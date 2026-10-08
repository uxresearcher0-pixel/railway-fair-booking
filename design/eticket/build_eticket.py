"""Build the railfair concept e-ticket (A4, EN + BN, print-first) as self-contained HTML.

Theme: railfair UI v0.2 — ink on white, one lime accent, rail-line motif,
Bricolage Grotesque / Geist / Geist Mono / Anek Bangla.

All data is fictional. The output must never be usable as a real ticket:
every page carries a DEMO banner and watermark and no Bangladesh Railway branding.

Usage: python3 build_eticket.py <fontsource node_modules dir> <out.html>
"""
import base64
import pathlib
import sys

import segno

FONT_DIR = pathlib.Path(sys.argv[1])
OUT = pathlib.Path(sys.argv[2])

FONTS = [
    ("Bricolage", "bricolage-grotesque/files/bricolage-grotesque-latin-600-normal.woff2", 600),
    ("Bricolage", "bricolage-grotesque/files/bricolage-grotesque-latin-700-normal.woff2", 700),
    ("Geist", "geist-sans/files/geist-sans-latin-400-normal.woff2", 400),
    ("Geist", "geist-sans/files/geist-sans-latin-500-normal.woff2", 500),
    ("Geist", "geist-sans/files/geist-sans-latin-600-normal.woff2", 600),
    ("GeistMono", "geist-mono/files/geist-mono-latin-500-normal.woff2", 500),
    ("GeistMono", "geist-mono/files/geist-mono-latin-600-normal.woff2", 600),
    ("Anek", "anek-bangla/files/anek-bangla-bengali-400-normal.woff2", 400),
    ("Anek", "anek-bangla/files/anek-bangla-bengali-500-normal.woff2", 500),
    ("Anek", "anek-bangla/files/anek-bangla-bengali-600-normal.woff2", 600),
]


def font_faces():
    out = []
    for family, rel, weight in FONTS:
        data = base64.b64encode((FONT_DIR / rel).read_bytes()).decode()
        out.append(
            f"@font-face{{font-family:'{family}';font-weight:{weight};"
            f"src:url(data:font/woff2;base64,{data}) format('woff2');}}"
        )
    return "\n".join(out)


def qr_svg(payload):
    return segno.make(payload, error="m").svg_inline(scale=3, border=0, dark="#111412")


BOOKING = "RF-7Q2K-48"
PASSENGERS = [
    dict(n=1, name="Abdul Karim", bn="আবদুল করিম", kind="Adult", kind_bn="প্রাপ্তবয়স্ক",
         id_type="NID", id_bn="এনআইডি", id_val="•••• 4821", seat="13",
         tone="info", status="Record matched", status_bn="রেকর্ড মিলেছে"),
    dict(n=2, name="Salma Karim", bn="সালমা করিম", kind="Adult", kind_bn="প্রাপ্তবয়স্ক",
         id_type="NID", id_bn="এনআইডি", id_val="•••• 1177", seat="14",
         tone="info", status="Record matched", status_bn="রেকর্ড মিলেছে"),
    dict(n=3, name="Rahim Karim", bn="রহিম করিম", kind="Adult", kind_bn="প্রাপ্তবয়স্ক",
         id_type="NID", id_bn="এনআইডি", id_val="•••• 3390", seat="18",
         tone="info", status="Record matched", status_bn="রেকর্ড মিলেছে"),
    dict(n=4, name="Ayesha Karim", bn="আয়েশা করিম", kind="Child, 8", kind_bn="শিশু, ৮",
         id_type="Birth reg.", id_bn="জন্মনিবন্ধন", id_val="•••• 0526", seat="19",
         tone="warn", status="Assisted check · not “verified”", status_bn="সহায়তায় যাচাই",
         with_="Travels with Abdul Karim (uncle) · seat 13", with_bn="আবদুল করিমের সাথে"),
]


BN_DIGITS = str.maketrans('0123456789', '০১২৩৪৫৬৭৮৯')


def stub(p):
    payload = f"RAILFAIR-DEMO|NOT-VALID|{BOOKING}|P{p['n']}|sig=demo"
    extra = (
        f"<div class='with'>↳ {p['with_']} · <span class='bn'>{p['with_bn']}</span></div>"
        if p.get("with_") else ""
    )
    return f"""
<section class="stub" aria-label="Ticket {p['n']} of 4">
  <div class="s-main">
    <div class="s-top"><span class="ov">TICKET {p['n']} / 4 · <span class="bn">টিকিট {str(p['n']).translate(BN_DIGITS)} / ৪</span></span>
      <span class="mono tok">{BOOKING}-P{p['n']}</span></div>
    <div class="s-name">{p['name']}<span class="bn"> {p['bn']}</span></div>
    <div class="s-kind">{p['kind']} · <span class="bn">{p['kind_bn']}</span></div>
    {extra}
    <div class="s-id">
      <span><span class="ov">ID · <span class="bn">পরিচয়পত্র</span></span><br>
        <b>{p['id_type']}</b> <span class="bn">{p['id_bn']}</span> <span class="mono">{p['id_val']}</span></span>
      <span class="tag {p['tone']}">{p['status']}<br><span class="bn">{p['status_bn']}</span></span>
    </div>
  </div>
  <div class="s-seat">
    <div class="ov">COACH · <span class="bn">কোচ</span></div><div class="mono s-coach">GHA</div>
    <div class="ov">SEAT · <span class="bn">আসন</span></div><div class="mono s-no">{p['seat']}</div>
    <div class="mono s-cls">S_CHAIR</div>
  </div>
  <div class="perf" aria-hidden="true"></div>
  <div class="s-qr">
    {qr_svg(payload)}
    <div class="qr-tag">DEMO QR</div>
    <div class="qr-cap">Scan → live status<br><span class="bn">স্ক্যানে বর্তমান অবস্থা</span></div>
  </div>
</section>"""


def header(page_no):
    return f"""
<div class="banner"><span>CONCEPT DEMO — NOT VALID FOR TRAVEL · NOT ISSUED BY BANGLADESH RAILWAY</span>
  <span class="bn">ধারণামূলক নমুনা — ভ্রমণের জন্য বৈধ নয়</span></div>
<header class="top">
  <div class="brand"><span class="mark">rf</span><span class="word">railfair</span></div>
  <div class="top-r"><span class="ov">E-TICKET · <span class="bn">ই-টিকিট</span></span>
    <span class="mono">{BOOKING} · page {page_no} / 2</span></div>
</header>"""


def page1():
    facts = [
        ("DATE", "তারিখ", "Fri 17 Oct 2026"),
        ("TRAIN", "ট্রেন", "MX-701 Morning"),
        ("CLASS", "শ্রেণি", "S_CHAIR"),
        ("COACH", "কোচ", "GHA"),
        ("SEATS", "আসন", "13 · 14 · 18 · 19"),
        ("PEOPLE", "যাত্রী", "3 + 1 child"),
    ]
    fact_html = "".join(
        f"<div class='fact'><div class='ov'>{en} · <span class='bn'>{bn}</span></div><div class='fv'>{v}</div></div>"
        for en, bn, v in facts
    )
    return f"""
<div class="page">
  <div class="wm" aria-hidden="true">DEMO</div>
  {header(1)}
  <section class="hero">
    <div class="route">
      <div class="city"><div class="code">DHK</div><div class="cname">Dhaka (Kamalapur)<span class="bn"> · ঢাকা</span></div></div>
      <div class="track" aria-hidden="true"><span class="st"></span><span class="ln"></span><span class="dur mono">5h 30m</span><span class="ln"></span><span class="st on"></span></div>
      <div class="city r"><div class="code">CTG</div><div class="cname">Chattogram<span class="bn"> · চট্টগ্রাম</span></div></div>
    </div>
    <div class="times">
      <div><span class="ov">DEPARTS · <span class="bn">ছাড়বে</span></span><span class="mono t">07:00</span></div>
      <div class="pnr"><span class="ov">BOOKING REF / PNR</span><span class="mono p">{BOOKING}</span><span class="ok">● Confirmed · <span class="bn">নিশ্চিত</span></span></div>
      <div class="r"><span class="ov">ARRIVES · <span class="bn">পৌঁছাবে</span></span><span class="mono t">12:30</span></div>
    </div>
  </section>
  <section class="facts">{fact_html}</section>

  <section class="cols">
    <div class="box">
      <div class="h">Who’s who <span class="bn">· কে কী</span></div>
      <dl>
        <dt>Booked by <span class="bn">ক্রেতা</span></dt><dd>Karim Uddin (nephew) · 01X ••• 5512</dd>
        <dt>Paid by <span class="bn">পরিশোধকারী</span></dt><dd>bKash ••9024</dd>
        <dt>Travellers <span class="bn">যাত্রী</span></dt><dd>4 named tickets, below</dd>
        <dt>Issued <span class="bn">ইস্যু</span></dt><dd class="mono">16 Oct 2026 · 21:10</dd>
        <dt>Channel <span class="bn">মাধ্যম</span></dt><dd>railfair app (demo)</dd>
      </dl>
    </div>
    <div class="box">
      <div class="h">Payment <span class="bn">· পেমেন্ট</span> <span class="demo">DEMO FARES</span></div>
      <dl class="money">
        <dt>Fare · 4 × ৳350 <span class="bn">ভাড়া</span></dt><dd class="mono">৳1,400</dd>
        <dt>VAT <span class="bn">ভ্যাট</span></dt><dd class="mono">৳0</dd>
        <dt>Bedding / SMS alert <span class="bn">বেডিং / এসএমএস</span></dt><dd class="mono">৳0</dd>
        <dt>Service charge · not refundable <span class="bn">সেবা খরচ · অফেরতযোগ্য</span></dt><dd class="mono">৳80</dd>
        <dt class="tot">Total paid <span class="bn">মোট</span></dt><dd class="mono tot">৳1,480</dd>
      </dl>
      <div class="note">Txn <span class="mono">PAY-88213</span> · Refunds go to the payer, bKash ••9024 — never to whoever holds the QR.
        <span class="bn">টাকা ফেরত যাবে পরিশোধকারীর কাছে।</span></div>
    </div>
  </section>

  <div class="sect"><span>One ticket per traveller · <span class="bn">প্রতি যাত্রীর আলাদা টিকিট</span></span><span>✂ cut along the dashes, or show on phone</span></div>
  {stub(PASSENGERS[0])}
  {stub(PASSENGERS[1])}
  <footer class="foot"><span>Fictional data · railfair concept, not an official ticket</span><span>Black & white printable</span></footer>
</div>"""


STATION = [
    ("<b>Staff scan each QR</b> for the live status, then compare that traveller’s ID. A QR alone identifies no one.",
     "কর্মী কিউআর স্ক্যান করে বর্তমান অবস্থা দেখবেন, তারপর পরিচয়পত্র মিলাবেন।"),
    ("Valid only for the train, date, class and seats shown. Phone copy or printout both work; a cancelled ticket stops working on every copy.",
     "শুধু উল্লিখিত ট্রেন, তারিখ, শ্রেণি ও আসনে বৈধ। বাতিল হলে সব কপি অকার্যকর।"),
    ("<b>The train never waits for checks.</b> Not being scanned does not make a ticket invalid.",
     "যাচাইয়ের জন্য ট্রেন অপেক্ষা করবে না। স্ক্যান না হলেও টিকিট অবৈধ নয়।"),
    ("Pay any charge only against an <b>official numbered receipt</b>. Paying does not create a seat or reactivate a cancelled ticket.",
     "জরিমানা দিলে নম্বরযুক্ত রসিদ নিন। টাকা দিলে আসন তৈরি হয় না।"),
]
CANCEL = [
    ("> 24 h before departure", "২৪ ঘণ্টার বেশি আগে", "Cancel per traveller; fare back to the payer minus approved deductions."),
    ("< 24 h", "২৪ ঘণ্টার কম", "Release the seat so someone else can travel; no standard refund."),
    ("Booked by someone else", "অন্য কেউ বুক করলে", "The traveller approves by SMS code or at a counter. A QR alone can’t cancel."),
]
CHECKLIST = [
    ("ID for every adult: NID or approved photo ID", "প্রত্যেক প্রাপ্তবয়স্কের পরিচয়পত্র"),
    ("Ayesha’s birth registration · she travels with Abdul", "আয়েশার জন্মনিবন্ধন"),
    ("All 4 tickets — printed or on a phone", "৪টি টিকিট — প্রিন্ট বা ফোনে"),
    ("Coach GHA · seats 13, 14, 18, 19", "কোচ GHA · আসন ১৩, ১৪, ১৮, ১৯"),
]


def page2():
    station = "".join(f"<li><div>{en}</div><div class='bn sub'>{bn}</div></li>" for en, bn in STATION)
    cancel = "".join(
        f"<dt>{en}<span class='bn'>{bn}</span></dt><dd>{txt}</dd>" for en, bn, txt in CANCEL
    )
    check = "".join(
        f"<li><span class='cb' aria-hidden='true'></span><div>{en}<div class='bn sub'>{bn}</div></div></li>"
        for en, bn in CHECKLIST
    )
    return f"""
<div class="page">
  <div class="wm" aria-hidden="true">DEMO</div>
  {header(2)}
  <div class="sect"><span>Tickets 3–4 · <span class="bn">টিকিট ৩–৪</span></span><span>✂ cut along the dashes, or show on phone</span></div>
  {stub(PASSENGERS[2])}
  {stub(PASSENGERS[3])}

  <section class="info">
    <div class="box check">
      <div class="h">Before you leave <span class="bn">· রওনার আগে</span></div>
      <ul class="cl">{check}</ul>
      <div class="assist"><b>Need help boarding?</b> Ask at any counter or tell the Guard; assistance is recorded on the ticket (proposed).
        <span class="bn">সহায়তা লাগলে কাউন্টারে বা গার্ডকে বলুন।</span></div>
    </div>
    <div class="box">
      <div class="h">At the station & on board <span class="bn">· স্টেশনে ও ট্রেনে</span></div>
      <ol class="rules">{station}</ol>
    </div>
  </section>

  <section class="info">
    <div class="box">
      <div class="h">Cancel or release <span class="bn">· বাতিল</span> <span class="demo">PROPOSED RULES</span></div>
      <dl class="cancel">{cancel}</dl>
    </div>
    <div class="box">
      <div class="h">Help & privacy <span class="bn">· সহায়তা ও গোপনীয়তা</span></div>
      <p>E-ticket problem? Tell us <b>within 2 hours</b>: <span class="mono">support@railfair.example</span> (demo). On the train: tell the Guard. Complaints are reviewed independently.</p>
      <p class="bn sub">ই-টিকিটে সমস্যা হলে ২ ঘণ্টার মধ্যে জানান। অভিযোগ স্বাধীনভাবে পর্যালোচনা করা হয়।</p>
      <p>QR codes hold a ticket token only — no name, NID or phone number.</p>
      <p class="mono verify">Verify or cancel: railfair app, website or any counter · {BOOKING}</p>
    </div>
  </section>
  <footer class="foot"><span>Fictional data · railfair concept, not an official ticket · rules marked “proposed” need railway approval</span><span>Black & white printable</span></footer>
</div>"""


CSS = """
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff}
body{font-family:'Geist','Anek',sans-serif;color:#111412;font-size:9pt;line-height:1.38;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.bn{font-family:'Anek',sans-serif;font-weight:400}
.mono{font-family:'GeistMono',monospace;font-weight:500}
.ov{font:500 7.2pt 'GeistMono';letter-spacing:.9pt;color:#5e625f;text-transform:uppercase}
.ov .bn{letter-spacing:0;font-size:7.4pt}
.sub{color:#5e625f;font-size:8.3pt}
.page{width:210mm;height:297mm;padding:7mm 11mm 7mm;position:relative;overflow:hidden;page-break-after:always;display:flex;flex-direction:column;gap:2.5mm}
.page:last-child{page-break-after:auto}
.wm{position:absolute;top:47%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font:700 170pt 'Bricolage';color:rgba(17,20,18,.045);letter-spacing:4mm;z-index:0}
.page>*:not(.wm){position:relative;z-index:1;flex-shrink:0}
.banner{display:flex;justify-content:space-between;gap:4mm;border:.45mm solid #111412;border-radius:10mm;padding:1.4mm 4mm;font:600 7.6pt 'Geist';letter-spacing:.3pt}
.banner .bn{font-weight:500}
.top{display:flex;justify-content:space-between;align-items:center}
.brand{display:flex;align-items:center;gap:2.2mm}
.mark{width:8mm;height:8mm;border-radius:2.4mm;background:#111412;color:#d4f26a;font:700 12pt 'Bricolage';display:flex;align-items:center;justify-content:center}
.word{font:700 17pt 'Bricolage';letter-spacing:-.3pt}
.top-r{display:flex;flex-direction:column;align-items:flex-end;font-size:8pt}
.hero{border-top:.6mm solid #111412;border-bottom:.6mm solid #111412;padding:3mm 0 2.6mm}
.route{display:grid;grid-template-columns:auto 1fr auto;align-items:end;gap:5mm}
.code{font:700 50pt 'Bricolage';letter-spacing:-1.5pt;line-height:.9}
.cname{font-size:8.6pt;color:#5e625f;margin-top:1mm}
.city.r{text-align:right}
.track{display:flex;align-items:center;gap:1.5mm;margin-bottom:9mm}
.track .ln{flex:1;border-top:.5mm dashed #111412}
.track .st{width:3.6mm;height:3.6mm;border-radius:50%;border:.6mm solid #111412;background:#fff}
.track .st.on{background:#d4f26a}
.track .dur{background:#d4f26a;border:.4mm solid #111412;border-radius:3mm;padding:.5mm 2.4mm;font-size:8pt}
.times{display:grid;grid-template-columns:1fr auto 1fr;align-items:end;margin-top:2.4mm}
.times>div{display:flex;flex-direction:column}
.times .r{align-items:flex-end}
.t{font-size:20pt;font-weight:600;letter-spacing:-.6pt;line-height:1.05}
.pnr{align-items:center;text-align:center;background:#111412;color:#fff;border-radius:3mm;padding:2mm 5mm}
.pnr .ov{color:#c9ccc6}
.pnr .p{font-size:15pt;color:#d4f26a;letter-spacing:.3pt}
.pnr .ok{font-size:7.6pt;color:#fff}
.facts{display:grid;grid-template-columns:1.25fr 1.2fr 1fr .8fr 1.25fr 1fr;border:.35mm solid #111412;border-radius:3mm;overflow:hidden}
.fact{padding:2mm 2.6mm;border-right:.35mm solid #d9d6cf}
.fact:last-child{border-right:none}
.fv{font:600 9.4pt 'Geist';margin-top:.6mm;line-height:1.2}
.cols,.info{display:grid;grid-template-columns:1fr 1fr;gap:3.5mm}
.box{border:.35mm solid #d9d6cf;border-radius:3mm;padding:2.8mm 3.6mm}
.h{font:600 10pt 'Bricolage';margin-bottom:1.6mm;display:flex;align-items:center;gap:1.5mm}
.h .bn{font:500 8.6pt 'Anek';color:#5e625f}
.demo{margin-left:auto;font:500 6.6pt 'GeistMono';letter-spacing:.7pt;color:#6941c6;border:.3mm solid #6941c6;border-radius:2mm;padding:.2mm 1.6mm}
dl{display:grid;grid-template-columns:auto 1fr;column-gap:3mm}
dt,dd{padding:.75mm 0;border-bottom:.25mm solid #ecebe6;font-size:8.4pt}
dt{color:#5e625f}
dt .bn{display:block;font-size:7.6pt;line-height:1.2}
.money dd{text-align:right}
dt.tot,dd.tot{border-bottom:none;color:#111412;font:600 10.5pt 'Geist';padding-top:1.3mm}
dd.tot{font-family:'GeistMono'}
.note{margin-top:1.6mm;font-size:7.9pt;background:#eef9c8;border-radius:2mm;padding:1.4mm 2.2mm}
.note .bn{display:block}
.sect{display:flex;justify-content:space-between;font:500 7pt 'GeistMono';letter-spacing:.6pt;color:#5e625f;text-transform:uppercase;border-bottom:.35mm dashed #8a8e89;padding-bottom:1mm}
.sect .bn{letter-spacing:0;font-size:7.6pt}
.stub{display:grid;grid-template-columns:1fr 31mm 0 37mm;border:.45mm solid #111412;border-radius:4mm;position:relative;min-height:40mm}
.s-main{padding:2.8mm 4mm;display:flex;flex-direction:column;gap:.6mm}
.s-top{display:flex;justify-content:space-between;align-items:center}
.tok{font-size:7.4pt;color:#5e625f}
.s-name{font:700 17pt 'Bricolage';letter-spacing:-.4pt;line-height:1.08;margin-top:.6mm}
.s-name .bn{font:500 11.5pt 'Anek';color:#5e625f;margin-left:2mm}
.s-kind{font-size:8.6pt;color:#5e625f}
.with{font-size:8pt;font-weight:500}
.s-id{display:flex;justify-content:space-between;align-items:flex-end;gap:2mm;margin-top:auto;font-size:8.6pt}
.tag{font-size:7.5pt;font-weight:500;border-radius:2mm;padding:.8mm 2.2mm;text-align:right;border:.3mm solid}
.tag.info{background:#e9edfb;color:#2848a8;border-color:#2848a8}
.tag.warn{background:#ffefd6;color:#8a4b00;border-color:#8a4b00}
.s-seat{background:#d4f26a;border-left:.45mm solid #111412;padding:2.6mm 3mm;display:flex;flex-direction:column;justify-content:center}
.s-seat .ov{color:#111412}
.s-coach{font-size:12pt;font-weight:600;margin-bottom:.8mm}
.s-no{font-size:30pt;font-weight:600;line-height:1;letter-spacing:-1pt}
.s-cls{font-size:7.6pt;margin-top:1mm}
.perf{border-left:.45mm dashed #111412;position:relative}
.perf:before,.perf:after{content:'';position:absolute;left:-2.9mm;width:5.4mm;height:5.4mm;border-radius:50%;background:#fff;border:.45mm solid #111412}
.perf:before{top:-3.2mm;clip-path:inset(50% 0 0 0)}
.perf:after{bottom:-3.2mm;clip-path:inset(0 0 50% 0)}
.s-qr{padding:2.6mm 3mm;display:flex;flex-direction:column;align-items:center;gap:.8mm}
.s-qr svg{width:28mm;height:28mm;display:block}
.qr-tag{font:600 6.8pt 'GeistMono';letter-spacing:.8pt;color:#6941c6;border:.3mm solid #6941c6;border-radius:2mm;padding:.1mm 2mm}
.qr-cap{font-size:7pt;text-align:center;line-height:1.25;color:#5e625f}
.info .box{font-size:8.4pt}
.info p{margin-bottom:1.3mm}
.cl{list-style:none;display:flex;flex-direction:column;gap:1.2mm}
.cl li{display:flex;gap:2.4mm;align-items:flex-start}
.cb{flex:none;width:4mm;height:4mm;border:.45mm solid #111412;border-radius:1mm;margin-top:.3mm}
.assist{margin-top:2mm;background:#f5f3ee;border-radius:2mm;padding:1.6mm 2.2mm;font-size:8pt}
.assist .bn{display:block}
.rules{list-style:none;counter-reset:r;display:flex;flex-direction:column;gap:1.2mm}
.rules li{counter-increment:r;padding-left:6mm;position:relative}
.rules li:before{content:counter(r);position:absolute;left:0;top:.1mm;width:4.2mm;height:4.2mm;border-radius:50%;background:#111412;color:#d4f26a;font:600 6.8pt 'GeistMono';display:flex;align-items:center;justify-content:center}
.cancel dt{font-weight:500;color:#111412}
.verify{margin-top:1.6mm;font-size:7.8pt;background:#f5f3ee;border-radius:2mm;padding:1.2mm 2mm}
.foot{margin-top:auto;display:flex;justify-content:space-between;font-size:7.4pt;color:#5e625f;border-top:.25mm solid #d9d6cf;padding-top:1.3mm}
"""

html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>railfair concept e-ticket (demo) · {BOOKING}</title>
<style>{font_faces()}{CSS}</style></head><body>{page1()}{page2()}</body></html>"""
# Mark Bangla runs so screen readers and the tagged PDF switch language.
html = html.replace('class="bn', 'lang="bn" class="bn').replace("class='bn", "lang='bn' class='bn")
OUT.write_text(html, encoding="utf-8")
print(f"wrote {OUT} ({len(html)//1024} KB)")
