import { useEffect, useState } from "react";

interface Props {
  score: number;          // 0-100
  label: string;
  size?: number;
  variant?: "risk" | "trust";
}

export function ScoreMeter({ score, label, size = 220, variant = "risk" }: Props) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(score * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const radius = size / 2 - 14;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (val / 100) * circ;

  const color =
    variant === "trust"
      ? val >= 70 ? "var(--success)" : val >= 40 ? "var(--warning)" : "var(--destructive)"
      : val >= 70 ? "var(--destructive)" : val >= 40 ? "var(--warning)" : "var(--success)";

  return (
    <div className="relative inline-flex flex-col items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`g-${label}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="oklch(0.62 0.25 290)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="oklch(0.3 0.04 270 / 50%)"
          strokeWidth={12}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#g-${label})`}
          strokeWidth={12}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.1s linear", filter: `drop-shadow(0 0 12px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-display font-bold" style={{ color }}>{val}</div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  );
}
