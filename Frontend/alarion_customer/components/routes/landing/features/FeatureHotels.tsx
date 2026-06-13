import Button from '@/components/ui/buttons/Button';
import FeatureHotelsCard, { type Hotel } from '../ui/Cards/FeatureHotelsCard';

/**
 * FeatureHotels — the "Featured Hotels" landing section.
 * Section header (eyebrow + heading + view-all) + a grid of reusable <HotelCard>.
 * Data is prop-driven (defaults below) — swap `hotels` for real API data later.
 */

const FEATURED: Hotel[] = [
  {
    name: 'The Oberoi Udaivilās',
    location: 'Udaipur, Rajasthan',
    rating: 4.96,
    badge: 'Signature',
    price: '₹62,000',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80&auto=format&fit=crop',
    amenities: ['Pool', 'Spa', 'Lake view', 'Suite'],
    href: '/property',
  },
  {
    name: 'Rambagh Palace',
    location: 'Jaipur, Rajasthan',
    rating: 4.89,
    badge: 'Heritage',
    price: '₹78,500',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&q=80&auto=format&fit=crop',
    amenities: ['Pool', 'Spa', 'Heritage', 'Butler'],
    href: '/property',
  },
  {
    name: 'Casa Atrévete Villa',
    location: 'Anjuna, Goa',
    rating: 4.92,
    badge: 'Beachfront',
    price: '₹38,200',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&q=80&auto=format&fit=crop',
    amenities: ['Beach', 'Pool', 'Chef', 'Yacht'],
    href: '/property',
  },
];

export default function FeatureHotels({ hotels = FEATURED }: { hotels?: Hotel[] }) {
  return (
    <section id="hotels" className="bg-linear-to-b from-[#0B1120] to-[#0E1426] py-30">
      <div className="mx-auto w-[min(1280px,calc(100%-3.5rem))]">
        {/* Section head */}
        <div className="mb-14 flex items-end justify-between gap-10">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
              <span className="h-px w-[22px] bg-[#C9A66B] opacity-70" />
              Featured Hotels
            </div>
            <h2 className="mt-3.5 max-w-[720px] font-serif text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-[-0.005em] text-[#F8FAFC]">
              Properties that
              <br />
              <em className="italic text-[#E7C68A]">shape memories.</em>
            </h2>
          </div>
          <Button variant="link" href="/hotels" className="shrink-0 text-[0.813rem] max-sm:hidden">
            View all 500+ stays
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M13 5l7 7-7 7" />
            </svg>
          </Button>
        </div>

        {/* Grid of reusable cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <FeatureHotelsCard key={hotel.name} hotel={hotel} />
          ))}
        </div>
      </div>
    </section>
  );
}
