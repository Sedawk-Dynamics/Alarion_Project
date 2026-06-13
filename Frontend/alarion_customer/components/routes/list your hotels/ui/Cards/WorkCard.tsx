/**
 * WorkCard — a reusable "how it works" step (mirrors `.step`).
 * Top gold rule + serif number + title + description. Prop-driven, Server Component.
 */

export type Step = {
  num: string; // "01"
  title: string;
  description: string;
};

export default function WorkCard({ num, title, description }: Step) {
  return (
    <div className="relative pt-7.5 before:absolute before:left-0 before:top-0 before:h-0.5 before:w-11.5 before:bg-[#C9A66B] before:content-['']">
      <div className="font-serif text-[2.625rem] leading-none text-[#E7C68A] opacity-90">{num}</div>
      <h3 className="mb-2.5 mt-4 font-serif text-2xl text-[#F8FAFC]">{title}</h3>
      <p className="max-w-80 text-[0.906rem] leading-[1.6] text-[#B7BECC]">{description}</p>
    </div>
  );
}
