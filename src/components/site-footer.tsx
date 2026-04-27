import { Link } from "@tanstack/react-router";
import { ShieldCheck, Github, Twitter, Linkedin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                   style={{ background: "var(--gradient-primary)" }}>
                <ShieldCheck className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-lg">FairUX <span className="gradient-text">AI</span></span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              The world's first AI-powered dark pattern auditor. Built to help product
              teams ship UX that respects users — not exploits them.
            </p>
            <div className="flex gap-3 mt-5">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:text-primary transition">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3">Product</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/scan" className="hover:text-foreground">Analyzer</Link></li>
              <li><Link to="/results" className="hover:text-foreground">Sample Report</Link></li>
              <li><Link to="/prototype" className="hover:text-foreground">Enterprise</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3">Company</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">Why It Matters</Link></li>
              <li><a href="#" className="hover:text-foreground">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} FairUX AI · Built for Google Hack2Skill Solution Challenge.</div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
