/**
 * AlarionFilmCard — the video frame (mirrors the landing `.video-frame`).
 * A 16:9 <video> with a poster overlay (play button + caption).
 * UI only — the play button is visual; play/hide logic is wired later.
 */

type AlarionFilmCardProps = {
  poster: string;
  sources: string[]; // mp4 sources, highest quality first
  title: string;
  description: string;
};

export default function AlarionFilmCard({ poster, sources, title, description }: AlarionFilmCardProps) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-[26px] border border-white/14 bg-[#05080f] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6),0_8px_24px_rgba(0,0,0,0.35)]">
      {/* The video */}
      <video playsInline preload="none" poster={poster} className="h-full w-full object-cover">
        {sources.map((src) => (
          <source key={src} src={src} type="video/mp4" />
        ))}
      </video>

      {/* Poster overlay (play button + caption) */}
      <div
        className="group absolute inset-0 z-2 grid cursor-pointer place-items-center bg-cover bg-center"
        style={{ backgroundImage: `url('${poster}')` }}
      >
        {/* darkening gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-[#0B1120]/25 to-[#0B1120]/72" />

        {/* Play button */}
        <button
          type="button"
          aria-label="Play film"
          className="relative z-3 grid h-21.5 w-21.5 place-items-center rounded-full border border-white/14 bg-[#F8FAFC]/14 backdrop-blur-[10px] transition duration-300 group-hover:scale-[1.08] group-hover:bg-[#E7C68A]/90"
        >
          <svg viewBox="0 0 24 24" className="ml-1.25 h-7.5 w-7.5 text-white transition-colors group-hover:text-[#1a1206]" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>

        {/* Caption */}
        <div className="pointer-events-none absolute bottom-9 left-10 right-10 z-3">
          <div className="font-serif text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.06] text-[#F8FAFC]">
            {title}
          </div>
          <div className="mt-2 max-w-130 text-[0.906rem] leading-[1.55] text-[#B7BECC]">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}
