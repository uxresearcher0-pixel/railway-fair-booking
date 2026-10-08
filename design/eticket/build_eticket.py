"""Build the railfair concept e-ticket (A4, EN + BN) as self-contained HTML.

All data is fictional. The output must never be usable as a real ticket:
every page carries a visible DEMO mark and no Bangladesh Railway branding.

Usage: python3 build_eticket.py <fontsource node_modules dir> <out.html>
"""
import base64
import pathlib
import sys

import segno

FONT_DIR = pathlib.Path(sys.argv[1])
OUT = pathlib.Path(sys.argv[2])

FONTS = [
    ("Bricolage", "bricolage-grotesque/files/bricolage-grotesque-latin-700-normal.woff2", 700),
    ("Geist", "geist-sans/files/geist-sans-latin-400-normal.woff2", 400),
    ("Geist", "geist-sans/files/geist-sans-latin-500-normal.woff2", 500),
    ("Geist", "geist-sans/files/geist-sans-latin-600-normal.woff2", 600),
    ("GeistMono", "geist-mono/files/geist-mono-latin-500-normal.woff2", 500),
    ("Anek", "anek-bangla/files/anek-bangla-bengali-400-normal.woff2", 400),
    ("Anek", "anek-bangla/files/anek-bangla-bengali-500-normal.woff2", 500),
    ("Anek", "anek-bangla/files/anek-bangla-bengali-600-normal.woff2", 600),
]


def font_faces():
    css = []
    for family, rel, weight in FONTS:
        data = base64.b64encode((FONT_DIR / rel).read_bytes()).decode()
        css.append(
            f"@font-face{{font-family:'{family}';font-weight:{weight};"
            f"src:url(data:font/woff2;base64,{data}) format('woff2');}}"
        )
    return "\n".join(css)


def qr_svg(payload):
    return segno.make(payload, error="m").svg_inline(scale=3, border=0, dark="#111412")


BOOKING = "RF-7Q2K-48"
PASSENGERS = [
    dict(n=1, name="Abdul Karim", bn="আবদুল করিম", kind="Adult", kind_bn="প্রাপ্তবয়স্ক",
         id_label="NID", id_bn="এনআইডি", id_val="•••• •••• 4821", seat="13",
         check="Record matched · compare ID", check_bn="রেকর্ড মিলেছে · পরিচয়পত্র মিলিয়ে দেখুন"),
    dict(n=2, name="Salma Karim", bn="সালমা করিম", kind="Adult", kind_bn="প্রাপ্তবয়স্ক",
         id_label="NID", id_bn="এনআইডি", id_val="•••• •••• 1177", seat="14",
         check="Record matched · compare ID", check_bn="রেকর্ড মিলেছে · পরিচয়পত্র মিলিয়ে দেখুন"),
    dict(n=3, name="Rahim Karim", bn="রহিম করিম", kind="Adult", kind_bn="প্রাপ্তবয়স্ক",
         id_label="NID", id_bn="এনআইডি", id_val="•••• •••• 3390", seat="18",
         check="Record matched · compare ID", check_bn="রেকর্ড মিলেছে · পরিচয়পত্র মিলিয়ে দেখুন"),
    dict(n=4, name="Ayesha Karim", bn="আয়েশা করিম", kind="Child, 8 · with Abdul Karim",
         kind_bn="শিশু, ৮ · আবদুল করিমের সাথে", id_label="Birth reg.", id_bn="জন্মনিবন্ধন",
         id_val="•••• 0526", seat="19",
         check="Assisted check · not “verified”", check_bn="সহায়তায় যাচাই · “যাচাইকৃত” নয়"),
]


def stub(p):
    payload = f"RAILFAIR-DEMO|NOT-VALID|{BOOKING}|P{p['n']}|sig=demo"
    return f"""
<section class="stub">
  <div class="cut"><span>✂</span></div>
  <div class="stub-in">
    <div class="qr">{qr_svg(payload)}<div class="qr-cap">DEMO QR · ডেমো</div></div>
    <div class="stub-body">
      <div class="over">PASSENGER {p['n']} OF 4 · যাত্রী {p['n']} / ৪</div>
      <div class="pname">{p['name']} <span class="bn">{p['bn']}</span></div>
      <div class="pkind">{p['kind']} · <span class="bn">{p['kind_bn']}</span></div>
      <div class="kv">
        <div><span class="k">COACH <span class="bn">কোচ</span></span><span class="v">GHA</span></div>
        <div><span class="k">SEAT <span class="bn">আসন</span></span><span class="v">{p['seat']}</span></div>
        <div><span class="k">CLASS <span class="bn">শ্রেণি</span></span><span class="v">S_CHAIR</span></div>
        <div><span class="k">DEP <span class="bn">ছাড়বে</span></span><span class="v">07:00</span></div>
      </div>
      <div class="idrow">
        <span><b>{p['id_label']}</b> <span class="bn">{p['id_bn']}</span> <span class="mono">{p['id_val']}</span></span>
        <span class="pill">{p['check']}<br><span class="bn">{p['check_bn']}</span></span>
      </div>
      <div class="ref mono">{BOOKING} · P{p['n']} · ticket token, not identity</div>
    </div>
  </div>
</section>"""


HEADER = f"""
<div class="banner">CONCEPT DEMO — NOT VALID FOR TRAVEL · Not issued by Bangladesh Railway
  <span class="bn">ধারণামূলক নমুনা — ভ্রমণের জন্য বৈধ নয়</span></div>
<header class="top">
  <div class="brand"><span class="mark">rf</span><span class="word">railfair</span>
    <span class="doc">e-ticket · <span class="bn">ই-টিকিট</span></span></div>
  <div class="bref"><div class="over">BOOKING · বুকিং</div><div class="mono big">{BOOKING}</div></div>
</header>"""


def page1():
    return f"""
<div class="page">
  <div class="wm">DEMO</div>
  {HEADER}
  <section class="journey">
    <div class="jl">
      <div class="city">DHAKA<div class="bn sub">ঢাকা</div></div>
      <div class="time mono">07:00</div>
    </div>
    <div class="rail"><span class="dot"></span><span class="line"></span><span class="dur mono">5h 30m</span><span class="line"></span><span class="dot lime"></span></div>
    <div class="jl right">
      <div class="city">CHATTOGRAM<div class="bn sub">চট্টগ্রাম</div></div>
      <div class="time mono">12:30</div>
    </div>
    <div class="jmeta">Fri 17 Oct 2026 · Morning Express (demo timetable) · S_CHAIR · Coach GHA · Seats 13, 14, 18, 19
      <div class="bn">শুক্রবার, ১৭ অক্টোবর ২০২৬ · মর্নিং এক্সপ্রেস (ডেমো) · কোচ GHA · আসন ১৩, ১৪, ১৮, ১৯</div></div>
  </section>

  <section class="grid2">
    <div class="box">
      <div class="over">WHO'S WHO · কে কী</div>
      <table>
        <tr><th>Booked by <span class="bn">ক্রেতা</span></th><td>Karim Uddin (nephew) · ••• 5512</td></tr>
        <tr><th>Paid by <span class="bn">পরিশোধকারী</span></th><td>bKash ••9024</td></tr>
        <tr><th>Travellers <span class="bn">যাত্রী</span></th><td>3 adults, 1 child · <span class="bn">৩ জন বড়, ১টি শিশু</span></td></tr>
        <tr><th>Issued <span class="bn">ইস্যু</span></th><td class="mono">16 Oct 2026 21:10</td></tr>
        <tr><th>Status <span class="bn">অবস্থা</span></th><td>Confirmed. The live status shows when staff scan each QR.</td></tr>
      </table>
    </div>
    <div class="box">
      <div class="over">FARE · ভাড়া (DEMO)</div>
      <table class="money">
        <tr><th>Fare 4 × ৳350 <span class="bn">ভাড়া</span></th><td class="mono">৳1,400</td></tr>
        <tr><th>VAT <span class="bn">ভ্যাট</span></th><td class="mono">৳0</td></tr>
        <tr><th>Service charge 4 × ৳20 · not refundable <span class="bn">সেবা খরচ · ফেরতযোগ্য নয়</span></th><td class="mono">৳80</td></tr>
        <tr class="tot"><th>Total paid <span class="bn">মোট</span></th><td class="mono">৳1,480</td></tr>
      </table>
      <div class="refund"><b>Refunds go to the payer</b> (bKash ••9024), never to the person holding the QR.
        <span class="bn">টাকা ফেরত যাবে যিনি পরিশোধ করেছেন তাঁর কাছে।</span></div>
    </div>
  </section>

  <div class="sect">ONE TICKET PER TRAVELLER · প্রতি যাত্রীর আলাদা টিকিট — cut along the line or show on phone</div>
  {stub(PASSENGERS[0])}
  {stub(PASSENGERS[1])}
  <footer class="foot">Page 1 of 2 · black & white friendly · fictional data · railfair concept, not an official ticket</footer>
</div>"""


RULES = [
    ("Staff scan your QR to see the ticket's <b>live status</b>, then compare your ID. The QR alone does not identify you.",
     "কর্মী কিউআর স্ক্যান করে টিকিটের বর্তমান অবস্থা দেখবেন, তারপর পরিচয়পত্র মিলাবেন। কিউআর একা পরিচয় প্রমাণ করে না।"),
    ("Carry the ID shown on your stub: NID, an approved photo ID, or, for a child, the birth registration. No ID with you? Ask for an <b>assisted check</b>. It is recorded, not an automatic refusal (proposed).",
     "টিকিটে লেখা পরিচয়পত্র সঙ্গে রাখুন: এনআইডি, অনুমোদিত ছবিসহ আইডি, শিশুর ক্ষেত্রে জন্মনিবন্ধন। না থাকলে সহায়তায় যাচাই চান (প্রস্তাবিত)।"),
    ("A phone copy or this printout both work. If a ticket is cancelled, every copy of it stops working.",
     "ফোনের কপি বা প্রিন্ট — দুটোই চলবে। টিকিট বাতিল হলে সব কপি অকার্যকর হয়ে যায়।"),
    ("<b>The train never waits for checks.</b> Not being scanned does not make your ticket invalid.",
     "যাচাইয়ের জন্য ট্রেন অপেক্ষা করবে না। স্ক্যান না হলেও টিকিট অবৈধ হয় না।"),
    ("Pay a charge only against an <b>official numbered receipt</b>. Paying does not create a seat or reactivate a cancelled ticket.",
     "জরিমানা দিলে নম্বরযুক্ত অফিসিয়াল রসিদ নিন। টাকা দিলে আসন তৈরি হয় না।"),
]

CANCEL = [
    ("More than 24 h before departure", "যাত্রার ২৪ ঘণ্টার বেশি আগে",
     "Cancel per traveller; fare back to the payer minus approved deductions (proposed rule)."),
    ("Less than 24 h", "২৪ ঘণ্টার কম",
     "Release the seat so someone else can travel; no standard refund (proposed rule)."),
    ("Booked by someone else?", "অন্য কেউ বুক করেছেন?",
     "The traveller approves the cancellation by SMS code or at a counter. A shared QR can't cancel a ticket."),
]


def page2():
    rules = "".join(f"<li><div>{en}</div><div class='bn'>{bn}</div></li>" for en, bn in RULES)
    cancel = "".join(
        f"<tr><th>{en}<div class='bn'>{bn}</div></th><td>{txt}</td></tr>" for en, bn, txt in CANCEL
    )
    return f"""
<div class="page">
  <div class="wm">DEMO</div>
  {HEADER}
  {stub(PASSENGERS[2])}
  {stub(PASSENGERS[3])}
  <section class="grid2 notes">
    <div class="box">
      <div class="over">AT THE STATION & ON BOARD · স্টেশনে ও ট্রেনে</div>
      <ul class="rules">{rules}</ul>
    </div>
    <div class="box">
      <div class="over">CANCEL OR RELEASE · বাতিল বা ছেড়ে দেওয়া</div>
      <table class="cancel">{cancel}</table>
      <div class="over" style="margin-top:4mm">HELP · সহায়তা</div>
      <p class="small">Problem with this e-ticket? Tell us within 2 hours: <span class="mono">support@railfair.example</span> (demo address). Counter or on-board issues: tell the Guard. Charges and complaints are reviewed by someone independent of the staff who recorded them.</p>
      <p class="small bn">ই-টিকিটে সমস্যা হলে ২ ঘণ্টার মধ্যে জানান। অভিযোগ স্বাধীনভাবে পর্যালোচনা করা হয়।</p>
    </div>
  </section>
  <footer class="foot">Page 2 of 2 · fictional data · railfair concept, not an official ticket · rules marked “proposed” need railway approval</footer>
</div>"""


CSS = """
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff}
body{font-family:'Geist','Anek',sans-serif;color:#111412;font-size:9.2pt;line-height:1.35;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.bn{font-family:'Anek',sans-serif;font-weight:400}
.mono{font-family:'GeistMono',monospace;font-weight:500}
.page{width:210mm;height:297mm;padding:8mm 12mm 8mm;position:relative;overflow:hidden;page-break-after:always;display:flex;flex-direction:column;gap:3.2mm}
.page:last-child{page-break-after:auto}
.wm{position:absolute;top:44%;left:50%;transform:translate(-50%,-50%) rotate(-28deg);font:700 150pt 'Bricolage';color:rgba(17,20,18,.05);letter-spacing:6mm;pointer-events:none;z-index:0}
.page>*:not(.wm){position:relative;z-index:1}
.banner{background:#111412;color:#fff;border-radius:3mm;padding:2mm 4mm;font-weight:600;font-size:8.6pt;display:flex;justify-content:space-between;gap:4mm}
.banner .bn{color:#d4f26a;font-weight:500}
.top{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:.6mm solid #111412;padding-bottom:2.5mm}
.brand{display:flex;align-items:center;gap:2.5mm}
.mark{width:9mm;height:9mm;border-radius:2.5mm;background:#111412;color:#d4f26a;font:700 13pt 'Bricolage';display:flex;align-items:center;justify-content:center}
.word{font:700 19pt 'Bricolage';letter-spacing:-.4pt}
.doc{font-size:10pt;color:#5e625f;margin-left:1mm}
.bref{text-align:right}.big{font-size:15pt}
.over{font-family:'GeistMono',monospace;font-weight:500;font-size:7pt;letter-spacing:.9pt;color:#5e625f;text-transform:uppercase;margin-bottom:1.5mm}
.journey{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:2mm 5mm;background:#111412;color:#fff;border-radius:4mm;padding:3.8mm 6mm}
.city{font:700 21pt 'Bricolage';letter-spacing:-.4pt;line-height:1}.city .sub{font:500 10pt 'Anek';color:#c9ccc6;margin-top:1mm}
.time{font-size:13pt;color:#d4f26a;margin-top:1.2mm}
.jl.right{text-align:right}
.rail{display:flex;align-items:center;gap:1.5mm}
.rail .line{flex:1;border-top:.5mm dashed #8a8e89}
.rail .dot{width:3mm;height:3mm;border-radius:50%;border:.5mm solid #d4f26a}
.rail .dot.lime{background:#d4f26a}
.rail .dur{font-size:8pt;background:#d4f26a;color:#111412;border-radius:3mm;padding:.4mm 2mm}
.jmeta{grid-column:1/-1;font-size:8.6pt;color:#e6e8e3;border-top:.3mm solid #3a3f3c;padding-top:2mm}
.jmeta .bn{color:#c9ccc6}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
.box{border:.35mm solid #c9ccc6;border-radius:3.5mm;padding:3mm 4mm}
table{width:100%;border-collapse:collapse}
th,td{text-align:left;vertical-align:top;padding:.8mm 0;border-bottom:.25mm solid #ecebe6;font-size:8.4pt}
th{font-weight:500;color:#5e625f;width:42%;padding-right:2mm}
th .bn{display:block;font-size:7.6pt}
.money td{text-align:right;white-space:nowrap}
.money th{width:auto}
.tot th,.tot td{font-weight:600;color:#111412;font-size:10pt;border-bottom:none;padding-top:1.8mm}
.refund{margin-top:2mm;background:#eef9c8;border-radius:2.5mm;padding:2mm 3mm;font-size:8.2pt}
.refund .bn{display:block}
.sect{font-family:'GeistMono',monospace;font-size:7.4pt;letter-spacing:.6pt;color:#5e625f;text-transform:uppercase}
.stub{position:relative}
.cut{position:absolute;top:-2.1mm;left:0;right:0;border-top:.35mm dashed #8a8e89}
.cut span{position:absolute;left:-1mm;top:-2.6mm;font-size:9pt;background:#fff;color:#5e625f;padding-right:1mm}
.stub-in{display:grid;grid-template-columns:34mm 1fr;gap:5mm;border:.5mm solid #111412;border-radius:4mm;padding:3.2mm 5mm}
.qr svg{width:34mm;height:34mm;display:block}
.qr-cap{margin-top:1.2mm;text-align:center;font:500 7pt 'GeistMono';letter-spacing:.8pt;background:#f1ecfb;color:#6941c6;border-radius:2mm;padding:.6mm 0}
.pname{font:700 16pt 'Bricolage';letter-spacing:-.3pt;line-height:1.1}
.pname .bn{font:500 12pt 'Anek';color:#5e625f;margin-left:1.5mm}
.pkind{font-size:8.6pt;color:#5e625f;margin:.6mm 0 1.6mm}
.kv{display:flex;gap:7mm}
.kv div{display:flex;flex-direction:column}
.k{font:500 6.8pt 'GeistMono';letter-spacing:.8pt;color:#5e625f}.k .bn{font-size:7pt;letter-spacing:0}
.v{font:500 17pt 'GeistMono';letter-spacing:-.5pt}
.idrow{display:flex;justify-content:space-between;align-items:center;gap:3mm;margin-top:1.8mm;font-size:8.6pt}
.pill{background:#e9edfb;color:#2848a8;border-radius:2.5mm;padding:1mm 2.5mm;font-size:7.6pt;font-weight:500;text-align:right}
.pill .bn{font-size:7.4pt}
.ref{margin-top:1.2mm;font-size:7pt;color:#8a8e89}
.notes .box{font-size:8.2pt}
.rules{list-style:none;display:flex;flex-direction:column;gap:2mm}
.rules li{padding-left:3.5mm;position:relative}
.rules li:before{content:'';position:absolute;left:0;top:1.6mm;width:1.6mm;height:1.6mm;border-radius:50%;background:#111412}
.rules .bn{color:#5e625f;font-size:7.8pt}
.cancel th{width:38%}
.cancel th .bn{display:block}
.small{font-size:8pt;margin-top:1mm}
.foot{margin-top:auto;font-size:7pt;color:#8a8e89;border-top:.25mm solid #ecebe6;padding-top:1.5mm}
"""

html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>railfair concept e-ticket (demo)</title>
<style>{font_faces()}{CSS}</style></head><body>{page1()}{page2()}</body></html>"""
OUT.write_text(html, encoding="utf-8")
print(f"wrote {OUT} ({len(html)//1024} KB)")
