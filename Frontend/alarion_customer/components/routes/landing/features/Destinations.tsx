import DestinationCard, { type Destination } from '../ui/Cards/DestinationCard';

/**
 * Destinations — the "Destinations" landing section.
 * Same shape as FeatureHotels: section header + a grid of reusable <DestinationCard>.
 * Data is prop-driven (defaults below) — swap `destinations` for real data later.
 */

const DESTINATIONS: Destination[] = [
  {
    city: 'Udaipur',
    state: 'Rajasthan',
    properties: '28 properties',
    size: 'big',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80&auto=format&fit=crop',
    href: '/destinations/udaipur',
  },
  {
    city: 'Goa',
    state: 'Coastal',
    properties: '42 properties',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80&auto=format&fit=crop',
    href: '/destinations/goa',
  },
  {
    city: 'Kerala',
    state: 'Backwaters',
    properties: '19 properties',
    size: 'tall',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80&auto=format&fit=crop',
    href: '/destinations/kerala',
  },
  {
    city: 'Jaipur',
    state: 'Pink City',
    properties: '22 properties',
    image: 'https://images.unsplash.com/photo-1477586957327-847a0f3f4fe3?w=900&q=80&auto=format&fit=crop',
    href: '/destinations/jaipur',
  },
  {
    city: 'Manali',
    state: 'Himalayas',
    properties: '14 properties',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=80&auto=format&fit=crop',
    href: '/destinations/manali',
  },
  {
    city: 'Mumbai',
    state: 'Metropolitan',
    properties: '31 properties',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=900&q=80&auto=format&fit=crop',
    href: '/destinations/mumbai',
  },
];

export default function Destinations({ destinations = DESTINATIONS }: { destinations?: Destination[] }) {
  return (
    <section id="dest" className="bg-[#0B1120] py-30">
      <div className="mx-auto w-[min(1280px,calc(100%-3.5rem))]">
        {/* Section head */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-10">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
              <span className="h-px w-5.5 bg-[#C9A66B] opacity-70" />
              Destinations
            </div>
            <h2 className="mt-3.5 max-w-180 font-serif text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-[-0.005em] text-[#F8FAFC]">
              Six escapes that
              <br />
              <em className="italic text-[#E7C68A]">colour India.</em>
            </h2>
          </div>
          <p className="max-w-95 text-[0.938rem] leading-[1.55] text-[#B7BECC]">
            From the lakes of Udaipur to Kerala&apos;s quiet backwaters — our most-loved regions,
            hand-curated for slow travellers.
          </p>
        </div>

        {/* Masonry grid — big/tall cards span 2 rows (lg). Auto-rows give each card its height. */}
        <div className="grid auto-rows-[200px] grid-cols-1 gap-4 md:auto-rows-[180px] md:grid-cols-2 lg:auto-rows-[220px] lg:grid-cols-[1.4fr_1fr_1fr]">
          {destinations.map((destination) => (
            <DestinationCard key={destination.city} destination={destination} />
          ))}
        </div>
      </div>
    </section>
  );
}
