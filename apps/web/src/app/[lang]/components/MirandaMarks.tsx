export function NewBadge() {
  return (
    <span className="inline-flex shrink-0 items-center rounded-tags bg-ember-orange px-1.5 py-[3px] font-editorial-new text-[12px] font-light leading-none tracking-[-0.01em] text-parchment">
      NEW
    </span>
  );
}

export function InkBanner({ word, prominent = false }: { word: string; prominent?: boolean }) {
  return (
    <div aria-hidden="true" className="bg-ink-black text-parchment">
      <p
        className={`px-3 text-center font-canopee font-bold leading-[0.92] tracking-[-0.06em] select-none ${
          prominent
            ? "py-6 text-[clamp(6rem,22vw,18rem)]"
            : "py-6 text-[clamp(4.75rem,15.5vw,14rem)]"
        }`}
      >
        {word}
      </p>
    </div>
  );
}

export function PressStamp() {
  return (
    <aside
      aria-hidden="true"
      className="w-[196px] rounded-cards border border-dashed border-ink-black bg-parchment px-4 py-4"
    >
      <svg viewBox="0 0 64 64" className="mx-auto h-14 w-14 text-ember-orange">
        <circle cx="32" cy="32" r="5.5" fill="currentColor" />
        {Array.from({ length: 12 }).map((_, index) => (
          <line
            key={index}
            x1="32"
            y1="14"
            x2="32"
            y2="4"
            stroke="currentColor"
            strokeWidth="2"
            transform={`rotate(${index * 30} 32 32)`}
          />
        ))}
      </svg>
      <p className="mt-2 text-center font-germgoth text-[34px] leading-none tracking-[-0.004em] text-ink-black">
        JCM
      </p>
      <div className="mt-3 space-y-1 border-t border-ink-black pt-2 font-editorial-new text-[11px] font-light leading-[1.35] tracking-[-0.01em] text-ink-black">
        <p className="flex gap-2">
          <span className="text-charcoal">NAME</span>
          <span>Johan Castellanos</span>
        </p>
        <p className="flex gap-2">
          <span className="text-charcoal">PRESS</span>
          <span>Christian Memos</span>
        </p>
      </div>
    </aside>
  );
}
