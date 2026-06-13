import Button from '@/components/ui/buttons/Button';

/**
 * HotelCard — the reusable hotel card (mirrors the Alarion landing `.hotel`).
 * Fully prop-driven so it can be reused on the landing grid, search results, etc.
 * UI only (Server Component) — no behaviour.
 */

export type Hotel = {
  name: string;
  location: string;
  rating: number;
  badge: string;
  price: string; // e.g. "₹62,000"
  image: string;
  amenities: string[]; // e.g. ["Pool", "Spa", "Lake view", "Suite"]
  href: string;
};

export default function FeatureHotelsCard({ hotel }: { hotel: Hotel }) {
  return (
    <article className="group relative isolate overflow-hidden rounded-[22px] border border-white/8 bg-[#111827] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6),0_8px_24px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1.5 hover:border-white/14">
      {/* Image */}
      <div className="relative aspect-[4/4.6] overflow-hidden">
        <span className="absolute left-4.5 top-4.5 z-2 rounded-full border border-white/14 bg-[#0B1120]/70 px-3 py-1.5 text-[0.688rem] font-semibold uppercase tracking-[0.12em] text-[#E7C68A] backdrop-blur-[10px]">
          {hotel.badge}
        </span>
        <span className="absolute right-4.5 top-4.5 z-2 flex items-center gap-1.5 rounded-full border border-white/14 bg-[#0B1120]/70 px-3 py-1.5 text-xs font-semibold text-[#F8FAFC] backdrop-blur-[10px]">
          <svg viewBox="0 0 24 24" className="h-3 w-3 fill-[#C9A66B]">
            <path d="M12 .587l3.668 7.568L24 9.423l-6 5.85L19.336 24 12 19.897 4.664 24 6 15.273 0 9.423l8.332-1.268z" />
          </svg>
          {hotel.rating}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hotel.image}
          alt={hotel.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        {/* bottom gradient overlay */}
        <div className="absolute inset-0 z-1 bg-linear-to-b from-transparent from-50% to-[#0B1120]/85" />
      </div>

      {/* Body */}
      <div className="relative px-5.5 pb-6 pt-5.5">
        {/* Location */}
        <div className="flex items-center gap-2 text-[0.719rem] uppercase tracking-[0.16em] text-[#7A8295]">
          <svg viewBox="0 0 24 24" className="h-2.75 w-2.75 opacity-70" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {hotel.location}
        </div>

        {/* Name */}
        <h3 className="mb-3.5 mt-2.5 font-serif text-[1.625rem] leading-[1.1] tracking-[-0.005em] text-[#F8FAFC]">
          {hotel.name}
        </h3>

        {/* Amenities */}
        <div className="mb-4.5 flex flex-wrap gap-x-3.5 gap-y-2 border-y border-white/8 py-3.5 text-xs text-[#7A8295]">
          {hotel.amenities.map((a) => (
            <div key={a} className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="h-3.25 w-3.25 opacity-85" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="9" />
              </svg>
              {a}
            </div>
          ))}
        </div>

        {/* Footer: price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[0.656rem] uppercase tracking-[0.14em] text-[#7A8295]">From</div>
            <div className="mt-0.5 font-serif text-[1.75rem] leading-[1.1] text-[#F8FAFC]">
              {hotel.price}
              <span className="ml-1 font-sans text-xs font-medium text-[#7A8295]">/ night</span>
            </div>
          </div>
          <Button variant="outline" size="sm" href={hotel.href}>
            View Property
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
              <path d="M5 12h14" />
              <path d="M13 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </article>
  );
}
