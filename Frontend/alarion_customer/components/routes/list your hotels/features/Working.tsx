import WorkCard, { type Step } from '../ui/Cards/WorkCard';

/**
 * Working — the STEPS / "How it works" section (mirrors `.sec.steps`).
 * Centered heading + a grid of reusable <WorkCard>. Server Component.
 */

const STEPS: Step[] = [
  { num: '01', title: 'Apply & verify', description: 'Submit your property details. Our team reviews and schedules a quick verification visit.' },
  { num: '02', title: 'Build your listing', description: 'We photograph, write and set up your page with your dedicated manager — at no cost.' },
  { num: '03', title: 'Go live & earn', description: "Your stay appears to millions of travellers. You're paid promptly after every checkout." },
];

export default function Working({ steps = STEPS }: { steps?: Step[] }) {
  return (
    <section className="border-y border-white/8 bg-[#0E1426] py-15">
      <div className="mx-auto max-w-7xl px-7">
        {/* Section head (centered) */}
        <div className="mx-auto max-w-160 text-center">
          <div className="inline-flex items-center justify-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
            <span className="h-px w-5.5 bg-[#C9A66B] opacity-70" />
            How it works
          </div>
          <h2 className="mt-3.5 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.04] tracking-[-0.005em] text-[#F8FAFC]">
            From application to first booking in <em className="italic text-[#E7C68A]">three steps.</em>
          </h2>
        </div>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-3">
          {steps.map((s) => (
            <WorkCard key={s.num} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
