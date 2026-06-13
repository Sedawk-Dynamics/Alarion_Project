import AlarionFilmCard from '../ui/Cards/AlarionFilmCard';

/**
 * AlarionFilm — the "The Alarion Film" video section (`.video-sec`).
 * Section header + the video frame card.
 */

export default function AlarionFilm() {
  return (
    <section id="film" className="bg-[#0E1426] py-30">
      <div className="mx-auto w-[min(1280px,calc(100%-3.5rem))]">
        {/* Section head */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-10">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[0.688rem] font-medium uppercase tracking-[0.22em] text-[#C9A66B]">
              <span className="h-px w-5.5 bg-[#C9A66B] opacity-70" />
              The Alarion Film
            </div>
            <h2 className="mt-3.5 max-w-180 font-serif text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-[-0.005em] text-[#F8FAFC]">
              Step inside the <em className="italic text-[#E7C68A]">stay.</em>
            </h2>
          </div>
          <p className="max-w-100 text-[0.938rem] leading-[1.55] text-[#B7BECC]">
            A two-minute journey through the palaces, backwaters and quiet mornings that define an
            Alarion escape.
          </p>
        </div>

        {/* Video frame */}
        <AlarionFilmCard
          poster="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80&auto=format&fit=crop"
          sources={[
            'https://assets.mixkit.co/videos/43607/43607-720.mp4',
            'https://assets.mixkit.co/videos/43607/43607-360.mp4',
          ]}
          title="Where every stay tells a story"
          description="From the lake palaces of Udaipur to Kerala's still backwaters — a glimpse of where Alarion can take you."
        />
      </div>
    </section>
  );
}
