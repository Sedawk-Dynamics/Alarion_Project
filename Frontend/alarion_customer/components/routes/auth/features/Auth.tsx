'use client';

import { useState } from 'react';
import AuthCard from '../ui/Cards/authCard';
import AuthInput from '../ui/Input/authInput';
import { Socials } from './Socials';

const MailIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 6L2 7" />
  </svg>
);
const LockIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const UserIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const COPY = {
  signin: { eyebrow: 'Welcome back', title: 'Sign in to Alarion', lede: 'Access your bookings, saved stays and member rates.' },
  signup: { eyebrow: 'Join Alarion', title: 'Create your account', lede: 'Member rates, saved stays and a concierge who remembers you.' },
};

function CheckBox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`mt-px grid h-4.5 w-4.5 shrink-0 place-items-center rounded-[5px] border-[1.5px] transition-colors ${
        checked ? 'border-[#C9A66B] bg-[#C9A66B]' : 'border-white/14'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-2.75 w-2.75 text-[#1a1206] transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  );
}

const ArrowIcon = (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M13 5l7 7-7 7" />
  </svg>
);

export default function Auth() {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [remember, setRemember] = useState(true);
  const [terms, setTerms] = useState(false);
  const isSignup = tab === 'signup';
  const copy = COPY[tab];

  return (
    <section className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Left — visual */}
      <AuthCard />

      {/* Right — form */}
      <div className="flex items-center justify-center bg-[#0B1120] px-6 py-12 lg:px-10">
        <div className="w-full max-w-105">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
            <span className="h-px w-5.5 bg-[#C9A66B] opacity-70" />
            {copy.eyebrow}
          </div>

          <h1 className="mb-2 mt-4 font-serif text-[2.5rem] leading-[1.05] tracking-[-0.005em] text-[#F8FAFC]">{copy.title}</h1>
          <p className="mb-7 text-[0.906rem] leading-[1.55] text-[#B7BECC]">{copy.lede}</p>

          {/* Tabs */}
          <div className="mb-7 grid grid-cols-2 gap-1 rounded-2xl border border-white/8 bg-white/4 p-1.25">
            <button type="button" onClick={() => setTab('signin')} className={`rounded-lg py-2.75 text-[0.844rem] font-semibold tracking-[0.02em] transition-colors ${tab === 'signin' ? 'bg-[#C9A66B] text-[#1a1206]' : 'text-[#7A8295]'}`}>
              Sign In
            </button>
            <button type="button" onClick={() => setTab('signup')} className={`rounded-lg py-2.75 text-[0.844rem] font-semibold tracking-[0.02em] transition-colors ${tab === 'signup' ? 'bg-[#C9A66B] text-[#1a1206]' : 'text-[#7A8295]'}`}>
              Create Account
            </button>
          </div>

          {/* Form — UI only. Add your RHF/Zod state + hooks here. */}
          <form onSubmit={(e) => e.preventDefault()}>
            {isSignup && <AuthInput label="Full name" type="text" placeholder="Ananya Krishnan" icon={UserIcon} />}
            <AuthInput  label="Email address" type="email" placeholder="you@example.com" icon={MailIcon} />
            <AuthInput label="Password" type="password" placeholder={isSignup ? 'At least 8 characters' : '••••••••'} icon={LockIcon} />

            {/* Remember / Forgot  OR  Terms */}
            {!isSignup ? (
              <div className="mb-6 mt-1.5 flex items-center justify-between">
                <button type="button" onClick={() => setRemember((v) => !v)} className="flex items-center gap-2.25 text-[0.813rem] text-[#B7BECC] select-none">
                  <CheckBox checked={remember} />
                  Remember me
                </button>
                <a href="#" className="text-[0.813rem] font-medium text-[#C9A66B] hover:text-[#E7C68A]">
                  Forgot password?
                </a>
              </div>
            ) : (
              <button type="button" onClick={() => setTerms((v) => !v)} className="mb-6 mt-0.5 flex items-start gap-2.5 text-left text-[0.781rem] leading-1.5 text-[#B7BECC] select-none">
                <CheckBox checked={terms} />
                <span>
                  I agree to Alarion&apos;s <a href="#" className="font-medium text-[#C9A66B]">Terms of Service</a> and{' '}
                  <a href="#" className="font-medium text-[#C9A66B]">Privacy Policy</a>.
                </span>
              </button>
            )}

            {/* Submit */}
            <button type="submit" className='mb-5.5 flex w-full items-center justify-center gap-2.25 rounded-xl bg-linear-to-b from-[#E7C68A] to-[#C9A66B] py-3.75 text-[0.906rem] font-bold tracking-[0.01em] text-[#1a1206] shadow-[0_14px_34px_-12px_rgba(201,166,107,0.6),0_0_0_1px_rgba(255,255,255,0.15)_inset] transition hover:-translate-y-px active:translate-y-0'>
              {isSignup ? 'Create Account' : 'Sign In'}
              {ArrowIcon}
            </button>

            {/* Divider */}
            <div className="mb-5.5 flex items-center gap-3.5 text-[0.719rem] uppercase tracking-[0.14em] text-[#7A8295]">
              <span className="h-px flex-1 bg-white/8" />
              {isSignup ? 'or sign up with' : 'or continue with'}
              <span className="h-px flex-1 bg-white/8" />
            </div>

            {/* Socials */}
            <Socials />

            {/* Swap */}
            <div className="text-center text-[0.844rem] text-[#B7BECC]">
              {isSignup ? (
                <>
                  Already a member?{' '}
                  <button type="button" onClick={() => setTab('signin')} className="font-semibold text-[#C9A66B] hover:text-[#E7C68A]">
                    Sign in instead
                  </button>
                </>
              ) : (
                <>
                  New to Alarion?{' '}
                  <button type="button" onClick={() => setTab('signup')} className="font-semibold text-[#C9A66B] hover:text-[#E7C68A]">
                    Create an account
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
