import { type ReactNode } from 'react';
import Button from '@/components/ui/buttons/Button';

/**
 * ItineryCard — the shared "CTA band" (mirrors `.cta-band`).
 * Eyebrow + heading on the left, a primary CTA on the right.
 * Cross-route, prop-driven, UI only (Server Component) — used by destinations,
 * experiences, etc. CTA uses the shared <Button variant="primary">.
 */

export type ItineryCardProps = {
  eyebrow?: string;
  title?: ReactNode; // may include <em> for the gold emphasis
  cta?: { label: string; href: string };
};

export default function ItineryCard({
  eyebrow = 'Not sure where to begin?',
  title = (
    <>
      Let our travel desk shape an <em className="italic text-[#E7C68A]">itinerary</em> around you.
    </>
  ),
  cta = { label: 'Speak to a concierge', href: '#' },
}: ItineryCardProps) {
  return (
    <div
      className="relative flex flex-wrap items-center justify-between gap-10 overflow-hidden rounded-[28px] border border-white/14 px-14 py-16"
      style={{
        background:
          'radial-gradient(70% 80% at 85% 30%, rgba(201,166,107,.14) 0%, transparent 70%), linear-gradient(180deg, #0d1426 0%, #060912 100%)',
      }}
    >
      <div>
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
          <span className="h-px w-5.5 bg-[#C9A66B] opacity-70" />
          {eyebrow}
        </div>
        {/* Heading */}
        <h2 className="mt-2.5 max-w-140 font-serif text-[clamp(1.875rem,3.4vw,2.875rem)] leading-[1.05] text-[#F8FAFC]">
          {title}
        </h2>
      </div>

      {/* CTA */}
      <Button variant="primary" size="lg" href={cta.href}>
        {cta.label}
        <svg viewBox="0 0 24 24" className="h-3.75 w-3.75" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="M13 5l7 7-7 7" />
        </svg>
      </Button>
    </div>
  );
}
