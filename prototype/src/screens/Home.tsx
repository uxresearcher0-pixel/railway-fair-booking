import { ScreenShell } from '../components/ScreenShell';
import { Icon, type IconName } from '../components/Icon';
import { useT } from '../i18n/lang';

export interface Journey {
  /** Hash route id: the link goes to #/<id>. */
  id: string;
  icon: IconName;
  title: [string, string];
  description: [string, string];
  /** Marks the fair-access v2 screens (proposed). */
  v2?: boolean;
}

export interface JourneyGroup {
  id: string;
  title: [string, string];
  journeys: Journey[];
}

/** Journeys by role. The ids match the routes in App.tsx. */
export const journeyGroups: JourneyGroup[] = [
  {
    id: 'passenger',
    title: ['Passenger', 'যাত্রী'],
    journeys: [
      { id: 'flow', icon: 'user', title: ['Book for a group of 7', '৭ জনের দলের জন্য বুক করুন'], description: ['Linked booking: invite the Package B buyer, choose seats together, pay.', 'যুক্ত বুকিং: প্যাকেজ B-এর ক্রেতাকে আমন্ত্রণ, একসাথে আসন বাছাই, পরিশোধ।'] },
      { id: 'apply-v2', icon: 'clock', v2: true, title: ['Apply for a busy train', 'ভিড়ের ট্রেনে আবেদন করুন'], description: ['Application window and random draw, then pay by a fixed time.', 'আবেদনের সময় ও দৈব লটারি, তারপর নির্দিষ্ট সময়ের মধ্যে পরিশোধ।'] },
      { id: 'r3v2', icon: 'shield', v2: true, title: ['Report an extra charge', 'বাড়তি টাকার অভিযোগ করুন'], description: ['Tell the independent review team privately. Your ticket stays valid.', 'স্বাধীন পর্যালোচনা দলকে গোপনে জানান। আপনার টিকিট বৈধ থাকে।'] },
      { id: 'g2v2', icon: 'user', v2: true, title: ['One group, one chance', 'এক দল, একটি সুযোগ'], description: ['A group of 7 gets one draw place; all 7 travel, or none.', '৭ জনের দল ড্র-এ একটি স্থান পায়; ৭ জনই যাবেন, নয়তো কেউ নয়।'] },
      { id: 'f05v2', icon: 'user', v2: true, title: ['Who does what on a booking', 'বুকিংয়ে কে কী করবেন'], description: ['Traveller, accompanying adult, helper and payer, and what the helper can do.', 'যাত্রী, সঙ্গী প্রাপ্তবয়স্ক, সাহায্যকারী ও পরিশোধকারী, আর সাহায্যকারী যা করতে পারেন।'] },
      { id: 'h1v2', icon: 'clock', v2: true, title: ['Hold paused', 'হোল্ড সাময়িক বন্ধ'], description: ['After repeated unpaid holds, new holds pause for a while (rule to confirm).', 'বারবার পরিশোধ ছাড়া হোল্ডের পর নতুন হোল্ড কিছুক্ষণ বন্ধ থাকে (নিয়ম নিশ্চিত হবে)।'] },
      { id: 'p24v2', icon: 'clock', v2: true, title: ['Waiting list', 'অপেক্ষমাণ তালিকা'], description: ['Your place is kept when a release is too small for your group.', 'ছাড়া আসন আপনার দলের জন্য কম হলে আপনার স্থান বজায় থাকে।'] },
      { id: 'p14v2', icon: 'ticket', v2: true, title: ['Your receipt', 'আপনার রসিদ'], description: ['Itemised official total and the SMS each adult traveller gets.', 'বিস্তারিত অফিসিয়াল মোট ও প্রত্যেক প্রাপ্তবয়স্ক যাত্রীর SMS।'] },
      { id: 'sms', icon: 'send', v2: true, title: ['SMS help and reports (demo)', 'SMS-এ সাহায্য ও অভিযোগ (ডেমো)'], description: ['Simulated two-way SMS: receipt, HELP, EXTRA and STATUS. No real SMS.', 'টু-ওয়ে SMS-এর সিমুলেশন: রসিদ, সাহায্য, বাড়তি টাকার অভিযোগ ও অবস্থা। আসল SMS নয়।'] },
      { id: 'r3cv2', icon: 'shield', v2: true, title: ['Your report in the app', 'অ্যাপে আপনার অভিযোগ'], description: ['Case OC-2207 from SMS: status, optional evidence. Your ticket stays valid.', 'SMS থেকে কেস OC-2207: অবস্থা, ঐচ্ছিক প্রমাণ। আপনার টিকিট বৈধ থাকে।'] },
      { id: 'p25v2', icon: 'ticket', v2: true, title: ['Recover a ticket', 'টিকিট পুনরুদ্ধার'], description: ['At any counter with your own ID. The helper’s phone is not needed.', 'নিজের পরিচয়পত্র নিয়ে যেকোনো কাউন্টারে। সাহায্যকারীর ফোন লাগবে না।'] },
      { id: 'a1v2', icon: 'lock', v2: true, title: ['Manage who can act on my booking', 'আমার বুকিংয়ে কে কী করতে পারেন'], description: ['See helpers and their rights, and remove a helper.', 'সাহায্যকারী ও তাঁদের অধিকার দেখুন, সাহায্যকারীকে সরান।'] },
      { id: 'f03', icon: 'seat', title: ['Travellers & class', 'যাত্রী ও শ্রেণি'], description: ['Choose adults, children and class within the booking limits.', 'বুকিংয়ের সীমার মধ্যে প্রাপ্তবয়স্ক, শিশু ও শ্রেণি বেছে নিন।'] },
      { id: 'f04a', icon: 'plus', title: ['Add traveller', 'যাত্রী যোগ করুন'], description: ['Name and date of birth as on the NID, then an NID record check.', 'এনআইডি অনুযায়ী নাম ও জন্মতারিখ, তারপর এনআইডি রেকর্ড মিলিয়ে দেখা।'] },
      { id: 'f01b', icon: 'arrow-right', title: ['Station picker', 'স্টেশন বাছাই'], description: ['Search for the destination in English or Bangla.', 'ইংরেজি বা বাংলায় গন্তব্য খুঁজুন।'] },
      { id: 'l1', icon: 'warning', title: ['Daily limit', 'দৈনিক সীমা'], description: ['What you can do after 2 bookings in a day.', 'দিনে ২টি বুকিংয়ের পর আপনি যা করতে পারেন।'] },
    ],
  },
  {
    id: 'staff',
    title: ['Staff', 'কর্মী'],
    journeys: [
      { id: 's02', icon: 'ticket', title: ['Check a ticket', 'টিকিট যাচাই'], description: ['Ticket status from the system and a separate person check by staff.', 'সিস্টেম থেকে টিকিটের অবস্থা আর কর্মীর আলাদা ব্যক্তি-যাচাই।'] },
      { id: 'ct04v2', icon: 'ticket', v2: true, title: ['Agent receipt', 'এজেন্টের রসিদ'], description: ['Registered agent: free application, itemised fee, same draw as the app.', 'নিবন্ধিত এজেন্ট: বিনামূল্যে আবেদন, আলাদা করে দেখানো ফি, অ্যাপের মতো একই ড্র।'] },
      { id: 'ct05v2', icon: 'ticket', v2: true, title: ['Counter-assisted report', 'কাউন্টারে সহায়তায় অভিযোগ'], description: ['No phone? Staff file the report and print an itemised receipt.', 'ফোন নেই? কর্মী অভিযোগ জমা দেন ও বিস্তারিত রসিদ প্রিন্ট করেন।'] },
      { id: 'dk03v2', icon: 'shield', v2: true, title: ['Desk correction', 'ডেস্কে সংশোধন'], description: ['Same person only, with a second approver. Self-approval is blocked.', 'শুধু একই ব্যক্তি, দ্বিতীয় অনুমোদনকারীসহ। নিজে অনুমোদন বন্ধ।'] },
    ],
  },
  {
    id: 'operations',
    title: ['Operations', 'পরিচালনা'],
    journeys: [
      { id: 'op08v2', icon: 'shield', v2: true, title: ['Draw run and replay', 'ড্র চালানো ও পুনরায় চালানো'], description: ['Inputs frozen before the random number; independent replay; no reruns.', 'দৈব সংখ্যার আগে ইনপুট স্থির; স্বাধীনভাবে পুনরায় চালানো; আবার চালানো যায় না।'] },
      { id: 'op09v2', icon: 'seat', v2: true, title: ['Every seat accounted for', 'প্রতিটি আসনের হিসাব'], description: ['Seats by state; an unexplained seat is flagged.', 'অবস্থা অনুযায়ী আসন; ব্যাখ্যাহীন আসন চিহ্নিত হয়।'] },
      { id: 'op10v2', icon: 'warning', v2: true, title: ['Agents and extra-charge reports', 'এজেন্ট ও বাড়তি টাকার অভিযোগ'], description: ['Reports are leads, not proof. No automatic penalty.', 'অভিযোগ সূত্র মাত্র, প্রমাণ নয়। স্বয়ংক্রিয় শাস্তি নেই।'] },
    ],
  },
  {
    id: 'public',
    title: ['Public', 'জনসাধারণ'],
    journeys: [
      { id: 'pa1v2', icon: 'shield', v2: true, title: ['Draw audit', 'ড্র অডিট'], description: ['Frozen inputs, random source and replay. No personal data. Check your application number.', 'স্থির ইনপুট, দৈব উৎস ও পুনরায় চালানো। ব্যক্তিগত তথ্য নেই। নিজের আবেদন নম্বর দেখুন।'] },
    ],
  },
];

/** Start screen of the coded prototype: journeys grouped by role. */
export function Home() {
  const { t } = useT();
  return (
    <ScreenShell
      screenId="Home"
      title={t('railfair prototype', 'railfair প্রোটোটাইপ')}
      lede={
        <>
          {t('Pick a journey. Screens marked', 'একটি যাত্রাপথ বেছে নিন।')} <span lang="en">v2</span>{' '}
          {t('show the proposed fair-access rules, which need railway approval.', 'চিহ্নিত স্ক্রিনগুলো প্রস্তাবিত ন্যায্য-সুযোগের নিয়ম, যা রেলওয়ের অনুমোদন সাপেক্ষ।')}
        </>
      }
    >
      {journeyGroups.map((g) => (
        <section key={g.id} className="card home-group" aria-labelledby={`home-${g.id}`}>
          <h2 id={`home-${g.id}`} className="section-title">
            {t(...g.title)}
          </h2>
          <ul className="journeys">
            {g.journeys.map((j) => (
              <li key={j.id}>
                <a className="journey" href={`#/${j.id}`}>
                  <span className="options__icon">
                    <Icon name={j.icon} />
                  </span>
                  <span className="journey__text">
                    <span className="journey__title">
                      <span className="journey__name">{t(...j.title)}</span>
                      {j.v2 ? (
                        <>
                          {' '}
                          <span className="journey__tag" lang="en">
                            (v2)
                          </span>
                        </>
                      ) : null}
                    </span>
                    <span className="journey__desc">
                      {t(...j.description)}
                    </span>
                  </span>
                  <Icon name="arrow-right" className="journey__arrow" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </ScreenShell>
  );
}
