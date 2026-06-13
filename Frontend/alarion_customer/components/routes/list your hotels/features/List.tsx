import Data, { type Stat } from '../ui/Cards/Data';
import Property from './Property';
import WhyPartner from './WhyPartner';
import Working from './Working';

/**
 * List — the parent of the "/list-your-hotel" page (mirrors List Your Hotel.html).
 * Hero (copy + stats + application form) + WhyPartner (benefits) + Working (steps).
 * Composes all the route's components. Stats are prop-driven.
 */

const STATS: Stat[] = [
  { value: '2.4', suffix: 'M', label: 'Annual visitors' },
  { value: '+31', suffix: '%', label: 'Avg. occupancy lift' },
  { value: '48', suffix: 'hr', label: 'To go live' },
];

export default function List({ stats = STATS }: { stats?: Stat[] }) {
  return (
    <>
      {/* HERO */}
      <section className="bg-[#0B1120]">
        <div className="mx-auto grid max-w-7xl items-start gap-16 px-7 pb-18 pt-33 lg:grid-cols-[1fr_460px]">
          {/* Copy + stats */}
          <div>
            <div className="inline-flex items-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
              <span className="h-px w-5.5 bg-[#C9A66B] opacity-70" />
              Alarion for Partners
            </div>
            <h1 className="mb-5.5 mt-5 max-w-160 font-serif text-[clamp(2.75rem,5.6vw,5rem)] leading-none tracking-[-0.005em] text-[#F8FAFC]">
              List your property where <em className="italic text-[#E7C68A]">discerning</em> guests look first.
            </h1>
            <p className="mb-9.5 max-w-125 text-[1.063rem] leading-[1.6] text-[#B7BECC]">
              Join a hand-curated collection of India&apos;s finest stays. No onboarding fees, a fair flat commission,
              and a partner team that treats your property like its own.
            </p>

            {/* Stats */}
            <div className="grid max-w-130 grid-cols-3 gap-2 border-t border-white/8 pt-8">
              {stats.map((s) => (
                <Data key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* Application form */}
          <Property />
        </div>
      </section>

      {/* BENEFITS */}
      <WhyPartner />

      {/* STEPS */}
      <Working />
    </>
  );
}
