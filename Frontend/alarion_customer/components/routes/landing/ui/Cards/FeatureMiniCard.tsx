/**
 * FeatureMiniCard — the floating mini hotel card in the hero (mirrors `.mini-card`).
 * Thumb + title + rating/location + price. UI only (Server Component).
 */

export type MiniHotel = {
  image: string;
  title: string;
  rating: number;
  location: string;
  price: string; // e.g. "₹62k"
};

export default function FeatureMiniCard({ image, title, rating, location, price }: MiniHotel) {
  return (
    <div className="flex items-center gap-3.5 rounded-[18px] border border-white/8 bg-[#F8FAFC]/4 p-4.5 backdrop-blur-[12px]">
      {/* Thumb */}
      <div
        className="h-15.5 w-15.5 shrink-0 rounded-xl bg-cover bg-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
        style={{ backgroundImage: `url('${image}')` }}
      />

      {/* Title + rating */}
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold tracking-[0.005em] text-[#F8FAFC]">{title}</div>
        <div className="mt-[3px] flex items-center gap-1.5 text-xs text-[#7A8295]">
          <svg viewBox="0 0 24 24" className="h-[11px] w-[11px] fill-[#C9A66B]">
            <path d="M12 .587l3.668 7.568L24 9.423l-6 5.85L19.336 24 12 19.897 4.664 24 6 15.273 0 9.423l8.332-1.268z" />
          </svg>
          {rating} · {location}
        </div>
      </div>

      {/* Price */}
      <div className="ml-auto text-right">
        <div className="font-serif text-[1.375rem] leading-none text-[#E7C68A]">{price}</div>
        <div className="mt-1 text-[0.625rem] uppercase tracking-[0.12em] text-[#7A8295]">/ night</div>
      </div>
    </div>
  );
}
