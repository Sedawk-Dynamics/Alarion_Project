import { type ReactNode } from 'react';

/**
 * WhyAlarionCard — reusable feature card (mirrors the Alarion landing `.feat`).
 * Icon + title + description. UI only (Server Component).
 */

export type Feature = {
  icon: ReactNode; // an <svg>… element
  title: string;
  description: string;
};

export default function WhyAlarionCard({ feature }: { feature: Feature }) {
  const { icon, title, description } = feature;
  return (
    <div className="group rounded-[22px] border border-white/8 bg-[#0E1426] px-8 pb-9 pt-10 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_10px_30px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-2 hover:border-[#C9A66B]/30 hover:bg-[#111827]">
      {/* Icon */}
      <div className="mb-7 grid h-11 w-11 place-items-center rounded-xl border border-[#C9A66B]/30 bg-linear-to-b from-[#C9A66B]/18 to-[#C9A66B]/6 text-[#E7C68A] transition group-hover:scale-[1.08] [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>

      {/* Title */}
      <h3 className="mb-3 font-serif text-[1.625rem] font-normal leading-[1.15] tracking-[-0.005em] text-[#F8FAFC]">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[0.906rem] leading-[1.6] text-[#B7BECC]">{description}</p>
    </div>
  );
}
