import Image from 'next/image';
import Button from '@/components/ui/buttons/Button';

/**
 * ExperienceCard — the reusable experience card (mirrors `.x-card` in Experiences.html).
 * Image (category badge + title overlay) + body (description + footer: duration/price + CTA).
 * Prop-driven, UI only (Server Component). CTA uses the shared <Button variant="outline">.
 */

export type Experience = {
  category: string; // ".x-cat" — "Wellness"
  title: string; // ".x-title-over"
  description: string; // ".x-desc"
  duration: string; // ".dur" — "90 minutes"
  price: string; // ".price" — "₹6,500"
  per?: string; // unit — "/ guest"
  image: string;
  href: string;
};

const ClockIcon = (
  <svg viewBox="0 0 24 24" className="h-3 w-3 opacity-80" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export default function ExperienceCard({ experience }: { experience: Experience }) {
  const { category, title, description, duration, price, per = '/ guest', image, href } = experience;

  return (
    // .x-card
    <article className="group relative flex flex-col overflow-hidden rounded-[22px] border border-white/8 bg-[#111827] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_10px_30px_rgba(0,0,0,0.35)] transition duration-500 ease-out hover:-translate-y-1.75 hover:border-[#C9A66B]/32">
      {/* .x-img — 4 / 3 */}
      <div className="relative aspect-4/3 overflow-hidden">
        {/* .x-cat badge */}
        <span className="absolute left-4 top-4 z-20 rounded-full border border-white/14 bg-[#0B1120]/70 px-3.25 py-1.75 text-[0.656rem] font-semibold uppercase tracking-[0.14em] text-[#E7C68A] backdrop-blur-md">
          {category}
        </span>

        {/* .img-zoom */}
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.07]"
        />

        {/* .x-img::after gradient */}
        <div className="absolute inset-0 z-10 bg-linear-to-b from-transparent from-42% to-[#0B1120]/86" />

        {/* .x-title-over */}
        <div className="absolute inset-x-5.5 bottom-4.5 z-20 font-serif text-[1.75rem] leading-[1.08] tracking-[0.005em] text-[#F8FAFC]">
          {title}
        </div>
      </div>

      {/* .x-body */}
      <div className="flex flex-1 flex-col px-5.5 pb-5.5 pt-5">
        <p className="mb-4.5 text-sm leading-[1.6] text-pretty text-[#B7BECC]">{description}</p>

        {/* .x-foot */}
        <div className="mt-auto flex items-center justify-between border-t border-white/8 pt-4">
          {/* .x-meta */}
          <div className="flex flex-col gap-1.25">
            <div className="flex items-center gap-1.75 text-[0.688rem] uppercase tracking-widest text-[#7A8295]">
              {ClockIcon}
              {duration}
            </div>
            <div className="font-serif text-xl text-[#F8FAFC]">
              {price}
              <span className="ml-1 font-sans text-[0.688rem] font-medium text-[#7A8295]">{per}</span>
            </div>
          </div>

          {/* .x-cta — shared Button (outline) */}
          <Button variant="outline" size="sm" href={href}>
            Discover
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
