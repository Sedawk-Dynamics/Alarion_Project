import StandardCard, { type Standard } from '../ui/Cards/StandardCard';
import ItineryCard from '@/components/ui/cards/ItineryCard';

/**
 * Standards — the lower half of "/why-alarion" (mirrors the standards section).
 * Section heading + a grid of reusable <StandardCard> + the shared CTA band.
 * Data is prop-driven (defaults below) — swap for API data later.
 */

const sw = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const STANDARDS: Standard[] = [
  { num: '01', title: 'Instant Booking', description: 'Real-time inventory and confirmed reservations in under nine seconds — no holds, no callbacks.', icon: (<svg viewBox="0 0 24 24" {...sw}><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" /></svg>) },
  { num: '02', title: 'Dynamic Pricing', description: 'Transparent rates that move with seasonality and demand. No hidden fees at checkout, ever.', icon: (<svg viewBox="0 0 24 24" {...sw}><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>) },
  { num: '03', title: 'Luxury Verified', description: 'Every property visited and audited by our team against a 142-point quality and service standard.', icon: (<svg viewBox="0 0 24 24" {...sw}><path d="M9 12l2 2 4-4M21 12c0 5-9 10-9 10S3 17 3 12V5l9-3 9 3v7z" /></svg>) },
  { num: '04', title: 'Secure Payments', description: 'Razorpay-powered checkout with 256-bit encryption, EMI support and one-tap saved cards.', icon: (<svg viewBox="0 0 24 24" {...sw}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M7 15h3" /></svg>) },
  { num: '05', title: '24/7 Concierge', description: 'Real humans — never bots — for itinerary changes, special requests and on-property assistance.', icon: (<svg viewBox="0 0 24 24" {...sw}><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>) },
  { num: '06', title: 'Best Price Guarantee', description: 'Find a lower rate elsewhere within 24 hours of booking, and we refund the difference — twice over.', icon: (<svg viewBox="0 0 24 24" {...sw}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10z" /><circle cx="7" cy="7" r="1.4" /></svg>) },
];

export default function Standards({ standards = STANDARDS }: { standards?: Standard[] }) {
  return (
    <section className="bg-[#0B1120]">
      <div className="mx-auto max-w-7xl px-7 pb-24">
        {/* Section heading */}
        <div className="pt-24">
          <div className="mb-3.5 inline-flex items-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
            <span className="h-px w-5.5 bg-[#C9A66B] opacity-70" />
            Our Standards
          </div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] tracking-[-0.005em] text-[#F8FAFC]">
            Six standards we <em className="italic text-[#E7C68A]">refuse to compromise.</em>
          </h2>
        </div>

        {/* Standards grid */}
        <div className="mb-25 mt-9 grid grid-cols-1 gap-4.5 md:grid-cols-2 lg:grid-cols-3">
          {standards.map((s) => (
            <StandardCard key={s.num} {...s} />
          ))}
        </div>

        {/* CTA band */}
        <ItineryCard
          eyebrow="Ready when you are"
          title={
            <>
              Experience the difference on your <em className="italic text-[#E7C68A]">next stay.</em>
            </>
          }
          cta={{ label: 'Find your stay', href: '/destinations' }}
        />
      </div>
    </section>
  );
}
