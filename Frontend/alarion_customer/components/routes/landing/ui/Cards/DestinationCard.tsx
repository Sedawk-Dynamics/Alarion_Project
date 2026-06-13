import Link from 'next/link';

/**
 * DestinationCard — reusable destination tile (mirrors the Alarion landing `.dest-card`).
 * Prop-driven, UI only (Server Component) — same shape as FeatureHotelsCard.
 */

export type Destination = {
  state: string; // region label, e.g. "Rajasthan" / "Coastal"
  city: string;
  properties: string; // e.g. "28 properties"
  image: string;
  href: string;
  size?: 'big' | 'tall' | 'default'; // 'big'/'tall' span 2 rows in the masonry; 'big' also gets a larger label
};

export default function DestinationCard({ destination }: { destination: Destination }) {
  const { state, city, properties, image, href, size = 'default' } = destination;

  // 'big' & 'tall' span two rows on the masonry grid (lg+); reset to one row below that.
  const span = size === 'big' || size === 'tall' ? 'lg:row-span-2' : '';
  const cityText = size === 'big' ? 'text-5xl' : 'text-[2.125rem]';

  return (
    <Link
      href={href}
      className={`group relative isolate block h-full overflow-hidden rounded-[22px] border border-white/8 transition-transform duration-500 hover:scale-[1.005] ${span}`}
    >
      {/* Zooming background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1200 group-hover:scale-[1.08]"
        style={{ backgroundImage: `url('${image}')` }}
      />

      {/* Bottom gradient overlay */}
      <div className="absolute inset-0 z-1 bg-linear-to-b from-transparent from-30% to-[#0B1120]/85 transition-colors duration-300 group-hover:from-[#0B1120]/20 group-hover:to-[#0B1120]/90" />

      {/* Label */}
      <div className="absolute bottom-5.5 left-6 z-2">
        <div className={`font-serif ${cityText} leading-none tracking-[0.005em] text-[#F8FAFC]`}>
          {city}
        </div>
        <div className="mt-2 flex items-center gap-2.5 text-[0.719rem] uppercase tracking-[0.18em] text-[#B7BECC]">
          <span className="h-px w-4.5 bg-[#C9A66B]" />
          {state} · {properties}
        </div>
      </div>
    </Link>
  );
}
