import Link from 'next/link';
import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

/**
 * Button — the one shared button for the whole app.
 * Variants: primary (gold gradient) · outline · link · chip (filter toggle).
 * Polymorphic: pass `href` to render a Next <Link>, otherwise a <button>.
 *
 *   <Button variant="primary">Search</Button>
 *   <Button variant="outline" size="sm" href="/property">Explore</Button>
 *   <Button variant="chip" active>All Regions</Button>
 */

type Variant = 'primary' | 'outline' | 'link' | 'chip';
type Size = 'sm' | 'md' | 'lg';

type BaseProps = {
  variant?: Variant;
  size?: Size;
  active?: boolean; // chip active state
  className?: string;
  children: ReactNode;
};

type ButtonProps = BaseProps & { href?: string } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>;

const BASE =
  'inline-flex items-center justify-center gap-2 transition disabled:pointer-events-none disabled:opacity-50';

const VARIANT: Record<Exclude<Variant, 'chip'>, string> = {
  primary:
    'rounded-full bg-linear-to-b from-[#E7C68A] to-[#C9A66B] font-bold tracking-[0.01em] text-[#1a1206] shadow-[0_12px_30px_-10px_rgba(201,166,107,0.6),0_0_0_1px_rgba(255,255,255,0.15)_inset] hover:-translate-y-px',
  outline:
    'rounded-full border border-white/14 bg-white/6 font-semibold tracking-[0.02em] text-[#F8FAFC] hover:border-[#C9A66B] hover:bg-[#C9A66B] hover:text-[#0B1120]',
  link: 'border-b border-white/14 pb-1.5 font-medium tracking-[0.04em] text-[#F8FAFC] hover:border-[#C9A66B] hover:text-[#C9A66B]',
};

const SIZE: Record<Size, string> = {
  sm: 'px-4 py-2.75 text-[0.781rem]',
  md: 'px-5 py-2.75 text-[0.844rem]',
  lg: 'px-6.5 py-3.5 text-[0.906rem]',
};

function chipClasses(active: boolean) {
  return `rounded-full border px-5 py-2.75 text-[0.844rem] font-medium tracking-[0.01em] ${
    active
      ? 'border-[#C9A66B] bg-[#C9A66B] font-semibold text-[#1a1206]'
      : 'border-white/14 bg-white/4 text-[#B7BECC] hover:border-[#C9A66B] hover:text-[#F8FAFC]'
  }`;
}

function buildClasses(variant: Variant, size: Size, active: boolean, className?: string) {
  const variantCls = variant === 'chip' ? chipClasses(active) : VARIANT[variant];
  // chip + link carry their own padding/sizing, so the size scale is skipped for them.
  const sizeCls = variant === 'chip' || variant === 'link' ? '' : SIZE[size];
  return [BASE, variantCls, sizeCls, className].filter(Boolean).join(' ');
}

export default function Button({
  variant = 'primary',
  size = 'md',
  active = false,
  className,
  children,
  href,
  ...rest
}: ButtonProps) {
  const classes = buildClasses(variant, size, active, className);

  if (href !== undefined) {
    return (
      <Link href={href} className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
