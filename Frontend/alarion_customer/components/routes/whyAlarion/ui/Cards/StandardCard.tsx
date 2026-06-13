import { type ReactNode } from 'react';

/**
 * StandardCard — a reusable "standard" card (mirrors `.feat` in Why-Alarion.html).
 * Corner number + gold icon tile + serif title + description. Prop-driven, Server Component.
 */

export type Standard = {
  num: string; // "01"
  icon: ReactNode; // an <svg>…
  title: string;
  description: string;
};

export default function StandardCard({ num, icon, title, description }: Standard) {
  return (
    <div className="group relative rounded-[22px] border border-white/8 bg-[#0E1426] px-8 pb-9 pt-10 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_10px_30px_rgba(0,0,0,0.35)] transition duration-400 ease-out hover:-translate-y-2 hover:border-[#C9A66B]/32 hover:bg-[#111827]">
      {/* .feat-num */}
      <span className="absolute right-8 top-8 font-serif text-xl text-[#7A8295] opacity-50">{num}</span>

      {/* .feat-ico */}
      <div className="mb-7 grid h-12 w-12 place-items-center rounded-[13px] border border-[#C9A66B]/28 bg-linear-to-b from-[#C9A66B]/18 to-[#C9A66B]/6 text-[#E7C68A] transition duration-400 ease-out group-hover:scale-[1.08] [&>svg]:h-5.5 [&>svg]:w-5.5">
        {icon}
      </div>

      <h3 className="mb-3 font-serif text-[1.688rem] leading-[1.15] tracking-[-0.005em] text-[#F8FAFC]">{title}</h3>
      <p className="text-[0.906rem] leading-[1.62] text-[#B7BECC]">{description}</p>
    </div>
  );
}
