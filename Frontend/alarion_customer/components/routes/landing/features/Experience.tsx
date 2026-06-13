import PremiumExperienceCard from '../ui/Cards/PremiumExperienceCard';

/**
 * Experience — the "A Premium Experience" section (`.exp`).
 * Two columns: a media image (with a tag + floating stat card) and the text + stats.
 * Not a card grid — a one-off feature block.
 */

const STATS = [
  { num: '500', suffix: '+', label: 'Verified Hotels' },
  { num: '50', suffix: 'K+', label: 'Bookings' },
  { num: '100', suffix: '+', label: 'Destinations' },
];

export default function Experience() {
  return (
    <section id="exp" className="bg-[#0B1120] py-30">
      <div className="mx-auto w-[min(1280px,calc(100%-3.5rem))]">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          {/* Media */}
          <div className="relative aspect-[4/4.8] overflow-hidden rounded-[26px] border border-white/14 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6),0_8px_24px_rgba(0,0,0,0.35)]">
            <span className="absolute left-6 top-6 z-2 rounded-full border border-white/14 bg-[#0B1120]/70 px-3.5 py-2 text-[0.719rem] uppercase tracking-[0.14em] text-[#E7C68A] backdrop-blur-[10px]">
              Inside Alarion
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1100&q=80&auto=format&fit=crop"
              alt="Luxury resort pavilion"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-6 right-6 z-2">
              <PremiumExperienceCard label="Avg. guest stay" value="4.2 nights" pill="+18% YoY" />
            </div>
          </div>

          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
              <span className="h-px w-5.5 bg-[#C9A66B] opacity-70" />
              A premium experience
            </div>
            <h2 className="mb-[22px] mt-4 font-serif text-[clamp(2.375rem,5vw,4rem)] leading-[1.02] tracking-[-0.005em] text-[#F8FAFC]">
              Quiet luxury,
              <br />
              <em className="italic text-[#E7C68A]">thoughtfully crafted.</em>
            </h2>
            <p className="mb-8 text-base leading-[1.65] text-[#B7BECC]">
              Every property in our portfolio is personally vetted — for design, service ritual,
              sustainability and the small details that turn a stay into a story. We work with
              hoteliers, not aggregators, so every booking arrives with a name attached.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 border-t border-white/8 pt-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-serif text-[clamp(2.75rem,5vw,4rem)] leading-none tracking-[-0.01em] text-[#F8FAFC]">
                    {s.num}
                    <span className="text-[#E7C68A]">{s.suffix}</span>
                  </div>
                  <div className="mt-3 text-[0.719rem] uppercase tracking-[0.18em] text-[#7A8295]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
