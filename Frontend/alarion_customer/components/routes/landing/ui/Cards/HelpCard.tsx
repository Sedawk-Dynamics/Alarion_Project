import { type ReactNode } from 'react';

/**
 * HelpCard — reusable help-centre card shell (mirrors the landing `.help-card`).
 * Icon + title + a flexible body (passed as children), since the message card and
 * the call card have different content. UI only (Server Component).
 */

export default function HelpCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode; // an <svg>… element
  title: string;
  children: ReactNode; // card body (description / care info + CTA)
}) {
  return (
    <div className="flex flex-col gap-3.5 rounded-[26px] border border-white/14 bg-[#F8FAFC]/4 px-8 py-[34px] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_10px_30px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-[#C9A66B]/40 hover:bg-[#F8FAFC]/6">
      {/* Icon */}
      <span className="grid h-13 w-13 place-items-center rounded-[14px] border border-[#C9A66B]/30 bg-[#C9A66B]/12 text-[#C9A66B] [&>svg]:h-6 [&>svg]:w-6">
        {icon}
      </span>

      {/* Title */}
      <h3 className="font-serif text-[1.625rem] tracking-[0.005em] text-[#F8FAFC]">{title}</h3>

      {/* Body */}
      {children}
    </div>
  );
}
