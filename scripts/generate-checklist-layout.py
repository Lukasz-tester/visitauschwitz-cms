"""
Generates the layout JSON for the "Before You Go — Preparation Checklist" page.
Output: /tmp/checklist-layout.json

Usage: python3 scripts/generate-checklist-layout.py
"""

import json

# --- Lexical node helpers ---

def text(t, fmt=0):
    return {"type": "text", "text": t, "format": fmt, "detail": 0, "mode": "normal", "style": "", "version": 1}

def bold(t):
    return text(t, 1)

def italic(t):
    return text(t, 2)

def link(label, url, new_tab=True):
    return {
        "type": "link",
        "children": [text(label)],
        "direction": "ltr",
        "fields": {"url": url, "newTab": new_tab, "linkType": "custom"},
        "format": "",
        "indent": 0,
        "version": 3,
    }

def paragraph(children=None):
    return {
        "type": "paragraph",
        "children": children or [],
        "direction": "ltr" if children else None,
        "format": "",
        "indent": 0,
        "textFormat": 0,
        "textStyle": "",
        "version": 1,
    }

def empty_para():
    return paragraph()

def heading(tag, children):
    return {
        "type": "heading",
        "tag": tag,
        "children": children,
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "version": 1,
    }

def listitem(children, value=1):
    return {
        "type": "listitem",
        "value": value,
        "checked": None,
        "children": children,
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "version": 1,
    }

def ul(items):
    """items: list of lists of children nodes (one per list item)"""
    return {
        "type": "list",
        "tag": "ul",
        "listType": "bullet",
        "start": 0,
        "children": [listitem(ch, i + 1) for i, ch in enumerate(items)],
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "version": 1,
    }

def root(children):
    return {
        "root": {
            "type": "root",
            "children": children,
            "direction": "ltr",
            "format": "",
            "indent": 0,
            "version": 1,
        }
    }

def content_block(heading_children=None, richtext_children=None, block_name=None, margin_top=None, margin_bottom=None, change_bg=None):
    block = {"blockType": "content"}
    if block_name:
        block["blockName"] = block_name
    if heading_children:
        block["heading"] = root(heading_children)
    block["columns"] = [{
        "size": "full",
        "richText": root(richtext_children or []),
    }]
    if change_bg:
        block["changeBackground"] = True
    if margin_top is not None:
        block["addMarginTop"] = margin_top
    if margin_bottom is not None:
        block["addMarginBottom"] = margin_bottom
    return block


# --- Build layout ---

layout = []

# Block 0: Intro
layout.append(content_block(
    block_name="intro",
    margin_top=False,
    margin_bottom=False,
    richtext_children=[
        paragraph([
            text("A practical checklist to help you prepare for your visit to the Auschwitz-Birkenau Memorial. Print this page or save it for reference. Based on guidance from a "),
            link("licensed Auschwitz guide", "https://www.visitauschwitz.info/en/supplement/"),
            text(" since 2006."),
        ]),
    ],
))

# Block 1: Reserve Your Visit
layout.append(content_block(
    block_name="reserve",
    heading_children=[
        heading("h2", [text("Reserve Your Visit")]),
        empty_para(),
    ],
    richtext_children=[
        paragraph([italic("Weeks before your visit")]),
        ul([
            [text("Reserve entry passes at "), link("visit.auschwitz.org", "https://visit.auschwitz.org"), text(" (the only official reservation system)")],
            [text("Book 2\u20133 weeks ahead (up to 90 days in advance); summer and weekends sell out fastest")],
            [text("Choose your tour type: guided tour (3.5h, ~130 PLN), self-guided afternoon entry (free), or study tour (6h, ~170 PLN)")],
            [text("Avoid third-party resellers \u2014 they overcharge for free or low-cost reservations")],
            [text("No on-site ticket sales since March 2026 \u2014 online reservation only")],
        ]),
    ],
))

# Block 2: Plan Your Transport
layout.append(content_block(
    block_name="transport",
    heading_children=[
        heading("h2", [text("Plan Your Transport from Krakow")]),
        empty_para(),
    ],
    richtext_children=[
        paragraph([italic("70 km, allow a full day (6+ hours total)")]),
        ul([
            [bold("Bus: "), text("Lajkonik from MDA station \u2014 ~1.5h, 22 PLN, goes directly to the Museum entrance")],
            [bold("Train: "), text("Krakow to Oswiecim \u2014 ~1h, 18 PLN (station is 1.5 km from the Memorial)")],
            [bold("Car: "), text("A4 motorway or DK44 \u2014 ~1h, parking 20 PLN at Auschwitz I")],
            [bold("Private transfer: "), text("confirm the full cost upfront")],
        ]),
    ],
))

# Block 3: Prepare Yourself
layout.append(content_block(
    block_name="prepare",
    heading_children=[
        heading("h2", [text("Prepare Yourself")]),
        empty_para(),
    ],
    richtext_children=[
        paragraph([italic("Before you go")]),
        ul([
            [text("Read basic history \u2014 Primo Levi\u2019s \u201cIf This Is a Man\u201d, Elie Wiesel\u2019s \u201cNight\u201d, or Edith Eger\u2019s \u201cThe Choice\u201d")],
            [text("Visit "), link("auschwitz.org", "https://www.auschwitz.org"), text(" for official historical information")],
            [text("Review the "), link("tour route", "https://www.visitauschwitz.info/en/tour/"), text(" on visitauschwitz.info to know what you will see")],
            [text("Avoid fictionalized accounts \u2014 even bestsellers like \u201cThe Boy in the Striped Pajamas\u201d or \u201cThe Tattooist of Auschwitz\u201d contain false depictions")],
            [text("Consider a 6-hour study tour for deeper understanding (smaller groups, less-visited areas)")],
        ]),
    ],
))

# Block 4: What to Pack
layout.append(content_block(
    block_name="what-to-pack",
    heading_children=[
        heading("h2", [text("What to Pack")]),
        empty_para(),
    ],
    richtext_children=[
        paragraph([italic("Keep belongings minimal")]),
        ul([
            [text("\u2610 Valid photo ID \u2014 passport, national ID card, or driver\u2019s license")],
            [text("\u2610 Entry pass \u2014 printed or digital with barcode (name must match your ID)")],
            [text("\u2610 Water bottle \u2014 staying hydrated is encouraged")],
            [text("\u2610 Comfortable walking shoes \u2014 extensive walking on uneven terrain and slippery stairs")],
            [text("\u2610 Umbrella or rain jacket")],
            [text("\u2610 Warm layers (November\u2013March) or sun protection (summer)")],
            [text("\u2610 Earphones with 3.5mm jack \u2014 needed for the guided tour headset")],
            [text("\u2610 Small bag only \u2014 max 30\u00d720\u00d710 cm (roughly a small handbag)")],
        ]),
    ],
))

# Block 5: Do NOT Bring
layout.append(content_block(
    block_name="do-not-bring",
    heading_children=[
        heading("h2", [text("Do NOT Bring")]),
        empty_para(),
    ],
    richtext_children=[
        ul([
            [text("\u2717 Large bags or backpacks (free lockers at the visitor centre)")],
            [text("\u2717 Food \u2014 eating prohibited inside the grounds")],
            [text("\u2717 Tripods, selfie sticks, or drones")],
            [text("\u2717 Alcohol, drugs, weapons, knives, or scissors")],
            [text("\u2717 Political, religious, or nationalistic flags, banners, or symbols")],
            [text("\u2717 Loud audio devices")],
            [text("\u2717 Pets (except certified guide dogs with vaccination certificates)")],
        ]),
    ],
))

# Block 6: Day of Your Visit
layout.append(content_block(
    block_name="day-of-visit",
    heading_children=[
        heading("h2", [text("Day of Your Visit")]),
        empty_para(),
    ],
    richtext_children=[
        ul([
            [text("\u2610 Arrive early (8 a.m.) or late afternoon for fewer crowds")],
            [text("\u2610 Store oversized bags in the free lockers at the visitor centre")],
            [text("\u2610 Pass through airport-style security at the entrance")],
            [text("\u2610 Dress modestly and respectfully \u2014 no offensive or provocative clothing")],
            [text("\u2610 Visit Auschwitz I first \u2014 main camp with museum exhibitions")],
            [text("\u2610 Take the free shuttle to Birkenau \u2014 runs every 10\u201315 minutes, ~8 min ride")],
            [text("\u2610 Allow at least 4\u20135 hours for both sites")],
            [text("\u2610 Visit both sites \u2014 Auschwitz I and Birkenau are both essential")],
            [text("\u2610 Give yourself quiet time after the visit")],
        ]),
    ],
))

# Block 7: Photography Rules
layout.append(content_block(
    block_name="photography",
    heading_children=[
        heading("h2", [text("Photography Rules")]),
        empty_para(),
    ],
    richtext_children=[
        ul([
            [text("Personal photography is allowed in most areas")],
            [bold("No photos: "), text("Block 4 victims\u2019 hair exhibit, Block 11 basements, security checkpoints")],
            [bold("No flash "), text("photography indoors")],
            [bold("No recording "), text("of guided lectures")],
            [bold("No tripods "), text("or selfie sticks")],
            [text("Be respectful \u2014 this is a memorial site")],
        ]),
    ],
))

# Block 8: Visiting with Children & Accessibility
layout.append(content_block(
    block_name="children-accessibility",
    heading_children=[
        heading("h2", [text("Visiting with Children & Accessibility")]),
        empty_para(),
    ],
    richtext_children=[
        ul([
            [text("Recommended minimum age: 14 \u2014 parents should consider emotional maturity")],
            [text("Children under 14 must be accompanied by an adult at all times")],
            [text("Baby carriers required \u2014 strollers cannot be used indoors")],
            [text("Wheelchairs available on site but cannot enter Auschwitz I buildings; uneven terrain at Birkenau")],
            [text("Disability ID holders with a guardian may receive special entry")],
            [text("Guide dogs permitted with valid training and vaccination certificates")],
            [text("Hearing aid devices may not work well with the tour headset")],
        ]),
    ],
))

# Block 9: Quick Reference (with background)
layout.append(content_block(
    block_name="quick-reference",
    change_bg=True,
    heading_children=[
        heading("h2", [text("Quick Reference")]),
        empty_para(),
    ],
    richtext_children=[
        ul([
            [bold("Opening: "), text("7:30 year-round")],
            [bold("Closing: "), text("14:00 (December) to 19:00 (May\u2013August)")],
            [bold("Last entry: "), text("90 minutes before closing")],
            [bold("Closed: "), text("January 1, December 25, Easter Sunday")],
            [bold("Distance: "), text("70 km from Krakow (~1\u20131.5 hours)")],
            [bold("Shuttle: "), text("Free, every 10\u201315 min between sites")],
            [bold("Tour languages: "), text("19 languages available")],
            [bold("Luggage storage: "), text("5 PLN (card only)")],
            [bold("Official booking: "), link("visit.auschwitz.org", "https://visit.auschwitz.org")],
        ]),
    ],
))

# --- Write output ---

with open("/tmp/checklist-layout.json", "w") as f:
    json.dump(layout, f, ensure_ascii=False, indent=2)

print(f"Generated {len(layout)} blocks -> /tmp/checklist-layout.json")
