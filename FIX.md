# Bug Investigation: "Right side of assignment cannot be destructured"

## Error
```
Error: Right side of assignment cannot be destructured
Call Stack: node_modules/@payloadcms/ui/src/elements/FieldDiffLabel/index.tsx (8:8)
```
Occurs on all collections (Pages, Posts) when trying to modify/publish content.

---

## Key Findings

### Source Map Is Misleading
`FieldDiffLabel` is just `<div>{children}</div>` — it can't throw a destructuring error. Turbopack source maps are unreliable here. The real error is somewhere else in the bundle.

### #1 — Custom Translator Replaces Publish/Save Buttons (PRIME SUSPECT)
`next.config.mjs` aliases `@payload-enchants/translator` → `./src/lib/translator` (local copy of the npm package).

The plugin replaces the Publish + Save buttons on all enabled collections:
```js
components: {
  edit: {
    PublishButton: CustomButton('publish'),
    SaveButton: CustomButton('save'),
  }
}
```

The component path used is:
```
@payload-enchants/translator/client#CustomButtonWithTranslator
```

**Problem**: The webpack alias maps `@payload-enchants/translator` → `./src/lib/translator`, but may NOT cover the `/client` subpath. When Payload's import map resolves `@payload-enchants/translator/client`, it might fail → component becomes `undefined` → destructuring `undefined` throws the error.

**File to check**: `next.config.mjs` webpack alias and whether the local translator has a `client` export:
- `src/lib/translator/dist/exports/client.js` ✓ (exists)
- Current alias: `config.resolve.alias['@payload-enchants/translator'] = path.resolve('./src/lib/translator')`
- May need: `config.resolve.alias['@payload-enchants/translator/client'] = path.resolve('./src/lib/translator/dist/exports/client')`

**CustomButtonWithTranslator.js** (`src/lib/translator/dist/client/components/CustomButton/CustomButtonWithTranslator.js`):
```js
export const CustomButtonWithTranslator = ({ type }) => {
  const { config } = useConfig();
  const DefaultButton = type === 'publish' ? PublishButton : SaveButton;
  const { globalSlug, id } = useDocumentInfo();
  const resolvers = config.admin?.custom?.translator?.resolvers ?? [];
  if (!id && !globalSlug) return <DefaultButton />;
  return <TranslatorProvider>...</TranslatorProvider>;
};
```

---

### #2 — `link.ts` Bug (line 94)
The `.map()` result is never saved back:
```typescript
// src/fields/link.ts
if (!disableLabel) {
  linkTypes.map((linkType) => ({   // ← result DISCARDED, does nothing
    ...linkType,
    admin: { ...linkType.admin, width: '50%' },
  }))
  linkResult.fields.push({ type: 'row', fields: [...linkTypes, labelField] })
  // ↑ uses original linkTypes — no width applied
}
```
**Fix**: Change to `linkTypes = linkTypes.map(...)`

---

### #3 — `Code` Block Caption Missing Editor
```typescript
// src/blocks/Code/config.ts
{
  name: 'caption',
  type: 'richText',
  localized: true,
  // ← no editor property!
}
```
Payload's `buildVersionFields.js` throws `MissingEditorProp` if `field.editor` is falsy for a richText field. Should add explicit `lexicalEditor({...})`.

---

## Files Already Checked
| File | Status |
|------|--------|
| `src/payload.config.ts` | fine |
| `src/fields/link.ts` | **BUG line 94** |
| `src/fields/linkGroup.ts` | fine |
| `src/fields/media.ts` | fine |
| `src/heros/config.ts` | has `label: false` — likely OK |
| `src/blocks/Code/config.ts` | **missing editor on caption** |
| `src/blocks/Banner/config.ts` | fine |
| `src/blocks/Content/config.ts` | fine |
| `src/blocks/CallToAction/config.ts` | fine |
| `src/blocks/Accordion/config.ts` | fine |
| `src/blocks/OpeningHours/config.ts` | fine |
| `src/collections/Pages/index.ts` | autosave 100ms |
| `src/collections/Posts/index.ts` | autosave 100ms |
| `src/i18n/localization.ts` | `en` + `pl` |
| `src/lib/translator/dist/index.js` | replaces buttons |
| `src/lib/translator/dist/client/components/CustomButton/CustomButtonWithTranslator.js` | uses `@payloadcms/ui` PublishButton |
| `next.config.mjs` | alias may not cover `/client` subpath |
| Payload `buildVersionFields.js` | throws on richText without editor |
| Payload `Select/index.js` (diff) | uses FieldDiffLabel |

## Next Steps
1. Check if `src/lib/translator/dist/exports/client.js` exports `CustomButtonWithTranslator`
2. Fix the webpack alias in `next.config.mjs` to also cover `/client` subpath
3. Fix `link.ts` line 94 — assign `.map()` result back
4. Add `lexicalEditor` to `Code/config.ts` caption field
