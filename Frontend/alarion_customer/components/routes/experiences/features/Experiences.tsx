import Link from 'next/link';
import ExperienceCard, { type Experience } from '../ui/Cards/ExperienceCard';
import Button from '@/components/ui/buttons/Button';
import ItineryCard from '@/components/ui/cards/ItineryCard';

/**
 * Experiences — the "/experiences" page (mirrors Experiences.html).
 * Breadcrumb + header + category filter chips + a grid of reusable <ExperienceCard>.
 * Filter chips use the shared <Button variant="chip"> (static for now — filtering later).
 * Data is prop-driven (defaults below) — swap for API data later.
 */

const CATEGORIES = ['All Experiences', 'Wellness', 'Culinary', 'Heritage', 'Adventure'];

const EXPERIENCES: Experience[] = [
  { category: 'Wellness', title: 'Royal Aravalli Spa Ritual', description: "A 90-minute Ayurvedic journey of warm oils and slow breathwork, drawn from Rajasthan's royal wellness traditions.", duration: '90 minutes', price: '₹6,500', per: '/ guest', image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1000&q=80&auto=format&fit=crop', href: '/property' },
  { category: 'Culinary', title: "Chef's Table Degustation", description: 'An eight-course tasting menu plated at the pass, paired with regional wines and narrated by the executive chef.', duration: 'Evening', price: '₹8,900', per: '/ guest', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&q=80&auto=format&fit=crop', href: '/property' },
  { category: 'Heritage', title: 'Private Palace Heritage Walk', description: 'A historian-led tour through royal courtyards and durbar halls usually closed to the public, ending with high tea.', duration: '3 hours', price: '₹4,200', per: '/ guest', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1000&q=80&auto=format&fit=crop', href: '/property' },
  { category: 'Adventure', title: 'Lake Pichola Sunset Cruise', description: "A private boat across Udaipur's mirror-still waters at golden hour, with canapés and a personal photographer aboard.", duration: '2 hours', price: '₹3,800', per: '/ guest', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&q=80&auto=format&fit=crop', href: '/property' },
  { category: 'Adventure', title: 'Himalayan Forest Trek', description: 'A guided full-day ascent through cedar forests above Manali, with a packed gourmet lunch at a glacial viewpoint.', duration: 'Full day', price: '₹5,500', per: '/ guest', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1000&q=80&auto=format&fit=crop', href: '/property' },
  { category: 'Wellness', title: 'Backwater Houseboat Retreat', description: "An overnight drift through Kerala's palm-lined canals aboard a private kettuvallam, with a yoga session at dawn.", duration: 'Overnight', price: '₹12,000', per: '/ guest', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1000&q=80&auto=format&fit=crop', href: '/property' },
];

export default function Experiences({ experiences = EXPERIENCES }: { experiences?: Experience[] }) {
  return (
    <section className="bg-[#0B1120]">
      <div className="mx-auto max-w-7xl px-7 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2.5 pb-3 pt-32.5 text-[0.813rem] tracking-[0.02em] text-[#7A8295]">
          <Link href="/" className="hover:text-[#F8FAFC]">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-[#B7BECC]">Experiences</span>
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-12 pb-2 pt-4.5">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
              <span className="h-px w-5.5 bg-[#C9A66B] opacity-70" />
              Experiences
            </div>
            <h1 className="mt-4.5 max-w-190 font-serif text-[clamp(2.75rem,6.5vw,5.75rem)] leading-[0.98] tracking-[-0.005em] text-[#F8FAFC]">
              Moments worth
              <br />
              <em className="italic text-[#E7C68A]">travelling for.</em>
            </h1>
          </div>
          <p className="mb-1.5 max-w-95 text-[0.969rem] leading-[1.6] text-[#B7BECC]">
            Beyond the room key — private rituals, chef&apos;s tables and quiet adventures, each curated by our travel
            desk and hosted by the properties we trust.
          </p>
        </div>

        {/* Category filter bar (shared Button chips — static for now) */}
        <div className="mb-9 mt-11 flex flex-wrap gap-2.5">
          {CATEGORIES.map((category, i) => (
            <Button key={category} variant="chip" active={i === 0}>
              {category}
            </Button>
          ))}
        </div>

        {/* Grid of reusable cards */}
        <div className="grid grid-cols-1 gap-6 pb-27.5 md:grid-cols-2 lg:grid-cols-3">
          {experiences.map((x) => (
            <ExperienceCard key={x.title} experience={x} />
          ))}
        </div>

        {/* Itinerary CTA banner */}
        <ItineryCard
          eyebrow="Want something bespoke?"
          title={
            <>
              Tell us the moment you&apos;re after — we&apos;ll <em className="italic text-[#E7C68A]">craft</em> it.
            </>
          }
          cta={{ label: 'Start a request', href: '#' }}
        />
      </div>
    </section>
  );
}
