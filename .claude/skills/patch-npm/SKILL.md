---
name: patch-npm
description: "TRIGGER when: user reports a Payload CMS / npm package bug, asks to patch node_modules, or asks to investigate admin UI misbehavior (fields closing, state resets, block reordering, race conditions). Contains discovered system architecture, known flaws, and the correct pnpm patch workflow."
---

# Patching npm Packages in this CMS

## Correct Workflow (do this, in order)

> **Never create patch files manually with `Write`.** The hunk header integrity check will fail.
> Always use the `pnpm patch` → modify → `pnpm patch-commit` cycle.

```bash
# 1. Start patch session — creates a temp copy of the package
pnpm patch "@payloadcms/ui@3.77.0"
# Output: "You can now edit folder: /private/var/folders/.../T/abc123"

# 2. Apply fix to the temp folder (use python3 for reliable string replacement)
python3 - <<'PY'
path = "/private/var/folders/.../T/abc123/dist/path/to/file.js"
with open(path) as f: c = f.read()
assert "old string" in c
with open(path, 'w') as f: f.write(c.replace("old string", "new string", 1))
print("Done")
PY

# 3. Commit — writes patches/<pkg>.patch AND updates package.json automatically
pnpm patch-commit "/private/var/folders/.../T/abc123"

# 4. Verify
pnpm install
grep "new string" node_modules/.pnpm/<pkg>/node_modules/<pkg>/dist/path/to/file.js
```

`pnpm patch-commit` handles:
- Correct unified diff format with git SHA1 hashes in `index` line
- Exact hunk line counts (`@@ -X,Y +X,Z @@`) — these are verified by pnpm on install
- Adding the entry to `package.json` `patchedDependencies`
- Updating `pnpm-lock.yaml`

## CRITICAL: Always Check Which File Turbopack Actually Loads

**Before patching any `@payloadcms/ui` file, verify it is imported directly by Turbopack.**

Many packages ship a **pre-bundled entry point** in `dist/exports/client/index.js`. Turbopack loads THIS single file — it never imports the individual source files like `dist/forms/Form/fieldReducer.js`.

**How to check:** Look at `package.json` `exports` field:
```bash
node -e "const p = require('node_modules/@payloadcms/ui/package.json'); console.log(JSON.stringify(p.exports['.']))"
# → {"import":"./dist/exports/client/index.js",...}
```

If the exports point to a bundled file, patch THAT file, not the individual source file.

**Confirming a file is being loaded:** Add `console.log('MODULE_LOADED')` at the top of the file you patched. If it doesn't appear in the browser console (even in incognito after a dev server restart), Turbopack is loading a different file.

`@payloadcms/ui@3.77.0` bundled entry: `dist/exports/client/index.js`

## Existing Patches

| Package | Patch file | What it fixes |
|---------|-----------|---------------|
| `payload@3.82.1` | `patches/payload@3.82.1.patch` | `mergeLocalizedData.js` — block/array matching by ID instead of index during multi-locale saves. Prevents block reorder when autosaving with locales. |
| `@payloadcms/ui@3.82.1` | `patches/@payloadcms__ui@3.82.1.patch` | **Bundled** `dist/exports/client/index.js` (minified) — strips `collapsed` from server row before merging. Prevents autosave race condition from closing open blocks. Bundled fix: `if(c>-1){let{collapsed:_sc,...lnc}=a;n[r].rows[c]={...e[r].rows[c],...lnc};}` Note: 3.82.1 uses `a` as the row variable, not `l`. |
| `@payloadcms/plugin-mcp@3.82.1` | `patches/@payloadcms__plugin-mcp@3.82.1.patch` | `dist/utils/schemaConversion/sanitizeJsonSchema.js` — adds `stripBlockUnions()` to prevent `json-schema-to-zod` failing on block-type discriminated unions (`anyOf`/`oneOf` with `blockType`). |

## CRITICAL: Patch SHA Mismatch — How to Detect and Fix

**Patches can silently fail** if they were created from a different build of the package. pnpm may accept a patch even when it can't apply the content change, leaving the file unmodified.

**How to verify a patch is actually working:**
```bash
# After pnpm install, check for the patched string in the installed file
grep -o "collapsed:_sc" node_modules/@payloadcms/ui/dist/exports/client/index.js
grep -o "stripBlockUnions" node_modules/@payloadcms/plugin-mcp/dist/utils/schemaConversion/sanitizeJsonSchema.js
```

**If a patch silently failed** (file unchanged despite patch being registered):
1. Remove the broken entry from `package.json` `patchedDependencies`
2. `pnpm install` (restores clean package)
3. `pnpm patch <pkg@version>` → get fresh temp folder from the CURRENT installed files
4. Apply fixes with python3 using the ACTUAL variable names from the current build
5. `pnpm patch-commit <temp-path>`

**The key mistake**: if an old patch used variable `l` but the new build uses `a`, the patch hunk won't match. Always verify the exact string in the current build before writing the python3 replacement.

## Common Mistakes to Avoid

- **Do not patch individual source files when the package uses a bundled entry point.** Turbopack resolves through `package.json` `exports` and loads the bundled file. Patching `dist/forms/Form/mergeServerFormState.js` has zero effect on `@payloadcms/ui` because Turbopack only loads `dist/exports/client/index.js`.
- **Do not `pnpm patch` without a valid lockfile.** If `pnpm install` failed (e.g., due to a bad patch), the lockfile may be stale. Revert `patchedDependencies` in `package.json`, run `pnpm install` to restore, then try again.
- **Do not create `.patch` files manually with `Write`.** Even if the diff looks correct, pnpm verifies hunk line counts and SHA1 hashes — hand-crafted files will fail with `ERR_PNPM_INVALID_PATCH: hunk header integrity check failed`.
- **Do not `pnpm patch` while a patch entry already exists in `package.json`.** Remove it first, install, then patch.

## Key Payload Admin Architecture (discovered debugging block-close bug)

### Form state flow on every field change (250ms debounce)
```
formState changes (modified=true)
  → executeOnChange (Form/index.js)
  → getFormState({ formState: currentSnapshot }) → server
  → server: fieldSchemasToFormState(previousFormState=snapshot)
  → isRowCollapsed checks previousFormState rows by ID
  → returns new form state
  → MERGE_SERVER_STATE dispatched
  → mergeServerFormState() merges into client state
```

### Autosave flow (interval ms debounce, default 1500ms here)
```
debouncedFormState changes AND actual data changed (reduceFieldsToValues diff)
  → handleAutosave (elements/Autosave/index.js)
  → submit({ action: PATCH /api/{collection}/{id}?autosave=true&draft=true })
  → serializableFormState = deepCopy(contextRef.current.fields) at submit() time ← SNAPSHOT
  → server saves document → returns saved doc
  → onSave(json, { formState: serializableFormState }) ← USES SNAPSHOT
  → getFormState({ data: savedDoc, formState: serializableFormState })
  → MERGE_SERVER_STATE dispatched
```

**Critical**: `serializableFormState` is captured at submit time. If the user changes UI state (expand/collapse) WHILE the autosave request is in flight, `onSave` uses the old snapshot as `previousFormState`, causing the server to return the stale collapse state, which then overwrites the user's current state.

### Row collapse state chain
```
isRowCollapsed (fieldSchemasToFormState/isRowCollapsed.js):
  1. if previousRow && 'collapsed' in previousRow → return previousRow.collapsed
  2. else if collapsedPrefs !== undefined → return collapsedPrefs.includes(row.id)
  3. else → return field.admin.initCollapsed

previousRow found by: previousFormState[path].rows.find(r => r.id === row.id)

In addFieldStatePromise.js:
  if (isCollapsed) newRow.collapsed = true;  // only sets true, never false
  // collapsed=false rows have NO collapsed property in form state
```

### MERGE_SERVER_STATE / mergeServerFormState.js
- Called whenever server returns updated form state
- For existing rows: `{ ...clientRow, ...serverRow }` — server wins (BUG before patch)
- For new server rows (`addedByServer`): appended to end of array
- After patch: `collapsed` stripped from `serverRow` before merge — client always wins for collapse state
- Does NOT override modified field values (respects `overrideLocalChanges: false`)

### REPLACE_STATE (full form state reset)
Triggered by `initialState` prop change. Happens on:
- Locale switch via `SidebarLocaleSwitcher` (router.push → server re-render → new initialState prop)
- Manual navigation

**This closes ALL open blocks/fields.** The `SidebarLocaleSwitcher` (in `beforeDocumentControls`) uses `router.push()` for locale switching, which causes a full page re-render.

### mergeLocalizedData.js (payload package)
Called during document saves (`collections/operations/utilities/update.js` and `globals/operations/update.js`) to merge locale-specific data with the existing document. Before the patch, blocks were matched by array index — causing reorder if a locale had blocks in different order. After patch: matched by `block.id` first, falls back to index.

## Diagnosing Future Admin UI Bugs

| Symptom | Likely cause | Where to look |
|---------|-------------|---------------|
| Blocks close ~1.5s after editing | Autosave race (serializableFormState stale) | `mergeServerFormState.js` rows merge |
| Blocks close immediately on locale switch | router.push full re-render → REPLACE_STATE | `SidebarLocaleSwitcher.tsx` |
| Blocks reorder on save | mergeLocalizedData index-based matching | `payload/dist/utilities/mergeLocalizedData.js` |
| Collapse state ignored on first load | initCollapsed or collapsedPrefs | `isRowCollapsed.js` |
| New block immediately collapses | initCollapsed: true on field | Block/array field config `admin.initCollapsed` |
