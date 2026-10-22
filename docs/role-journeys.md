# Role journeys (Figma page 98)

This page has five connected journeys, each showing one person's view: 59 screens in all. Every screen has **‹ Back** and **Next ›** within its own journey, and tapping the step number goes back to the index. A screen's own buttons stay linked inside the journey.

To show it, press Present ▶ and choose "Role journeys · start here". Each role also has its own starting point.

New screens for this page (Figma 02c, section v2-6):
- **AG01–AG05:** the registered agent's own portal.
- **HB1·v2:** what a helper sees after paying.

| # | Role | Screens |
|---|---|---|
| 1 | Traveller books for themselves (19) | P01 → P02 → P03 → F01 → F02 → F03 → P04 → P05 → P21·v2 → P21b·v2 → PA1·v2 → P22·v2 → P08 → F06 → P10·v2 → P14·v2 → SMS01 → P16 → P25·v2 |
| 2 | Someone books for the traveller, the helper (12) | P01 → P05 → F04a → P06 → F05·v2 → P21·v2 → P10·v2 → HB1·v2 → SMS01 (to the traveller) → A1·v2 → A1b·v2 → P25·v2 |
| 3 | Registered agent (8) | AG01 dashboard → AG02 apply with the traveller's consent code → AG03 fee and receipt → CT04·v2 printed receipt → AG04 status only → AG05 standing → R3·v2 / R3b·v2 (the passenger can report the agent) |
| 4 | Guard at the station entry (11) | EG01–EG04 main path, then exceptions EG05–EG11 |
| 5 | TT on the train (13) | OB01–OB03 main path, exceptions OB04–OB10, then OB11–OB13 |

Proposed design. All data is fictional. The rules need railway approval, and the agent fee rate is still to be confirmed.

## বাংলায় ধাপে ধাপে

### ১ · যাত্রী নিজের জন্য বুক করেন
১. সাইন ইন করে নিয়ম দেখে নিন (P01, P02)।
২. খুঁজুন: স্টেশন, তারিখ, যাত্রী ও শ্রেণি (P03, F01, F02, F03)।
৩. ট্রেন বেছে নিন। ব্যস্ত ট্রেনে ড্র হয় (P04)।
৪. যাত্রীদের নাম ও পরিচয়পত্রের তথ্য দিন (P05)।
৫. ড্র-এর জন্য আবেদন করুন, রসিদ পাবেন (P21·v2, P21b·v2)।
৬. পাবলিক অডিটে ড্র যাচাই করুন। নির্বাচিত হলে ১১:০০-এর মধ্যে পরিশোধ করুন (PA1·v2, P22·v2)।
৭. আসন বেছে নিয়ে বুকিং দেখে নিন (P08, F06)।
৮. অফিসিয়াল মোট দিয়ে পরিশোধ করুন। রসিদ ও SMS আসবে (P10·v2, P14·v2, SMS01)।
৯. দরকার হলে বাতিল বা পুনরুদ্ধার করুন (P16, P25·v2)।

### ২ · অন্য কেউ যাত্রীর হয়ে বুক করেন (সাহায্যকারী)
১. সাহায্যকারী নিজের অ্যাকাউন্টে সাইন ইন করেন (P01)।
২. যাত্রীর তথ্য যোগ করেন। শিশুর সাথে একজন সঙ্গী প্রাপ্তবয়স্ক থাকেন (P05, F04a, P06)।
৩. কে কী করবেন: টিকিট যাত্রীর, সাহায্যকারী শুধু বুক ও পরিশোধ করেন (F05·v2)।
৪. আবেদন ও পরিশোধ করেন (P21·v2, P10·v2)।
৫. টিকিট যাত্রীর নিজের ফোনে যায়। সাহায্যকারী বাতিল বা বদলাতে পারেন না (HB1·v2)।
৬. যাত্রী নিজের ফোনে রসিদ পান (SMS01)।
৭. যাত্রী দেখেন কে বুকিংয়ে কাজ করতে পারেন, চাইলে সাহায্যকারীকে সরান (A1·v2, A1b·v2)।
৮. ফোন না থাকলে যেকোনো কাউন্টারে পরিচয়পত্র দেখিয়ে পুনরুদ্ধার করা যায় (P25·v2)।

### ৩ · নিবন্ধিত এজেন্ট
১. ড্যাশবোর্ডে নিয়ম, ফির সীমা ও নিজের অবস্থা দেখেন (AG01)।
২. যাত্রীর জন্য আবেদন করেন। যাত্রীর নিজের ফোনে যাওয়া সম্মতি কোড ছাড়া আবেদন করা যায় না (AG02)।
৩. ফি রসিদে লেখা থাকে, আর একই তথ্য যাত্রীর SMS-এ যায় (AG03, CT04·v2)।
৪. এজেন্ট শুধু আবেদনের অবস্থা দেখেন; টিকিট বা QR পান না (AG04)।
৫. নিজের বিরুদ্ধে অভিযোগ ও তার ফলাফল দেখতে পান। কোনো স্বয়ংক্রিয় শাস্তি নেই (AG05)।
৬. বেশি টাকা চাওয়া হলে যাত্রী অভিযোগ করতে পারেন (R3·v2, R3b·v2)।

### ৪ · স্টেশনের প্রবেশ গেটে গার্ড
১. শিফট শুরু করে ডিভাইস প্রস্তুত করেন (EG01)।
২. স্ক্যান প্রস্তুত (EG02)।
৩. টিকিটের অবস্থা সিস্টেম দেখায়, আর ব্যক্তি যাচাই গার্ড নিজে করেন। দুটো আলাদা কাজ (EG03)।
৪. প্রবেশ রেকর্ড হয় (EG04)।
৫. ব্যতিক্রম:
   - রেকর্ড নিশ্চিত হয়নি (EG05)।
   - যাচাই করা যায়নি, তাই "যাচাই হয়নি" হিসেবে রেকর্ড হয় (EG06)।
   - অগ্রাধিকার পাস (EG07, EG08)।
   - অফলাইনে অস্থায়ী যাচাই (EG09)।
   - টিকিট গ্রহণযোগ্য নয় (EG10)।
   - দলের টিকিট (EG11)।

### ৫ · ট্রেনে টিটি
১. বগির তালিকা দেখেন (OB01)।
২. টিকিট ও ব্যক্তি যাচাই করেন (OB02)।
৩. দলের টিকিট দেখেন (OB03)।
৪. ব্যতিক্রম:
   - বাতিল টিকিট (OB04)।
   - অফলাইন স্ক্যান (OB05)।
   - আগে স্ক্যান করা টিকিট (OB06)।
   - অবৈধ QR (OB07)।
   - ভুল যাত্রা (OB08)।
   - যাচাই করা যায়নি (OB09)।
   - ঘটনা ও রসিদ (OB10)।
৫. যাচাই রেকর্ড করেন (OB11)।
৬. দরকার হলে রসিদ দিয়ে অফিসিয়াল ভাড়া আদায় করেন (OB12)।
৭. গন্তব্যে হস্তান্তর করেন (OB13)।
