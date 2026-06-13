'use client';

import { forwardRef } from 'react';

/**
 * Input — the one dynamic field for the List-Your-Hotel form (mirrors `.field`).
 * Renders an <input> by default, or a <select> when `options` is passed.
 *
 * RHF/Zod-ready: forwards its ref and spreads native props, so later:
 *   <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
 *   <Input label="Type" options={TYPES} {...register('type')} error={errors.type?.message} />
 */

export type Option = { label: string; value?: string };

type InputProps = {
  label?: string;
  error?: string;
  options?: Option[]; // when present → renders a <select>
} & React.InputHTMLAttributes<HTMLInputElement>;

const FIELD =
  'w-full rounded-[11px] border bg-[#0B1120]/40 px-3.5 py-3 text-sm text-[#F8FAFC] outline-none transition-colors placeholder:text-[#7A8295] focus:border-[#C9A66B] focus:bg-[#0B1120]/60';
const LABEL = 'mb-1.75 block text-[0.656rem] font-semibold uppercase tracking-[0.14em] text-[#7A8295]';

const Input = forwardRef<HTMLInputElement | HTMLSelectElement, InputProps>(function Input(
  { label, error, options, ...rest },
  ref,
) {
  const border = error ? 'border-[#e2725b]' : 'border-white/14';

  return (
    <div>
      {label && <label className={LABEL}>{label}</label>}

      {options ? (
        <div className="relative">
          <select
            ref={ref as React.Ref<HTMLSelectElement>}
            aria-invalid={!!error}
            className={`${FIELD} ${border} cursor-pointer appearance-none pr-9`}
            {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            {options.map((o) => (
              <option key={o.label} value={o.value ?? o.label}>
                {o.label}
              </option>
            ))}
          </select>
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8295]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      ) : (
        <input ref={ref as React.Ref<HTMLInputElement>} aria-invalid={!!error} className={`${FIELD} ${border}`} {...rest} />
      )}

      {error && <div className="mt-1.25 text-[0.688rem] text-[#e2725b]">{error}</div>}
    </div>
  );
});

export default Input;
