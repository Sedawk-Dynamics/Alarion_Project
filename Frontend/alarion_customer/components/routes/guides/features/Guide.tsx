import Link from 'next/link';
import GuideCard, { type Guide } from '../ui/Cards/GuideCard';
import Button from '@/components/ui/buttons/Button';
import ItineryCard from '@/components/ui/cards/ItineryCard';

/**
 * Guide — the "/guide" page (mirrors Guide.html).
 * Breadcrumb + header + region filter chips + a grid of reusable <GuideCard>.
 * Filter chips use the shared <Button variant="chip"> (static for now — filtering later).
 * Data is prop-driven (defaults below) — swap for API data later.
 */

const REGIONS = ['All Regions', 'North', 'South', 'East', 'West', 'Northeast', 'Central'];

const GUIDES: Guide[] = [
  { region: 'North', state: 'Rajasthan', cities: 'Jaipur · Udaipur', dishes: ['Dal Baati Churma', 'Laal Maas', 'Ghevar'], restaurants: [{ name: 'Suvarna Mahal', meta: 'Royal Thali · Rambagh' }, { name: 'Chokhi Dhani', meta: 'Rajasthani · Tonk Rd' }, { name: 'Handi Restaurant', meta: 'Laal Maas · MI Road' }], image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&q=80&auto=format&fit=crop' },
  { region: 'North', state: 'Delhi', cities: 'New Delhi · NCR', dishes: ['Butter Chicken', 'Chaat', 'Galouti Kebab'], restaurants: [{ name: 'Bukhara', meta: 'North-West Frontier · ITC' }, { name: "Karim's", meta: 'Mughlai · Jama Masjid' }, { name: 'Indian Accent', meta: 'Modern Indian · Lodhi' }], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&q=80&auto=format&fit=crop' },
  { region: 'North', state: 'Punjab', cities: 'Amritsar', dishes: ['Amritsari Kulcha', 'Sarson da Saag', 'Makki di Roti'], restaurants: [{ name: 'Kesar da Dhaba', meta: 'Punjabi · Old City' }, { name: 'Bharawan da Dhaba', meta: 'Thali · Town Hall' }, { name: 'Beera Chicken', meta: 'Tandoori · Majitha Rd' }], image: 'https://images.unsplash.com/photo-1477586957327-847a0f3f4fe3?w=900&q=80&auto=format&fit=crop' },
  { region: 'South', state: 'Kerala', cities: 'Kochi', dishes: ['Appam & Stew', 'Karimeen Pollichathu', 'Puttu'], restaurants: [{ name: 'Kayees Rahmathulla', meta: 'Biryani · Mattancherry' }, { name: 'Dhe Puttu', meta: 'Puttu · Vyttila' }, { name: 'Fort House', meta: 'Seafood · Fort Kochi' }], image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80&auto=format&fit=crop' },
  { region: 'South', state: 'Tamil Nadu', cities: 'Chennai', dishes: ['Idli & Dosa', 'Chettinad Chicken', 'Filter Coffee'], restaurants: [{ name: 'Murugan Idli Shop', meta: 'Tiffin · T. Nagar' }, { name: 'Saravana Bhavan', meta: 'South Indian · Citywide' }, { name: 'Annalakshmi', meta: 'Vegetarian · Anna Salai' }], image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&q=80&auto=format&fit=crop' },
  { region: 'South', state: 'Karnataka', cities: 'Bengaluru', dishes: ['Masala Dosa', 'Bisi Bele Bath', 'Mangalorean Fish Curry'], restaurants: [{ name: 'MTR', meta: 'Dosa · Lalbagh Rd' }, { name: 'Vidyarthi Bhavan', meta: 'Tiffin · Gandhi Bazaar' }, { name: 'CTR (Shri Sagar)', meta: 'Benne Dosa · Malleshwaram' }], image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&q=80&auto=format&fit=crop' },
  { region: 'West', state: 'Goa', cities: 'Panaji', dishes: ['Goan Fish Curry', 'Pork Vindaloo', 'Bebinca'], restaurants: [{ name: 'Vinayak Family', meta: 'Seafood · Assagao' }, { name: "Mum's Kitchen", meta: 'Goan · Panaji' }, { name: 'Gunpowder', meta: 'Coastal · Assagao' }], image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80&auto=format&fit=crop' },
  { region: 'West', state: 'Maharashtra', cities: 'Mumbai', dishes: ['Vada Pav', 'Misal Pav', 'Bombil Fry'], restaurants: [{ name: 'Britannia & Co.', meta: 'Parsi · Ballard Estate' }, { name: 'Trishna', meta: 'Seafood · Fort' }, { name: 'Bademiya', meta: 'Kebabs · Colaba' }], image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=900&q=80&auto=format&fit=crop' },
  { region: 'West', state: 'Gujarat', cities: 'Ahmedabad', dishes: ['Dhokla', 'Gujarati Thali', 'Fafda-Jalebi'], restaurants: [{ name: 'Agashiye', meta: 'Thali · House of MG' }, { name: 'Gordhan Thal', meta: 'Gujarati · Sarkhej' }, { name: 'Vishalla', meta: 'Village Dining · Vasna' }], image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=80&auto=format&fit=crop' },
  { region: 'East', state: 'West Bengal', cities: 'Kolkata', dishes: ['Macher Jhol', 'Kosha Mangsho', 'Rosogolla'], restaurants: [{ name: "Kewpie's", meta: 'Bengali Thali · Elgin' }, { name: '6 Ballygunge Place', meta: 'Bengali · Ballygunge' }, { name: 'Bhojohori Manna', meta: 'Home-style · Citywide' }], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80&auto=format&fit=crop' },
  { region: 'East', state: 'Odisha', cities: 'Bhubaneswar · Puri', dishes: ['Dalma', 'Chhena Poda', 'Macha Besara'], restaurants: [{ name: 'Dalma', meta: 'Odia · Saheed Nagar' }, { name: 'Odisha Hotel', meta: 'Thali · Master Canteen' }, { name: 'Kanika', meta: 'Fine Odia · Mayfair' }], image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=900&q=80&auto=format&fit=crop' },
  { region: 'Northeast', state: 'Assam', cities: 'Guwahati', dishes: ['Masor Tenga', 'Duck Curry', 'Pitha'], restaurants: [{ name: 'Khorikaa', meta: 'Assamese · Zoo Road' }, { name: 'Paradise', meta: 'Thali · Silpukhuri' }, { name: "Gam's Delicacy", meta: 'Tribal · Christian Basti' }], image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=80&auto=format&fit=crop' },
  { region: 'Northeast', state: 'Meghalaya', cities: 'Shillong', dishes: ['Jadoh', 'Dohneiiong', 'Tungrymbai'], restaurants: [{ name: 'Trattoria', meta: 'Khasi · Police Bazaar' }, { name: 'City Hut Dhaba', meta: 'Multi-cuisine · Oakland' }, { name: 'Déjà Vu', meta: 'Local · Laitumkhrah' }], image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&q=80&auto=format&fit=crop' },
  { region: 'Central', state: 'Madhya Pradesh', cities: 'Indore', dishes: ['Poha-Jalebi', 'Bhutte ka Kees', 'Sabudana Khichdi'], restaurants: [{ name: 'Sarafa Bazaar', meta: 'Night Street Food · Old City' }, { name: 'Chappan Dukan', meta: 'Snacks · New Palasia' }, { name: 'Nafees', meta: 'Mughlai · Sapna Sangeeta' }], image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80&auto=format&fit=crop' },
];

export default function Guide({ guides = GUIDES }: { guides?: Guide[] }) {
  return (
    <section className="bg-[#0B1120]">
      <div className="mx-auto max-w-7xl px-7 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2.5 pb-3 pt-32.5 text-[0.813rem] tracking-[0.02em] text-[#7A8295]">
          <Link href="/" className="hover:text-[#F8FAFC]">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-[#B7BECC]">Travel Guide</span>
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-12 pb-2 pt-4.5">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
              <span className="h-px w-5.5 bg-[#C9A66B] opacity-70" />
              Travel Guide
            </div>
            <h1 className="mt-4.5 max-w-190 font-serif text-[clamp(2.75rem,6.5vw,5.75rem)] leading-[0.98] tracking-[-0.005em] text-[#F8FAFC]">
              Know India,
              <br />
              <em className="italic text-[#E7C68A]">region by region.</em>
            </h1>
          </div>
          <p className="mb-1.5 max-w-95 text-[0.969rem] leading-[1.6] text-[#B7BECC]">
            A taste of every corner — what to eat and where to eat it, curated by our local travel desk across
            India&apos;s great culinary regions.
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
          {guides.map((g) => (
            <GuideCard key={g.state} guide={g} />
          ))}
        </div>

        {/* Itinerary CTA banner */}
        <ItineryCard
          eyebrow="Hungry for the real thing?"
          title={
            <>
              Let us build a stay around the <em className="italic text-[#E7C68A]">flavours</em> you love.
            </>
          }
          cta={{ label: 'Explore destinations', href: '/destinations' }}
        />
      </div>
    </section>
  );
}
