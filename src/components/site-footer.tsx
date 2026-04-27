import { Link } from "@tanstack/react-router";
import { ShieldCheck, Github, Twitter, Linkedin, Lock, Cookie, FileCheck2, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-32 relative">
      {/* Top accent line */}
      <div
        className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.7 0.22 245 / 60%), transparent)" }}
      />
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Trust badges row */}
        <div className="glass-strong rounded-2xl p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { I: Lock, t: "GDPR aware", s: "EU consent rules" },
            { I: ShieldCheck, t: "CCPA aware", s: "California privacy" },
            { I: Cookie, t: "ePrivacy aware", s: "Cookie compliance" },
            { I: FileCheck2, t: "SOC2 roadmap", s: "Enterprise-ready" },
          ].map(({ I, t, s }) => (
            <div key={t} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl glass flex items-center justify-center shrink-0">
                <I className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold leading-tight">{t}</div>
                <div className="text-[11px] text-muted-foreground leading-tight">{s}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}
              >
                <ShieldCheck className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-lg">
                FairUX <span className="gradient-text">AI</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              The AI auditor for ethical product teams. Detect dark patterns, manipulative
              flows, and deceptive design before they reach your users.
            </p>
            <div className="flex gap-2 mt-5">
              {[
                { I: Github, href: "https://github.com" },
                { I: Twitter, href: "https://twitter.com" },
                { I: Linkedin, href: "https://linkedin.com" },
              ].map(({ I, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Social"
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:text-primary hover:scale-105 transition"
                >
                  <I className="w-4 h-4" />
                </a>
              ))}
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              All systems operational · 99.9% uptime
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3">Product</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/scan" className="hover:text-foreground transition">Analyzer</Link></li>
              <li><Link to="/results" className="hover:text-foreground transition">Sample Report</Link></li>
              <li><Link to="/prototype" className="hover:text-foreground transition">Roadmap</Link></li>
              <li><a href="#faq" className="hover:text-foreground transition">FAQ</a></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3">Company</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition">Why It Matters</Link></li>
              <li><a href="https://hack2skill.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">Hack2Skill</a></li>
              <li><a href="mailto:hello@fairux.ai" className="hover:text-foreground transition">Contact</a></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3">Stay updated</div>
            <p className="text-xs text-muted-foreground mb-3">
              Monthly insights on dark patterns and ethical UX.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center glass rounded-xl pl-3 pr-1 py-1"
            >
              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="email"
                placeholder="you@team.com"
                className="flex-1 min-w-0 bg-transparent outline-none text-sm px-2 py-2"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} FairUX AI · Built for the Google Hack2Skill Solution Challenge.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition">Privacy</a>
            <a href="#" className="hover:text-foreground transition">Terms</a>
            <a href="#" className="hover:text-foreground transition">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
