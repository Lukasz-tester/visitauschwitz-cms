#!/usr/bin/env python3
"""Generate FAQ page layout JSON for MCP createPages call."""
import json

# Lexical helpers
def text(t, fmt=0):
    return {"detail": 0, "format": fmt, "mode": "normal", "style": "", "text": t, "type": "text", "version": 1}

def paragraph(children):
    return {"children": children, "direction": None, "format": "", "indent": 0, "type": "paragraph", "version": 1, "textFormat": 0, "textStyle": ""}

def empty_para():
    return paragraph([])

def heading(t, tag="h2"):
    return {"children": [text(t)], "direction": "ltr", "format": "", "indent": 0, "type": "heading", "version": 1, "tag": tag}

def link(label, url):
    return {
        "children": [text(label)],
        "direction": "ltr", "format": "", "indent": 0,
        "type": "link", "version": 3,
        "fields": {"url": url, "newTab": False, "linkType": "custom"}
    }

def rich_text(children):
    return {"root": {"children": children, "direction": None, "format": "", "indent": 0, "type": "root", "version": 1}}

def content_block(h2_text, change_bg=False, block_name=""):
    b = {
        "blockType": "content",
        "heading": rich_text([heading(h2_text), empty_para()]),
        "columns": [],
        "changeBackground": change_bg,
        "addMarginTop": False,
        "addMarginBottom": False,
    }
    if block_name:
        b["blockName"] = block_name
    return b

def accordion_block(items, change_bg=False):
    return {
        "blockType": "accordion",
        "isFAQ": True,
        "changeBackground": change_bg,
        "addPaddingBottom": False,
        "accordionItems": items,
    }

def faq_item(question, answer_paragraphs):
    """Each answer_paragraphs is a list of paragraph nodes."""
    return {
        "question": question,
        "answer": rich_text(answer_paragraphs),
    }

def p(*parts):
    """Build a paragraph from a mix of strings, bold tuples, and link tuples.

    Usage: p("Normal text ", ("bold text", 1), " more text ", ("link text", "/url"), ".")
    """
    children = []
    for part in parts:
        if isinstance(part, str):
            children.append(text(part))
        elif isinstance(part, tuple) and len(part) == 2:
            if part[1] in (1, 2, 8):  # format codes: bold, italic, underline
                children.append(text(part[0], part[1]))
            elif isinstance(part[1], str) and part[1].startswith("/"):
                children.append(link(part[0], part[1]))
            else:
                children.append(text(part[0]))
    return paragraph(children)


# ==================== FAQ SECTIONS ====================

# Section 1: Tickets & Booking
sec1_items = [
    faq_item("Is Auschwitz free to visit?", [
        p("Yes — entry to the Auschwitz-Birkenau Memorial grounds is completely free. You need a timed entry pass reserved online at visit.auschwitz.org. Guided educator tours cost extra (~130 PLN per person for 3.5 hours)."),
        p(("Read more about ticket options", "/tickets"), ".")
    ]),
    faq_item("How do I book Auschwitz tickets?", [
        p("Reserve at visit.auschwitz.org up to 90 days in advance. Choose between a free individual pass (afternoon slots) or a paid guided tour. Since March 2026, all passes are online-only — no on-site ticket sales. Reserve at least 2–3 weeks ahead, especially April through October."),
        p(("Full booking guide", "/tickets"), ".")
    ]),
    faq_item("What if Auschwitz tickets are sold out for my date?", [
        p("Try different time slots or dates — cancellations appear daily. Check the afternoon free-entry window, which often has availability. Avoid third-party resellers who mark up prices for what is a free or low-cost reservation."),
        p(("More tips for sold-out dates", "/tickets"), ".")
    ]),
    faq_item("Can I buy Auschwitz tickets on the day?", [
        p("No. Since March 1, 2026, on-site ticket sales have been permanently discontinued. All entry passes must be reserved online in advance at visit.auschwitz.org."),
        p(("Why this policy changed", "/posts/auschwitz-tickets-online-only-in-2026-what-changed"), ".")
    ]),
    faq_item("How much does a guided Auschwitz tour cost?", [
        p("A 3.5-hour general guided tour costs ~130 PLN per person (120 PLN discounted for students under 26, seniors over 75, and disability card holders). A 6-hour study tour is ~170 PLN. Private tours for groups start at 870 PLN per group (as low as ~34 PLN per person for 30 people). Polish-language tours are 10–20 PLN cheaper."),
        p(("Full price list", "/tickets"), ".")
    ]),
    faq_item("Are third-party Auschwitz tickets legitimate?", [
        p("Only reserve from the official visit.auschwitz.org. Third-party resellers often overcharge for what is a free or low-cost reservation. Some scammers sell supposedly \"sold out\" dates that are actually available, or provide only transport without actual museum entry."),
        p(("Scam warnings and safe booking", "/tickets"), ".")
    ]),
    faq_item("How far in advance should I book Auschwitz?", [
        p("At least 2–3 weeks ahead. Slots open 90 days before the visit date. Summer months (June–August) and weekends sell out fastest. For free afternoon passes, 7+ days ahead is usually sufficient."),
        p(("Booking tips", "/tickets"), ".")
    ]),
    faq_item("Can I skip the queue at Auschwitz?", [
        p("Individual visitors and groups of up to 15 people can bypass the longest queues. A private tour lets you start 30 minutes before group tours begin. Visiting in the off-season (November–March) or early morning also means shorter wait times."),
        p(("How to avoid crowds", "/supplement"), ".")
    ]),
]

# Section 2: Getting There
sec2_items = [
    faq_item("How do I get to Auschwitz from Krakow?", [
        p("The Memorial is in Oświęcim, ~70 km west of Krakow. Options: direct Lajkonik bus from MDA station (~1.5h, 22 PLN), train (~1h, 15 PLN), car via A4 motorway (~1h), or organized transfer with tour included."),
        p(("All transport options compared", "/arrival"), " | ", ("Plan your full day trip", "/posts/krakow-to-auschwitz-day-trip"), ".")
    ]),
    faq_item("How far is Auschwitz from Krakow?", [
        p("About 70 km by road, roughly 1–1.5 hours depending on transport. By train approximately 1 hour, by bus about 1.5 hours, by car around 1 hour via the A4 motorway."),
        p(("Detailed directions", "/arrival"), ".")
    ]),
    faq_item("Can I visit Auschwitz from Warsaw?", [
        p("Yes, but it is a long day. Warsaw to Oświęcim is ~350 km. Take a train to Krakow first (2.5 hours), then continue to Oświęcim. Alternatively, direct organized tours from Warsaw are available. Allow a full day."),
        p(("Transport planning", "/arrival"), ".")
    ]),
    faq_item("Is there parking at Auschwitz?", [
        p("Yes — paid parking at both sites. Main lot at Auschwitz I: 20 PLN per car, 40 PLN per coach, 90 PLN per camper, 15 PLN per motorcycle. A free lot is available 700m away. Birkenau also has dedicated parking."),
        p(("Parking map and locations", "/arrival"), ".")
    ]),
    faq_item("How do I get between Auschwitz I and Birkenau?", [
        p("A free shuttle bus runs every 10–15 minutes between the two sites (3.5 km apart, ~8 minute ride). Check timetables at the bus stops. You can also walk (~40 min) or take a taxi (40 PLN)."),
        p(("Shuttle details", "/arrival"), ".")
    ]),
    faq_item("Is Auschwitz located in Krakow?", [
        p("No. The Memorial is in Oświęcim (historically known as Auschwitz in German), a separate town 70 km west of Krakow. Most visitors travel from Krakow as a day trip."),
        p(("Location and directions", "/arrival"), " | ", ("Day trip planning guide", "/posts/krakow-to-auschwitz-day-trip"), ".")
    ]),
]

# Section 3: Tour Duration & Types
sec3_items = [
    faq_item("How long does an Auschwitz visit take?", [
        p("A guided tour lasts 3.5 hours covering both sites. For a thorough self-guided visit, plan at least 4–5 hours. A study tour takes 6 hours. Including transport from Krakow, expect a full day (6+ hours total)."),
        p(("Detailed tour routes", "/tour"), " | ", ("Day trip timeline", "/posts/krakow-to-auschwitz-day-trip"), ".")
    ]),
    faq_item("Can I visit Auschwitz without a guide?", [
        p("Yes. Free individual entry passes are available for afternoon slots (limited to 10 people per time slot). You explore at your own pace using outdoor information boards. Preparation is essential — there is no audio guide provided. A guided tour is recommended for first-time visitors."),
        p(("Honest comparison: guided vs self-guided", "/posts/can-you-visit-auschwitz-without-a-guide"), ".")
    ]),
    faq_item("Is a self-guided Auschwitz visit worth it?", [
        p("It depends on your preferences. Self-guided gives you more time for reflection and freedom to explore beyond the standard route. However, you miss the educator's context and stories. If you prepare well — read history, use our tour page walkthrough — a self-guided visit can be deeply meaningful. First-timers generally benefit more from a guided tour."),
        p(("Full pros and cons comparison", "/posts/can-you-visit-auschwitz-without-a-guide"), ".")
    ]),
    faq_item("What is the difference between a general tour and a study tour?", [
        p("A general tour lasts 3.5 hours and covers the main exhibits at both camp sites. A study tour lasts 6–8 hours with smaller groups, covering additional areas like the \"Canada\" sorting warehouses, registration building (\"Sauna\"), and more barracks. Study tours are recommended for those wanting deeper understanding."),
        p(("Tour types and prices", "/tickets"), ".")
    ]),
    faq_item("Can I visit Auschwitz and the Salt Mines on the same day?", [
        p("Technically possible but rushed and very tiring. You would need to reserve an early morning Auschwitz slot and an afternoon Salt Mine visit. Organized combo tours exist but often feel cramped — groups arriving at the same time cause long queues. If possible, visit on separate days to properly absorb both experiences.")
    ]),
    faq_item("Is there an audio guide at Auschwitz?", [
        p("There is no audio guide system at the Memorial. During guided tours, you receive a headset to hear your educator's narration (bring your own earphones with a 3.5mm jack). For self-guided visits, use the site's information boards and prepare beforehand."),
        p(("Prepare with the tour walkthrough", "/tour"), ".")
    ]),
]

# Section 4: Rules & What to Bring
sec4_items = [
    faq_item("What is the Auschwitz dress code?", [
        p("Wear modest, respectful attire appropriate for a memorial site. No offensive or provocative clothing. Comfortable walking shoes are essential — much of the visit is outdoors on uneven terrain. Dress for the weather: summers can be hot, winters well below zero."),
        p(("Complete dress code and seasonal guide", "/posts/what-to-wear-to-auschwitz-dress-code"), ".")
    ]),
    faq_item("Can you take photos at Auschwitz?", [
        p("Yes, personal photography is allowed in most areas. Exceptions: no photography in the Block 4 victims' hair exhibit and Block 11 basements. No flash photography indoors, no tripods, selfie sticks, or recording of guided lectures. Be respectful — this is a memorial site."),
        p(("Full visitor rules", "/supplement"), ".")
    ]),
    faq_item("What is the Auschwitz bag size limit?", [
        p("Bags must not exceed 30×20×10 cm (roughly a small handbag). Larger bags, backpacks, and suitcases must be left in the free lockers at the visitor centre. This is checked at the airport-style security entrance."),
        p(("What to bring and what to leave", "/supplement"), ".")
    ]),
    faq_item("What is not allowed at Auschwitz?", [
        p("Prohibited items include: large bags and backpacks, alcohol, drugs, weapons (knives, scissors), sharp objects, drones, pets (except certified guide dogs), tripods, loud audio devices, political or religious or nationalistic flags, banners, and symbols. Eating and smoking are not allowed inside the grounds."),
        p(("Complete list of rules", "/supplement"), ".")
    ]),
    faq_item("What should I bring to Auschwitz?", [
        p("Required: your entry pass (printed or digital with barcode) and valid photo ID. Recommended: water bottle, umbrella or rain jacket, comfortable walking shoes, warm layers in colder months. Keep belongings minimal due to bag size restrictions (30×20×10 cm)."),
        p(("Seasonal packing advice", "/posts/what-to-wear-to-auschwitz-dress-code"), " | ", ("Preparation tips", "/supplement"), ".")
    ]),
    faq_item("Is there luggage storage at Auschwitz?", [
        p("Yes — free lockers are available at the visitor centre for oversized bags and luggage. You can store items before entering and collect them after your visit."),
        p(("On-site facilities", "/museum"), ".")
    ]),
]

# Section 5: What to Expect
sec5_items = [
    faq_item("What is the difference between Auschwitz and Birkenau?", [
        p("They are two parts of one memorial complex, 3.5 km apart. Auschwitz I is the original camp — brick barracks housing museum exhibitions with preserved evidence and photographs. Auschwitz II-Birkenau is the much larger extermination camp with wooden barracks, the selection ramp, and gas chamber ruins. Both are essential to visit. A free shuttle connects them."),
        p(("Understanding both sites in depth", "/posts/auschwitz-vs-birkenau-difference"), ".")
    ]),
    faq_item("What should I expect at Auschwitz?", [
        p("A deeply moving experience. You will walk through the original camp grounds, authentic barracks, and preserved evidence of mass murder. Expect airport-style security at entry, then a solemn walk through exhibitions. Most of the visit is outdoors. The experience is emotionally intense — there is no \"right\" way to react. Allow yourself time and space afterward."),
        p(("Step-by-step tour guide", "/tour"), ".")
    ]),
    faq_item("Is Auschwitz appropriate for children?", [
        p("The Museum recommends visitors be at least 14 years old. Children under 14 are allowed but must be accompanied by an adult at all times. Baby carriers are required — strollers cannot be used indoors. Parents should use their judgement based on their child's maturity."),
        p(("Complete parent's guide", "/posts/visiting-auschwitz-with-children"), ".")
    ]),
    faq_item("How should I prepare emotionally for visiting Auschwitz?", [
        p("Read basic history beforehand so you understand the context of what you will see. Consider watching a documentary or reading a survivor memoir (Primo Levi, Elie Wiesel, Edith Eger). Be prepared for difficult imagery — rooms of personal belongings, photographs of victims, and physical evidence. Give yourself quiet time after the visit. Avoid fictionalized accounts that distort the reality of the camp."),
        p(("Preparation tips and reading list", "/supplement"), ".")
    ]),
    faq_item("Is visiting Auschwitz worth it?", [
        p("Yes. It is one of the most important memorial sites in the world and a UNESCO World Heritage Site. Visitors consistently describe it as profoundly moving and essential for understanding history. As a licensed guide since 2006, I believe everyone who is able to visit should do so at least once."),
        p(("Plan your visit", "/tickets"), ".")
    ]),
    faq_item("What should I read before visiting Auschwitz?", [
        p("Start with Primo Levi's \"If This Is a Man\" — one of the most important Auschwitz testimonies. \"Night\" by Elie Wiesel and \"The Choice\" by Edith Eger are also highly recommended. The visitauschwitz.info tour page provides a location-by-location walkthrough with historical context that will help you understand what you see on site."),
        p(("Guided tour walkthrough with historical context", "/tour"), ".")
    ]),
]

# Section 6: Facilities & Practical Info
sec6_items = [
    faq_item("What are the Auschwitz opening hours?", [
        p("The Museum opens at 7:30 year-round. Closing time varies by month: 14:00 (December), 15:00 (January and November), 16:00 (February), 17:00 (March and October), 18:00 (April and September), 19:00 (May through August). Last entry is 90 minutes before closing. Closed: January 1, December 25, Easter Sunday."),
        p(("Current opening hours", "/museum"), ".")
    ]),
    faq_item("When is the best time to visit Auschwitz?", [
        p("For fewer crowds: visit November through March, or arrive at 8am or late in the day. Best weather with manageable crowds: April–June and September–October. Summer (July–August) has the longest hours but is the most crowded and hot. Individual visitors and groups up to 15 can bypass the longest queues."),
        p(("Crowd-avoidance tips", "/supplement"), " | ", ("Seasonal clothing advice", "/posts/what-to-wear-to-auschwitz-dress-code"), ".")
    ]),
    faq_item("Can I visit Auschwitz in winter?", [
        p("Yes — the Museum is open year-round (except January 1, December 25, Easter Sunday). Winter visits are quieter with significantly fewer crowds. Dress very warmly — temperatures can drop well below zero, and much of the visit is outdoors. Hours are shorter (closing at 14:00–15:00 in December–January). Winter visits can feel particularly solemn and reflective."),
        p(("What to wear in winter", "/posts/what-to-wear-to-auschwitz-dress-code"), ".")
    ]),
    faq_item("Are there toilets and food at Auschwitz?", [
        p("Yes. Restrooms are available at the visitor centre and at key points in both sites. A restaurant operates at the Auschwitz I visitor centre. There is also a snack bar at Birkenau. Eating and drinking are not permitted inside the camp grounds themselves. Restaurants and shops are within 1 km of the main parking lot."),
        p(("On-site facilities and nearby dining", "/museum"), ".")
    ]),
    faq_item("Is Auschwitz wheelchair accessible?", [
        p("Partially. Auschwitz I has ramps for most exhibition buildings. Birkenau has challenging terrain — uneven surfaces, gravel, and grass — which can be difficult for wheelchair users. Wheelchairs are available at the Memorial but cannot be used inside some Auschwitz I buildings due to narrow doorways and stairs. Special entry is available with a disability ID. Guide dogs are permitted with certificates."),
        p(("Accessibility details", "/supplement"), ".")
    ]),
    faq_item("What languages are guided tours available in?", [
        p("Group tours are available in Czech, English, French, German, Italian, Polish, Russian, Slovak, and Spanish. Private tours offer even more languages including Croatian, Dutch, Greek, Hebrew, Hungarian, Japanese, Korean, Serbian, Swedish, and Ukrainian — 19 languages total. English tours are the most frequent."),
        p(("Tour options and languages", "/tickets"), ".")
    ]),
    faq_item("Where can I eat near Auschwitz?", [
        p("A cafeteria is located at the Auschwitz I visitor centre. Additional restaurants, a supermarket, and cafés are within 1 km of the main parking lot. In Oświęcim town (1.5 km from the Memorial), you will find more dining options around the market square. Pack water and a snack for the visit itself — no eating inside the grounds."),
        p(("Nearby facilities and surroundings", "/museum"), ".")
    ]),
    faq_item("What documents do I need for Auschwitz entry?", [
        p("A valid photo ID (passport, national ID card, or driver's license) and your entry pass (printed or shown digitally with barcode). Your pass is personalized — the name must match your ID."),
        p(("Entry requirements and booking", "/tickets"), ".")
    ]),
]

# Section 7: History Basics
sec7_items = [
    faq_item("How many people were murdered at Auschwitz?", [
        p("Approximately 1.1 million people were murdered at Auschwitz-Birkenau. The vast majority — about 960,000 — were Jews from across Europe. Other victims included approximately 74,000 Poles, 21,000 Roma, 15,000 Soviet prisoners of war, and thousands of others. It was the deadliest single site of the Holocaust.")
    ]),
    faq_item("What happened at Auschwitz?", [
        p("Auschwitz-Birkenau was the largest Nazi German concentration and extermination camp, operated from 1940 to 1945. It served multiple purposes: forced labour, human experimentation, and systematic mass murder. It was the site of the largest mass extermination in a single location in human history. Today it is preserved as a memorial and museum, and a UNESCO World Heritage Site."),
        p(("See what remains today", "/tour"), ".")
    ]),
    faq_item("Who liberated Auschwitz?", [
        p("The Soviet Red Army liberated Auschwitz on January 27, 1945. They found approximately 7,000 surviving prisoners. This date — January 27 — is now observed worldwide as International Holocaust Remembrance Day.")
    ]),
    faq_item("Is Auschwitz a museum or a concentration camp?", [
        p("Both. The original camp site is preserved as the Auschwitz-Birkenau State Museum and Memorial, established in 1947 by the Polish Parliament. It is both a museum with permanent exhibitions and an authentic historical site — the preserved remains of the actual camp. It became a UNESCO World Heritage Site in 1979."),
        p(("What to expect on site", "/museum"), ".")
    ]),
    faq_item("What is the difference between Auschwitz I and Auschwitz II?", [
        p("Auschwitz I (the \"main camp\") opened in 1940 in converted Polish army barracks. It served as the administrative centre and houses today's main exhibitions. Auschwitz II-Birkenau, built in 1941, was vastly larger — designed specifically as an extermination centre with gas chambers and crematoria. Most of the killing took place at Birkenau."),
        p(("Detailed comparison of both sites", "/posts/auschwitz-vs-birkenau-difference"), ".")
    ]),
]

# ==================== BUILD LAYOUT ====================
sections = [
    ("Tickets & Booking", sec1_items, True, "tickets-booking"),
    ("Getting to Auschwitz", sec2_items, False, "getting-there"),
    ("Tour Duration & Types", sec3_items, True, "tour-types"),
    ("Rules & What to Bring", sec4_items, False, "rules"),
    ("What to Expect", sec5_items, True, "what-to-expect"),
    ("Facilities & Practical Information", sec6_items, False, "facilities"),
    ("History Basics for Visitors", sec7_items, True, "history"),
]

layout = []
for h2_text, items, bg, name in sections:
    layout.append(content_block(h2_text, change_bg=bg, block_name=name))
    layout.append(accordion_block(items, change_bg=bg))

# ==================== BUILD FULL PAGE ====================
page = {
    "title": "FAQ",
    "slug": "faq",
    "slugLock": False,
    "_status": "published",
    "locale": "en",
    "hero": {
        "type": "lowImpact",
        "richText": rich_text([
            heading("Auschwitz FAQ: Answers to the Most Common Visitor Questions", "h1"),
            empty_para(),
        ]),
    },
    "meta": {
        "title": "Auschwitz FAQ — Visitor Questions Answered",
        "description": "Answers to frequently asked questions about visiting Auschwitz-Birkenau. Tickets, transport, tours, rules, dress code, opening hours — by a licensed guide since 2006.",
    },
    "layout": layout,
}

with open('/tmp/faq-layout.json', 'w') as f:
    json.dump(layout, f, ensure_ascii=False)

with open('/tmp/faq-page.json', 'w') as f:
    json.dump(page, f, ensure_ascii=False)

print(f"Generated FAQ layout with {len(layout)} blocks → /tmp/faq-layout.json")
print(f"Generated FAQ full page → /tmp/faq-page.json")
for i, b in enumerate(layout):
    bt = b['blockType']
    if bt == 'accordion':
        print(f"  [{i}] {bt}: {len(b['accordionItems'])} items, isFAQ={b['isFAQ']}")
    else:
        print(f"  [{i}] {bt}: {b.get('blockName', '')}")

total_qs = sum(len(b['accordionItems']) for b in layout if b['blockType'] == 'accordion')
print(f"\nTotal FAQ questions: {total_qs}")
