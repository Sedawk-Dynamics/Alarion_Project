'use client';

import { useState } from 'react';

/**
 * FaqCard — a single accordion item (mirrors the landing `.faq-item`).
 * Client component (needs open/close state). Mirrors `.faq-q` / `.faq-icon` / `.faq-a`.
 */

export type FaqProps = {
  question: string;
  answer: string;
};

export default function FaqCard({ question, answer }: FaqProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/8">
      {/* Question */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 px-1 py-6.5 text-left text-[1.125rem] font-semibold text-[#F8FAFC] transition-colors hover:text-[#E7C68A]"
      >
        {question}
        <span
          className={`grid h-7.5 w-7.5 shrink-0 place-items-center rounded-full border text-[#C9A66B] transition duration-300 ${
            open ? 'rotate-45 border-[#C9A66B]/40 bg-[#C9A66B]/14' : 'border-white/14'
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>

      {/* Answer (smooth collapse via grid-rows) */}
      <div
        className={`grid transition-all duration-300 ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-170 pb-7 pl-1 pr-11 text-[0.938rem] leading-[1.65] text-[#B7BECC]">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
