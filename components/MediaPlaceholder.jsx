// Stand-in for a real photo or video. Replace usages of this component with
// <img> / next/image or <video> once you have real assets — see README.md.
export default function MediaPlaceholder({
  label,
  tone = 1,
  className = "",
  ratio = "aspect-[4/5]",
}) {
  const tones = [
    "from-[#2b2a26] via-[#8b7355] to-[#f6f1e9]",
    "from-[#1c1b19] via-[#6b6455] to-[#e8e2d4]",
    "from-[#3a3630] via-[#a9967a] to-[#f6f1e9]",
    "from-[#22201c] via-[#8a8073] to-[#ded4bd]",
  ];
  return (
    <div
      className={`relative overflow-hidden bg-charcoal ${ratio} ${className}`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${tones[tone % tones.length]}`}
      />
      <div className="absolute inset-0 bg-black/10" />
      {label && (
        <span className="absolute bottom-3 left-4 text-[11px] tracking-wide text-ivory/80 font-sans">
          {label}
        </span>
      )}
    </div>
  );
}
