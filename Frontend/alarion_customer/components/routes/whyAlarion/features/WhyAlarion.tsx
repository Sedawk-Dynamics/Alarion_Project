import Link from 'next/link';
import DataCard, { type Stat } from '../ui/Cards/DataCard';

/**
 * WhyAlarion — the top of the "/why-alarion" page (mirrors Why-Alarion.html w-head + stats).
 * Breadcrumb + header + the 4-stat strip of reusable <DataCard>.
 * Data is prop-driven (defaults below) — swap for API data later.
 */

const STATS: Stat[] = [
  { value: '500', suffix: '+', label: 'Verified Hotels' },
  { value: '50K', suffix: '+', label: 'Bookings' },
  { value: '100', suffix: '+', label: 'Destinations' },
  { value: '4.91', suffix: '★', label: 'Average Rating' },
];

export default function WhyAlarion({ stats = STATS }: { stats?: Stat[] }) {
  return (
    <section className="bg-[#0B1120]">
      <div className="mx-auto max-w-7xl px-7">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2.5 pb-3 pt-32.5 text-[0.813rem] tracking-[0.02em] text-[#7A8295]">
          <Link href="/" className="hover:text-[#F8FAFC]">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-[#B7BECC]">Why Alarion</span>
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-12 pb-2 pt-4.5">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
              <span className="h-px w-5.5 bg-[#C9A66B] opacity-70" />
              Why Choose Alarion
            </div>
            <h1 className="mt-4.5 max-w-190 font-serif text-[clamp(2.75rem,6.5vw,5.75rem)] leading-[0.98] tracking-[-0.005em] text-[#F8FAFC]">
              Built like a product,
              <br />
              run like a <em className="italic text-[#E7C68A]">concierge.</em>
            </h1>
          </div>
          <p className="mb-1.5 max-w-95 text-[0.969rem] leading-[1.6] text-[#B7BECC]">
            We work with hoteliers, not aggregators — so every booking arrives with a name attached and a standard we
            refuse to compromise.
          </p>
        </div>

        {/* Stats strip */}
        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[22px] border border-white/8 bg-white/8 md:grid-cols-4">
          {stats.map((stat) => (
            <DataCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
