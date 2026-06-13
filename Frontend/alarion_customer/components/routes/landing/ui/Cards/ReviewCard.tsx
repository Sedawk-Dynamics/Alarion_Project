/**
 * ReviewCard — reusable guest-story / testimonial card (mirrors the landing `.quote-card`).
 * UI only (Server Component).
 */

export type Review = {
  description: string;
  userName: string;
  city: string; // e.g. "UDAIPUR"
  stays: string; // e.g. "2 STAYS"
  image: string; // avatar
  stars: number; // out of 5
};

export default function ReviewCard({ description, userName, city, stays, image, stars }: Review) {
  return (
    <div className="flex flex-col transition duration-300 hover:-translate-y-1.5 hover:border-[#C9A66B]/30 hover:bg-[#111827]duration-200  rounded-[22px] border border-white/14 bg-[#F8FAFC]/4 px-7.5 py-8 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-[14px]">
      {/* Stars */}
      <div className="mb-4.5 flex gap-0.75 text-[#C9A66B]">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} viewBox="0 0 24 24" className={`h-3.5 w-3.5 ${i < Math.round(stars) ? 'fill-current' : 'fill-white/15'}`}>
            <path d="M12 .587l3.668 7.568L24 9.423l-6 5.85L19.336 24 12 19.897 4.664 24 6 15.273 0 9.423l8.332-1.268z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p className="mb-7 text-[1.0625rem] leading-[1.62] tracking-[0.002em] text-[#F8FAFC]">
        {description}
      </p>

      {/* Footer: avatar + name + meta */}
      <div className="mt-auto flex items-center gap-3.5">
        <div
          className="h-11 w-11 rounded-full border border-white/14 bg-cover bg-center"
          style={{ backgroundImage: `url('${image}')` }}
        />
        <div>
          <div className="text-sm font-semibold text-[#F8FAFC]">{userName}</div>
          <div className="mt-0.5 text-[0.719rem] tracking-[0.06em] text-[#7A8295]">
            {city} · {stays}
          </div>
        </div>
      </div>
    </div>
  );
}
