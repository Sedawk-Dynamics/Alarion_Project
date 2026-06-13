import { type ReactNode } from 'react';

/**
 * MemberOfferCard — reusable coupon card (mirrors the landing `.coupon`).
 * Icon + title/subtitle + description + code row. UI only (copy button is visual).
 */

export type Coupon = {
  icon: ReactNode; // an <svg>… element
  title: string; // "Festive 25"
  subtitle: string; // "Valid till 31 Dec"
  description: string;
  code: string; // "FESTIVE25"
};

export default function MemberOfferCard({ icon, title, subtitle, description, code }: Coupon) {
  return (
    <div className="group flex flex-col gap-4 rounded-[20px] border border-white/8 bg-[#0E1426] px-6 py-6.5 transition duration-300 hover:-translate-y-1.5 hover:border-[#C9A66B]/30 hover:bg-[#111827]">
      {/* Top: icon + title/subtitle */}
      <div className="flex items-center gap-3.5">
        <span className="grid h-11.5 w-11.5 shrink-0 place-items-center rounded-xl border border-[#C9A66B]/30 bg-linear-to-b from-[#C9A66B]/18 to-[#C9A66B]/5 text-[#E7C68A] [&>svg]:h-5.25 [&>svg]:w-5.25">
          {icon}
        </span>
        <div>
          <div className="font-serif text-[1.375rem] leading-[1.05] text-[#F8FAFC]">{title}</div>
          <div className="mt-0.75 text-xs tracking-[0.04em] text-[#7A8295]">{subtitle}</div>
        </div>
      </div>

      {/* Description */}
      <p className="flex-1 text-[0.844rem] leading-[1.55] text-[#B7BECC]">{description}</p>

      {/* Code row */}
      <div className="flex items-center justify-between gap-2.5 rounded-xl border border-dashed border-[#C9A66B]/45 bg-[#C9A66B]/6 py-2 pl-4 pr-2">
        <span className="text-sm font-bold tracking-[0.16em] text-[#E7C68A]">{code}</span>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-[9px] bg-[#C9A66B] px-3.75 py-2.25 text-xs font-bold tracking-[0.03em] text-[#1a1206] transition hover:-translate-y-px"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Copy
        </button>
      </div>
    </div>
  );
}
