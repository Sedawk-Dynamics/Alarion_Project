import Link from 'next/link';
/**
 * Footer — app-wide footer.
 * Prop-driven (columns + legal links) with defaults from the Alarion design.
 * Server Component (static) — no client JS needed.
 */
export type FooterLink = { label: string; href: string };
export type FooterColumn = { title: string; links: FooterLink[] };

type Newsletter = { title: string; text: string; placeholder?: string; button?: string };
type Contact = { email: string; phone: string };

type FooterProps = {
  /** "full" = landing footer (brand + columns + newsletter). "minimal" = contact + legal bar only. */
  variant?: 'full' | 'minimal';
  brand?: string;
  tagline?: string;
  columns?: FooterColumn[];
  legal?: FooterLink[];
  newsletter?: Newsletter;
  contact?: Contact;
};

const DEFAULT_CONTACT: Contact = {
  email: 'concierge@alarion.com',
  phone: '+91 124 716 0000',
};

const MailIcon = (
  <svg viewBox="0 0 24 24" className="h-3.75 w-3.75 shrink-0 text-[#C9A66B]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 6L2 7" />
  </svg>
);
const PhoneIcon = (
  <svg viewBox="0 0 24 24" className="h-3.75 w-3.75 shrink-0 text-[#C9A66B]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const DEFAULT_NEWSLETTER: Newsletter = {
  title: 'Stay in the know',
  text: 'Monthly notes on new properties, member rates and slow-travel stories from across India.',
  placeholder: 'your@email.com',
  button: 'Subscribe',
};

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: 'Explore',
    links: [
      { label: 'Featured Hotels', href: '/#hotels' },
      { label: 'Destinations', href: '/destinations' },
      { label: 'Experiences', href: '/experiences' },
      { label: 'Private Retreats', href: '/retreats' },
      { label: 'Group Bookings', href: '/group-bookings' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Alarion', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Partner with Us', href: '/list-your-hotel' },
      { label: 'Sustainability', href: '/sustainability' },
    ],
  },
];

const DEFAULT_LEGAL: FooterLink[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Legal', href: '/legal' },
];

export default function Footer({
  variant = 'full',
  brand = 'Alarion',
  tagline = "Where every stay tells a story. A curated booking platform for India's most distinguished hotels and private retreats.",
  columns = DEFAULT_COLUMNS,
  legal = DEFAULT_LEGAL,
  newsletter = DEFAULT_NEWSLETTER,
  contact = DEFAULT_CONTACT,
}: FooterProps) {
  const year = new Date().getFullYear();

  // Minimal footer (e.g. Destinations) — contact row + legal bar only.
  if (variant === 'minimal') {
    return (
      <footer className="border-t border-white/8 bg-[#070A14]">
        <div className="mx-auto max-w-7xl px-7 pb-8 pt-12">
          {/* Contact row */}
          <div className="mb-5.5 flex flex-wrap gap-7 border-b border-white/8 pb-5.5">
            <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2.25 text-[0.844rem] font-medium text-[#B7BECC] transition-colors hover:text-[#E7C68A]">
              {MailIcon}
              {contact.email}
            </a>
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2.25 text-[0.844rem] font-medium text-[#B7BECC] transition-colors hover:text-[#E7C68A]">
              {PhoneIcon}
              {contact.phone}
            </a>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-[0.781rem] text-[#7A8295]">
              © {year} {brand} Hospitality Pvt. Ltd. — Gurgaon, India.
            </p>
            <div className="flex gap-6">
              {legal.map((link) => (
                <Link key={link.href} href={link.href} className="text-[0.781rem] text-[#7A8295] hover:text-[#F8FAFC]">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-neutral-200/10 bg-[#070A14] ">
      <div className="mx-auto max-w-7xl px-4 py-30 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand block */}
          <div className="md:col-span-2 lg:col-span-4">
            <Link href="/" className="font-serif text-2xl tracking-[0.02em] text-[#C9A66B]">
              {brand}
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-[1.6] text-[#B7BECC]">{tagline}</p>
            <div className="mt-5 space-y-3 text-sm font-medium text-">
              <a href="mailto:concierge@alarion.com" className="block text-[#B7BECC] hover:text-[#C9A66B]">
                concierge@alarion.com
              </a>
              <a href="tel:+911247160000" className="block text-[#B7BECC] hover:text-[#C9A66B]">
                Customer Care: +91 124 716 0000
              </a>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h4 className="text-[0.719rem] font-semibold uppercase tracking-[0.2em] text-[#7A8295]">{col.title}</h4>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#B7BECC] hover:text-[#C9A66B]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter — "Stay in the know" */}
          <div className="md:col-span-2 lg:col-span-4">
            <h4 className="text-[0.719rem] font-semibold uppercase tracking-[0.2em] text-[#7A8295]">
              {newsletter.title}
            </h4>
            <p className="mt-4 max-w-sm text-[0.844rem] leading-[1.55] text-[#B7BECC]">
              {newsletter.text}
            </p>
            <form className="mt-5 flex items-center gap-2 rounded-xl border border-neutral-300 bg-white p-1.5">
              <input
                type="email"
                required
                placeholder={newsletter.placeholder}
                className="flex-1 bg-transparent px-3 py-2 text-[0.844rem] text-neutral-900 outline-none placeholder:text-neutral-400"
              />
              <button
                type="submit"
                className="rounded-lg bg-white px-4 py-2 text-[0.813rem] font-semibold text-black transition-colors hover:bg-neutral-700"
              >
                {newsletter.button}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-80 pt-6 sm:flex-row">
          <p className="text-[0.781rem] tracking-[0.02em] text-[#7A8295]">
            © {year} {brand} Hospitality Pvt. Ltd. — Gurgaon, India.
          </p>
          <div className="flex gap-6">
            {legal.map((link) => (
              <Link key={link.href} href={link.href} className="text-[0.781rem] text-[#7A8295] hover:text-[#C9A66B]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
