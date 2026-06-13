'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * Navbar — fixed floating glass pill (matches the Alarion landing `.nav`).
 * Prop-driven with sensible defaults so pages can override brand/links/actions.
 */

export type NavLink = { label: string; href: string };

type NavbarProps = {
  brand?: string;
  links?: NavLink[];
  signInHref?: string;
  listPropertyHref?: string;
};

const DEFAULT_LINKS: NavLink[] = [
  { label: 'Hotels', href: '/#hotels' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Guide', href: '/guide' },
  { label: 'Why Alarion', href: '/why-alarion' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'Help', href: '/#help' },
];

export default function Navbar({
  brand = 'Alarion',
  links = DEFAULT_LINKS,
  signInHref = '/auth',
  listPropertyHref = '/list-your-hotel',
}: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    // .nav — fixed centered floating pill
    <nav className="fixed left-1/2 top-4.5 z-60 flex w-[min(1280px,calc(100%-32px))] -translate-x-1/2 items-center justify-between rounded-full border border-white/8 bg-[#0B1120]/55 px-5.5 py-3.5 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-[18px] backdrop-saturate-[1.4] transition-colors duration-300">
      {/* Brand */}
      <Link href="/" className="font-serif text-2xl tracking-[0.02em] text-[#C9A66B]">
        {brand}
      </Link>

      {/* Desktop links — .nav-links (gap 26px) */}
      <ul className="hidden items-center gap-6.5 lg:flex">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[0.844rem] font-medium text-[#B7BECC] transition-colors hover:text-[#F8FAFC]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop actions — .nav-actions (gap 16px) */}
      <div className="hidden items-center gap-4 lg:flex">
        <Link
          href={listPropertyHref}
          className="text-[0.813rem] font-medium text-[#E7C68A] transition-colors hover:text-[#C9A66B]"
        >
          List your place
        </Link>
        {/* .nav-cta — bg ink, text navy */}
        <Link
          href={signInHref}
          className="rounded-full bg-[#F8FAFC] px-4.5 py-2.5 text-[0.813rem] font-medium tracking-[0.01em] text-[#0B1120] transition-colors hover:bg-[#E7C68A]"
        >
          Sign In
        </Link>
      </div>

      {/* Mobile toggle */}
      <button
        type="button"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center rounded-md p-1.5 text-[#F8FAFC] lg:hidden"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
        </svg>
      </button>

      {/* Mobile menu — drops below the pill */}
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+10px)] rounded-2xl border border-white/8 bg-[#0B1120]/95 p-3 backdrop-blur-[18px] lg:hidden">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-[0.844rem] font-medium text-[#B7BECC] hover:bg-white/5 hover:text-[#F8FAFC]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href={signInHref}
                onClick={() => setOpen(false)}
                className="block rounded-full bg-[#F8FAFC] px-4.5 py-2.5 text-center text-[0.813rem] font-semibold text-[#0B1120]"
              >
                Sign In
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
