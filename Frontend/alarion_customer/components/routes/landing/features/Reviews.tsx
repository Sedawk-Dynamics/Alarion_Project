import ReviewCard, { type Review } from '../ui/Cards/ReviewCard';

/**
 * Reviews — the "Guest Stories" landing section.
 * Section header + a grid of reusable <ReviewCard>.
 * Data is prop-driven (defaults below) — swap `reviews` for real data later.
 */

const REVIEWS: Review[] = [
  {
    description:
      '"The concierge remembered our anniversary from our last stay — three years ago. That\'s the kind of detail Alarion has built a brand around."',
    userName: 'Ananya Krishnan',
    city: 'UDAIPUR',
    stays: '2 STAYS',
    stars: 5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&auto=format&fit=crop',
  },
  {
    description:
      '"Booking through Alarion feels like calling a friend who happens to own the best hotels in India. Everything is just handled."',
    userName: 'Vikram Mehta',
    city: 'JAIPUR',
    stays: '4 STAYS',
    stars: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop',
  },
  {
    description:
      '"I\'ve used every booking platform there is. Alarion is the first that respects the property as much as the guest. It shows."',
    userName: 'Priya Shenoy',
    city: 'KERALA',
    stays: '6 STAYS',
    stars: 5,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80&auto=format&fit=crop',
  },
];

export default function Reviews({ reviews = REVIEWS }: { reviews?: Review[] }) {
  return (
    <section id="test" className="relative overflow-hidden bg-[#0E1426] py-30">
      {/* Decorative radial glows (matches `.test::before`) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 35% at 80% 10%, rgba(201,166,107,.08) 0%, transparent 70%), radial-gradient(40% 30% at 10% 90%, rgba(37,99,235,.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-[min(1280px,calc(100%-3.5rem))]">
        {/* Section head */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-10">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
              <span className="h-px w-5.5 bg-[#C9A66B] opacity-70" />
              Guest Stories
            </div>
            <h2 className="mt-3.5 max-w-180 font-serif text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-[-0.005em] text-[#F8FAFC]">
              4.91 average rating,
              <br />
              <em className="italic text-[#E7C68A]">across 12,400 stays.</em>
            </h2>
          </div>
          <p className="max-w-95 text-[0.938rem] leading-[1.55] text-[#B7BECC]">
            Words from travellers who measure hospitality by how well they&apos;re remembered next
            time.
          </p>
        </div>

        {/* Grid of reusable cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.userName} {...review} />
          ))}
        </div>
      </div>
    </section>
  );
}
