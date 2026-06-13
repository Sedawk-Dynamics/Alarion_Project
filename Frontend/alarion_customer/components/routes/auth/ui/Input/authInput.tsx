'use client';

import { forwardRef, useState, type ReactNode } from 'react';

type AuthInputProps = {
  label?: string;
  icon?: ReactNode; // lead <svg> shown on the left
  error?: string; // validation message (e.g. from RHF/Zod)
} & React.InputHTMLAttributes<HTMLInputElement>;

const EyeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <path d="M1 1l22 22" />
  </svg>
);

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(function AuthInput(
  { label, icon, error, type = 'text', ...rest },
  ref,
) {
  const isPassword = type === 'password';
  const [show, setShow] = useState(false);
  const inputType = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div className="mb-4">
      {label && (
        <label className="mb-2 block text-[0.688rem] font-semibold uppercase tracking-[0.16em] text-[#7A8295]">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <span className="pointer-events-none absolute left-3.75 grid h-4 w-4 place-items-center text-[#7A8295] [&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          type={inputType}
          aria-invalid={!!error}
          className={`w-full rounded-xl border bg-white/4 py-3.5 pl-11 ${
            isPassword ? 'pr-12' : 'pr-3.75'
          } text-[0.906rem] text-[#F8FAFC] outline-none transition-colors placeholder:text-[#7A8295] focus:border-[#C9A66B] focus:bg-white/6 ${
            error ? 'border-[#e2725b]' : 'border-white/14'
          }`}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-3 grid h-7.5 w-7.5 place-items-center rounded-lg text-[#7A8295] transition-colors hover:text-[#B7BECC] [&>svg]:h-4.25 [&>svg]:w-4.25"
          >
            {show ? EyeOffIcon : EyeIcon}
          </button>
        )}
      </div>

      {error && <div className="mt-1.5 text-[0.719rem] text-[#e2725b]">{error}</div>}
    </div>
  );
});

export default AuthInput;
