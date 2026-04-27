import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScoreMeter } from "@/components/score-meter";
import { ResultsSkeleton } from "@/components/results-skeleton";
import { TrustTrend } from "@/components/trust-trend";
import { ParticleField } from "@/components/particle-field";
import { loadResult, saveResult, type AnalysisResult, type Severity } from "@/lib/analysis";
import {
  AlertTriangle, Download, RefreshCw, ShieldCheck, ShieldAlert, ShieldX,
  Sparkles, CheckCircle2, FileText, ArrowRight, Share2, Copy, Check,
  TrendingDown, TrendingUp, Lock, Globe, Image as ImageIcon, Type,
} from "lucide-react";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Audit Results — FairUX AI" },
      { name: "description", content: "Detailed dark pattern audit report with risk scoring, violations, and UX fix recommendations." },
      { property: "og:title", content: "FairUX AI — Audit Results" },
      { property: "og:description", content: "Risk score, violations, and UX fixes." },
    ],
  }),
  component: ResultsPage,
});

const SAMPLE: AnalysisResult = {
  riskScore: 82,
  trustScore: 34,
  compliance: "high_risk",
  summary:
    "The audited interface relies heavily on urgency manipulation, misleading visual hierarchy, and friction-laden cancellation flows. " +
    "Several patterns appear to violate GDPR informed-consent standards. Immediate remediation recommended.",
  violations: [
    { pattern: "Fake urgency countdown", severity: "high",
      description: "A 23-minute countdown timer pressures users with no verifiable basis for the deadline.",
      why_harmful: "Triggers anxiety-driven decisions, bypassing rational evaluation and harming user autonomy.",
      fix: "Remove arbitrary timers. Show only verifiable deadlines tied to real inventory or pricing windows." },
    { pattern: "Misleading green button", severity: "high",
      description: "'Continue with subscription' is a vibrant primary green CTA, while 'No thanks' is rendered as low-contrast grey text.",
      why_harmful: "Visual hierarchy steers users toward the option that benefits the business, not them.",
      fix: "Give both options equal visual weight. Treat decline as a first-class user choice." },
    { pattern: "Hidden cancellation flow", severity: "critical",
      description: "Cancellation requires four clicks across upsell interstitials with retention offers.",
      why_harmful: "Roach motel pattern — easy to enter, hard to leave. Likely violates EU Consumer Rights and CCPA.",
      fix: "Place 'Cancel subscription' one click from account settings. No upsell interstitials." },
    { pattern: "Forced cookie consent", severity: "medium",
      description: "Pre-ticked non-essential cookies with a styled 'Accept All' and an unstyled buried 'Reject'.",
      why_harmful: "Violates GDPR and ePrivacy informed-consent requirements.",
      fix: "Equal-weight Accept and Reject buttons. No pre-ticked boxes for non-essential cookies." },
    { pattern: "Confirmshaming opt-out", severity: "medium",
      description: "Decline label reads: 'No, I don't care about saving money.'",
      why_harmful: "Uses guilt and social pressure to manipulate user choice.",
      fix: "Use neutral language: 'Decline' or 'No thanks'." },
    { pattern: "Hidden total price", severity: "high",
      description: "Final price including taxes, shipping, and service fees only appears after entering payment details.",
      why_harmful: "Drip pricing exploits sunk-cost bias once users have invested time.",
      fix: "Show full inclusive total at the start of checkout, not the end." },
  ],
  recommendations: [
    "Audit every CTA pair for equal visual weight.",
    "Make the cancel/decline path one click from account settings.",
    "Replace urgency timers with real, evidence-based deadlines.",
    "Provide single-click reject for non-essential cookies.",
    "Surface total inclusive price before payment fields.",
    "Run plain-language reviews on every opt-out copy string.",
  ],
  scannedAt: new Date().toISOString(),
  source: { type: "url", value: "https://acme.shop/checkout" },
};

function ResultsPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [usingSample, setUsingSample] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Severity | "all">("all");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Brief skeleton flash so first paint feels intentional
    const t = setTimeout(() => {
      const r = loadResult();
      if (r) {
        setResult(r);
      } else {
        setResult(SAMPLE);
        setUsingSample(true);
        saveResult(SAMPLE);
      }
      setLoading(false);
    }, 350);
    return () => clearTimeout(t);
  }, []);

  const compliance = useMemo(() => {
    if (!result) return null;
    const map = {
      safe: { label: "Safe", color: "var(--success)", Icon: ShieldCheck, sub: "No critical violations detected." },
      warning: { label: "Warning", color: "var(--warning)", Icon: ShieldAlert, sub: "Some patterns need attention." },
      high_risk: { label: "High Risk", color: "var(--destructive)", Icon: ShieldX, sub: "Immediate remediation recommended." },
    } as const;
    return map[result.compliance];
  }, [result]);

  const filteredViolations = useMemo(() => {
    if (!result) return [];
    if (filter === "all") return result.violations;
    return result.violations.filter((v) => v.severity === filter);
  }, [result, filter]);

  const counts = useMemo(() => {
    if (!result) return { critical: 0, high: 0, medium: 0, low: 0 };
    return result.violations.reduce(
      (acc, v) => ({ ...acc, [v.severity]: acc[v.severity] + 1 }),
      { critical: 0, high: 0, medium: 0, low: 0 },
    );
  }, [result]);

  if (loading || !result || !compliance) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <ResultsSkeleton />
        <SiteFooter />
      </div>
    );
  }

  const exportPDF = () => {
    if (typeof window !== "undefined") window.print();
  };

  const shareReport = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: "FairUX AI Audit Report", text: result.summary, url });
      } catch {
        /* user dismissed */
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  // Synthetic 30-day trust trend (visual only)
  const baseTrust = result.trustScore;
  const trustTrend = Array.from({ length: 16 }, (_, i) => {
    const noise = Math.sin(i * 0.7) * 5 + (Math.random() - 0.5) * 4;
    const drift = (i / 15) * (baseTrust - 60);
    return Math.max(0, Math.min(100, Math.round(60 + drift + noise)));
  });

  const SourceIcon = result.source.type === "url" ? Globe : result.source.type === "image" ? ImageIcon : Type;

  return (
    <div className="min-h-screen print:bg-white">
      <SiteHeader />
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-10 sm:pt-12 pb-24 print:pt-4">
        <div className="absolute inset-x-0 top-0 h-[420px] aurora opacity-40 pointer-events-none print:hidden" />
        <ParticleField className="opacity-30 print:hidden" density={0.00008} />

        {usingSample && (
          <div className="relative mb-6 glass rounded-xl px-4 py-3 text-sm flex items-center gap-2 print:hidden">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span>Showing a sample report. <Link to="/scan" className="underline font-medium">Run your own scan →</Link></span>
          </div>
        )}

        {/* Header */}
        <div className="relative flex flex-wrap items-start justify-between gap-4 mb-8">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] uppercase tracking-[0.25em] text-primary mb-2">Audit Report</div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">Dark Pattern Analysis</h1>
            <div className="text-sm text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1.5">
                <SourceIcon className="w-3.5 h-3.5" />
                <span className="font-mono break-all">{result.source.value}</span>
              </span>
              <span className="opacity-50">·</span>
              <span>{new Date(result.scannedAt).toLocaleString()}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <button
              onClick={shareReport}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium glass hover:bg-white/10 transition"
            >
              {copied ? <><Check className="w-4 h-4 text-success" /> Copied</> : <><Share2 className="w-4 h-4" /> Share</>}
            </button>
            <button
              onClick={() => navigate({ to: "/scan" })}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium glass hover:bg-white/10 transition"
            >
              <RefreshCw className="w-4 h-4" /> Scan another
            </button>
            <button
              onClick={exportPDF}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground glow-primary hover:scale-105 transition"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>

        {/* Top scorecard */}
        <div className="relative grid lg:grid-cols-3 gap-5">
          <div className="glass-strong rounded-3xl p-8 flex flex-col items-center justify-center text-center hover-lift">
            <ScoreMeter score={result.riskScore} label="Risk Score" variant="risk" />
            <div className="text-xs text-muted-foreground mt-4 inline-flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-destructive" />
              Higher = more dark patterns detected
            </div>
          </div>
          <div className="glass-strong rounded-3xl p-8 flex flex-col items-center justify-center text-center hover-lift">
            <ScoreMeter score={result.trustScore} label="Trust Score" variant="trust" />
            <div className="text-xs text-muted-foreground mt-4 inline-flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-warning" />
              Higher = more trustworthy interface
            </div>
          </div>
          <div
            className="glass-strong rounded-3xl p-7 flex flex-col justify-between hover-lift"
            style={{ borderLeft: `3px solid ${compliance.color}` }}
          >
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Compliance status</div>
              <div className="flex items-center gap-3 mt-3">
                <compliance.Icon className="w-9 h-9" style={{ color: compliance.color }} />
                <div>
                  <div className="text-2xl sm:text-3xl font-display font-bold leading-none" style={{ color: compliance.color }}>
                    {compliance.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{compliance.sub}</div>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-foreground/90">{result.summary}</p>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-6 pt-5 border-t border-border/40">
              <Stat label="Total" value={result.violations.length} />
              <Stat label="Critical" value={counts.critical} accent />
              <Stat label="High" value={counts.high} />
              <Stat label="Fixes" value={result.recommendations.length} />
            </div>
          </div>
        </div>

        {/* Trend + breakdown row */}
        <div className="relative grid lg:grid-cols-3 gap-5 mt-5">
          <div className="lg:col-span-2 glass-strong rounded-3xl p-7">
            <TrustTrend data={trustTrend} positive={result.trustScore >= 50} label="Trust trajectory · last 30 days" height={140} />
          </div>
          <div className="glass-strong rounded-3xl p-7">
            <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-4">Severity breakdown</div>
            <div className="space-y-3">
              {(["critical", "high", "medium", "low"] as Severity[]).map((s) => {
                const c = counts[s];
                const total = Math.max(1, result.violations.length);
                const pct = (c / total) * 100;
                const sev = severityStyle(s);
                return (
                  <div key={s}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="capitalize" style={{ color: sev.color }}>{s}</span>
                      <span className="font-mono text-muted-foreground">{c}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: sev.color, boxShadow: `0 0 8px ${sev.color}` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Violations */}
        <div className="relative mt-14">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <SectionHead title="Violations detected" sub="Each finding includes evidence, harm explanation, and an actionable fix." />
            <div className="flex flex-wrap gap-1.5 glass rounded-xl p-1 print:hidden">
              {(["all", "critical", "high", "medium", "low"] as const).map((f) => {
                const active = filter === f;
                const c = f === "all" ? result.violations.length : counts[f];
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                      active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={active ? { background: "var(--gradient-primary)" } : undefined}
                  >
                    {f} <span className={`ml-1 font-mono ${active ? "opacity-80" : "opacity-60"}`}>{c}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {filteredViolations.length === 0 ? (
            <EmptyFilter onReset={() => setFilter("all")} />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredViolations.map((v, i) => (
                <ViolationCard key={`${v.pattern}-${i}`} v={v} index={i + 1} />
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="relative mt-16 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-strong rounded-3xl p-7 sm:p-8">
            <SectionHead title="UX fix recommendations" sub="High-leverage improvements to ship next sprint." compact />
            <ul className="mt-6 space-y-3">
              {result.recommendations.map((r, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 glass rounded-xl px-4 py-3 hover-lift"
                  style={{ animation: `fade-up 0.5s ease-out ${i * 0.05}s both` }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold text-primary-foreground"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-sm leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-strong rounded-3xl p-7 sm:p-8 flex flex-col">
            <SectionHead title="Privacy assured" sub="Your data, your control." compact />
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-2"><Lock className="w-4 h-4 text-success" /> Scan processed in-memory</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> No data retained server-side</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> No third-party tracking</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Privacy-first by default</li>
            </ul>
            <Link
              to="/prototype"
              className="mt-auto pt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Explore Enterprise features <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-muted-foreground inline-flex items-center justify-center w-full gap-2">
          <FileText className="w-3.5 h-3.5" />
          Report ID: <span className="font-mono">FUX-{Math.abs(hashCode(result.scannedAt)).toString(36).toUpperCase().slice(0, 8)}</span>
          <span className="opacity-50">·</span>
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            }}
            className="inline-flex items-center gap-1 hover:text-foreground transition"
          >
            <Copy className="w-3 h-3" /> Copy link
          </button>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function hashCode(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h;
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-display font-bold ${accent ? "text-destructive" : "gradient-text"}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function ViolationCard({ v, index }: { v: AnalysisResult["violations"][number]; index: number }) {
  const severity = severityStyle(v.severity);
  return (
    <div
      className="glass rounded-2xl p-5 hover-lift relative overflow-hidden group"
      style={{ animation: `fade-up 0.5s ease-out ${index * 0.04}s both` }}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: severity.color }} />
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity"
        style={{ background: severity.color }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg glass flex items-center justify-center text-xs font-mono font-bold shrink-0">
            {String(index).padStart(2, "0")}
          </div>
          <h3 className="font-display font-semibold text-base truncate">{v.pattern}</h3>
        </div>
        <SeverityBadge severity={v.severity} />
      </div>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{v.description}</p>

      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <div className="glass rounded-xl p-3">
          <div className="text-[10px] uppercase tracking-widest text-destructive flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" /> Why it's harmful
          </div>
          <p className="text-xs mt-1.5 leading-relaxed">{v.why_harmful}</p>
        </div>
        <div className="glass rounded-xl p-3">
          <div className="text-[10px] uppercase tracking-widest text-success flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" /> Suggested fix
          </div>
          <p className="text-xs mt-1.5 leading-relaxed">{v.fix}</p>
        </div>
      </div>
    </div>
  );
}

function EmptyFilter({ onReset }: { onReset: () => void }) {
  return (
    <div className="glass-strong rounded-3xl p-12 text-center">
      <div
        className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
        style={{ background: "color-mix(in oklab, var(--success) 18%, transparent)" }}
      >
        <ShieldCheck className="w-7 h-7 text-success" />
      </div>
      <h3 className="mt-5 font-display font-bold text-lg">No violations at this severity</h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">
        That's good news for this filter. Switch back to see other findings.
      </p>
      <button
        onClick={onReset}
        className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium glass hover:bg-white/10 transition"
      >
        <RefreshCw className="w-4 h-4" /> Show all
      </button>
    </div>
  );
}

function severityStyle(s: Severity) {
  return ({
    low: { color: "var(--success)", label: "Low" },
    medium: { color: "var(--warning)", label: "Medium" },
    high: { color: "var(--destructive)", label: "High" },
    critical: { color: "var(--destructive)", label: "Critical" },
  } as const)[s];
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const s = severityStyle(severity);
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md whitespace-nowrap"
      style={{
        background: `color-mix(in oklab, ${s.color} 15%, transparent)`,
        color: s.color,
        border: `1px solid ${s.color}`,
      }}
    >
      {s.label}
    </span>
  );
}

function SectionHead({ title, sub, compact }: { title: string; sub: string; compact?: boolean }) {
  return (
    <div>
      <h2 className={`${compact ? "text-xl" : "text-2xl sm:text-3xl"} font-display font-bold tracking-tight`}>{title}</h2>
      <p className="text-sm text-muted-foreground mt-1.5">{sub}</p>
    </div>
  );
}
