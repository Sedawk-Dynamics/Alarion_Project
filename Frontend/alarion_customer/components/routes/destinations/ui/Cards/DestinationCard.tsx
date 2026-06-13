import Image from 'next/image';
import Button from '@/components/ui/buttons/Button';

/**
 * DestinationCard — the reusable destination card (mirrors `.d-card`).
 * Image (region badge + city label) + body (price + Explore CTA).
 * Prop-driven, UI only (Server Component). The CTA uses the shared <Button variant="outline">.
 */

export type Destination = {
  region: string; // "Rajasthan"
  city: string; // "Udaipur"
  meta: string; // "City of Lakes · 28 stays"
  price: string; // "₹24,500"
  image: string;
  href: string;
};

export default function DestinationCard({ destination }: { destination: Destination }) {
  const { region, city, meta, price, image, href } = destination;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[22px] border border-white/8 bg-[#111827] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_10px_30px_rgba(0,0,0,0.35)] transition duration-500 hover:-translate-y-1.75 hover:border-[#C9A66B]/32">
      {/* Image */}
      <div className="relative aspect-[4/3.1] overflow-hidden">
        {/* Region badge */}
        <span className="absolute left-4 top-4 z-20 rounded-full border border-white/14 bg-[#0B1120]/70 px-3.25 py-1.75 text-[0.656rem] font-semibold uppercase tracking-[0.14em] text-[#E7C68A] backdrop-blur-md">
          {region}
        </span>

        <Image
          src={image}
          alt={`${city}, ${region}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.07]"
        />

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 z-10 bg-linear-to-b from-transparent from-[38%] to-[#0B1120]/82" />

        {/* City label */}
        <div className="absolute bottom-4.5 left-5.5 z-20">
          <div className="font-serif text-4xl leading-none tracking-[0.005em] text-[#F8FAFC]">{city}</div>
          <div className="mt-2.25 flex items-center gap-2.5 text-[0.719rem] uppercase tracking-[0.16em] text-[#B7BECC]">
            <span className="h-px w-4.5 bg-[#C9A66B]" />
            {meta}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex items-center justify-between px-5.5 pb-5 pt-4.5">
        <div>
          <div className="text-[0.625rem] uppercase tracking-[0.14em] text-[#7A8295]">From</div>
          <div className="mt-0.75 font-serif text-[1.375rem] leading-[1.1] text-[#F8FAFC]">
            {price}
            <span className="ml-1 font-sans text-[0.688rem] font-medium text-[#7A8295]">/ night</span>
          </div>
        </div>

        {/* CTA — shared Button (outline) */}
        <Button variant="outline" size="sm" href={href}>
          Explore
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </article>
  );
}
