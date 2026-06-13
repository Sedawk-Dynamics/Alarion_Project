'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Search — the hero booking widget (`.book`).
 * Interactive: clicking a field opens its popover (destination list / date range
 * calendar / guest steppers). The form sits in its own stacking context (`z-30`)
 * so the popovers render ABOVE the Features band below the hero.
 */

// Shared field shell (mirrors `.book-field`) — `relative` so popovers anchor to it.
const FIELD =
  'relative block w-full cursor-pointer rounded-[14px] border border-transparent bg-[#0B1120]/35 px-4.5 py-3.5 text-left transition-colors hover:border-white/8 hover:bg-[#0B1120]/55';
const LABEL = 'mb-1.5 block text-[0.656rem] font-semibold uppercase tracking-[0.18em] text-[#7A8295]';
const VAL = 'truncate text-[0.938rem] font-medium text-[#F8FAFC]';
const SUB = 'mt-0.5 text-xs text-[#7A8295]';

// Popover shell (mirrors `.pop`)
const POP =
  'absolute left-0 top-[calc(100%+10px)] z-50 rounded-2xl border border-white/14 bg-[#0E1426]/96 p-3.5 shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl';

type Field = 'dest' | 'dates' | 'guests' | null;

const DESTINATIONS = [
  { name: 'Udaipur, Rajasthan', meta: 'Lake palaces · City of Lakes', count: '28 stays', thumb: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=200&q=80&auto=format&fit=crop' },
  { name: 'Jaipur, Rajasthan', meta: 'Pink City · Forts & palaces', count: '22 stays', thumb: 'https://images.unsplash.com/photo-1477586957327-847a0f3f4fe3?w=200&q=80&auto=format&fit=crop' },
  { name: 'Goa', meta: 'Beaches · Coastal villas', count: '42 stays', thumb: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=200&q=80&auto=format&fit=crop' },
  { name: 'Kerala', meta: 'Backwaters · Houseboats', count: '19 stays', thumb: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=200&q=80&auto=format&fit=crop' },
  { name: 'Manali, Himachal', meta: 'Himalayas · Mountain retreats', count: '14 stays', thumb: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=200&q=80&auto=format&fit=crop' },
  { name: 'Mumbai, Maharashtra', meta: 'Metropolitan · City luxury', count: '31 stays', thumb: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=200&q=80&auto=format&fit=crop' },
];

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a: Date | null, b: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const fmt = (d: Date | null) =>
  d ? d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Add dates';

const GUEST_ROWS = [
  { key: 'adults', label: 'Adults', sub: 'Ages 13 or above', min: 1 },
  { key: 'children', label: 'Children', sub: 'Ages 2 – 12', min: 0 },
  { key: 'rooms', label: 'Rooms', sub: 'Maximum 4 rooms', min: 1, max: 4 },
] as const;

export default function Search() {
  const [open, setOpen] = useState<Field>(null);
  const [dest, setDest] = useState('Udaipur, Rajasthan');
  const [checkIn, setCheckIn] = useState<Date | null>(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate() + 7);
  });
  const [checkOut, setCheckOut] = useState<Date | null>(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate() + 9);
  });
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [viewMonth, setViewMonth] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });

  const rootRef = useRef<HTMLFormElement>(null);

  // Close on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(null);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const today = startOfDay(new Date());
  const nights = checkIn && checkOut ? Math.round((checkOut.getTime() - checkIn.getTime()) / 86_400_000) : 0;

  function pickDay(day: Date) {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(day);
      setCheckOut(null);
    } else if (day > checkIn) {
      setCheckOut(day);
    } else {
      setCheckIn(day);
      setCheckOut(null);
    }
  }

  function step(key: 'adults' | 'children' | 'rooms', delta: number, min: number, max = 20) {
    setGuests((g) => ({ ...g, [key]: Math.min(max, Math.max(min, g[key] + delta)) }));
  }

  function Month({ month }: { month: Date }) {
    const year = month.getFullYear();
    const m = month.getMonth();
    const lead = new Date(year, m, 1).getDay();
    const days = new Date(year, m + 1, 0).getDate();
    const cells: (Date | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => new Date(year, m, i + 1))];

    return (
      <div>
        <div className="flex items-center justify-between px-1 pb-3.5">
          {m === viewMonth.getMonth() && year === viewMonth.getFullYear() ? (
            <button
              type="button"
              aria-label="Previous month"
              disabled={viewMonth <= new Date(today.getFullYear(), today.getMonth(), 1)}
              onClick={() => setViewMonth((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1))}
              className="grid h-7.5 w-7.5 place-items-center rounded-lg border border-white/8 bg-white/4 transition hover:border-[#C9A66B] disabled:opacity-35"
            >
              <svg viewBox="0 0 24 24" className="h-3.25 w-3.25" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          ) : (
            <span className="w-7.5" />
          )}
          <div className="font-serif text-[1.125rem] text-[#F8FAFC]">
            {month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </div>
          {m === (viewMonth.getMonth() + 1) % 12 ? (
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setViewMonth((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1))}
              className="grid h-7.5 w-7.5 place-items-center rounded-lg border border-white/8 bg-white/4 transition hover:border-[#C9A66B]"
            >
              <svg viewBox="0 0 24 24" className="h-3.25 w-3.25" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          ) : (
            <span className="w-7.5" />
          )}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {DOW.map((d) => (
            <div key={d} className="py-1.5 text-center text-[0.625rem] font-semibold uppercase tracking-0.1em text-[#7A8295]">
              {d}
            </div>
          ))}
          {cells.map((day, i) => {
            if (!day) return <span key={i} className="aspect-square" />;
            const disabled = day < today;
            const isStart = sameDay(day, checkIn);
            const isEnd = sameDay(day, checkOut);
            const inRange = !!checkIn && !!checkOut && day > checkIn && day < checkOut;
            let cls = 'aspect-square grid place-items-center text-[0.813rem] border border-transparent transition ';
            if (disabled) cls += 'rounded-lg text-[#7A8295] opacity-35 cursor-not-allowed';
            else if (isStart || isEnd) cls += `bg-[#C9A66B] font-bold text-[#1a1206] ${isStart && isEnd ? 'rounded-lg' : isStart ? 'rounded-l-lg' : 'rounded-r-lg'}`;
            else if (inRange) cls += 'rounded-none bg-[#C9A66B]/10 text-[#F8FAFC]';
            else cls += 'rounded-lg text-[#F8FAFC] hover:border-[#C9A66B]/30 hover:bg-[#C9A66B]/12';
            return (
              <button key={i} type="button" disabled={disabled} onClick={() => pickDay(day)} className={cls}>
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <form
      ref={rootRef}
      autoComplete="off"
      onSubmit={(e) => e.preventDefault()}
      className="relative z-30 mx-auto grid w-[min(1280px,calc(100%-3.5rem))] grid-cols-2 items-stretch gap-2 rounded-xl border border-white/14 bg-[#F8FAFC]/6 p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.45),0_2px_0_rgba(255,255,255,0.04)_inset] backdrop-blur-[22px] backdrop-saturate-[1.4] lg:grid-cols-[1.4fr_1fr_1fr_0.9fr_auto]"
    >
      {/* Destination */}
      <div className={FIELD} onClick={() => setOpen('dest')}>
        <span className={LABEL}>Destination</span>
        <input
          type="text"
          placeholder="Where to?"
          value={dest}
          onChange={(e) => setDest(e.target.value)}
          onFocus={() => setOpen('dest')}
          className="w-full bg-transparent text-[0.938rem] font-medium text-[#F8FAFC] outline-none placeholder:font-normal placeholder:text-[#7A8295]"
        />
        <div className={SUB}>City, region or property</div>

        {open === 'dest' && (
          <div className={`${POP} w-90`} onClick={(e) => e.stopPropagation()}>
            <div className="flex max-h-85 flex-col gap-0.5 overflow-y-auto">
              <div className="px-3 pb-1.5 pt-2 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-[#7A8295]">
                Popular destinations
              </div>
              {DESTINATIONS.map((d) => (
                <button
                  key={d.name}
                  type="button"
                  onClick={() => {
                    setDest(d.name);
                    setOpen(null);
                  }}
                  className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left transition hover:bg-[#C9A66B]/8"
                >
                  <span className="h-9.5 w-9.5 shrink-0 rounded-[9px] border border-white/8 bg-cover bg-center" style={{ backgroundImage: `url('${d.thumb}')` }} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-[#F8FAFC]">{d.name}</span>
                    <span className="block truncate text-[0.719rem] text-[#7A8295]">{d.meta}</span>
                  </span>
                  <span className="ml-auto shrink-0 text-[0.688rem] tracking-[0.06em] text-[#7A8295]">{d.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Check-in */}
      <div className={FIELD} onClick={() => setOpen('dates')}>
        <span className={LABEL}>Check-in</span>
        <div className={VAL}>{fmt(checkIn)}</div>
        <div className={SUB}>From ₹24,500 / night</div>
      </div>

      {/* Check-out (holds the dual-month calendar popover) */}
      <div className={FIELD} onClick={() => setOpen('dates')}>
        <span className={LABEL}>Check-out</span>
        <div className={VAL}>{fmt(checkOut)}</div>
        <div className={SUB}>{nights ? `${nights} night${nights > 1 ? 's' : ''}` : 'Select date'}</div>

        {open === 'dates' && (
          <div className={`${POP} w-[min(640px,calc(100vw-3.5rem))] p-4.5`} onClick={(e) => e.stopPropagation()}>
            <div className="grid gap-6 md:grid-cols-2">
              <Month month={viewMonth} />
              <Month month={new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)} />
            </div>
            <div className="mt-3.5 flex items-center justify-between border-t border-white/8 pt-3.5 text-[0.781rem] text-[#B7BECC]">
              <span>{checkIn && !checkOut ? 'Select your check-out date' : checkIn && checkOut ? `${nights} night${nights > 1 ? 's' : ''} selected` : 'Select your check-in date'}</span>
              <button type="button" onClick={() => setOpen(null)} className="rounded-lg bg-[#C9A66B] px-3.5 py-2 text-[0.781rem] font-semibold text-[#1a1206]">
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Guests (right-aligned popover) */}
      <div className={FIELD} onClick={() => setOpen('guests')}>
        <span className={LABEL}>Guests</span>
        <div className={VAL}>
          {guests.adults} Adult{guests.adults > 1 ? 's' : ''} · {guests.rooms} Room{guests.rooms > 1 ? 's' : ''}
        </div>
        <div className={SUB}>{guests.children ? `${guests.children} ${guests.children > 1 ? 'children' : 'child'}` : 'Add children'}</div>

        {open === 'guests' && (
          <div className={`${POP} left-auto right-0 w-80`} onClick={(e) => e.stopPropagation()}>
            {GUEST_ROWS.map((row, idx) => {
              const value = guests[row.key];
              const max = 'max' in row ? row.max : 20;
              return (
                <div key={row.key} className={`flex items-center justify-between py-3.5 ${idx ? 'border-t border-white/8' : ''}`}>
                  <div>
                    <div className="text-sm font-medium text-[#F8FAFC]">{row.label}</div>
                    <div className="mt-0.5 text-[0.719rem] text-[#7A8295]">{row.sub}</div>
                  </div>
                  <div className="flex items-center gap-3.5">
                    <button
                      type="button"
                      disabled={value <= row.min}
                      onClick={() => step(row.key, -1, row.min, max)}
                      className="grid h-7.5 w-7.5 place-items-center rounded-full border border-white/14 text-[#F8FAFC] transition hover:border-[#C9A66B] hover:text-[#C9A66B] disabled:opacity-30"
                    >
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                        <path d="M5 12h14" />
                      </svg>
                    </button>
                    <span className="min-w-4.5 text-center text-sm font-semibold text-[#F8FAFC]">{value}</span>
                    <button
                      type="button"
                      disabled={value >= max}
                      onClick={() => step(row.key, 1, row.min, max)}
                      className="grid h-7.5 w-7.5 place-items-center rounded-full border border-white/14 text-[#F8FAFC] transition hover:border-[#C9A66B] hover:text-[#C9A66B] disabled:opacity-30"
                    >
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
            <button type="button" onClick={() => setOpen(null)} className="mt-3.5 w-full rounded-[10px] bg-[#C9A66B] py-2.75 text-[0.813rem] font-semibold text-[#1a1206]">
              Done
            </button>
          </div>
        )}
      </div>

      {/* Search button */}
      <button
        type="submit"
        className="col-span-2 inline-flex min-w-35 items-center justify-center gap-2.5 rounded-[14px] bg-linear-to-b from-[#E7C68A] to-[#C9A66B] px-6.5 py-3.5 text-[0.875rem] font-bold tracking-[0.01em] text-[#1a1206] shadow-[0_12px_30px_-10px_rgba(201,166,107,0.6),0_0_0_1px_rgba(255,255,255,0.15)_inset] transition hover:-translate-y-px lg:col-span-1 lg:py-0"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        Search
      </button>
    </form>
  );
}
