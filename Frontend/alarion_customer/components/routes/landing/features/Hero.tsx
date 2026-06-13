import Features from './Features';
import Search from './Search';

/**
 * Hero — the landing hero (`.hero`): background + copy + trust badges + the search widget.
 * The <Search/> widget is its own component; the feature ticker and mini hotel cards
 * will be added as separate components later.
 */

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=2400&q=80&auto=format&fit=crop';

const TRUST = [
  {
    label: 'Verified Properties',
    icon: (
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
  },
  {
    label: 'Secure Payments',
    icon: (
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
  },
  {
    label: 'Instant Confirmation',
    icon: (
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
];

export default function Hero() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden pt-35">
      {/* Background image + gradient */}
      <div
        className="absolute inset-0 -z-20 scale-[1.04]"
        style={{
          background:
            `linear-gradient(180deg, rgba(11,17,32,.55) 0%, rgba(11,17,32,.4) 35%, rgba(11,17,32,.92) 92%, #0B1120 100%), url("${HERO_IMAGE}") center/cover no-repeat`,
        }}
      />
      {/* Top vignette (mirrors .hero-bg::after) */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            'radial-gradient(80% 60% at 50% 0%, rgba(11,17,32,0) 0%, rgba(11,17,32,.4) 70%, rgba(11,17,32,.85) 100%)',
        }}
      />

      {/* Copy */}
      <div className="mx-auto w-[min(1280px,calc(100%-3.5rem))] pb-12">
        <div className="max-w-220">
          <div className="mb-7 inline-flex items-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
            <span className="h-px w-5.5 bg-[#C9A66B] opacity-70" />
            Where Every Stay Tells a Story
          </div>

          <h1 className="mb-6 font-serif text-[clamp(3rem,7.6vw,7.25rem)] leading-[0.98] tracking-[-0.005em] text-[#F8FAFC]">
            Experience Luxury
            <br />
            <em className="italic text-[#E7C68A]">Beyond Stays.</em>
          </h1>

          <p className="max-w-140 text-[1.125rem] font-light leading-[1.55] text-[#B7BECC]">
            A curated collection of India&apos;s most distinguished hotels, resorts and private
            retreats — designed for travellers who measure escape in moments, not miles.
          </p>

          {/* Trust badges */}
          <div className="mt-9 flex flex-wrap gap-7 text-[0.813rem] tracking-[0.02em] text-[#B7BECC]">
            {TRUST.map((t) => (
              <div key={t.label} className="flex items-center gap-2.5">
                <span className="grid h-6 w-6 place-items-center rounded-full border border-[#C9A66B]/30 bg-[#C9A66B]/12 text-[#C9A66B]">
                  {t.icon}
                </span>
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search widget (separate component; self-aligns to the same container width) */}
      <Search />

      {/* TODO: feature ticker + floating mini hotel cards (separate components) */}
      <Features/>
    </section>
  );
}
