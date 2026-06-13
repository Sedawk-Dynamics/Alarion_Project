import HelpCard from '../ui/Cards/HelpCard';
import Faqs from './Faqs';

/**
 * Help — the "Help Centre" landing section (the FAQ accordion lives in a separate Faqs component).
 * Section header + two help cards (message + call), built from the reusable HelpCard shell.
 */

const PHONE_PATH =
  'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0122 16.92z';

const arrowIcon = (
  <svg viewBox="0 0 24 24" className="h-3.75 w-3.75" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M13 5l7 7-7 7" />
  </svg>
);

// Card icon (sized by HelpCard's [&>svg])
const phoneIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={PHONE_PATH} />
  </svg>
);

// Smaller phone icon for the CTA button
const phoneIconSm = (
  <svg viewBox="0 0 24 24" className="h-3.75 w-3.75" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={PHONE_PATH} />
  </svg>
);

const CTA_SOLID =
  'mt-auto inline-flex items-center gap-2 self-start rounded-full bg-[#F8FAFC] px-[22px] py-3 text-[0.844rem] font-semibold text-[#0B1120] transition hover:-translate-y-px hover:bg-[#E7C68A]';
const CTA_GHOST =
  'mt-auto inline-flex items-center gap-2 self-start rounded-full border border-white/14 px-[22px] py-3 text-[0.844rem] font-semibold text-[#E7C68A] transition hover:-translate-y-px hover:border-[#C9A66B] hover:bg-[#C9A66B]/12 hover:text-[#C9A66B]';

export default function Help() {
  return (
    <section id="help" className="border-t border-white/8 bg-[#0E1426] py-30">
      <div className="mx-auto w-[min(1280px,calc(100%-3.5rem))]">
        {/* Section head */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-10">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
              <span className="h-px w-5.5 bg-[#C9A66B] opacity-70" />
              Help Centre
            </div>
            <h2 className="mt-3.5 max-w-180 font-serif text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-[-0.005em] text-[#F8FAFC]">
              Welcome to the <em className="italic text-[#E7C68A]">Help Centre.</em>
            </h2>
          </div>
          <p className="max-w-100 text-[0.938rem] leading-[1.55] text-[#B7BECC]">
            Our concierge team is here around the clock. Send us a message or call us — whichever
            suits your moment.
          </p>
        </div>

        {/* Help cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Message */}
          <HelpCard
            title="Send us a message"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            }
          >
            <p className="text-[0.906rem] leading-[1.55] text-[#B7BECC]">
              Share your travel dates, questions or special requests and our concierge will reply
              within a few hours — usually much sooner.
            </p>
            <a href="mailto:concierge@alarion.com" className={CTA_SOLID}>
              concierge@alarion.com
              {arrowIcon}
            </a>
          </HelpCard>

          {/* Call */}
          <HelpCard title="Call us" icon={phoneIcon}>
            <div className="text-[0.656rem] font-semibold uppercase tracking-[0.18em] text-[#7A8295]">
              Customer Care Number
            </div>
            <a href="tel:+911247160000" className="font-serif text-[1.875rem] tracking-[0.01em] text-[#E7C68A]">
              +91 124 716 0000
            </a>
            <div className="text-[0.813rem] text-[#7A8295]">Available 24×7 · Toll-free across India</div>
            <a href="tel:+911247160000" className={CTA_GHOST}>
              {phoneIconSm}
              Call Customer Care
            </a>
          </HelpCard>
        </div>
      </div>
      <Faqs/>
    </section>
  );
}
