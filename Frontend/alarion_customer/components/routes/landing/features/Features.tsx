import FeatureTickers, { type TickerItem } from '../ui/Cards/FeatureTickers';
import FeatureMiniCard, { type MiniHotel } from '../ui/Cards/FeatureMiniCard';

/**
 * Features — the hero's lower band: the scrolling feature ticker + the floating mini cards.
 * Composes the two reusable cards. Data is prop-driven (defaults below).
 */

const TICKER_ITEMS: TickerItem[] = [
  {
    bold: 'Free cancellation',
    text: 'up to 48 hrs',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
  },
  {
    bold: 'Best price',
    text: 'guarantee',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.4 7.4H22l-6 4.5 2.3 7.1-6.3-4.6L5.7 21l2.3-7.1-6-4.5h7.6z" />
      </svg>
    ),
  },
  {
    bold: '24/7',
    text: 'private concierge',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    bold: 'Secure',
    text: 'instant payments',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
  },
  {
    bold: '500+',
    text: 'handpicked stays',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    bold: 'Tailored',
    text: 'experiences',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
        <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-2.9 1.2V21a2 2 0 11-4 0v-.1A1.7 1.7 0 005 19.2l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.7 1.7 0 002.6 13H2.5a2 2 0 110-4h.1A1.7 1.7 0 004.8 7l-.1-.1a2 2 0 112.8-2.8l.1.1A1.7 1.7 0 009 4.6V4.5a2 2 0 114 0v.1a1.7 1.7 0 002.9 1.2l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 001.2 2.9h.1a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
      </svg>
    ),
  },
];

const MINI_HOTELS: MiniHotel[] = [
  {
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80&auto=format&fit=crop',
    title: 'The Oberoi Udaivilās',
    rating: 4.96,
    location: 'Udaipur',
    price: '₹62k',
  },
  {
    image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=400&q=80&auto=format&fit=crop',
    title: 'Amanbagh Retreat',
    rating: 4.92,
    location: 'Alwar',
    price: '₹48k',
  },
  {
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80&auto=format&fit=crop',
    title: 'Taj Lake Palace',
    rating: 4.89,
    location: 'Udaipur',
    price: '₹54k',
  },
];

export default function Features({
  tickerItems = TICKER_ITEMS,
  miniHotels = MINI_HOTELS,
}: {
  tickerItems?: TickerItem[];
  miniHotels?: MiniHotel[];
}) {
  return (
    <div className="mx-auto mt-10 w-[min(1280px,calc(100%-3.5rem))]">
      {/* Scrolling feature ticker */}
      <FeatureTickers items={tickerItems} />

      {/* Floating mini hotel cards */}
      <div className="mt-12 grid grid-cols-1 gap-4.5 pb-24 md:grid-cols-3">
        {miniHotels.map((hotel) => (
          <FeatureMiniCard key={hotel.title} {...hotel} />
        ))}
      </div>
    </div>
  );
}
