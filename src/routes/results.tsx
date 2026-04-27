import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScoreMeter } from "@/components/score-meter";
import { loadResult, saveResult, type AnalysisResult, type Severity } from "@/lib/analysis";
import {
  AlertTriangle, Download, RefreshCw, ShieldCheck, ShieldAlert, ShieldX,
  Sparkles, CheckCircle2, FileText, ArrowRight,
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

  useEffect(() => {
    const r = loadResult();
    if (r) {
      setResult(r);
    } else {
      setResult(SAMPLE);
      setUsingSample(true);
      saveResult(SAMPLE);
    }
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

  if (!result || !compliance) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading report…</div>
      </div>
    );
  }

  const exportPDF = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-24 print:pt-4">
        {usingSample && (
          <div className="mb-6 glass rounded-xl px-4 py-3 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Showing a sample report. <Link to="/scan" className="underline">Run your own scan →</Link></span>
          </div>
        )}

        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary mb-2">Audit Report</div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold">Dark Pattern Analysis</h1>
            <div className="text-sm text-muted-foreground mt-1.5 font-mono break-all">
              Source: {result.source.value} · {new Date(result.scannedAt).toLocaleString()}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <button
              onClick={() => navigate({ to: "/scan" })}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium glass hover:bg-white/10"
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
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="glass-strong rounded-3xl p-8 flex flex-col items-center justify-center text-center">
            <ScoreMeter score={result.riskScore} label="Risk Score" variant="risk" />
            <div className="text-sm text-muted-foreground mt-4">Higher means more dark patterns detected</div>
          </div>
          <div className="glass-strong rounded-3xl p-8 flex flex-col items-center justify-center text-center">
            <ScoreMeter score={result.trustScore} label="Trust Score" variant="trust" />
            <div className="text-sm text-muted-foreground mt-4">Higher means a more trustworthy interface</div>
          </div>
          <div className="glass-strong rounded-3xl p-8 flex flex-col justify-between"
               style={{ borderLeft: `3px solid ${compliance.color}` }}>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Compliance status</div>
              <div className="flex items-center gap-3 mt-3">
                <compliance.Icon className="w-8 h-8" style={{ color: compliance.color }} />
                <div>
                  <div className="text-3xl font-display font-bold" style={{ color: compliance.color }}>
                    {compliance.label}
                  </div>
                  <div className="text-xs text-muted-foreground">{compliance.sub}</div>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed">{result.summary}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-border/40">
              <Stat label="Violations" value={result.violations.length} />
              <Stat label="Critical" value={result.violations.filter((v) => v.severity === "critical").length} accent />
              <Stat label="Fixes" value={result.recommendations.length} />
            </div>
          </div>
        </div>

        {/* Violations */}
        <div className="mt-12">
          <SectionHead title="Violations detected" sub="Each finding includes evidence, harm explanation, and an actionable fix." />
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {result.violations.map((v, i) => (
              <ViolationCard key={i} v={v} index={i + 1} />
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-16 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-strong rounded-3xl p-8">
            <SectionHead title="UX fix recommendations" sub="High-leverage improvements to ship next sprint." compact />
            <ul className="mt-6 space-y-3">
              {result.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-3 glass rounded-xl px-4 py-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                       style={{ background: "var(--gradient-primary)" }}>
                    {i + 1}
                  </div>
                  <span className="text-sm leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-strong rounded-3xl p-8 flex flex-col">
            <SectionHead title="Privacy assured" sub="Your data, your control." compact />
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Scan processed in-memory</li>
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

        <div className="mt-10 text-center text-xs text-muted-foreground inline-flex items-center justify-center w-full gap-2">
          <FileText className="w-3.5 h-3.5" />
          Report ID: <span className="font-mono">FUX-{Math.abs(hashCode(result.scannedAt)).toString(36).toUpperCase().slice(0, 8)}</span>
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
    <div className="glass rounded-2xl p-5 hover-lift relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: severity.color }} />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg glass flex items-center justify-center text-xs font-mono font-bold">
            {String(index).padStart(2, "0")}
          </div>
          <h3 className="font-display font-semibold text-base">{v.pattern}</h3>
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
    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md whitespace-nowrap"
          style={{
            background: `color-mix(in oklab, ${s.color} 15%, transparent)`,
            color: s.color,
            border: `1px solid ${s.color}`,
          }}>
      {s.label}
    </span>
  );
}

function SectionHead({ title, sub, compact }: { title: string; sub: string; compact?: boolean }) {
  return (
    <div>
      <h2 className={`${compact ? "text-xl" : "text-2xl sm:text-3xl"} font-display font-bold`}>{title}</h2>
      <p className="text-sm text-muted-foreground mt-1.5">{sub}</p>
    </div>
  );
}
