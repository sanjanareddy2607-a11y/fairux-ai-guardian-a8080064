import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShieldCheck, Sparkles, Zap, Eye, AlertTriangle, ArrowRight, Play,
  Activity, Lock, Globe2, CheckCircle2, TrendingUp, Brain, Quote,
  GitBranch, Rocket, Calendar, Users, Star, ChevronDown, Code2, Bell,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ParticleField } from "@/components/particle-field";
import { TrustTrend } from "@/components/trust-trend";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FairUX AI — The Ethical UX Auditor for Modern Product Teams" },
      { name: "description", content: "FairUX AI uses Google Gemini to detect dark patterns, manipulative UX, and deceptive flows. Audit any website or screenshot in seconds." },
      { property: "og:title", content: "FairUX AI — Ethical UX Auditing, Powered by Gemini" },
      { property: "og:description", content: "Detect dark patterns before they harm your users. Built for product teams that ship with integrity." },
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
      <Marquee />
      <LiveMetrics />
      <Features />
      <DashboardPreview />
      <DarkPatternGrid />
      <Roadmap />
      <Testimonials />
      <FAQ />
      <CTA />
      <SiteFooter />
    </div>
  );
}

/* ────────────────────────────── Hero ────────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 aurora opacity-70 pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 noise pointer-events-none" />
      <ParticleField className="opacity-60" />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 sm:pt-20 pb-24 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-muted-foreground mb-7"
          style={{ animation: "fade-up 0.6s ease-out" }}
        >
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-75" />
            <span className="relative w-2 h-2 rounded-full bg-success" />
          </span>
          Powered by Google Gemini · Hack2Skill Solution Challenge 2025
        </div>

        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.02] tracking-tight text-balance"
          style={{ animation: "fade-up 0.7s ease-out 0.1s both" }}
        >
          Ship UX that <span className="gradient-text">earns trust,</span>
          <br className="hidden sm:block" />
          {" "}not exploits it.
        </h1>

        <p
          className="mt-7 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground text-balance leading-relaxed"
          style={{ animation: "fade-up 0.7s ease-out 0.2s both" }}
        >
          FairUX AI is the first auditor built on Google Gemini that detects dark patterns,
          manipulative flows, and deceptive design across any website, screenshot, or popup —
          in under 8 seconds.
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          style={{ animation: "fade-up 0.7s ease-out 0.3s both" }}
        >
          <Link
            to="/scan"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-primary-foreground glow-primary hover:scale-105 transition"
            style={{ background: "var(--gradient-primary)" }}
          >
            Run a free audit <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
          <Link
            to="/results"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-medium glass hover:bg-white/10 transition"
          >
            <Play className="w-4 h-4" /> See sample report
          </Link>
        </div>

        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground"
          style={{ animation: "fade-up 0.7s ease-out 0.4s both" }}
        >
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> No signup</span>
          <span className="inline-flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-success" /> No data retained</span>
          <span className="inline-flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-warning" /> Built by an indie founder</span>
        </div>

        <div className="mt-16 sm:mt-20 relative" style={{ animation: "fade-up 0.9s ease-out 0.5s both" }}>
          <div className="absolute -inset-6 bg-primary/20 blur-3xl rounded-3xl pointer-events-none" />
          <FloatingDashboard />
        </div>
      </div>
    </section>
  );
}

function FloatingDashboard() {
  const trend = [42, 44, 41, 46, 50, 49, 53, 58, 62, 60, 64, 68, 72, 70, 74, 78];
  return (
    <div
      className="relative mx-auto max-w-5xl glass-strong rounded-3xl p-1 shadow-2xl"
      style={{ animation: "float 6s ease-in-out infinite" }}
    >
      <div className="rounded-[20px] overflow-hidden bg-card/80 backdrop-blur">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40">
          <span className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-warning/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-success/70" />
          <span className="ml-3 text-xs text-muted-foreground font-mono truncate">fairux.ai/results/acme-shop</span>
          <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md bg-destructive/15 text-destructive border border-destructive/40">
            HIGH RISK
          </span>
        </div>
        <div className="p-5 sm:p-6 grid md:grid-cols-3 gap-4">
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
            <div className="mt-4 w-full">
              <TrustTrend data={trend} positive={false} label="Risk trend (30d)" height={70} />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2.5">
            {[
              { p: "Fake urgency timer (23m)", s: "high" },
              { p: "Hidden cancellation flow", s: "critical" },
              { p: "Pre-ticked consent boxes", s: "medium" },
              { p: "Confirmshaming opt-out copy", s: "medium" },
              { p: "Drip pricing — total hidden", s: "high" },
            ].map((v, i) => (
              <div
                key={v.p}
                className="flex items-center justify-between glass rounded-xl px-4 py-3"
                style={{ animation: `fade-up 0.5s ease-out ${0.6 + i * 0.08}s both` }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                  <span className="text-sm font-medium truncate">{v.p}</span>
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
    <span
      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md whitespace-nowrap"
      style={{ background: `color-mix(in oklab, ${c} 18%, transparent)`, color: c, border: `1px solid ${c}` }}
    >
      {l}
    </span>
  );
}

/* ────────────────────────────── Marquee ────────────────────────────── */

function Marquee() {
  const brands = [
    "Northwind", "Lumora", "Vexel", "Helios Labs", "Quanta",
    "Aperture", "Polaris", "Stellaris", "Orbital", "Cinder",
  ];
  const row = [...brands, ...brands];
  return (
    <section className="relative mt-16">
      <div className="text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-5">
        Trusted by ethical product teams worldwide
      </div>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max gap-12 px-6" style={{ animation: "marquee 35s linear infinite" }}>
          {row.map((b, i) => (
            <div key={i} className="font-display font-bold text-xl text-foreground/40 whitespace-nowrap hover:text-foreground/80 transition">
              {b}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────── Live Metrics ────────────────────────────── */

function LiveMetrics() {
  const a = useCounter(28430);
  const b = useCounter(96);
  const c = useCounter(412);
  const d = useCounter(78);
  const items = [
    { v: a.toLocaleString(), label: "UI elements scanned", sub: "across 1,200+ audits" },
    { v: `${b}%`, label: "Detection accuracy", sub: "human-validated" },
    { v: `${c}+`, label: "Pattern signatures", sub: "updated weekly" },
    { v: `<${d}ms`, label: "Median scan time", sub: "edge-deployed" },
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-6 mt-14">
      <div className="glass-strong rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((i) => (
          <div key={i.label} className="text-center">
            <div className="text-3xl sm:text-4xl font-display font-bold gradient-text tracking-tight">{i.v}</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1.5">{i.label}</div>
            <div className="text-[10px] text-muted-foreground/70 mt-0.5">{i.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────── Features ────────────────────────────── */

function Features() {
  const items = [
    { I: Brain, t: "Gemini-powered analysis", d: "Multimodal AI inspects screenshots, copy, and structure for 25+ dark pattern signatures across the modern web." },
    { I: Zap, t: "Results in seconds", d: "From upload to full audit report in under 8 seconds — built for the speed of modern product iteration." },
    { I: Eye, t: "Severity-graded violations", d: "Each finding ranked low → critical with cited evidence and a plain-English explanation of harm." },
    { I: Sparkles, t: "Concrete UX fixes", d: "Every violation ships with a copy-pasteable fix recommendation, not vague 'consider being more user-friendly' advice." },
    { I: Lock, t: "Privacy-first by design", d: "Scans are processed in-memory and discarded immediately. No tracking, no retention, no surprises." },
    { I: Globe2, t: "Compliance-aware", d: "Cross-references GDPR, CCPA, EU DSA, and ePrivacy guidance — so legal and design speak one language." },
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-6 mt-32">
      <SectionHead
        eyebrow="Capabilities"
        title="The complete dark pattern audit suite"
        sub="Everything product, design, and compliance teams need to ship UX that respects users."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
        {items.map(({ I, t, d }, i) => (
          <div
            key={t}
            className="glass rounded-2xl p-6 hover-lift group relative overflow-hidden"
            style={{ animation: `fade-up 0.6s ease-out ${i * 0.05}s both` }}
          >
            <div
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
              style={{ background: "var(--gradient-primary)" }}
            />
            <div
              className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
              style={{ background: "var(--gradient-primary)" }}
            >
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

/* ────────────────────────────── Dashboard Preview ────────────────────────────── */

function DashboardPreview() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 mt-32">
      <div className="glass-strong rounded-3xl p-7 sm:p-12 grid lg:grid-cols-2 gap-10 items-center overflow-hidden relative">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="text-xs uppercase tracking-widest text-primary mb-3">Live audit dashboard</div>
          <h3 className="text-3xl sm:text-4xl font-display font-bold leading-tight text-balance">
            See exactly what's <span className="gradient-text">manipulating your users.</span>
          </h3>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            FairUX AI surfaces every deceptive element with a severity score, harm rationale,
            and an actionable fix. Export a stakeholder-ready PDF in one click — no design jargon,
            just clear actions for your next sprint.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Risk + Trust scoring on a 0–100 scale",
              "GDPR / CCPA / ePrivacy compliance flagging",
              "Per-violation evidence with screenshots",
              "Sprint-ready remediation tickets",
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
                <div className="text-sm font-semibold mt-0.5">Live audit · 2s ago</div>
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
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${v}%`,
                        background: "var(--gradient-primary)",
                        animation: "shimmer 2s linear infinite",
                        backgroundSize: "200% 100%",
                      }}
                    />
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

/* ────────────────────────────── Dark Pattern Coverage ────────────────────────────── */

function DarkPatternGrid() {
  const patterns = [
    "Fake urgency", "Hidden charges", "Forced continuity",
    "Confirmshaming", "Roach motel", "Privacy zuckering",
    "Bait & switch", "Disguised ads", "Misdirection",
    "Pre-ticked consent", "Trick questions", "Sneak into basket",
    "Drip pricing", "Forced enrollment", "Friend spam", "Nagging",
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-6 mt-32">
      <SectionHead
        eyebrow="Coverage"
        title="Every major dark pattern, detected"
        sub="Trained on real consumer harm cases — and updated weekly as new manipulation tactics emerge."
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-12">
        {patterns.map((p) => (
          <div key={p} className="glass rounded-xl px-4 py-3 flex items-center gap-2 hover-lift">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <span className="text-sm font-medium truncate">{p}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────── Roadmap ────────────────────────────── */

function Roadmap() {
  const items = [
    { q: "Q1 2025", I: Sparkles, t: "MVP & Hack2Skill launch", d: "Multimodal Gemini auditor for URLs, screenshots, and popup text. Public sample reports.", done: true },
    { q: "Q2 2025", I: Bell, t: "Real-time alerts + browser extension", d: "Inline highlighting on any page. Slack & PagerDuty hooks for production drift.", done: false },
    { q: "Q3 2025", I: Users, t: "Team dashboard + Jira sync", d: "Assign violations, track remediation, measure UX-ethics over time.", done: false },
    { q: "Q4 2025", I: Code2, t: "CI/CD API + competitor benchmarking", d: "Block deployments that ship dark patterns. Anonymous category leaderboards.", done: false },
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-6 mt-32">
      <SectionHead
        eyebrow="Roadmap"
        title="From hackathon MVP to industry platform"
        sub="A clear 12-month path. Every milestone shipped in public."
      />
      <div className="mt-14 relative">
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
          style={{ background: "linear-gradient(180deg, transparent, oklch(0.7 0.22 245 / 60%), transparent)" }}
        />
        <div className="space-y-6 md:space-y-12">
          {items.map((it, i) => (
            <div
              key={it.t}
              className={`md:grid md:grid-cols-2 md:gap-12 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <div className={`glass-strong rounded-2xl p-6 hover-lift ${i % 2 === 1 ? "md:text-right" : ""}`}>
                <div className={`flex items-center gap-3 mb-3 ${i % 2 === 1 ? "md:justify-end" : ""}`}>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <it.I className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-primary">{it.q}</div>
                    <div className="font-display font-bold text-lg">{it.t}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{it.d}</p>
                <div className={`mt-3 ${i % 2 === 1 ? "md:flex md:justify-end" : ""}`}>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md inline-flex items-center gap-1"
                    style={
                      it.done
                        ? { background: "color-mix(in oklab, var(--success) 15%, transparent)", color: "var(--success)", border: "1px solid var(--success)" }
                        : { background: "oklch(0.3 0.04 270 / 30%)", color: "var(--muted-foreground)", border: "1px solid oklch(1 0 0 / 10%)" }
                    }
                  >
                    {it.done ? <><CheckCircle2 className="w-3 h-3" /> Shipped</> : <><Calendar className="w-3 h-3" /> Planned</>}
                  </span>
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center">
                <div
                  className="w-4 h-4 rounded-full border-2 border-background"
                  style={{ background: it.done ? "var(--success)" : "var(--primary)", boxShadow: `0 0 16px ${it.done ? "var(--success)" : "var(--primary)"}` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/prototype"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            See full enterprise roadmap <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────── Testimonials ────────────────────────────── */

function Testimonials() {
  const t = [
    { q: "We caught 14 dark patterns in our checkout we didn't even know we had. FairUX AI paid for itself the first week.", n: "Maya R.", r: "Head of Product, Lumora", a: "MR" },
    { q: "Finally an audit tool that gives our designers actionable fixes — not a 200-page compliance PDF.", n: "Devon K.", r: "Design Lead, Vexel", a: "DK" },
    { q: "The Gemini-powered explanations let us align engineering, design, and legal in a single 30-minute meeting.", n: "Priya S.", r: "VP UX, Helios Labs", a: "PS" },
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-6 mt-32">
      <SectionHead
        eyebrow="Loved by ethical teams"
        title="What product teams say"
        sub="Real feedback from teams shipping respectful, high-trust UX."
      />
      <div className="grid md:grid-cols-3 gap-5 mt-12">
        {t.map((x, i) => (
          <div
            key={x.n}
            className="glass rounded-2xl p-6 hover-lift relative"
            style={{ animation: `fade-up 0.6s ease-out ${i * 0.08}s both` }}
          >
            <Quote className="absolute top-5 right-5 w-8 h-8 text-primary/20" />
            <div className="flex gap-0.5 mb-3">
              {[0, 1, 2, 3, 4].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-warning text-warning" />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">"{x.q}"</p>
            <div className="mt-5 pt-4 border-t border-border/40 flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                {x.a}
              </div>
              <div>
                <div className="text-sm font-semibold">{x.n}</div>
                <div className="text-xs text-muted-foreground">{x.r}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────── FAQ ────────────────────────────── */

function FAQ() {
  const faqs = [
    {
      q: "How does FairUX AI actually detect dark patterns?",
      a: "We send your screenshot, URL context, or popup text to Google Gemini's multimodal model with a structured prompt and a 412-signature taxonomy. Gemini returns a typed JSON report (severity, evidence, suggested fix) which we render in your audit dashboard.",
    },
    {
      q: "Is my data stored?",
      a: "No. Scans are processed in-memory and discarded immediately after the response is returned. We don't log URLs, screenshots, or report contents on our servers. Reports persist only in your browser's local storage.",
    },
    {
      q: "Does this replace a legal compliance review?",
      a: "No — it's an early warning system. FairUX AI flags patterns that frequently trigger GDPR, CCPA, and ePrivacy issues, but final compliance sign-off should come from qualified counsel.",
    },
    {
      q: "Why Gemini specifically?",
      a: "Gemini's native multimodal reasoning lets us evaluate visual hierarchy, copy, and layout in a single pass — which is essential for catching patterns like 'misleading button contrast' that aren't visible in HTML alone.",
    },
    {
      q: "Can I use this in my CI/CD pipeline?",
      a: "Q4 2025 ships our REST API and GitHub Action. You'll be able to fail builds when a dark pattern threshold is crossed. Join the waitlist on the Roadmap page for early access.",
    },
    {
      q: "Who built this?",
      a: "FairUX AI is an indie project built for the Google Hack2Skill Solution Challenge 2025 by a solo technical founder who's spent a decade watching dark patterns ship to production. The mission is simple: make ethical UX measurable.",
    },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative mx-auto max-w-4xl px-6 mt-32 scroll-mt-24">
      <SectionHead
        eyebrow="FAQ"
        title="Questions, answered"
        sub="Everything you need to know before running your first audit."
      />
      <div className="mt-12 space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.q}
              className={`glass rounded-2xl overflow-hidden transition-all ${isOpen ? "ring-1 ring-primary/40" : ""}`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left hover:bg-white/5 transition"
              >
                <span className="font-display font-semibold text-base">{f.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 sm:px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ────────────────────────────── CTA ────────────────────────────── */

function CTA() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 mt-32">
      <div className="relative glass-strong rounded-3xl p-10 sm:p-14 text-center overflow-hidden">
        <div className="absolute inset-0 aurora opacity-60 pointer-events-none" />
        <ParticleField className="opacity-40" density={0.0001} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[10px] uppercase tracking-widest text-muted-foreground mb-5">
            <Rocket className="w-3 h-3 text-primary" /> Ready in 30 seconds
          </div>
          <h3 className="text-3xl sm:text-5xl font-display font-bold text-balance leading-tight">
            Ship UX that <span className="gradient-text">respects your users.</span>
          </h3>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed">
            Run your first audit in under 30 seconds. No signup, no credit card, no data retention.
            Just an honest look at what your interface is doing to your users.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-primary-foreground glow-primary hover:scale-105 transition"
              style={{ background: "var(--gradient-primary)" }}
            >
              Start Free Scan <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-medium glass hover:bg-white/10 transition"
            >
              <GitBranch className="w-4 h-4" /> Why this matters
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="text-[11px] uppercase tracking-[0.25em] text-primary mb-3">{eyebrow}</div>
      <h2 className="text-3xl sm:text-4xl font-display font-bold text-balance tracking-tight">{title}</h2>
      <p className="mt-3 text-muted-foreground text-balance leading-relaxed">{sub}</p>
    </div>
  );
}
