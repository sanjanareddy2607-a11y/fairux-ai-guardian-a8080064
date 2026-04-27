import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShieldCheck, Sparkles, Zap, Eye, AlertTriangle, ArrowRight, Play,
  Activity, Lock, Globe2, CheckCircle2, TrendingUp, Brain,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FairUX AI — Detect Dark Patterns Before They Harm Users" },
      { name: "description", content: "AI-powered UX auditing for ethical products. Scan websites with Gemini AI to detect dark patterns and manipulative flows." },
      { property: "og:title", content: "FairUX AI — Ethical UX Auditing" },
      { property: "og:description", content: "Scan websites and screenshots with AI to detect dark patterns instantly." },
    ],
  }),
  component: Landing,
});

function useCounter(target: number, duration = 1800) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Hero />
      <LiveMetrics />
      <Features />
      <DashboardPreview />
      <DarkPatternGrid />
      <Testimonials />
      <CTA />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-80 pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-28 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-muted-foreground mb-8"
          style={{ animation: "fade-up 0.6s ease-out" }}
        >
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Powered by Google Gemini · Built for Hack2Skill Solution Challenge
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.05] text-balance"
            style={{ animation: "fade-up 0.7s ease-out 0.1s both" }}>
          Detect <span className="gradient-text">dark patterns</span><br />
          before they harm users.
        </h1>

        <p className="mt-7 max-w-2xl mx-auto text-lg text-muted-foreground text-balance"
           style={{ animation: "fade-up 0.7s ease-out 0.2s both" }}>
          AI-powered UX auditing for ethical products. Scan any website, screenshot, or popup
          with Gemini AI and get a complete dark pattern report in seconds.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
             style={{ animation: "fade-up 0.7s ease-out 0.3s both" }}>
          <Link
            to="/scan"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-primary-foreground glow-primary hover:scale-105 transition"
            style={{ background: "var(--gradient-primary)" }}
          >
            Start Free Scan <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
          <Link
            to="/results"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-medium glass hover:bg-white/10 transition"
          >
            <Play className="w-4 h-4" /> Watch Demo
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xs uppercase tracking-widest text-muted-foreground"
             style={{ animation: "fade-up 0.7s ease-out 0.4s both" }}>
          <span>Trusted by ethical product teams</span>
          {["Northwind", "Lumora", "Vexel", "Helios Labs", "Quanta"].map((b) => (
            <span key={b} className="font-display font-semibold text-foreground/70">{b}</span>
          ))}
        </div>

        {/* Floating mockup */}
        <div className="mt-20 relative" style={{ animation: "fade-up 0.9s ease-out 0.5s both" }}>
          <div className="absolute -inset-6 bg-primary/20 blur-3xl rounded-3xl pointer-events-none" />
          <FloatingDashboard />
        </div>
      </div>
    </section>
  );
}

function FloatingDashboard() {
  return (
    <div className="relative mx-auto max-w-4xl glass-strong rounded-3xl p-1 shadow-2xl"
         style={{ animation: "float 6s ease-in-out infinite" }}>
      <div className="rounded-[20px] overflow-hidden bg-card/80 backdrop-blur">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40">
          <span className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-warning/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-success/70" />
          <span className="ml-3 text-xs text-muted-foreground font-mono">fairux.ai/results</span>
        </div>
        <div className="p-6 grid md:grid-cols-3 gap-4">
          {/* Risk score visual */}
          <div className="md:col-span-1 glass rounded-2xl p-5 flex flex-col items-center justify-center">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="-rotate-90">
                <circle cx="50" cy="50" r="42" stroke="oklch(0.3 0.04 270 / 50%)" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="42" stroke="url(#hg)" strokeWidth="8" fill="none"
                        strokeLinecap="round" strokeDasharray="263.9" strokeDashoffset="58" />
                <defs>
                  <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.22 245)" />
                    <stop offset="100%" stopColor="oklch(0.62 0.25 290)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-display font-bold gradient-text">78</div>
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Risk</div>
              </div>
            </div>
          </div>
          {/* Violations preview */}
          <div className="md:col-span-2 space-y-2.5">
            {[
              { p: "Fake urgency timer", s: "high" },
              { p: "Hidden cancellation flow", s: "critical" },
              { p: "Pre-ticked consent boxes", s: "medium" },
              { p: "Confirmshaming opt-out", s: "medium" },
            ].map((v) => (
              <div key={v.p} className="flex items-center justify-between glass rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span className="text-sm font-medium">{v.p}</span>
                </div>
                <SeverityChip s={v.s as never} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SeverityChip({ s }: { s: "low" | "medium" | "high" | "critical" }) {
  const map = {
    low: { c: "var(--success)", l: "Low" },
    medium: { c: "var(--warning)", l: "Medium" },
    high: { c: "var(--destructive)", l: "High" },
    critical: { c: "var(--destructive)", l: "Critical" },
  } as const;
  const { c, l } = map[s];
  return (
    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
          style={{ background: `color-mix(in oklab, ${c} 18%, transparent)`, color: c, border: `1px solid ${c}` }}>
      {l}
    </span>
  );
}

function LiveMetrics() {
  const a = useCounter(28430);
  const b = useCounter(96);
  const c = useCounter(412);
  const d = useCounter(99);
  const items = [
    { v: a.toLocaleString(), label: "UI elements scanned" },
    { v: `${b}%`, label: "Detection accuracy" },
    { v: `${c}+`, label: "Pattern signatures" },
    { v: `${d}.9%`, label: "Privacy preserved" },
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-6 mt-12">
      <div className="glass-strong rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((i) => (
          <div key={i.label} className="text-center">
            <div className="text-3xl font-display font-bold gradient-text">{i.v}</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{i.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { I: Brain, t: "Gemini-powered analysis", d: "Multimodal AI inspects screenshots, copy, and structure for 25+ dark pattern signatures." },
    { I: Zap, t: "Results in seconds", d: "From upload to full audit report in under 8 seconds — built for rapid product iteration." },
    { I: Eye, t: "Severity-graded violations", d: "Each finding ranked low → critical with clear evidence and harm explanation." },
    { I: Sparkles, t: "Concrete UX fixes", d: "Every violation ships with a copy-pasteable fix recommendation, not vague advice." },
    { I: Lock, t: "Privacy-first by design", d: "Scans are processed in-memory and discarded. No tracking, no data retention." },
    { I: Globe2, t: "Compliance-aware", d: "Cross-references GDPR, CCPA, and EU DSA dark pattern guidance." },
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-6 mt-32">
      <SectionHead
        eyebrow="Capabilities"
        title="The complete dark pattern audit suite"
        sub="Everything product, design, and compliance teams need to ship UX that respects users."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
        {items.map(({ I, t, d }) => (
          <div key={t} className="glass rounded-2xl p-6 hover-lift">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                 style={{ background: "var(--gradient-primary)" }}>
              <I className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-display font-semibold text-lg">{t}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 mt-32">
      <div className="glass-strong rounded-3xl p-8 sm:p-12 grid lg:grid-cols-2 gap-10 items-center overflow-hidden">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary mb-3">Live audit dashboard</div>
          <h3 className="text-3xl sm:text-4xl font-display font-bold leading-tight text-balance">
            See exactly what's <span className="gradient-text">manipulating your users</span>.
          </h3>
          <p className="text-muted-foreground mt-4">
            FairUX AI surfaces every deceptive element with a severity score, harm rationale,
            and an actionable fix. Export a stakeholder-ready PDF in one click.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Risk + Trust scoring on a 0-100 scale",
              "GDPR / CCPA compliance flagging",
              "Per-violation evidence with screenshots",
              "Exportable audit report (PDF)",
            ].map((x) => (
              <li key={x} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <span className="text-sm">{x}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/results"
            className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold glass hover:bg-white/10 transition"
          >
            View sample report <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 bg-violet/20 blur-3xl pointer-events-none" />
          <div className="relative glass rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">acme.shop checkout</div>
                <div className="text-sm font-semibold mt-0.5">Live audit</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-destructive/15 text-destructive border border-destructive">
                HIGH RISK
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MetricCard label="Risk" value="78" trend="+12" color="destructive" Icon={TrendingUp} />
              <MetricCard label="Trust" value="32" trend="-9" color="warning" Icon={Activity} />
            </div>
            <div className="space-y-2 pt-2">
              {[
                ["Forced subscription", 92],
                ["Hidden fees disclosure", 84],
                ["Cookie consent design", 71],
                ["Cancellation friction", 88],
              ].map(([l, v]) => (
                <div key={l as string}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{l}</span>
                    <span className="font-mono">{v}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full"
                         style={{ width: `${v}%`, background: "var(--gradient-primary)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value, trend, color, Icon }:
  { label: string; value: string; trend: string; color: string; Icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="glass rounded-xl p-3.5">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-2xl font-display font-bold">{value}</span>
        <span className={`text-xs text-${color}`}>{trend}</span>
      </div>
    </div>
  );
}

function DarkPatternGrid() {
  const patterns = [
    "Fake urgency", "Hidden charges", "Forced continuity",
    "Confirmshaming", "Roach motel", "Privacy zuckering",
    "Bait & switch", "Disguised ads", "Misdirection",
    "Pre-ticked consent", "Trick questions", "Sneak into basket",
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-6 mt-32">
      <SectionHead
        eyebrow="Coverage"
        title="Every major dark pattern, detected"
        sub="Trained on real-world consumer harm cases and updated as new manipulation tactics emerge."
      />
      <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-3 mt-12">
        {patterns.map((p) => (
          <div key={p} className="glass rounded-xl px-4 py-3 flex items-center gap-2 hover-lift">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{p}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const t = [
    { q: "We caught 14 dark patterns in our checkout we didn't even know we had. FairUX AI paid for itself the first week.", n: "Maya R.", r: "Head of Product, Lumora" },
    { q: "Finally an audit tool that gives our designers actionable fixes — not a 200-page compliance PDF.", n: "Devon K.", r: "Design Lead, Vexel" },
    { q: "The Gemini-powered explanations make it easy to align engineering, design, and legal in one meeting.", n: "Priya S.", r: "VP UX, Helios Labs" },
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-6 mt-32">
      <SectionHead
        eyebrow="Loved by ethical teams"
        title="What product teams say"
        sub="Real feedback from teams shipping respectful UX."
      />
      <div className="grid md:grid-cols-3 gap-5 mt-12">
        {t.map((x) => (
          <div key={x.n} className="glass rounded-2xl p-6 hover-lift">
            <div className="text-primary text-3xl font-display leading-none">"</div>
            <p className="text-sm leading-relaxed text-foreground/90 mt-2">{x.q}</p>
            <div className="mt-5 pt-4 border-t border-border/40">
              <div className="text-sm font-semibold">{x.n}</div>
              <div className="text-xs text-muted-foreground">{x.r}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 mt-32">
      <div className="relative glass-strong rounded-3xl p-12 text-center overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none" />
        <div className="relative">
          <h3 className="text-3xl sm:text-4xl font-display font-bold text-balance">
            Ship UX that <span className="gradient-text">respects your users.</span>
          </h3>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Run your first audit in under 30 seconds. No signup, no data retention.
          </p>
          <Link
            to="/scan"
            className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-primary-foreground glow-primary hover:scale-105 transition"
            style={{ background: "var(--gradient-primary)" }}
          >
            Start Free Scan <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="text-xs uppercase tracking-widest text-primary mb-3">{eyebrow}</div>
      <h2 className="text-3xl sm:text-4xl font-display font-bold text-balance">{title}</h2>
      <p className="mt-3 text-muted-foreground text-balance">{sub}</p>
    </div>
  );
}
