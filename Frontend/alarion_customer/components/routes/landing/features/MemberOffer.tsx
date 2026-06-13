import Button from '@/components/ui/buttons/Button';
import MemberOfferCard, { type Coupon } from '../ui/Cards/MemberOfferCard';

/**
 * MemberOffer — the "Member Offers" landing section.
 * Section header + a welcome-offer hero banner + a grid of reusable coupon cards.
 * Coupon data is prop-driven (defaults below).
 */

const COUPONS: Coupon[] = [
  {
    title: 'Festive 25',
    subtitle: 'Valid till 31 Dec',
    description: 'Flat 25% off heritage palaces and resorts on stays of 2 nights or more.',
    code: 'FESTIVE25',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10z" />
        <circle cx="7" cy="7" r="1.4" />
      </svg>
    ),
  },
  {
    title: 'Long Stay',
    subtitle: '4 nights +',
    description: 'Stay four nights or longer and the fourth night is on us — applied automatically.',
    code: 'LONGSTAY',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    title: 'Bank Offer',
    subtitle: 'HDFC cards',
    description: 'An extra 10% instant discount when you pay with an eligible HDFC credit card.',
    code: 'HDFC10',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
];

export default function MemberOffer({ coupons = COUPONS }: { coupons?: Coupon[] }) {
  return (
    <section id="offers" className="bg-linear-to-b from-[#0B1120] to-[#0E1426] py-30">
      <div className="mx-auto w-[min(1280px,calc(100%-3.5rem))]">
        {/* Section head */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-10">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
              <span className="h-px w-5.5 bg-[#C9A66B] opacity-70" />
              Member Offers
            </div>
            <h2 className="mt-3.5 max-w-180 font-serif text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-[-0.005em] text-[#F8FAFC]">
              Save more on every <em className="italic text-[#E7C68A]">escape.</em>
            </h2>
          </div>
          <p className="max-w-95 text-[0.938rem] leading-[1.55] text-[#B7BECC]">
            Sign in to unlock member-only rates, then stack a seasonal code at checkout.
          </p>
        </div>

        {/* Welcome-offer hero banner */}
        <div
          className="relative mb-6.5 grid items-center gap-13 overflow-hidden rounded-[26px] border border-white/14 px-14 py-13 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_10px_30px_rgba(0,0,0,0.35)] lg:grid-cols-[1fr_auto]"
          style={{
            background:
              'radial-gradient(80% 130% at 84% 16%, rgba(201,166,107,.20) 0%, transparent 60%), linear-gradient(180deg, #0d1426 0%, #070b15 100%)',
          }}
        >
          <div>
            <div className="inline-flex items-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
              <span className="h-px w-5.5 bg-[#C9A66B] opacity-70" />
              Welcome offer
            </div>
            <h3 className="mb-3.5 mt-4 font-serif text-[clamp(1.875rem,3.6vw,3rem)] leading-[1.04] tracking-[-0.005em] text-[#F8FAFC]">
              Sign in &amp; get <em className="italic text-[#E7C68A]">10% off</em> your first stay.
            </h3>
            <p className="mb-7 max-w-115 text-[0.938rem] leading-[1.6] text-[#B7BECC]">
              Create a free Alarion account and we&apos;ll instantly take 10% off your first booking
              — plus early access to member rates across all 500+ properties.
            </p>
            <Button variant="primary" size="lg" href="/auth">
              Sign in to claim
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M13 5l7 7-7 7" />
              </svg>
            </Button>
          </div>

          {/* 10% circular badge */}
          <div
            className="mx-auto grid h-52 w-52 shrink-0 place-items-center rounded-full border border-dashed border-[#C9A66B]/55 text-center"
            style={{
              background:
                'radial-gradient(circle at 32% 26%, rgba(231,198,138,.26), transparent 62%), rgba(201,166,107,.07)',
            }}
          >
            <div>
              <div className="font-serif text-[4.5rem] leading-[0.88] text-[#E7C68A]">
                10<span className="ml-0.5 align-super text-[2rem]">%</span>
              </div>
              <div className="mt-2 text-[0.656rem] uppercase tracking-[0.22em] text-[#B7BECC]">
                First Stay
              </div>
            </div>
          </div>
        </div>

        {/* Coupon grid (reusable cards) */}
        <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <MemberOfferCard key={coupon.code} {...coupon} />
          ))}
        </div>
      </div>
    </section>
  );
}
