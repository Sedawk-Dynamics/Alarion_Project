import Link from 'next/link';
import { type ReactNode } from 'react';

/**
 * AuthCard — the visual side of the auth screen (mirrors `.auth-visual`).
 * Background image + brand + "back to site" link + a member testimonial.
 * This is the photo/card part only — the inputs live in their own components.
 * Prop-driven, UI only (Server Component). Hidden on small screens, shown ≥ lg.
 */

export type AuthCardProps = {
  brand?: string;
  backHref?: string;
  backLabel?: string;
  image?: string;
  quote?: ReactNode;
  author?: { name: string; meta: string; avatar: string };
};

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&q=80&auto=format&fit=crop';

const DEFAULT_AUTHOR = {
  name: 'Ananya Krishnan',
  meta: 'Member since 2021',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&q=80&auto=format&fit=crop',
};

export default function AuthCard({
  brand = 'Alarion',
  backHref = '/',
  backLabel = 'Back to site',
  image = DEFAULT_IMAGE,
  author = DEFAULT_AUTHOR,
  quote = (
    <>
      “The concierge remembered our anniversary from a stay three years ago. That&apos;s the{' '}
      <em className="italic text-[#E7C68A]">Alarion</em> difference.”
    </>
  ),
}: AuthCardProps) {
  return (
    <div className="relative isolate hidden h-full overflow-hidden p-11 lg:block">
      {/* Background image + gradient (mirrors .bg) */}
      <div
        className="absolute inset-0 -z-10 scale-[1.03]"
        style={{
          background: `linear-gradient(180deg, rgba(11,17,32,.35) 0%, rgba(11,17,32,.6) 60%, rgba(11,17,32,.92) 100%), url("${image}") center/cover no-repeat`,
        }}
      />

      {/* Top: brand + back link */}
      <div className="flex items-center justify-between">
        <Link href={backHref} className="font-serif text-[2rem] leading-none tracking-[0.02em] text-[#F8FAFC]">
          {brand}
        </Link>
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-[#0B1120]/50 px-4 py-2.25 text-[0.781rem] font-medium text-[#B7BECC] backdrop-blur-md transition-colors hover:bg-[#0B1120]/75 hover:text-[#F8FAFC]"
        >
          <svg viewBox="0 0 24 24" className="h-3.25 w-3.25" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M11 19l-7-7 7-7" />
          </svg>
          {backLabel}
        </Link>
      </div>

      {/* Bottom: testimonial */}
      <div className="absolute inset-x-11 bottom-11">
        <p className="mb-5 max-w-140 font-serif text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.12] tracking-[-0.005em] text-[#F8FAFC]">
          {quote}
        </p>
        <div className="flex items-center gap-3 text-[0.813rem] text-[#B7BECC]">
          <span
            className="h-10 w-10 rounded-full border border-white/14 bg-cover bg-center"
            style={{ backgroundImage: `url('${author.avatar}')` }}
          />
          <span>
            <b className="font-semibold text-[#F8FAFC]">{author.name}</b> · {author.meta}
          </span>
        </div>
      </div>
    </div>
  );
}
