import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Chrome, Bell, FileBarChart, Users, BarChart3, Code2, ArrowRight, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/prototype")({
  head: () => ({
    meta: [
      { title: "Enterprise Roadmap — FairUX AI" },
      { name: "description", content: "Browser extension, real-time alerts, weekly UX reports, team dashboard, competitor benchmarking, and API for companies." },
      { property: "og:title", content: "FairUX AI — Enterprise" },
      { property: "og:description", content: "What's coming next for product teams." },
    ],
  }),
  component: PrototypePage,
});

const features = [
  {
    I: Chrome, title: "Browser Extension Scanner", tag: "Q2 2025",
    desc: "Audit any page you visit in one click. Highlight dark patterns inline as you browse competitor flows.",
    bullets: ["Inline element highlighting", "Side-panel mini report", "Privacy-first local cache"],
  },
  {
    I: Bell, title: "Real-time Alerts", tag: "Q2 2025",
    desc: "Get notified when dark patterns enter your production UI. Slack, email, and webhook integrations.",
    bullets: ["Per-route monitoring", "Severity threshold filters", "Slack & PagerDuty hooks"],
  },
  {
    I: FileBarChart, title: "Weekly UX Reports", tag: "Q3 2025",
    desc: "Automated audit emails for your team every Monday. Trend lines, regressions, and quick-wins.",
    bullets: ["Stakeholder-ready PDFs", "Diff against last week", "Team distribution lists"],
  },
  {
    I: Users, title: "Team Dashboard", tag: "Q3 2025",
    desc: "Centralized control room. Assign violations, track remediation, and measure UX ethics over time.",
    bullets: ["Role-based access", "Jira & Linear sync", "Compliance audit trails"],
  },
  {
    I: BarChart3, title: "Competitor Benchmarking", tag: "Q4 2025",
    desc: "See how your UX ethics score compares to competitors. Identify trust opportunities in your category.",
    bullets: ["Industry leaderboards", "Quarterly trend reports", "Anonymous benchmarks"],
  },
  {
    I: Code2, title: "API for Companies", tag: "Q4 2025",
    desc: "Embed FairUX scoring directly into your CI/CD pipeline. Block deployments that ship dark patterns.",
    bullets: ["REST + GraphQL APIs", "GitHub Action", "Webhook deliveries"],
  },
];

function PrototypePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-24">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-muted-foreground mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Coming soon to Enterprise
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-balance">
            Built for the <span className="gradient-text">ethical product team</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Our roadmap turns FairUX AI into a continuous UX ethics platform —
            embedded in every layer of your product workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
          {features.map(({ I, title, tag, desc, bullets }) => (
            <div key={title} className="glass-strong rounded-3xl p-7 hover-lift relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                     style={{ background: "var(--gradient-primary)" }}>
                  <I className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-primary border border-primary/40 bg-primary/10">
                  {tag}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{desc}</p>
              <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                {bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 glass-strong rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none" />
          <div className="relative">
            <h3 className="text-3xl font-display font-bold text-balance">Want early access?</h3>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              We're onboarding a small number of design-led teams to shape the roadmap. Run your first audit today.
            </p>
            <Link
              to="/scan"
              className="mt-7 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-primary-foreground glow-primary hover:scale-105 transition"
              style={{ background: "var(--gradient-primary)" }}
            >
              Start Free Scan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
