import { ScreenShell } from '../components/ScreenShell';
import { AllowancePill } from '../components/AllowancePill';
import { Notice } from '../components/Notice';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { BOOKINGS_PER_DAY } from '../data/demo';
import { useT } from '../i18n/lang';

export function L1DailyLimit() {
  const { t } = useT();
  return (
    <ScreenShell
      screenId="L1"
      title={t('Daily limit reached', 'দৈনিক সীমা শেষ')}
      lede={t("You've used 2 of 2 bookings today (8 seats). Published terms: max 4 seats per booking and up to 2 bookings a day, the second for a different train or route. Eid rules can be stricter.", 'আজ আপনি ২টির মধ্যে ২টি বুকিং ব্যবহার করেছেন (৮টি আসন)। প্রকাশিত শর্ত: প্রতি বুকিংয়ে সর্বোচ্চ ৪টি আসন এবং দিনে ২টি পর্যন্ত বুকিং, দ্বিতীয়টি অন্য ট্রেন বা রুটের জন্য। ঈদের নিয়ম আরও কঠোর হতে পারে।')}
      backLabel={t('Back to search', 'খোঁজে ফিরে যান')}
    >
      <AllowancePill used={BOOKINGS_PER_DAY} />

      <section className="card" aria-labelledby="l1-options">
        <h2 id="l1-options" className="section-title">
          {t('What you can do', 'আপনি যা করতে পারেন')}
        </h2>
        <ol className="options">
          <li>
            <span className="options__icon">
              <Icon name="user" />
            </span>
            <div>
              <h3>{t('Ask another traveller to buy', 'অন্য যাত্রীকে কিনতে বলুন')}</h3>
              <p>{t('An adult traveller on the trip can buy in the app or at any station counter with their NID, within their own daily allowance.', 'এই যাত্রার একজন প্রাপ্তবয়স্ক যাত্রী নিজের দৈনিক সীমার মধ্যে অ্যাপে বা যেকোনো স্টেশন কাউন্টারে তাঁর এনআইডি দিয়ে কিনতে পারেন।')}</p>
              <Button variant="secondary">{t('Invite a traveller', 'একজন যাত্রীকে আমন্ত্রণ জানান')}</Button>
            </div>
          </li>
          <li>
            <span className="options__icon">
              <Icon name="clock" />
            </span>
            <div>
              <h3>{t('Book tomorrow', 'আগামীকাল বুক করুন')}</h3>
              <p>{t('Your allowance resets at midnight (time to confirm), if seats are still on sale.', 'আসন বিক্রি চালু থাকলে মধ্যরাতে আপনার সীমা নতুন করে শুরু হয় (সময় নিশ্চিত করতে হবে)।')}</p>
              <Button variant="secondary">{t('Remind me tomorrow', 'আগামীকাল মনে করিয়ে দিন')}</Button>
            </div>
          </li>
          <li>
            <span className="options__icon">
              <Icon name="ticket" />
            </span>
            <div>
              <h3>{t('Buy at a station counter', 'স্টেশন কাউন্টারে কিনুন')}</h3>
              <p>{t('Staff check ID at the counter. Whether counter bookings count towards this limit is a rule to confirm.', 'কাউন্টারে কর্মীরা পরিচয়পত্র দেখেন। কাউন্টারের বুকিং এই সীমায় গণ্য হবে কি না, সেই নিয়ম নিশ্চিত করতে হবে।')}</p>
            </div>
          </li>
        </ol>
      </section>

      <Notice tone="info" title={t("Cancelling doesn't give bookings back (proposed)", 'বাতিল করলে বুকিং ফেরত আসে না (প্রস্তাবিত)')} live="off">
        {t("Cancelled or refunded bookings don't restore today's allowance. This stops the limit being reset by buying and cancelling.", 'বাতিল বা অর্থ ফেরত দেওয়া বুকিং আজকের সীমা ফিরিয়ে দেয় না। এতে কিনে আবার বাতিল করে সীমা নতুন করা যায় না।')}
      </Notice>
    </ScreenShell>
  );
}
