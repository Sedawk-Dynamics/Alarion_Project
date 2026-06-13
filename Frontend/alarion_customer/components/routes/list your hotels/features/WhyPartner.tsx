import BenefitsCard, { type Benefit } from '../ui/Cards/BenefitsCard';

/**
 * WhyPartner — the BENEFITS section (mirrors `.sec` / `.ben-grid`).
 * Centered heading + a grid of reusable <BenefitsCard>. Server Component.
 */

const sw = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const BENEFITS: Benefit[] = [
  { title: 'Premium audience', description: 'Reach 2.4M high-intent travellers a year who book stays, not just rooms.', icon: (<svg viewBox="0 0 24 24" {...sw}><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>) },
  { title: 'Fair flat commission', description: 'One transparent rate. No tiered penalties, no pay-to-rank auctions, ever.', icon: (<svg viewBox="0 0 24 24" {...sw}><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>) },
  { title: 'Dedicated manager', description: 'A real person who knows your property and helps you grow, not a ticket queue.', icon: (<svg viewBox="0 0 24 24" {...sw}><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>) },
  { title: 'Smart pricing tools', description: 'Demand-based rate suggestions and a live dashboard for occupancy and revenue.', icon: (<svg viewBox="0 0 24 24" {...sw}><path d="M3 3v18h18M7 14l4-4 3 3 5-6" /></svg>) },
];

export default function WhyPartner({ benefits = BENEFITS }: { benefits?: Benefit[] }) {
  return (
    <section className="bg-[#0B1120] py-15">
      <div className="mx-auto max-w-7xl px-7">
        {/* Section head (centered) */}
        <div className="mx-auto mb-12 max-w-160 text-center">
          <div className="inline-flex items-center justify-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
            <span className="h-px w-5.5 bg-[#C9A66B] opacity-70" />
            Why partner with Alarion
          </div>
          <h2 className="mt-3.5 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.04] tracking-[-0.005em] text-[#F8FAFC]">
            Built for owners who care about <em className="italic text-[#E7C68A]">their guests.</em>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <BenefitsCard key={b.title} {...b} />
          ))}
        </div>
      </div>
    </section>
  );
}
