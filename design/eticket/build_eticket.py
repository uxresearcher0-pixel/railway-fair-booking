"""Build the railfair concept e-ticket (A4, EN + BN, print-first) as self-contained HTML.

Layout: two self-contained tickets stacked per A4 page, each with a large
scan-ready QR (no cutting needed), then a full booking summary page.
Theme: railfair UI v0.2 — ink on white, one lime accent, rail-line motif.

All data is fictional. The output must never be usable as a real ticket:
every page carries a DEMO banner and watermark and no Bangladesh Railway branding.

Usage: python3 build_eticket.py <fontsource node_modules dir> <out.html> [traveller count 1-4]

Tickets pair up two per page; with an odd count the last ticket sits in the
upper half and the lower half stays empty. A full booking summary page always follows.
"""
import base64
import math
import re
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
BN_DIGITS = str.maketrans("0123456789", "০১২৩৪৫৬৭৮৯")
BOOKING = "RF-7Q2K-48"


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
    # Level Q tolerates print smudges and folds; border=4 is the standard quiet zone.
    qr = segno.make(payload, error="q")
    w, h = qr.symbol_size(scale=1, border=4)
    svg = qr.svg_inline(scale=1, border=4, dark="#111412", light="#ffffff")
    # Replace fixed pixel size with a viewBox so CSS can scale it to the print size.
    svg = re.sub(r'\swidth="\d+"\sheight="\d+"', f' viewBox="0 0 {w} {h}" shape-rendering="crispEdges"', svg, count=1)
    return svg


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
    dict(n=4, name="Ayesha Karim", bn="আয়েশা করিম", kind="Child, 8 years", kind_bn="শিশু, ৮ বছর",
         id_type="Birth reg.", id_bn="জন্মনিবন্ধন", id_val="•••• 0526", seat="19",
         tone="warn", status="Assisted check · not “verified”", status_bn="সহায়তায় যাচাই",
         with_="Accompanying adult: Abdul Karim · seat 13", with_bn="সঙ্গী: আবদুল করিম"),
]


ALL_PASSENGERS = PASSENGERS
PASSENGERS = ALL_PASSENGERS[: int(sys.argv[3]) if len(sys.argv) > 3 else len(ALL_PASSENGERS)]
N = len(PASSENGERS)
FARE, SERVICE = 350, 20
TOTAL_PAGES = math.ceil(N / 2) + 1


def taka(v):
    return f"৳{v:,}"


def bn_num(n):
    return str(n).translate(BN_DIGITS)


def chrome(label):
    return f"""
<div class="wm" aria-hidden="true">DEMO</div>
<div class="banner"><span>CONCEPT DEMO — NOT VALID FOR TRAVEL · NOT ISSUED BY BANGLADESH RAILWAY</span>
  <span class="bn">ধারণামূলক নমুনা — ভ্রমণের জন্য বৈধ নয়</span></div>
<header class="top">
  <div class="brand"><span class="mark">rf</span><span class="word">railfair</span><span class="doc">{label}</span></div>
  <div class="top-r"><span class="ov">BOOKING REF / PNR</span><span class="mono pnr">{BOOKING}</span></div>
</header>"""


def footer(page_no, left):
    return f"""<footer class="foot"><span>{left}</span><span class="mono">{BOOKING} · page {page_no} / {TOTAL_PAGES}</span></footer>"""


def ticket_half(p):
    payload = f"RAILFAIR-DEMO|NOT-VALID|{BOOKING}|P{p['n']}|sig=demo"
    with_line = (
        f"<div class='with'><b>{p['with_']}</b> · <span class='bn'>{p['with_bn']}</span></div>"
        if p.get("with_") else ""
    )
    return f"""
<section class="ticket" aria-label="Ticket {p['n']} of {N} for {p['name']}">
  <div class="t-head">
    <div class="th-l"><span class="ov">TICKET {p['n']} OF {N} · <span class="bn">টিকিট {bn_num(p['n'])} / {bn_num(N)}</span></span>
      <span class="route"><span class="code">DHK</span><span class="mini-track"><i></i><b class="mono">5h 30m</b><i></i></span><span class="code">CTG</span></span></div>
    <div class="th-m"><span class="ov">FRI 17 OCT 2026</span><span class="tr">MX-701 Morning Express</span><span class="bn sub">শুক্রবার, ১৭ অক্টোবর ২০২৬</span></div>
    <div class="th-r"><div><span class="ov">DEPARTS</span><span class="mono t">07:00</span></div><div><span class="ov">ARRIVES</span><span class="mono t">12:30</span></div></div>
  </div>
  <div class="t-body">
    <div class="who">
      <div class="ov">TRAVELLER · <span class="bn">যাত্রী</span></div>
      <div class="pname">{p['name']} <span class="pbn bn">{p['bn']}</span></div>
      <div class="pkind">{p['kind']} · <span class="bn">{p['kind_bn']}</span></div>
      {with_line}
      <div class="seatrow">
        <div class="seat"><div class="ov">COACH · <span class="bn">কোচ</span></div><div class="mono big">GHA</div></div>
        <div class="seat lime"><div class="ov">SEAT · <span class="bn">আসন</span></div><div class="mono big">{p['seat']}</div></div>
        <div class="seat"><div class="ov">CLASS · <span class="bn">শ্রেণি</span></div><div class="mono big sm">S_CHAIR</div></div>
      </div>
      <div class="idbox">
        <div><div class="ov">ID TO SHOW · <span class="bn">দেখানোর পরিচয়পত্র</span></div>
          <div class="idv"><b>{p['id_type']}</b> <span class="bn">{p['id_bn']}</span> <span class="mono idn">{p['id_val']}</span></div></div>
        <span class="tag {p['tone']}">{p['status']}<br><span class="bn">{p['status_bn']}</span></span>
      </div>
      <div class="rule">Show with the ID above · valid only for this train, date and seat · the train never waits for checks.
        <span class="bn">পরিচয়পত্রসহ দেখান · শুধু এই ট্রেন, তারিখ ও আসনে বৈধ।</span></div>
    </div>
    <div class="scan">
      <div class="ov scan-h">SCAN HERE · <span class="bn">এখানে স্ক্যান করুন</span></div>
      <div class="qr">{qr_svg(payload)}</div>
      <div class="mono tok">{BOOKING}-P{p['n']}</div>
      <div class="demo-q">DEMO QR — NOT A VALID TICKET</div>
    </div>
  </div>
</section>"""


def tickets_page(page_no, group):
    first = group[0]
    if len(group) == 2:
        second = group[1]
        label = f"Tickets {first['n']}–{second['n']} of {N} · <span class='bn'>টিকিট {bn_num(first['n'])}–{bn_num(second['n'])} / {bn_num(N)}</span>"
        fold = ('<div class="fold" aria-hidden="true"><span>Fold here if travelling separately — no cutting needed · '
                '<span class="bn">আলাদা ভ্রমণে এখানে ভাঁজ করুন</span></span></div>')
        lower = ticket_half(second)
    else:
        label = f"Ticket {first['n']} of {N} · <span class='bn'>টিকিট {bn_num(first['n'])} / {bn_num(N)}</span>"
        # Keep the same geometry as a paired page: the lower half is left blank.
        fold = '<div class="fold blank" aria-hidden="true"><span>&nbsp;</span></div>'
        lower = '<div class="empty-half" aria-hidden="true"></div>'
    return f"""
<div class="page tix">
  {chrome(label)}
  {ticket_half(first)}
  {fold}
  {lower}
  {footer(page_no, "Fictional data · railfair concept, not an official ticket · one or two tickets per page")}
</div>"""


def fare_rows():
    return f"""
        <dt>Fare · {N} × {taka(FARE)} <span class="bn">ভাড়া</span></dt><dd class="mono">{taka(N * FARE)}</dd>
        <dt>VAT <span class="bn">ভ্যাট</span></dt><dd class="mono">৳0</dd>
        <dt>Bedding / SMS alert <span class="bn">বেডিং / এসএমএস</span></dt><dd class="mono">৳0</dd>
        <dt>Service charge · not refundable <span class="bn">সেবা খরচ · অফেরতযোগ্য</span></dt><dd class="mono">{taka(N * SERVICE)}</dd>
        <dt class="tot">Total paid <span class="bn">মোট</span></dt><dd class="mono tot">{taka(N * (FARE + SERVICE))}</dd>"""


def summary_page():  # noqa: C901 - flat template
    rows = "".join(
        f"<tr><td class='mono'>{p['n']}</td><td><b>{p['name']}</b>"
        f"<div class='tsub'><span class='bn'>{p['bn']}</span> · {p['kind']}{' · with Abdul Karim' if p.get('with_') else ''}</div></td>"
        f"<td class='nw'>{p['id_type']} <span class='mono'>{p['id_val']}</span></td>"
        f"<td class='mono nw'>GHA-{p['seat']}</td><td class='mono nw'>{BOOKING}-P{p['n']}</td></tr>"
        for p in PASSENGERS
    )
    return f"""
<div class="page sum">
  {chrome("Booking summary — for the person who booked · <span class='bn'>বুকিং সারাংশ</span>")}
  <div class="jline"><span class="mono">DHK → CTG</span><span>Fri 17 Oct 2026 · MX-701 Morning Express · S_CHAIR · Coach GHA</span><span class="mono">07:00 → 12:30</span></div>

  <section class="box">
    <div class="h">Travellers <span class="bn">· যাত্রী</span></div>
    <table class="tt">
      <thead><tr><th>#</th><th>Traveller</th><th>ID</th><th>Seat</th><th>Ticket token</th></tr></thead>
      <tbody>{rows}</tbody>
    </table>
  </section>

  <section class="cols">
    <div class="box">
      <div class="h">Booking <span class="bn">· বুকিং</span></div>
      <dl>
        <dt>Booked by <span class="bn">ক্রেতা</span></dt><dd>Karim Uddin · 01X ••• 5512</dd>
        <dt>Paid by <span class="bn">পরিশোধকারী</span></dt><dd>bKash ••9024</dd>
        <dt>Issued <span class="bn">ইস্যু</span></dt><dd class="mono">16 Oct 2026 · 21:10</dd>
        <dt>Status <span class="bn">অবস্থা</span></dt><dd>Confirmed · {N} ticket{'s' if N > 1 else ''} · railfair app (demo)</dd>
      </dl>
    </div>
    <div class="box">
      <div class="h">Payment <span class="bn">· পেমেন্ট</span><span class="demo">DEMO FARES</span></div>
      <dl class="money">
{fare_rows()}
      </dl>
      <div class="note">Txn <span class="mono">PAY-88213</span> · Refunds go to the payer (bKash ••9024), never to whoever holds a QR.
        <span class="bn">টাকা ফেরত যাবে পরিশোধকারীর কাছে।</span></div>
    </div>
  </section>

  <section class="cols">
    <div class="box">
      <div class="h">Cancel or release <span class="bn">· বাতিল</span><span class="demo">PROPOSED RULES</span></div>
      <dl class="cancel">
        <dt>More than 24 h before departure<span class="bn">যাত্রার ২৪ ঘণ্টার বেশি আগে</span></dt><dd>Cancel per traveller; fare returned to the payer minus approved deductions.</dd>
        <dt>Less than 24 h<span class="bn">২৪ ঘণ্টার কম</span></dt><dd>Release the seat so someone else can travel; no standard refund.</dd>
        <dt>Booked for another traveller<span class="bn">অন্য যাত্রীর জন্য বুক করলে</span></dt><dd>The traveller approves by SMS code or at a counter. A QR alone cannot cancel a ticket.</dd>
      </dl>
    </div>
    <div class="box">
      <div class="h">Help & privacy <span class="bn">· সহায়তা ও গোপনীয়তা</span></div>
      <p>E-ticket problem? Report it <b>within 2 hours</b>: <span class="mono">support@railfair.example</span> (demo). On the train, inform the Guard. Complaints are reviewed independently.</p>
      <p class="bn sub">ই-টিকিটে সমস্যা হলে ২ ঘণ্টার মধ্যে জানান।</p>
      <p>Pay on-train charges only against an official numbered receipt. Boarding assistance: ask at any counter (proposed).</p>
      <p class="verify mono">Verify or cancel: railfair app, website or any counter · {BOOKING}</p>
    </div>
  </section>
  {footer(TOTAL_PAGES, "Fictional data · railfair concept, not an official ticket · rules marked “proposed” need railway approval")}
</div>"""


CSS = """
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff}
body{font-family:'Geist','Anek',sans-serif;color:#111412;font-size:9.4pt;line-height:1.4;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.bn{font-family:'Anek',sans-serif;font-weight:400}
.mono{font-family:'GeistMono',monospace;font-weight:500}
.ov{font:500 7.4pt 'GeistMono';letter-spacing:.9pt;color:#5e625f;text-transform:uppercase}
.ov .bn{letter-spacing:0;font-size:7.8pt}
.sub{color:#5e625f;font-size:8.4pt}
.small{font-size:8.2pt;margin-top:2mm}
.page{width:210mm;height:297mm;padding:12mm 14mm 10mm;position:relative;overflow:hidden;page-break-after:always;display:flex;flex-direction:column;gap:5mm}
.page:last-child{page-break-after:auto}
.page>*:not(.wm){position:relative;z-index:1;flex-shrink:0}
.wm{position:absolute;top:58%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font:700 170pt 'Bricolage';color:rgba(17,20,18,.04);letter-spacing:4mm;z-index:0}
.banner{display:flex;justify-content:space-between;gap:4mm;border:.45mm solid #111412;border-radius:10mm;padding:1.6mm 4.5mm;font:600 7.8pt 'Geist';letter-spacing:.3pt}
.banner .bn{font-weight:500}
.top{display:flex;justify-content:space-between;align-items:center;padding-bottom:3mm;border-bottom:.6mm solid #111412}
.brand{display:flex;align-items:center;gap:2.5mm}
.mark{width:9mm;height:9mm;border-radius:2.6mm;background:#111412;color:#d4f26a;font:700 13pt 'Bricolage';display:flex;align-items:center;justify-content:center}
.word{font:700 19pt 'Bricolage';letter-spacing:-.3pt}
.doc{font:500 10pt 'Geist';color:#5e625f;margin-left:2mm;padding-left:3mm;border-left:.35mm solid #d9d6cf}
.top-r{display:flex;flex-direction:column;align-items:flex-end}
.pnr{font-size:16pt;letter-spacing:.3pt}
.journey{display:grid;grid-template-columns:auto 1fr auto;align-items:end;column-gap:6mm;row-gap:3mm;padding-bottom:4mm;border-bottom:.35mm solid #d9d6cf}
.code{font:700 44pt 'Bricolage';letter-spacing:-1.4pt;line-height:.9}
.cname{font-size:8.8pt;color:#5e625f;margin-top:1.2mm}
.city.r{text-align:right}
.track{display:flex;align-items:center;gap:1.6mm;margin-bottom:8mm}
.track .ln{flex:1;border-top:.5mm dashed #111412}
.track .st{width:3.6mm;height:3.6mm;border-radius:50%;border:.6mm solid #111412;background:#fff}
.track .st.on{background:#d4f26a}
.track .dur{background:#d4f26a;border:.4mm solid #111412;border-radius:3mm;padding:.5mm 2.4mm;font-size:8.4pt}
.tm{display:flex;flex-direction:column}
.tm.mid{align-items:center;text-align:center;align-self:center}
.tm.r{align-items:flex-end}
.t{font-size:20pt;font-weight:600;letter-spacing:-.6pt;line-height:1.05}
.tix{gap:4mm}
.ticket{flex:1 1 0;display:flex;flex-direction:column;border:.6mm solid #111412;border-radius:5mm;overflow:hidden;min-height:0}
.t-head{display:grid;grid-template-columns:auto 1fr auto;gap:6mm;align-items:center;padding:3.2mm 5mm;border-bottom:.6mm solid #111412}
.th-l,.th-m{display:flex;flex-direction:column;gap:.4mm}
.th-m .sub{font-size:8pt;line-height:1.2}
.route{display:flex;align-items:center;gap:2.4mm}
.code{font:700 22pt 'Bricolage';letter-spacing:-.6pt;line-height:1}
.mini-track{display:flex;align-items:center;gap:1.2mm}
.mini-track i{display:block;width:7mm;border-top:.5mm dashed #111412}
.mini-track b{font-size:7.6pt;font-weight:500;background:#d4f26a;border:.35mm solid #111412;border-radius:3mm;padding:.2mm 1.8mm}
.tr{font:600 10.5pt 'Geist'}
.th-r{display:flex;gap:6mm}
.th-r>div{display:flex;flex-direction:column}
.t{font-size:17pt;font-weight:600;letter-spacing:-.5pt;line-height:1.05}
.t-body{flex:1;display:grid;grid-template-columns:1fr 70mm;min-height:0}
.who{padding:4mm 5mm;display:flex;flex-direction:column;gap:1mm}
.pname{font:700 22pt 'Bricolage';letter-spacing:-.5pt;line-height:1.1}
.pbn{font-size:13pt;font-weight:500;color:#5e625f;margin-left:1.5mm;letter-spacing:0}
.pkind{font-size:9.4pt;color:#5e625f}
.with{font-size:8.6pt;background:#f5f3ee;border-radius:2mm;padding:1mm 2.4mm;margin-top:.4mm;white-space:nowrap}
.with .bn{color:#5e625f}
.seatrow{display:grid;grid-template-columns:1fr 1fr 1.35fr;gap:2.4mm;margin-top:auto;padding-top:2mm}
.seat{border:.35mm solid #111412;border-radius:3mm;padding:1.6mm 3mm}
.seat.lime{background:#d4f26a}
.seat.lime .ov{color:#111412}
.big{font-size:22pt;font-weight:600;letter-spacing:-.8pt;line-height:1.1}
.big.sm{font-size:14pt;line-height:1.55}
.idbox{display:flex;justify-content:space-between;align-items:flex-end;gap:3mm;margin-top:2mm;padding-top:2mm;border-top:.25mm solid #ecebe6}
.idv{font-size:9.6pt;margin-top:.4mm;white-space:nowrap}
.idn{font-size:11pt;font-weight:600;margin-left:1mm}
.tag{font-size:7.8pt;font-weight:500;border-radius:2mm;padding:.8mm 2.4mm;text-align:right;border:.3mm solid;white-space:nowrap}
.tag.info{background:#e9edfb;color:#2848a8;border-color:#2848a8}
.tag.warn{background:#ffefd6;color:#8a4b00;border-color:#8a4b00}
.rule{margin-top:2mm;font-size:7.8pt;color:#5e625f;line-height:1.35}
.rule .bn{display:block}
.scan{border-left:.6mm solid #111412;padding:3mm 4mm;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.4mm}
.scan-h{color:#111412;font-weight:600}
.qr svg{width:60mm;height:60mm;display:block}
.tok{font-size:9.4pt;letter-spacing:.4pt}
.demo-q{font:600 6.8pt 'GeistMono';letter-spacing:.7pt;color:#6941c6;border:.3mm solid #6941c6;border-radius:2mm;padding:.3mm 2mm}
.jline{display:flex;justify-content:space-between;gap:4mm;align-items:center;border:.45mm solid #111412;border-radius:3mm;padding:2.4mm 4mm;font-size:9.4pt}
.jline .mono{font-size:13pt;font-weight:600;white-space:nowrap}
.empty-half{flex:1 1 0;border:.6mm solid transparent}
.fold.blank{visibility:hidden}
.fold{height:4mm;display:flex;align-items:center;gap:3mm;font:500 7.2pt 'GeistMono';letter-spacing:.5pt;color:#5e625f;text-transform:uppercase}
.fold:before,.fold:after{content:'';flex:1;border-top:.35mm dashed #8a8e89}
.fold .bn{letter-spacing:0;text-transform:none;font-size:7.6pt}
.keep{background:#eef9c8;border-radius:3mm;padding:2mm 3.6mm;font-size:8.8pt;font-weight:500}
.keep .bn{display:block;font-weight:400}
.page.sum{gap:3.4mm;padding-top:10mm}
.sum dt,.sum dd{padding:.8mm 0}
.box{border:.35mm solid #d9d6cf;border-radius:3.5mm;padding:3mm 4.2mm}
.h{font:600 11pt 'Bricolage';margin-bottom:2mm;display:flex;align-items:center;gap:1.6mm}
.h .bn{font:500 9pt 'Anek';color:#5e625f}
.demo{margin-left:auto;font:500 6.8pt 'GeistMono';letter-spacing:.7pt;color:#6941c6;border:.3mm solid #6941c6;border-radius:2mm;padding:.2mm 1.6mm}
.tt{width:100%;border-collapse:collapse;font-size:8.8pt}
.tt th{font:500 7.2pt 'GeistMono';letter-spacing:.8pt;color:#5e625f;text-transform:uppercase;text-align:left;padding:1mm 1.6mm;border-bottom:.35mm solid #111412}
.tt td{padding:1.4mm 1.6mm;border-bottom:.25mm solid #ecebe6;vertical-align:top}
.tt .tsub{font-size:8pt;color:#5e625f}
.tt .nw{white-space:nowrap}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
dl{display:grid;grid-template-columns:auto 1fr;column-gap:3mm}
dt,dd{padding:1mm 0;border-bottom:.25mm solid #ecebe6;font-size:8.8pt}
dt{color:#5e625f}
dt .bn{display:block;font-size:8pt;line-height:1.25}
.money dd{text-align:right}
dt.tot,dd.tot{border-bottom:none;color:#111412;font:600 11pt 'Geist';padding-top:1.6mm}
dd.tot{font-family:'GeistMono'}
.note{margin-top:2mm;font-size:8.4pt;background:#eef9c8;border-radius:2mm;padding:1.6mm 2.4mm}
.note .bn{display:block}
.cancel{grid-template-columns:36mm 1fr}
.cancel dt{color:#111412;font-weight:500}
.box p{font-size:8.8pt;margin-bottom:1.6mm}
.verify{font-size:8pt;background:#f5f3ee;border-radius:2mm;padding:1.4mm 2.2mm}
.foot{margin-top:auto;display:flex;justify-content:space-between;font-size:7.6pt;color:#5e625f;border-top:.25mm solid #d9d6cf;padding-top:2mm}
"""

pages = "".join(tickets_page(i // 2 + 1, PASSENGERS[i:i + 2]) for i in range(0, N, 2)) + summary_page()
html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>railfair concept e-ticket (demo) · {BOOKING}</title>
<style>{font_faces()}{CSS}</style></head><body>{pages}</body></html>"""
# Mark Bangla runs so screen readers and the tagged PDF switch language.
html = html.replace('class="bn', 'lang="bn" class="bn').replace("class='bn", "lang='bn' class='bn")
OUT.write_text(html, encoding="utf-8")
print(f"wrote {OUT} ({len(html)//1024} KB)")
