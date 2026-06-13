import { type ReactNode } from 'react';

/**
 * BenefitsCard — a reusable "why partner" benefit card (mirrors `.ben`).
 * Gold icon tile + serif title + description. Prop-driven, Server Component.
 */

export type Benefit = {
  icon: ReactNode; // an <svg>…
  title: string;
  description: string;
};

export default function BenefitsCard({ icon, title, description }: Benefit) {
  return (
    <div className="rounded-[20px] border border-white/8 bg-[#0E1426] px-6.5 py-8 transition duration-400 ease-out hover:-translate-y-1.5 hover:border-[#C9A66B]/30 hover:bg-[#111827]">
      {/* .ben-ico */}
      <div className="mb-6 grid h-11.5 w-11.5 place-items-center rounded-xl border border-[#C9A66B]/28 bg-linear-to-b from-[#C9A66B]/18 to-[#C9A66B]/6 text-[#E7C68A] [&>svg]:h-5.25 [&>svg]:w-5.25">
        {icon}
      </div>
      <h3 className="mb-2.5 font-serif text-[1.438rem] leading-[1.15] text-[#F8FAFC]">{title}</h3>
      <p className="text-sm leading-[1.6] text-[#B7BECC]">{description}</p>
    </div>
  );
}
