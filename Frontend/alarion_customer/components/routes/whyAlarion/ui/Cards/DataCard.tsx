/**
 * DataCard — a single stat cell in the Why-Alarion stats strip (mirrors `.stat`).
 * Big serif number (with a gold suffix) + uppercase label. Prop-driven, Server Component.
 */

export type Stat = {
  value: string; // "500", "50K", "4.91"
  suffix?: string; // "+", "★" — rendered in gold
  label: string; // "Verified Hotels"
};

export default function DataCard({ value, suffix, label }: Stat) {
  return (
    <div className="bg-[#0E1426] px-7.5 py-8.5 transition-colors hover:bg-[#111827]">
      <div className="font-serif text-[clamp(2.5rem,4.4vw,3.625rem)] leading-none tracking-[-0.01em] text-[#F8FAFC]">
        {value}
        {suffix && <span className="text-[#E7C68A]">{suffix}</span>}
      </div>
      <div className="mt-3.5 text-[0.688rem] uppercase tracking-[0.18em] text-[#7A8295]">{label}</div>
    </div>
  );
}
