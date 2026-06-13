import Image from 'next/image';

/**
 * GuideCard — the reusable travel-guide card (mirrors `.g-card` in Guide.html).
 * Image (region badge + state/cities overlay) + body ("Must-eat dishes" chips +
 * "Where to eat" restaurant list). No CTA. Prop-driven, UI only (Server Component).
 */

export type Guide = {
  region: string; // ".gc-region" badge — "North"
  state: string; // ".st" — "Rajasthan"
  cities: string; // ".ci" — "Jaipur · Udaipur"
  dishes: string[]; // ".gc-dishes"
  restaurants: { name: string; meta: string }[]; // ".gc-rest"
  image: string;
};

const ForkIcon = (
  <svg viewBox="0 0 24 24" className="h-3.25 w-3.25 text-[#C9A66B]" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 002-2V2M5 11v11M11 2v20M19 7c0 2-2 4-2 4s-2-2-2-4 2-5 2-5 2 3 2 5z" />
  </svg>
);
const PinIcon = (
  <svg viewBox="0 0 24 24" className="h-3.25 w-3.25 text-[#C9A66B]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const LABEL = 'flex items-center gap-2 text-[0.656rem] font-semibold uppercase tracking-[0.16em] text-[#7A8295]';

export default function GuideCard({ guide }: { guide: Guide }) {
  const { region, state, cities, dishes, restaurants, image } = guide;

  return (
    // .g-card
    <article className="group relative flex flex-col overflow-hidden rounded-[22px] border border-white/8 bg-[#111827] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_10px_30px_rgba(0,0,0,0.35)] transition duration-500 ease-out hover:-translate-y-1.5 hover:border-[#C9A66B]/32">
      {/* .gc-img — 16 / 10 */}
      <div className="relative aspect-16/10 overflow-hidden">
        {/* .gc-region badge */}
        <span className="absolute left-3.75 top-3.75 z-20 rounded-full border border-white/14 bg-[#0B1120]/70 px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#E7C68A] backdrop-blur-md">
          {region}
        </span>

        {/* .img-zoom */}
        <Image
          src={image}
          alt={`${state} — ${cities}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.07]"
        />

        {/* .gc-img::after gradient */}
        <div className="absolute inset-0 z-10 bg-linear-to-b from-transparent from-36% to-[#0B1120]/85" />

        {/* .gc-name */}
        <div className="absolute bottom-4 left-5 z-20 flex items-baseline gap-3">
          <span className="font-serif text-[1.938rem] leading-none text-[#F8FAFC]">{state}</span>
          <span className="text-[0.719rem] uppercase tracking-[0.14em] text-[#B7BECC]">{cities}</span>
        </div>
      </div>

      {/* .gc-body */}
      <div className="flex flex-1 flex-col gap-3.5 px-5.5 pb-5.5 pt-5">
        {/* Must-eat dishes */}
        <div className={LABEL}>
          {ForkIcon}
          Must-eat dishes
        </div>
        <div className="-mt-1 flex flex-wrap gap-1.75">
          {dishes.map((dish) => (
            <span key={dish} className="rounded-full border border-white/8 bg-white/4 px-2.75 py-1.25 text-xs text-[#B7BECC]">
              {dish}
            </span>
          ))}
        </div>

        {/* Where to eat */}
        <div className={LABEL}>
          {PinIcon}
          Where to eat
        </div>
        <ul className="-mt-0.5">
          {restaurants.map((r) => (
            <li key={r.name} className="flex items-center justify-between gap-3.5 border-t border-white/8 py-2.75 first:border-t-0">
              <span className="text-sm font-semibold text-[#F8FAFC]">{r.name}</span>
              <span className="shrink-0 text-right text-[0.719rem] tracking-[0.02em] text-[#7A8295]">{r.meta}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
