import Link from 'next/link';
import DestinationCard, { type Destination } from '../ui/Cards/DestinationCard';
import Button from '@/components/ui/buttons/Button';
import ItineryCard from '@/components/ui/cards/ItineryCard';

/**
 * Destination — the "/destinations" page (mirrors Destinations.html).
 * Breadcrumb + header + region filter chips + a grid of reusable <DestinationCard>.
 * Filter chips use the shared <Button variant="chip"> (static for now — filtering later).
 * Data is prop-driven (defaults below) — swap for API data later.
 */

const REGIONS = ['All Regions', 'Rajasthan', 'Coastal & Backwaters', 'Himalayas', 'Cities & Heritage'];

const DESTINATIONS: Destination[] = [
  { region: 'Rajasthan', city: 'Udaipur', meta: 'City of Lakes · 28 stays', price: '₹24,500', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&q=80&auto=format&fit=crop', href: '/property' },
  { region: 'Rajasthan', city: 'Jaipur', meta: 'The Pink City · 22 stays', price: '₹18,900', image: 'https://images.unsplash.com/photo-1477586957327-847a0f3f4fe3?w=1000&q=80&auto=format&fit=crop', href: '/property' },
  { region: 'Coastal', city: 'Goa', meta: 'Beachfront · 42 stays', price: '₹12,800', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&q=80&auto=format&fit=crop', href: '/property' },
  { region: 'Coastal', city: 'Kerala', meta: 'Backwaters · 19 stays', price: '₹14,200', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1000&q=80&auto=format&fit=crop', href: '/property' },
  { region: 'Himalayas', city: 'Manali', meta: 'Mountain Air · 14 stays', price: '₹9,800', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1000&q=80&auto=format&fit=crop', href: '/property' },
  { region: 'Cities', city: 'Mumbai', meta: 'City of Dreams · 31 stays', price: '₹21,000', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1000&q=80&auto=format&fit=crop', href: '/property' },
];

export default function Destination({ destinations = DESTINATIONS }: { destinations?: Destination[] }) {
  return (
    <section className="bg-[#0B1120]">
      <div className="mx-auto max-w-7xl px-7 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2.5 pb-3 pt-32.5 text-[0.813rem] tracking-[0.02em] text-[#7A8295]">
          <Link href="/" className="hover:text-[#F8FAFC]">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-[#B7BECC]">Destinations</span>
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-12 pb-2 pt-4.5">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
              <span className="h-px w-5.5 bg-[#C9A66B] opacity-70" />
              Destinations
            </div>
            <h1 className="mt-4.5 max-w-190 font-serif text-[clamp(2.75rem,6.5vw,5.75rem)] leading-[0.98] tracking-[-0.005em] text-[#F8FAFC]">
              Escapes that
              <br />
              <em className="italic text-[#E7C68A]">colour India.</em>
            </h1>
          </div>
          <p className="mb-1.5 max-w-95 text-[0.969rem] leading-[1.6] text-[#B7BECC]">
            From the lakes of Udaipur to Kerala&apos;s quiet backwaters — explore our most-loved regions, each
            hand-curated for slow, unhurried travel.
          </p>
        </div>

        {/* Region filter bar (shared Button chips — static for now) */}
        <div className="mb-9 mt-11 flex flex-wrap gap-2.5">
          {REGIONS.map((region, i) => (
            <Button key={region} variant="chip" active={i === 0}>
              {region}
            </Button>
          ))}
        </div>

        {/* Grid of reusable cards */}
        <div className="grid grid-cols-1 gap-6 pb-27.5 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <DestinationCard key={d.city} destination={d} />
          ))}
        </div>
        <ItineryCard/>
      </div>

      
    </section>
  );
}
