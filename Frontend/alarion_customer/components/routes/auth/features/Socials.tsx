const SOC =
  'flex items-center justify-center gap-2.25 rounded-[11px] border border-white/14 bg-white/4 py-3 text-[0.844rem] font-semibold text-[#B7BECC] transition hover:border-white/14 hover:bg-white/8 hover:text-[#F8FAFC] [&>svg]:h-[17px] [&>svg]:w-[17px]';

export const  Socials=()=> {
  return (
    <div className="mb-7 grid grid-cols-2 gap-3">
      <button type="button" className={SOC}>
        <svg viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-.97 2.6-2.06 3.4l3.3 2.6c1.93-1.8 3.04-4.4 3.04-7.5 0-.7-.06-1.4-.18-2z" />
          <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.4l-3.3-2.6c-.9.6-2.05.96-3.32.96-2.55 0-4.7-1.7-5.48-4.05l-3.4 2.6C4.46 19.9 7.95 22 12 22z" />
          <path fill="#4285F4" d="M6.52 13.9A6 6 0 016.2 12c0-.66.11-1.3.31-1.9l-3.4-2.6A10 10 0 002 12c0 1.6.38 3.1 1.06 4.5z" />
          <path fill="#FBBC05" d="M12 6c1.47 0 2.78.5 3.82 1.5l2.86-2.86C16.96 2.99 14.7 2 12 2 7.95 2 4.46 4.1 3.11 7.5l3.4 2.6C7.3 7.75 9.45 6 12 6z" />
        </svg>
        Google
      </button>
      <button type="button" className={SOC}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.36 1.43c.04 1.06-.36 2.1-1.04 2.86-.71.8-1.86 1.42-2.98 1.33-.06-1.04.4-2.12 1.05-2.84.72-.8 1.97-1.4 2.97-1.35zM20.5 17.1c-.55 1.27-.81 1.83-1.52 2.95-.99 1.56-2.39 3.5-4.12 3.51-1.54.02-1.93-1-4.02-.99-2.08.01-2.52.99-4.06.97-1.73-.01-3.05-1.76-4.04-3.32-2.77-4.34-3.06-9.43-1.35-12.14 1.21-1.93 3.13-3.06 4.93-3.06 1.84 0 3 1 4.52 1 1.48 0 2.38-1 4.5-1 1.61 0 3.31.88 4.53 2.39-3.98 2.18-3.33 7.87.15 9.69z" />
        </svg>
        Apple
      </button>
    </div>
  );
}