/**
 * PremiumExperienceCard — the small floating stat card (mirrors the landing `.float-card`).
 * Used over the experience image. UI only (Server Component).
 */

export type ExperienceStat = {
  label: string; // "Avg. guest stay"
  value: string; // "4.2 nights"
  pill?: string; // "+18% YoY"
};

export default function PremiumExperienceCard({ label, value, pill }: ExperienceStat) {
  return (
    <div className="min-w-55 rounded-[18px] border border-white/14 bg-[#0B1120]/78 px-5 py-4.5 shadow-[0_20px_60px_rgba(0,0,0,0.45),0_2px_0_rgba(255,255,255,0.04)_inset] backdrop-blur-lg">
      <div className="text-[0.719rem] uppercase tracking-[0.14em] text-[#7A8295]">{label}</div>
      <div className="mt-1.5 font-serif text-[1.75rem] leading-none text-[#F8FAFC]">{value}</div>
      {pill && (
        <span className="mt-2.5 inline-block rounded-full border border-[#10B981]/30 bg-[#10B981]/15 px-2.5 py-1 text-[0.688rem] font-semibold tracking-[0.02em] text-[#10B981]">
          {pill}
        </span>
      )}
    </div>
  );
}
