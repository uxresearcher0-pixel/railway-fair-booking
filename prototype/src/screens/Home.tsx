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
      { id: 'r3v2', icon: 'shield', v2: true, title: ['Report an extra charge', 'বাড়তি টাকা চাওয়ার কথা জানান'], description: ['Tell the independent review team privately. Your ticket stays valid.', 'স্বাধীন পর্যালোচনা দলকে গোপনে জানান। আপনার টিকিট বৈধ থাকে।'] },
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
    journeys: [{ id: 's02', icon: 'ticket', title: ['Check a ticket', 'টিকিট যাচাই'], description: ['Ticket status from the system and a separate person check by staff.', 'সিস্টেম থেকে টিকিটের অবস্থা আর কর্মীর আলাদা ব্যক্তি-যাচাই।'] }],
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
