const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const fa = require('react-icons/fa6');
const path = require('path');
const { applyTheme } = require('/root/.claude/skills/synced/5b5aeae5-4a61-4d10-9a91-9471606e7c3c_e77d32f8-c954-4624-9cc4-c86d7089323b/pptx/scripts/apply_theme.js');

const IMG = path.join(__dirname, 'img');
const OUT = process.argv[2] || path.join(__dirname, 'railfair-proposal.pptx');
const BN = 'Nirmala UI';

const THEME = {
  name: 'railfair proposal',
  headFontFace: 'Cambria',
  bodyFontFace: 'Calibri',
  colors: {
    dk1: '17201B', lt1: 'FFFFFF', dk2: '1E5B3F', lt2: 'EEF4EA',
    accent1: '1E5B3F', accent2: 'C9EE5A', accent3: '2F7A55', accent4: 'B45309', accent5: '5B6670', accent6: '0E7490',
    hlink: '0E7490', folHlink: '5B6670',
  },
};
const HEX = THEME.colors;

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = 'Fair tickets, less black marketing — proposed upgrade';
pres.author = 'Shahriar Shanto (UX Research)';
const C = pres.SchemeColor;

// ---------- layouts ----------
pres.defineSlideMaster({
  title: 'TITLE_DARK',
  background: { color: C.text2 },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.8, y: 2.0, w: 11.7, h: 1.5, fontFace: BN, fontSize: 48, bold: true, color: C.background1, align: 'left', valign: 'bottom', margin: 0 }, text: '' } },
    { placeholder: { options: { name: 'sub', type: 'body', x: 0.8, y: 3.6, w: 11.7, h: 1.6, fontSize: 24, color: C.background2, valign: 'top', margin: 0 }, text: '' } },
  ],
});
pres.defineSlideMaster({
  title: 'CONTENT',
  background: { color: C.background1 },
  margin: [0.5, 0.6, 0.6, 0.6],
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 0.35, w: 12.1, h: 0.75, fontFace: BN, fontSize: 32, bold: true, color: C.text2, align: 'left', valign: 'bottom', margin: 0 }, text: '' } },
    { placeholder: { options: { name: 'sub', type: 'body', x: 0.6, y: 1.1, w: 12.1, h: 0.4, fontSize: 16, italic: true, color: C.accent5, valign: 'top', margin: 0 }, text: '' } },
    { text: { text: 'Proposed concept · fictional data · not a live railway service', options: { x: 0.6, y: 7.05, w: 8, h: 0.3, fontSize: 10, color: C.accent5, margin: 0 } } },
  ],
  slideNumber: { x: 12.2, y: 7.05, w: 0.5, h: 0.3, fontSize: 10, color: C.accent5, align: 'right' },
});

// ---------- helpers ----------
async function icon(Comp, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: '#' + color, size: String(size) }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return 'image/png;base64,' + buf.toString('base64');
}
async function crop(file, w, h) {
  const buf = await sharp(path.join(IMG, file)).extract({ left: 480, top: 0, width: w, height: h }).png().toBuffer();
  return 'image/png;base64,' + buf.toString('base64');
}
const bn = (text, o = {}) => ({ text, options: { fontFace: BN, ...o } });
const bn1 = (text, o = {}) => [bn(text, o)];
function content(section, titleBn, subEn, notes) {
  const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: section });
  s.addText(titleBn, { placeholder: 'title' });
  s.addText(subEn, { placeholder: 'sub' });
  if (notes) s.addNotes(notes);
  return s;
}
function phone(s, img, x, y, h, name) {
  const w = h * (780 / 1688);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x - 0.12, y: y - 0.12, w: w + 0.24, h: h + 0.24, rectRadius: 0.25, fill: { color: C.background2 }, line: { color: C.background2 }, objectName: name + ' frame' });
  s.addImage({ path: path.join(IMG, img), x, y, w, h, objectName: name, altText: name });
  return w;
}
function desk(s, data, x, y, w, ratio, name) {
  const h = w / ratio;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x - 0.12, y: y - 0.12, w: w + 0.24, h: h + 0.24, rectRadius: 0.15, fill: { color: C.background2 }, line: { color: C.background2 }, objectName: name + ' frame' });
  s.addImage({ data, x, y, w, h, objectName: name, altText: name });
  return h;
}
function bullets(s, items, x, y, w, h, size = 16) {
  const runs = [];
  items.forEach((it, i) => {
    const last = i === items.length - 1;
    if (Array.isArray(it)) { // [bangla, english]
      runs.push({ text: it[0], options: { fontFace: BN, bold: true, bullet: true, breakLine: true, color: C.text1 } });
      runs.push({ text: it[1], options: { fontSize: size - 2, color: C.accent5, breakLine: !last, paraSpaceAfter: 8, indentLevel: 0, bullet: false } });
    } else runs.push({ text: it, options: { fontFace: BN, bullet: true, breakLine: !last, paraSpaceAfter: 8, color: C.text1 } });
  });
  s.addText(runs, { x, y, w, h, fontSize: size, valign: 'top', margin: 0, isTextBox: true, objectName: 'Points' });
}

(async () => {
  const I = {
    bolt: await icon(fa.FaBolt, HEX.accent1), users: await icon(fa.FaUsers, HEX.accent1), hour: await icon(fa.FaHourglassHalf, HEX.accent1),
    swap: await icon(fa.FaRightLeft, HEX.accent1), money: await icon(fa.FaMoneyBillWave, HEX.accent1), secret: await icon(fa.FaUserSecret, HEX.accent1),
    scale: await icon(fa.FaScaleBalanced, HEX.dk1), id: await icon(fa.FaIdCard, HEX.dk1), eye: await icon(fa.FaEye, HEX.dk1),
  };
  const s02 = await crop('s02_bn.png', 1920, 1420);
  const op09 = await crop('op09v2_bn.png', 1920, 1500);
  const sms = await crop('sms_desk_bn.png', 1920, 1760);

  // 1 Title
  pres.addSection({ title: 'Opening' });
  let s = pres.addSlide({ masterName: 'TITLE_DARK', sectionTitle: 'Opening' });
  s.addText('ন্যায্য টিকিট, কালোবাজারি কম', { placeholder: 'title' });
  s.addText([
    { text: 'Fair tickets, less black marketing', options: { bold: true, breakLine: true } },
    { text: 'A proposed upgrade to Rail Sheba booking and ticket checking', options: { fontSize: 20, breakLine: true } },
    { text: 'প্রস্তাবিত ধারণা · কাল্পনিক তথ্য · আলোচনার জন্য', options: { fontFace: BN, fontSize: 18, color: C.accent2 } },
  ], { placeholder: 'sub' });
  s.addText('Shahriar Shanto · UX Research · October 2026', { x: 0.8, y: 6.5, w: 8, h: 0.4, fontSize: 14, color: C.background2, margin: 0, isTextBox: true, objectName: 'Presenter' });
  s.addNotes('শুরু: এটি একটি প্রস্তাবিত ধারণা, চালু কোনো সেবা নয়। সব তথ্য কাল্পনিক। Open: this is a proposal for discussion, not a live system.');

  // 2 The brief
  pres.addSection({ title: 'Problem' });
  s = content('Problem', 'আপনার প্রশ্ন, আমাদের উত্তর', 'The brief and our answer in one line',
    'ক্লায়েন্টের প্রশ্ন দিয়ে শুরু করুন, তারপর এক লাইনে উত্তর। The three verbs on the right are the whole deck.');
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.9, w: 5.8, h: 4.6, rectRadius: 0.2, fill: { color: C.background2 }, line: { color: C.background2 }, objectName: 'Brief card' });
  s.addText([
    bn('প্রশ্ন', { fontSize: 14, bold: true, color: C.accent3, breakLine: true }),
    bn('Rail Sheba-র বর্তমান ব্যবস্থার সম্ভাব্য সমাধান কী, আর কীভাবে টিকিট কালোবাজারি ঠেকানো ও কমানো যায়?', { fontSize: 24, color: C.text1, breakLine: true }),
    { text: 'What are the possible solutions for the current system, and how can ticket black marketing be prevented and reduced?', options: { fontSize: 14, italic: true, color: C.accent5 } },
  ], { x: 0.95, y: 2.2, w: 5.1, h: 4.0, valign: 'top', margin: 0, isTextBox: true, objectName: 'Brief text', paraSpaceAfter: 10 });
  const ans = [['দ্রুততার প্রতিযোগিতা বন্ধ', 'Stop the speed race'], ['টিকিট যাত্রীর সাথে বাঁধা', 'Bind each ticket to its traveller'], ['প্রতিটি ধাপ রেকর্ডে', 'Keep every step on record']];
  ans.forEach(([b, e], i) => {
    const y = 1.9 + i * 1.6;
    s.addShape(pres.shapes.OVAL, { x: 6.9, y: y + 0.15, w: 0.8, h: 0.8, fill: { color: C.accent2 }, line: { color: C.accent2 }, objectName: 'Step ' + (i + 1) });
    s.addText(String(i + 1), { x: 6.9, y: y + 0.15, w: 0.8, h: 0.8, fontSize: 24, bold: true, align: 'center', valign: 'middle', color: C.text1, margin: 0, isTextBox: true, objectName: 'Step number ' + (i + 1) });
    s.addText([bn(b, { fontSize: 26, bold: true, color: C.text2, breakLine: true }), { text: e, options: { fontSize: 16, color: C.accent5 } }],
      { x: 7.95, y, w: 4.8, h: 1.1, valign: 'middle', margin: 0, isTextBox: true, objectName: 'Answer ' + (i + 1) });
  });

  // 3 How black marketing works
  s = content('Problem', 'কালোবাজারি এখন কীভাবে চলে', 'Six tools resellers rely on today (observed from outside; internal systems not reviewed)',
    'Each of these six tools is closed by a specific feature later in the deck. বাইরে থেকে দেখা আচরণ; ভেতরের সিস্টেম দেখা হয়নি।');
  const probs = [
    [I.bolt, 'গতি ও বট', 'Whoever clicks fastest at sale opening wins'],
    [I.users, 'অনেক অ্যাকাউন্ট', 'Extra phones and accounts mean extra chances'],
    [I.hour, 'আসন আটকে রাখা', 'Holding seats, then releasing them to a buyer'],
    [I.swap, 'নাম বদল ও হাতবদল', 'Resold tickets used by someone else'],
    [I.money, 'লুকানো বাড়তি দাম', 'Agents charge on top, with no receipt'],
    [I.secret, 'ভেতরের লোকের আসন', 'Seats quietly held back for resale'],
  ];
  probs.forEach(([ic, b, e], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 4.1, y = 1.85 + row * 2.5;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 3.8, h: 2.2, rectRadius: 0.15, fill: { color: C.background2 }, line: { color: C.background2 }, objectName: 'Problem card ' + (i + 1) });
    s.addShape(pres.shapes.OVAL, { x: x + 0.3, y: y + 0.3, w: 0.8, h: 0.8, fill: { color: C.background1 }, line: { color: C.background1 }, objectName: 'Problem icon bg ' + (i + 1) });
    s.addImage({ data: ic, x: x + 0.48, y: y + 0.48, w: 0.44, h: 0.44, objectName: 'Problem icon ' + (i + 1), altText: b });
    s.addText([bn(b, { fontSize: 20, bold: true, color: C.text1, breakLine: true }), { text: e, options: { fontSize: 14, color: C.accent5 } }],
      { x: x + 0.3, y: y + 1.2, w: 3.3, h: 0.9, valign: 'top', margin: 0, isTextBox: true, objectName: 'Problem text ' + (i + 1) });
  });

  // 4 Three pillars
  pres.addSection({ title: 'Solution' });
  s = content('Solution', 'আমাদের সমাধান: তিনটি স্তম্ভ', 'Our solution in three pillars',
    'Pillar 1 removes speed and duplicate entries. Pillar 2 removes handover and seat parking. Pillar 3 makes fees, staff and seats visible.');
  const pillars = [
    [I.scale, 'ন্যায্য সুযোগ', 'Fair access', ['আবেদনের সময় + প্রকাশ্য ড্র', 'প্রতি যাত্রী একটি আবেদন', 'নির্দিষ্ট পরিশোধের সময়']],
    [I.id, 'টিকিট যাত্রীর', 'The ticket belongs to the traveller', ['নাম বদল বা হাতবদল নেই', 'সাহায্যকারী ও এজেন্ট টিকিট পান না', 'গেটে ও ট্রেনে ব্যক্তি যাচাই']],
    [I.eye, 'স্বচ্ছতা ও জবাবদিহি', 'Transparency and accountability', ['খাতওয়ারি অফিসিয়াল মোট + SMS রসিদ', 'গোপনে বাড়তি টাকার অভিযোগ', 'প্রতিটি আসনের হিসাব, দ্বিতীয় অনুমোদন']],
  ];
  pillars.forEach(([ic, b, e, pts], i) => {
    const x = 0.6 + i * 4.1, y = 1.85;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 3.8, h: 4.85, rectRadius: 0.15, fill: { color: i === 0 ? C.accent2 : C.background2 }, line: { color: i === 0 ? C.accent2 : C.background2 }, objectName: 'Pillar ' + (i + 1) });
    s.addShape(pres.shapes.OVAL, { x: x + 0.3, y: y + 0.3, w: 0.9, h: 0.9, fill: { color: C.background1 }, line: { color: C.background1 }, objectName: 'Pillar icon bg ' + (i + 1) });
    s.addImage({ data: ic, x: x + 0.5, y: y + 0.5, w: 0.5, h: 0.5, objectName: 'Pillar icon ' + (i + 1), altText: e });
    s.addText([bn(b, { fontSize: 24, bold: true, color: C.text1, breakLine: true }), { text: e, options: { fontSize: 14, italic: true, color: C.text2 } }],
      { x: x + 0.3, y: y + 1.35, w: 3.3, h: 1.0, valign: 'top', margin: 0, isTextBox: true, objectName: 'Pillar title ' + (i + 1) });
    s.addText(pts.map((p, k) => bn(p, { bullet: true, breakLine: k < pts.length - 1, paraSpaceAfter: 10 })),
      { x: x + 0.3, y: y + 2.5, w: 3.3, h: 2.2, fontSize: 16, color: C.text1, valign: 'top', margin: 0, isTextBox: true, objectName: 'Pillar points ' + (i + 1) });
  });

  // 5 How the draw works
  s = content('Solution', 'ব্যস্ত ট্রেনে আবেদন ও ড্র', 'How the fair draw works on busy trains (times are examples; rules proposed)',
    'আগে এলে আগে পাবেন — শুধু সাধারণ ট্রেনে থাকবে। ব্যস্ত ট্রেনে দ্রুত ক্লিকে কোনো লাভ নেই। Screen: P21·v2 in Bangla.');
  const tl = [['০৮:০০', 'আবেদন শুরু', 'Window opens'], ['১০:০০', 'তালিকা স্থির', 'List and seats frozen'], ['১০:৩০', 'ড্র প্রকাশ', 'Result by app and SMS'], ['১১:০০', 'পরিশোধের শেষ সময়', 'Unpaid seats go to the next in order']];
  tl.forEach(([t, b, e], i) => {
    const y = 1.9 + i * 1.18;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 1.6, h: 0.9, rectRadius: 0.12, fill: { color: i === 2 ? C.accent2 : C.text2 }, line: { color: i === 2 ? C.accent2 : C.text2 }, objectName: 'Time ' + (i + 1) });
    s.addText(bn1(t, { fontSize: 22, bold: true, color: i === 2 ? C.text1 : C.background1 }), { x: 0.6, y, w: 1.6, h: 0.9, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: 'Time text ' + (i + 1) });
    s.addText([bn(b, { fontSize: 20, bold: true, color: C.text1, breakLine: true }), { text: e, options: { fontSize: 14, color: C.accent5 } }], { x: 2.45, y, w: 5.6, h: 0.9, valign: 'middle', margin: 0, isTextBox: true, objectName: 'Step text ' + (i + 1) });
  });
  s.addText([bn('০৮:০০ বা ০৯:৫৯ — সুযোগ একই। ', { bold: true }), { text: 'Applying early gives no extra chance.', options: { italic: true } }],
    { x: 0.6, y: 6.55, w: 7.6, h: 0.4, fontSize: 15, color: C.text2, margin: 0, isTextBox: true, objectName: 'Key line' });
  phone(s, 'p21v2_bn.png', 9.6, 1.75, 5.0, 'Screen P21·v2 apply for the draw');

  // 6 Proof the draw is fair
  s = content('Solution', 'ড্র যে সৎ, তার প্রমাণ', 'Anyone can check the draw afterwards',
    'Trust is the first objection. Show this public audit page. No names, NID or phone numbers are shown.');
  phone(s, 'pa1v2_bn.png', 0.85, 1.75, 5.0, 'Screen PA1·v2 public draw audit');
  bullets(s, [
    ['তালিকা ও আসনসংখ্যা আগে স্থির', 'Applicants and seats are frozen and fingerprinted before the random number exists'],
    ['প্রকাশ্য দৈব সংখ্যা', 'The random number comes from a public source'],
    ['স্বাধীন পুনরায় চালানো', 'An independent auditor replays the draw and must get the same result'],
    ['আবার চালানো নিষেধ', 'Nobody can rerun a draw to get a different result'],
    ['নিজের স্থান নিজে দেখা', 'Anyone can check their own application number; no personal data is public'],
  ], 4.2, 1.9, 8.5, 4.9, 17);

  // 7 Pay and official total
  s = content('Solution', 'নির্বাচিত হলে: নির্দিষ্ট সময়ে, অফিসিয়াল দামে', 'Picked: pay by a fixed time, at an itemised official total',
    'P22·v2: the deadline never restarts, so nobody can park seats. P10·v2: fare, service charge and any agent fee are listed separately.');
  phone(s, 'p22v2_bn.png', 0.85, 1.75, 5.0, 'Screen P22·v2 picked, pay by 11:00');
  phone(s, 'p10v2_bn.png', 3.7, 1.75, 5.0, 'Screen P10·v2 official total');
  bullets(s, [
    ['পরিশোধের সময় আবার শুরু হয় না', 'Opening the offer, changing phone or retrying payment never resets the clock'],
    ['না দিলে আসন পরের জনের', 'Unpaid seats go to the next application in draw order, never to someone chosen'],
    ['খাতওয়ারি অফিসিয়াল মোট', 'Fare, service charge and any agent fee shown line by line'],
    ['SMS রসিদ প্রত্যেক প্রাপ্তবয়স্ককে', 'Each adult traveller gets the same total by SMS'],
  ], 6.8, 1.9, 5.9, 4.9, 17);

  // 8 Ticket stays with the traveller
  s = content('Solution', 'টিকিট সবসময় যাত্রীর', 'The ticket stays with the traveller, whoever booked it',
    'This closes the agent-holds-the-account pattern. Helpers can book and pay; only the traveller controls the ticket. Agents need a consent code from the traveller\'s own phone.');
  phone(s, 'f05v2_bn.png', 0.85, 1.75, 5.0, 'Screen F05·v2 who does what');
  phone(s, 'a1v2_bn.png', 3.7, 1.75, 5.0, 'Screen A1·v2 who can act on my booking');
  bullets(s, [
    ['যাত্রী, সাহায্যকারী, পরিশোধকারী আলাদা', 'Helpers can book and pay, but cannot change or cancel the ticket'],
    ['যাত্রী সাহায্যকারীকে সরাতে পারেন', 'Any time, in the app or at any counter'],
    ['এজেন্টের জন্য সম্মতি কোড', "Sent to the traveller's own phone; agents see status only, never the QR"],
    ['নাম বদল নেই', 'Desk corrections only for the same person, with a second approver'],
    ['ফেরতের টাকা যে দিয়েছে তার কাছে', 'Refunds cannot be redirected'],
  ], 6.8, 1.9, 5.9, 4.9, 16);

  // 9 Checks
  s = content('Solution', 'গেটে ও ট্রেনে: টিকিট আর মানুষ আলাদাভাবে যাচাই', 'At the gate and on the train: ticket status and person check are separate',
    'QR proves the ticket is genuine, not who holds it. Staff record one of three outcomes. "Couldn\'t check" is recorded honestly, never as invalid, so queues keep moving.');
  const h9 = desk(s, s02, 0.85, 1.8, 6.9, 1920 / 1420, 'Screen S02 staff check');
  bullets(s, [
    ['সিস্টেম: টিকিট আসল কি না', 'Signed QR and live ticket status'],
    ['কর্মী: মানুষটি কি একই', 'Name and photo ID against the named traveller'],
    ['তিনটি ফল, সবই রেকর্ড', 'Matches · does not match · could not check'],
    ['অফলাইনেও কাজ করে', 'Offline checks are provisional; reissue cancels old QRs'],
  ], 8.3, 1.9, 4.4, 4.9, 16);

  // 10 SMS
  s = content('Solution', 'SMS-এ সাহায্য ও বাড়তি টাকার অভিযোগ', 'Help and extra-charge reporting by SMS, no smartphone needed (simulation)',
    'Keywords stay the same in English and Bangla. One case across SMS, app and counter. Reporting never cancels a ticket. The real two-way number is a telecom dependency.');
  desk(s, sms, 0.85, 1.8, 5.2, 1920 / 1760, 'SMS demo screen');
  const kws = [['HELP', 'সাহায্যের মেনু', 'Ticket access, refund, booking without permission, callback'], ['EXTRA', 'বাড়তি টাকার অভিযোগ', 'Total paid → reported excess → SEND to confirm'], ['STATUS', 'অভিযোগের অবস্থা', 'Received → under review → outcome and appeal']];
  kws.forEach(([k, b, e], i) => {
    const y = 1.9 + i * 1.45;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.7, y, w: 1.7, h: 1.15, rectRadius: 0.12, fill: { color: C.text1 }, line: { color: C.text1 }, objectName: 'Keyword ' + k });
    s.addText(k, { x: 6.7, y, w: 1.7, h: 1.15, fontSize: 20, bold: true, align: 'center', valign: 'middle', color: C.accent2, margin: 0, isTextBox: true, objectName: 'Keyword text ' + k });
    s.addText([bn(b, { fontSize: 18, bold: true, color: C.text1, breakLine: true }), { text: e, options: { fontSize: 14, color: C.accent5 } }], { x: 8.65, y, w: 4.1, h: 1.15, valign: 'middle', margin: 0, isTextBox: true, objectName: 'Keyword meaning ' + k });
  });
  s.addText([bn('কখনো এনআইডি, পিন, পাসওয়ার্ড বা OTP চাওয়া হয় না। ', { bold: true }), { text: 'Reports are leads, not proof; no automatic penalty.', options: {} }],
    { x: 6.7, y: 6.35, w: 6.0, h: 0.6, fontSize: 14, color: C.text2, valign: 'top', margin: 0, isTextBox: true, objectName: 'SMS safety line' });

  // 11 Insider controls
  s = content('Solution', 'ভেতরের অনিয়ম ঠেকানো', 'Controls against insider misuse',
    'Software cannot stop collusion alone, but it makes it visible. OP09·v2 shows one unexplained seat flagged automatically.');
  desk(s, op09, 0.85, 1.8, 6.4, 1920 / 1500, 'Screen OP09·v2 every seat accounted for');
  bullets(s, [
    ['প্রতিটি আসনের হিসাব', 'Each seat is in exactly one state; unapproved blocks are flagged'],
    ['দ্বিতীয় অনুমোদন', 'Desk decisions need a second person; self-approval is blocked'],
    ['ড্র পুনরায় চালানো ও প্রকাশ', 'Inputs frozen before the draw; independent replay'],
    ['অডিট লগ ও নমুনা পর্যালোচনা', 'An independent integrity team reviews samples'],
  ], 7.8, 1.9, 4.9, 4.9, 16);

  // 12 Comparison
  pres.addSection({ title: 'Impact' });
  s = content('Impact', 'এখন বনাম প্রস্তাবিত', 'Current approach (observed from outside) vs proposed',
    'Go row by row; each "now" problem matches one of the six tools from the problem slide.');
  const hdr = (t) => ({ text: t, options: { bold: true, color: HEX.lt1, fill: { color: HEX.dk2 }, fontSize: 15 } });
  const cell = (t, o = {}) => ({ text: t, options: { fontFace: BN, fontSize: 14, color: HEX.dk1, ...o } });
  const rows = [
    [hdr('বিষয় / Topic'), hdr('এখন / Now'), hdr('প্রস্তাবিত / Proposed')],
    ['ব্যস্ত ট্রেনের টিকিট', 'যে আগে ক্লিক করে', 'নির্দিষ্ট সময়ে আবেদন + প্রকাশ্য ড্র'],
    ['বাড়তি অ্যাকাউন্ট', 'বাড়তি সুযোগ', 'প্রতি যাত্রী একটি আবেদন'],
    ['আসন আটকে রাখা', 'হোল্ড করে পরে ছাড়া', 'নির্দিষ্ট শেষ সময়, বারবার হলে বিরতি'],
    ['দালালের হাতে টিকিট', 'ঘটে', 'টিকিট যাত্রীর ফোনে, এজেন্ট শুধু অবস্থা দেখেন'],
    ['নাম বদলে বিক্রি', 'ঝুঁকি আছে', 'শুধু একই ব্যক্তির সংশোধন, দ্বিতীয় অনুমোদন'],
    ['গেট ও ট্রেনে যাচাই', 'অসম', 'টিকিট ও ব্যক্তি আলাদাভাবে, রেকর্ডসহ'],
    ['বাড়তি টাকা', 'জানানোর পথ নেই', 'রসিদ, SMS ও গোপন অভিযোগ'],
    ['ভেতরের আসন সরানো', 'ধরা কঠিন', 'প্রতিটি আসনের হিসাব'],
  ].map((r, i) => i === 0 ? r : [cell(r[0], { bold: true }), cell(r[1], { color: HEX.accent4 }), cell(r[2], { color: HEX.dk2, bold: true })]);
  s.addTable(rows, { x: 0.6, y: 1.8, w: 12.1, colW: [3.2, 3.2, 5.7], rowH: 0.52, border: { type: 'solid', pt: 0.75, color: 'D5DED0' }, fill: { color: HEX.lt1 }, valign: 'middle', margin: [0, 0.12, 0, 0.12], objectName: 'Comparison table' });

  // 13 Simulation chart
  s = content('Impact', 'একটি সরল সিমুলেশন: কেন "এক যাত্রী, এক আবেদন" জরুরি', 'Seats won by broker-assisted applicants out of 200 (model, not a measurement)',
    'Model: 1,000 single-seat applicants, 200 of them broker-assisted (20%), 200 seats, 20,000 draws. With one entry each they win their fair share (~40). If each could enter 5 times, they would win ~111. Source: research/allocation_sim.py.');
  s.addChart(pres.charts.BAR, [{ name: 'Seats won', labels: ['এক আবেদন / one entry each', '৫ বার আবেদন / five entries each'], values: [40, 111] }], {
    x: 0.6, y: 1.8, w: 7.4, h: 4.9, barDir: 'col', chartColors: [HEX.accent1, HEX.accent4],
    showValue: true, dataLabelPosition: 'outEnd', dataLabelFontSize: 20, dataLabelFontBold: true, dataLabelColor: HEX.dk1, dataLabelFontFace: '+mn-lt',
    catAxisLabelColor: HEX.accent5, catAxisLabelFontSize: 14, catAxisLabelFontFace: BN, valAxisLabelColor: HEX.accent5, valAxisLabelFontSize: 12, valAxisLabelFontFace: '+mn-lt',
    valAxisMaxVal: 140, valAxisMinVal: 0, valGridLine: { color: 'E3E8DF', size: 0.75 }, catGridLine: { style: 'none' }, showLegend: false, barGapWidthPct: 80, objectName: 'Simulation chart',
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.5, y: 1.9, w: 4.2, h: 4.7, rectRadius: 0.15, fill: { color: C.background2 }, line: { color: C.background2 }, objectName: 'Chart takeaway card' });
  s.addText([
    { text: '≈ 40', options: { fontSize: 54, bold: true, color: C.text2, breakLine: true } },
    bn('ন্যায্য ভাগ: আবেদনকারীদের ২০% দালালের মাধ্যমে এলে আসনের প্রায় ২০%', { fontSize: 16, color: C.text1, breakLine: true, paraSpaceAfter: 14 }),
    { text: '≈ 111', options: { fontSize: 54, bold: true, color: C.accent4, breakLine: true } },
    bn('ডুপ্লিকেট যাচাই না থাকলে: অর্ধেকের বেশি আসন', { fontSize: 16, color: C.text1, breakLine: true, paraSpaceAfter: 14 }),
    { text: 'A model to explain the mechanism. Only a pilot can measure the real effect.', options: { fontSize: 12, italic: true, color: C.accent5 } },
  ], { x: 8.8, y: 2.1, w: 3.7, h: 4.4, valign: 'top', margin: 0, isTextBox: true, objectName: 'Chart takeaway' });

  // 14 For everyone
  s = content('Impact', 'সবার জন্য, সব জায়গা থেকে', 'Every role has its own screens; every passenger has a way in',
    'Page 98 in Figma shows each role\'s full journey. Making the official route easy is itself anti-black-market: fewer people need a paid middleman.');
  const roles = ['যাত্রী', 'সাহায্যকারী', 'নিবন্ধিত এজেন্ট', 'কাউন্টার', 'গার্ড', 'টিটি', 'ডেস্ক', 'স্বাধীন পর্যালোচক', 'পরিচালনা'];
  s.addText(bn1('ভূমিকা', { bold: true }), { x: 0.6, y: 1.85, w: 6, h: 0.4, fontSize: 18, color: C.text2, margin: 0, isTextBox: true, objectName: 'Roles label' });
  roles.forEach((r, i) => {
    const col = i % 3, row = Math.floor(i / 3), x = 0.6 + col * 2.05, y = 2.4 + row * 0.95;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 1.9, h: 0.75, rectRadius: 0.35, fill: { color: i < 3 ? C.accent2 : C.background2 }, line: { color: i < 3 ? C.accent2 : C.background2 }, objectName: 'Role ' + r });
    s.addText(bn1(r, { bold: true }), { x, y, w: 1.9, h: 0.75, fontSize: 15, align: 'center', valign: 'middle', color: C.text1, margin: 0, isTextBox: true, objectName: 'Role text ' + r });
  });
  s.addText(bn1('যাত্রীর পথ', { bold: true }), { x: 7.2, y: 1.85, w: 5.5, h: 0.4, fontSize: 18, color: C.text2, margin: 0, isTextBox: true, objectName: 'Channels label' });
  bullets(s, [
    ['অ্যাপ ও ওয়েবসাইট (মোবাইল ও ডেস্কটপ)', 'Same rules and fares on every channel'],
    ['স্টেশন কাউন্টার, বিনামূল্যে সাহায্য', 'Counter terminal for walk-ins and recovery'],
    ['SMS, স্মার্টফোন ছাড়াই', 'Help and reports by keyword'],
    ['কাগজের টিকিট ও পুরো বাংলা', 'Tested with automated accessibility checks'],
  ], 7.2, 2.4, 5.5, 2.9, 16);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 5.45, w: 12.1, h: 1.25, rectRadius: 0.15, fill: { color: C.text2 }, line: { color: C.text2 }, objectName: 'One rule band' });
  s.addText([bn('যেভাবেই বুক করুন — নিয়ম একই, টিকিট যাত্রীর, প্রতিটি ধাপ রেকর্ডে।', { fontSize: 22, bold: true, color: C.background1, breakLine: true }), { text: 'Whoever books and wherever they book: one set of rules, the ticket stays with the traveller, every step is on record.', options: { fontSize: 14, color: C.accent2 } }],
    { x: 0.95, y: 5.45, w: 11.4, h: 1.25, valign: 'middle', margin: 0, isTextBox: true, objectName: 'One rule text' });

  // 15 What's built
  pres.addSection({ title: 'Evidence' });
  s = content('Evidence', 'যা তৈরি হয়েছে, এখনই দেখা যায়', 'What is ready to see today',
    'Offer a live demo: Figma page 99 act 1, then the SMS EXTRA report, the guard check, and the agent portal on page 98.');
  const stats = [['৭৯', 'connected screens', 'পুরো যাত্রা, পেজ ৯৯'], ['৫', 'role journeys', 'যাত্রী, সাহায্যকারী, এজেন্ট, গার্ড, টিটি'], ['৪৮৭', 'automated tests pass', 'কোডেড প্রোটোটাইপ'], ['০', 'accessibility violations', '৩৪০টি স্ক্রিন অবস্থায় (axe)']];
  stats.forEach(([n, e, b], i) => {
    const x = 0.6 + i * 3.08;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.9, w: 2.85, h: 3.2, rectRadius: 0.15, fill: { color: i === 0 ? C.text2 : C.background2 }, line: { color: i === 0 ? C.text2 : C.background2 }, objectName: 'Stat card ' + (i + 1) });
    s.addText([bn(n, { fontSize: 60, bold: true, color: i === 0 ? C.accent2 : C.text2, breakLine: true }), { text: e, options: { fontSize: 16, bold: true, color: i === 0 ? C.background1 : C.text1, breakLine: true } }, bn(b, { fontSize: 14, color: i === 0 ? C.background2 : C.accent5 })],
      { x: x + 0.25, y: 2.1, w: 2.4, h: 2.8, valign: 'top', margin: 0, isTextBox: true, objectName: 'Stat ' + (i + 1) });
  });
  bullets(s, [
    ['Figma: ইংরেজি ও বাংলা, মোবাইল ও ডেস্কটপ, কর্মী ও পরিচালনার স্ক্রিন', 'Interactive prototypes with Back / Next on every screen'],
    ['প্রস্তাবিত নিয়ম, সিদ্ধান্তের তালিকা ও সিমুলেশন', 'Every rule labelled proposed for railway approval'],
  ], 0.6, 5.4, 12.1, 1.5, 15);

  // 16 Honest limits
  s = content('Evidence', 'যা একা পারবে না', 'Honest limits: what design alone cannot solve',
    'Saying this openly builds trust. Do not promise a percentage drop.');
  const lim = [
    ['গোপন নগদ লেনদেন', 'If both sides hide a cash deal, no system sees it. Needs cheap official help and sampling.'],
    ['আসল মানুষ মিলে কেনা', 'Real people buying within their limits can only be found by pattern review.'],
    ['একজনের একাধিক পরিচয়পত্র', 'Needs official identity linking with the NID service.'],
    ['কর্মীর যোগসাজশ', 'Needs an independent integrity team, not only software.'],
    ['কতটা কমবে', 'No number can be promised until a measured pilot.'],
  ];
  lim.forEach(([b, e], i) => {
    const y = 1.85 + i * 0.98;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 12.1, h: 0.82, rectRadius: 0.12, fill: { color: C.background2 }, line: { color: C.background2 }, objectName: 'Limit ' + (i + 1) });
    s.addText(bn1(b, { bold: true }), { x: 0.9, y, w: 4.0, h: 0.82, fontSize: 18, color: C.accent4, valign: 'middle', margin: 0, isTextBox: true, objectName: 'Limit title ' + (i + 1) });
    s.addText(e, { x: 5.0, y, w: 7.5, h: 0.82, fontSize: 15, color: C.text1, valign: 'middle', margin: 0, isTextBox: true, objectName: 'Limit text ' + (i + 1) });
  });

  // 17 Pilot
  pres.addSection({ title: 'Next steps' });
  s = content('Next steps', 'প্রস্তাব: ছোট পাইলট দিয়ে শুরু', 'Proposal: start with a measured pilot',
    'Ask for a pilot, not a full rollout. Baseline first, then compare.');
  const steps = [['১', 'নিয়ম অনুমোদন', 'Approve proposed rules #35–#44'], ['২', 'প্রযুক্তিগত যাচাই', 'Joint discovery: NID linking, back end, SMS number'], ['৩', 'পাইলট', '2–3 busy routes, staff trained'], ['৪', 'মাপা ও সিদ্ধান্ত', 'Compare with baseline, then decide on rollout']];
  steps.forEach(([n, b, e], i) => {
    const x = 0.6 + i * 3.08;
    s.addShape(pres.shapes.OVAL, { x, y: 1.95, w: 0.9, h: 0.9, fill: { color: i === 2 ? C.accent2 : C.text2 }, line: { color: i === 2 ? C.accent2 : C.text2 }, objectName: 'Pilot step ' + n });
    s.addText(bn1(n, { bold: true }), { x, y: 1.95, w: 0.9, h: 0.9, fontSize: 26, align: 'center', valign: 'middle', color: i === 2 ? C.text1 : C.background1, margin: 0, isTextBox: true, objectName: 'Pilot number ' + n });
    s.addText([bn(b, { fontSize: 20, bold: true, color: C.text1, breakLine: true }), { text: e, options: { fontSize: 14, color: C.accent5 } }], { x, y: 3.0, w: 2.85, h: 1.2, valign: 'top', margin: 0, isTextBox: true, objectName: 'Pilot text ' + n });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.5, w: 12.1, h: 2.25, rectRadius: 0.15, fill: { color: C.background2 }, line: { color: C.background2 }, objectName: 'Metrics card' });
  s.addText(bn1('যা মাপা হবে / What we measure', { bold: true }), { x: 0.9, y: 4.65, w: 11.5, h: 0.45, fontSize: 18, color: C.text2, margin: 0, isTextBox: true, objectName: 'Metrics label' });
  const mets = ['পুনর্বিক্রির বিজ্ঞাপন / resale listings', 'যাচাইয়ে নামের অমিল / name mismatches at checks', 'বাড়তি টাকার অভিযোগ / extra-charge reports', 'ব্যাখ্যাহীন আসন / unexplained seats', 'গেটে সময় / time at the gate', 'যাত্রীর সন্তুষ্টি / passenger satisfaction'];
  mets.forEach((m, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    s.addText(bn1(m, { bullet: true }), { x: 0.9 + col * 3.9, y: 5.25 + row * 0.6, w: 3.8, h: 0.5, fontSize: 14, color: C.text1, valign: 'middle', margin: 0, isTextBox: true, objectName: 'Metric ' + (i + 1) });
  });

  // 18 Ask / close
  s = pres.addSlide({ masterName: 'TITLE_DARK', sectionTitle: 'Next steps' });
  s.addText('আপনাদের কাছে আমাদের অনুরোধ', { placeholder: 'title' });
  s.addText([
    { text: 'What we ask from the railway authority', options: { bold: true, breakLine: true } },
    { text: 'Approve a pilot on 2–3 busy routes · NID linking · an independent review team · a two-way SMS number · staff training', options: { fontSize: 18, breakLine: true } },
    { text: 'প্রশ্ন ও আলোচনা · Questions and discussion', options: { fontFace: BN, fontSize: 22, color: C.accent2 } },
  ], { placeholder: 'sub' });
  s.addNotes('Close with the ask: a pilot, not a full rollout. Q&A prep: docs/client-qa.md (25 questions).');

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log('wrote', OUT);
})().catch(e => { console.error(e); process.exit(1); });
