import { Link, useLocation } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/scan", label: "Analyzer" },
  { to: "/results", label: "Results" },
  { to: "/prototype", label: "Enterprise" },
  { to: "/about", label: "Why It Matters" },
] as const;

export function SiteHeader() {
  const location = useLocation();
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="glass rounded-2xl flex items-center justify-between px-4 sm:px-6 py-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/40 blur-md rounded-lg group-hover:bg-primary/60 transition" />
              <div className="relative w-9 h-9 rounded-lg flex items-center justify-center"
                   style={{ background: "var(--gradient-primary)" }}>
                <ShieldCheck className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-base">FairUX <span className="gradient-text">AI</span></div>
              <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Ethical UX Audits</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const active = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    active
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <Link
            to="/scan"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-primary-foreground glow-primary hover:scale-105 transition"
            style={{ background: "var(--gradient-primary)" }}
          >
            Start Free Scan
          </Link>
        </div>
      </div>
    </header>
  );
}
