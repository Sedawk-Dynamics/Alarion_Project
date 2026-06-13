import WhyAlarionCard, { type Feature } from '../ui/Cards/WhyAlarionCard';

/**
 * WhyAlarion — the "Why Choose Alarion" landing section.
 * Section header + a grid of reusable <WhyAlarionCard> feature cards.
 * Data is prop-driven (defaults below).
 */

const FEATURES: Feature[] = [
  {
    title: 'Instant Booking',
    description: 'Real-time inventory and confirmed reservations in under nine seconds — no holds, no callbacks.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
    ),
  },
  {
    title: 'Dynamic Pricing',
    description: 'Transparent rates that move with seasonality and demand. No hidden fees at checkout, ever.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    title: 'Luxury Verified',
    description: 'Every property visited and audited by our team against a 142-point quality and service standard.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4M21 12c0 5-9 10-9 10S3 17 3 12V5l9-3 9 3v7z" />
      </svg>
    ),
  },
  {
    title: 'Secure Payments',
    description: 'Razorpay-powered checkout with 256-bit encryption, EMI support and one-tap saved cards.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18M7 15h3" />
      </svg>
    ),
  },
  {
    title: '24/7 Concierge',
    description: 'Real humans — never bots — for itinerary changes, special requests and on-property assistance.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    ),
  },
  {
    title: 'Best Price Guarantee',
    description: 'Find a lower rate elsewhere within 24 hours of booking, and we refund the difference — twice over.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M16 8l-8 8M8 8l8 8" />
      </svg>
    ),
  },
];

export default function WhyAlarion({ features = FEATURES }: { features?: Feature[] }) {
  return (
    <section id="why" className="bg-[#0B1120] py-30">
      <div className="mx-auto w-[min(1280px,calc(100%-3.5rem))]">
        {/* Section head */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-10">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
              <span className="h-px w-5.5 bg-[#C9A66B] opacity-70" />
              Why Choose Alarion
            </div>
            <h2 className="mt-3.5 max-w-180 font-serif text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-[-0.005em] text-[#F8FAFC]">
              Six standards we
              <br />
              <em className="italic text-[#E7C68A]">refuse to compromise.</em>
            </h2>
          </div>
          <p className="max-w-95 text-[0.938rem] leading-[1.55] text-[#B7BECC]">
            Built like a product, run like a concierge — the booking platform that treats every
            guest as a returning friend.
          </p>
        </div>

        {/* Grid of reusable feature cards */}
        <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <WhyAlarionCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
