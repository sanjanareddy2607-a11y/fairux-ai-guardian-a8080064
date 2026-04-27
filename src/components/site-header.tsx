import { Link, useLocation } from "@tanstack/react-router";
import { ShieldCheck, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/scan", label: "Analyzer" },
  { to: "/results", label: "Sample Report" },
  { to: "/prototype", label: "Roadmap" },
  { to: "/about", label: "Why It Matters" },
] as const;

export function SiteHeader() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close mobile drawer on route change
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <div
          className={`glass rounded-2xl flex items-center justify-between px-3 sm:px-5 py-2.5 transition-all duration-300 ${
            scrolled ? "shadow-2xl bg-background/60 backdrop-blur-xl" : ""
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5 group min-w-0">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-primary/40 blur-md rounded-lg group-hover:bg-primary/60 transition" />
              <div
                className="relative w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}
              >
                <ShieldCheck className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
            </div>
            <div className="leading-tight min-w-0">
              <div className="font-display font-bold text-base truncate">
                FairUX <span className="gradient-text">AI</span>
              </div>
              <div className="text-[9px] text-muted-foreground tracking-[0.18em] uppercase truncate">
                Ethical UX Audits
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const active = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {l.label}
                  {active && (
                    <span
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full"
                      style={{ background: "var(--gradient-primary)" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/scan"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-primary-foreground glow-primary hover:scale-105 transition"
              style={{ background: "var(--gradient-primary)" }}
            >
              Start Free Scan
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="md:hidden w-10 h-10 rounded-xl glass flex items-center justify-center"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            open ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
        >
          <div className="glass-strong rounded-2xl p-3 space-y-1">
            {links.map((l) => {
              const active = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium ${
                    active ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-white/5"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              to="/scan"
              className="block text-center mt-2 px-4 py-3 rounded-xl text-sm font-semibold text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              Start Free Scan
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
