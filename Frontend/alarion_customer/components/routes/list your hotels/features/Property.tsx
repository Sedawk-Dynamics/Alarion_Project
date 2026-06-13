'use client';

import { useState } from 'react';
import Input, { type Option } from '../ui/Input/Input';

/**
 * Property — the partner application form (mirrors `.lh-form`).
 * Built around the reusable RHF/Zod-ready <Input>. UI only for now: submitting
 * flips to the success state. (Wire useForm + zodResolver here later.)
 */

const TYPES: Option[] = [
  { label: 'Select…', value: '' },
  { label: 'Luxury Hotel' },
  { label: 'Heritage Palace' },
  { label: 'Boutique Resort' },
  { label: 'Private Villa' },
  { label: 'Homestay' },
  { label: 'Wellness Retreat' },
];

const SUBMIT =
  'mt-1.5 flex w-full items-center justify-center gap-2.25 rounded-xl bg-linear-to-b from-[#E7C68A] to-[#C9A66B] py-3.75 text-[0.906rem] font-bold tracking-[0.01em] text-[#1a1206] shadow-[0_14px_34px_-12px_rgba(201,166,107,0.6),0_0_0_1px_rgba(255,255,255,0.15)_inset] transition hover:-translate-y-px';

export default function Property() {
  const [sent, setSent] = useState(false);

  return (
    <div className="rounded-3xl border border-white/14 bg-[#F8FAFC]/5 px-7 py-7.5 shadow-[0_20px_60px_rgba(0,0,0,0.45),0_2px_0_rgba(255,255,255,0.04)_inset] backdrop-blur-[14px] lg:sticky lg:top-27">
      {sent ? (
        // .lh-done
        <div className="px-1 py-4.5 text-center">
          <div className="mx-auto mb-5 grid h-17 w-17 place-items-center rounded-full border border-[#10B981]/40 bg-[#10B981]/12 text-[#10B981]">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h3 className="mb-2.5 font-serif text-[1.625rem] text-[#F8FAFC]">Application received</h3>
          <p className="mx-auto max-w-75 text-sm leading-[1.6] text-[#B7BECC]">
            Thank you — our partnerships team will reach out within 48 hours to walk you through the next steps.
          </p>
        </div>
      ) : (
        <>
          {/* .lh-formbody */}
          <h3 className="font-serif text-[1.625rem] text-[#F8FAFC]">Start listing — it&apos;s free</h3>
          <p className="mb-5.5 mt-1 text-[0.813rem] text-[#7A8295]">
            Tell us about your property and we&apos;ll be in touch within 48 hours.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-3.5" noValidate>
            <Input label="Property name" type="text" placeholder="e.g. The Lotus Haveli" />

            <div className="grid grid-cols-2 gap-3.5">
              <Input label="Property type" options={TYPES} />
              <Input label="No. of rooms" type="number" min={1} placeholder="e.g. 24" />
            </div>

            <Input label="City / Location" type="text" placeholder="e.g. Udaipur, Rajasthan" />

            <div className="grid grid-cols-2 gap-3.5">
              <Input label="Your name" type="text" placeholder="Full name" />
              <Input label="Phone" type="tel" placeholder="+91 ……" />
            </div>

            <Input label="Email address" type="email" placeholder="you@property.com" />

            <button type="submit" className={SUBMIT}>
              Submit application
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M13 5l7 7-7 7" />
              </svg>
            </button>

            <div className="text-center text-[0.719rem] leading-1.5 text-[#7A8295]">
              No listing fee · No exclusivity · Cancel anytime
            </div>
          </form>
        </>
      )}
    </div>
  );
}
