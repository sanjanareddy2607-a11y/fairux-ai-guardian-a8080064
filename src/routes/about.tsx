import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AlertTriangle, Heart, Scale, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Why It Matters — FairUX AI" },
      { name: "description", content: "Dark patterns cost users billions and erode trust. Learn why ethical UX matters and see real-world examples." },
      { property: "og:title", content: "FairUX AI — Why Dark Patterns Matter" },
      { property: "og:description", content: "The case for ethical UX, with real examples." },
    ],
  }),
  component: AboutPage,
});

const examples = [
  {
    title: "The Hidden Charge",
    pattern: "Sneak into basket",
    story: "A user buys a $19 magazine subscription. At checkout, a 'Premium Insurance' line item is pre-added for $4.99/month — buried below the fold.",
    harm: "Recurring charges users never knowingly agreed to. The FTC has fined companies $100M+ for this pattern.",
  },
  {
    title: "The Roach Motel",
    pattern: "Hidden cancellation",
    story: "Signing up takes 30 seconds and one click. Cancelling requires calling a phone line during business hours, navigating an IVR maze, then declining four retention offers.",
    harm: "Users stay subscribed against their will. Now explicitly illegal under the EU Consumer Rights Directive and California's AB 390.",
  },
  {
    title: "The Misleading Button",
    pattern: "Visual hierarchy manipulation",
    story: "A cookie banner shows 'Accept All' as a glowing primary button while 'Reject All' is rendered as low-contrast text far below.",
    harm: "Coerces consent in violation of GDPR's 'freely given' standard. CNIL has issued multi-million euro fines.",
  },
  {
    title: "The Confirmshame",
    pattern: "Guilt-driven opt-out",
    story: "A discount popup decline button reads: 'No, I don't deserve to save money.'",
    harm: "Manipulates users through shame. Erodes brand trust the moment users notice the pattern.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-24">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-muted-foreground mb-6">
            <Heart className="w-3.5 h-3.5 text-primary" /> Our mission
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-balance leading-tight">
            Dark patterns cost users <span className="gradient-text">billions of dollars</span> and a lifetime of trust.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-balance">
            Manipulative UX isn't an edge case — it's the dominant design pattern of the modern web.
            FairUX AI exists to make ethical alternatives visible, measurable, and actionable.
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-3 gap-5">
          {[
            { v: "$3.2B", l: "Lost annually to subscription traps in the US alone" },
            { v: "78%", l: "Of users encounter at least one dark pattern weekly" },
            { v: "412", l: "Distinct dark pattern signatures in our taxonomy" },
          ].map((s) => (
            <div key={s.l} className="glass-strong rounded-2xl p-6 text-center">
              <div className="text-3xl font-display font-bold gradient-text">{s.v}</div>
              <div className="text-xs text-muted-foreground mt-2 leading-relaxed">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="text-xs uppercase tracking-widest text-primary mb-3 text-center">Real-world examples</div>
          <h2 className="text-3xl font-display font-bold text-center text-balance">
            Patterns we audit, with the harm they cause
          </h2>
          <div className="mt-10 space-y-5">
            {examples.map((e) => (
              <div key={e.title} className="glass rounded-2xl p-6 sm:p-8 grid sm:grid-cols-[200px_1fr] gap-6 items-start">
                <div>
                  <div className="text-xs uppercase tracking-widest text-destructive">{e.pattern}</div>
                  <div className="font-display font-bold text-xl mt-1">{e.title}</div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed">{e.story}</p>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Why it harms:</strong> {e.harm}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 glass-strong rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh opacity-50 pointer-events-none" />
          <div className="relative">
            <Scale className="w-12 h-12 mx-auto text-primary" />
            <h3 className="mt-5 text-3xl font-display font-bold text-balance">
              Build products users <span className="gradient-text">come back to.</span>
            </h3>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Trust compounds. Manipulation doesn't. Run your first dark pattern audit today.
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
