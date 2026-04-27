/**
 * Animated SVG trust/risk trend sparkline — premium dashboard feel.
 * Renders an area-filled gradient line chart with a moving glow tip.
 */
export function TrustTrend({
  data,
  height = 120,
  positive = true,
  label = "Trust trend (30d)",
}: {
  data: number[];
  height?: number;
  positive?: boolean;
  label?: string;
}) {
  const w = 600;
  const h = height;
  const pad = 6;
  const max = Math.max(...data, 100);
  const min = Math.min(...data, 0);
  const range = Math.max(1, max - min);
  const stepX = (w - pad * 2) / (data.length - 1);

  const pts = data.map((v, i) => {
    const x = pad + i * stepX;
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return [x, y] as const;
  });

  const path = pts
    .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
    .join(" ");
  const area = `${path} L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z`;

  const stroke = positive ? "var(--success)" : "var(--destructive)";
  const lastX = pts[pts.length - 1][0];
  const lastY = pts[pts.length - 1][1];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="text-xs font-mono text-muted-foreground">
          {data[0]} → <span className="text-foreground font-semibold">{data[data.length - 1]}</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`tt-fill-${positive}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`tt-stroke-${positive}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.7 0.22 245)" />
            <stop offset="100%" stopColor={stroke} />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#tt-fill-${positive})`} />
        <path
          d={path}
          fill="none"
          stroke={`url(#tt-stroke-${positive})`}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: `drop-shadow(0 0 6px ${stroke})`,
            strokeDasharray: 2000,
            strokeDashoffset: 2000,
            animation: "trend-draw 1.6s ease-out 0.1s forwards",
          }}
        />
        <circle cx={lastX} cy={lastY} r="4" fill={stroke}>
          <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={lastX} cy={lastY} r="3" fill="white" />
      </svg>
      <style>{`@keyframes trend-draw { to { stroke-dashoffset: 0; } }`}</style>
    </div>
  );
}
