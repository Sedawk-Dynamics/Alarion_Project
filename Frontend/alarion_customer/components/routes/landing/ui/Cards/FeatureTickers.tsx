import { type ReactNode } from 'react';

/**
 * FeatureTickers — the floating feature marquee in the hero (mirrors `.feat-ticker`).
 * Scrolls right → left forever; pauses on hover. The track is rendered twice so the
 * -50% translate loops seamlessly. UI only (Server Component).
 */

export type TickerItem = {
  icon: ReactNode; // an <svg>… element
  bold: string; // emphasised part, e.g. "Free cancellation"
  text: string; // remainder, e.g. "up to 48 hrs"
};

function Item({ item }: { item: TickerItem }) {
  return (
    <div className="inline-flex items-center gap-3 whitespace-nowrap px-9.5 text-sm font-medium tracking-[0.02em] text-[#B7BECC]">
      <span className="grid h-7.5 w-7.5 shrink-0 place-items-center rounded-[9px] border border-[#C9A66B]/26 bg-linear-to-b from-[#C9A66B]/16 to-[#C9A66B]/5 text-[#E7C68A] [&>svg]:h-3.75 [&>svg]:w-3.75">
        {item.icon}
      </span>
      <span>
        <b className="font-semibold text-[#F8FAFC]">{item.bold}</b> {item.text}
      </span>
    </div>
  );
}

const Separator = () => <span className="h-1.25 w-1.25 shrink-0 rounded-full bg-[#C9A66B] opacity-50" />;

export default function FeatureTickers({ items }: { items: TickerItem[] }) {
  return (
    <div className="group relative overflow-hidden border-y border-white/8 py-4.5 mask-[linear-gradient(90deg,transparent_0,#000_8%,#000_92%,transparent_100%)]">
      <div className="flex w-max items-center animate-feat-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {/* Rendered twice for a seamless -50% loop */}
        {[0, 1].map((dup) =>
          items.map((item, i) => (
            <span key={`${dup}-${i}`} className="inline-flex items-center">
              <Item item={item} />
              <Separator />
            </span>
          )),
        )}
      </div>
    </div>
  );
}
