/**
 * Data — a single stat in the List-Your-Hotel hero strip (mirrors `.lh-stat`).
 * Serif number (gold suffix) + uppercase label. Prop-driven, Server Component.
 */

export type Stat = {
  value: string; // "2.4", "+31", "48"
  suffix?: string; // "M", "%", "hr" — rendered in gold
  label: string; // "Annual visitors"
};

export default function Data({ value, suffix, label }: Stat) {
  return (
    <div>
      <div className="font-serif text-[clamp(2.25rem,4vw,3.25rem)] leading-none tracking-[-0.01em] text-[#F8FAFC]">
        {value}
        {suffix && <span className="text-[#E7C68A]">{suffix}</span>}
      </div>
      <div className="mt-3 text-[0.688rem] uppercase tracking-[0.16em] text-[#7A8295]">{label}</div>
    </div>
  );
}
