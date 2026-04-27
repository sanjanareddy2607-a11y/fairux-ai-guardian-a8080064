import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ParticleField } from "@/components/particle-field";
import {
  Upload, Globe, Type, Sparkles, ShieldCheck, Lock, X, ArrowRight,
  Wand2, Image as ImageIcon, FileText,
} from "lucide-react";
import { saveResult, type AnalysisResult } from "@/lib/analysis";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Run a Dark Pattern Audit — FairUX AI" },
      { name: "description", content: "Upload a screenshot, paste a URL, or paste popup text. Gemini AI returns a complete dark pattern audit in seconds." },
      { property: "og:title", content: "FairUX AI — Analyzer" },
      { property: "og:description", content: "Run an AI-powered dark pattern audit." },
    ],
  }),
  component: ScanPage,
});

type Mode = "upload" | "url" | "text";

const SCAN_STAGES = [
  "Initializing Gemini vision model…",
  "Parsing UI hierarchy and visual weight…",
  "Cross-referencing 412 dark pattern signatures…",
  "Evaluating consent flows and copy…",
  "Scoring manipulation risk and harm…",
  "Generating UX fix recommendations…",
];

const EXAMPLE_URLS = [
  "https://example.com/checkout",
  "https://example.com/cancel-subscription",
  "https://example.com/cookies",
];

const EXAMPLE_TEXTS = [
  `🔥 Only 2 left in stock! Your trial expires in 23h 47m.\n[ Continue with Premium - $19.99/mo ]\nNo, I don't care about saving money`,
  `We use cookies and 847 partners to personalize your experience.\n[ ✓ Accept All ]    Reject (small grey link)`,
];

function ScanPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Only image files are supported.");
      return;
    }
    if (f.size > 6 * 1024 * 1024) {
      setError("Image must be under 6 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setImageName(f.name);
      setMode("upload");
      setError(null);
    };
    reader.readAsDataURL(f);
  };

  const submit = async () => {
    setError(null);

    const payload: { url?: string; text?: string; image?: string } = {};
    if (mode === "url") {
      if (!url.trim() || !/^https?:\/\//.test(url.trim())) {
        setError("Enter a full URL starting with https://");
        return;
      }
      payload.url = url.trim();
    } else if (mode === "text") {
      if (text.trim().length < 10) {
        setError("Paste at least 10 characters of UI text.");
        return;
      }
      payload.text = text.trim();
    } else {
      if (!image) {
        setError("Upload a screenshot first.");
        return;
      }
      payload.image = image;
    }

    setLoading(true);
    setStage(0);
    const stageInt = setInterval(() => {
      setStage((s) => Math.min(s + 1, SCAN_STAGES.length - 1));
    }, 1100);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error(
          `Analyzer endpoint not reachable (HTTP ${res.status}). ` +
            `If you just deployed, the build may still be propagating.`,
        );
      }

      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || `Scan failed (${res.status})`);
      }

      const data = await res.json();

      const result: AnalysisResult = {
        riskScore: data.riskScore,
        trustScore: data.trustScore,
        compliance: data.compliance,
        summary: data.summary,
        violations: data.violations,
        recommendations: data.recommendations,
        scannedAt: data.scannedAt,
        source: {
          type: mode === "upload" ? "image" : mode === "url" ? "url" : "text",
          value:
            mode === "upload"
              ? imageName ?? "screenshot.png"
              : mode === "url"
                ? url
                : text.slice(0, 80),
        },
      };

      saveResult(result);
      clearInterval(stageInt);
      navigate({ to: "/results" });
    } catch (e) {
      clearInterval(stageInt);
      setError(e instanceof Error ? e.message : "Scan failed.");
      setLoading(false);
    }
  };

  if (loading) return <ScanningState stage={stage} />;

  return (
    <div className="min-h-screen relative">
      <SiteHeader />
      <div className="absolute inset-x-0 top-0 h-[420px] aurora opacity-50 pointer-events-none" />
      <ParticleField className="opacity-30" density={0.00008} />

      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-12 sm:pt-16 pb-24">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-muted-foreground mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Powered by Gemini multimodal AI
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-balance tracking-tight">
            Run a <span className="gradient-text">dark pattern audit</span>
          </h1>
          <p className="mt-4 text-muted-foreground text-balance leading-relaxed">
            Upload a UI screenshot, paste a URL, or paste popup text. Get a complete,
            stakeholder-ready report in under 8 seconds.
          </p>
        </div>

        <div className="mt-10 sm:mt-12 glass-strong rounded-3xl p-1.5">
          <div className="rounded-[20px] bg-card/60 backdrop-blur p-5 sm:p-8">
            {/* Mode switcher */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { k: "url", I: Globe, l: "Website URL", s: "Live page" },
                { k: "upload", I: Upload, l: "Screenshot", s: "PNG / JPG" },
                { k: "text", I: Type, l: "Popup text", s: "Paste copy" },
              ].map(({ k, I, l, s }) => {
                const active = mode === k;
                return (
                  <button
                    key={k}
                    onClick={() => { setMode(k as Mode); setError(null); }}
                    className={`flex flex-col sm:flex-row items-center sm:items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-3 rounded-xl text-sm font-medium transition ${
                      active
                        ? "text-primary-foreground glow-primary"
                        : "glass text-muted-foreground hover:text-foreground"
                    }`}
                    style={active ? { background: "var(--gradient-primary)" } : undefined}
                  >
                    <I className="w-4 h-4 shrink-0" />
                    <div className="text-center sm:text-left">
                      <div className="text-xs sm:text-sm font-semibold leading-tight">{l}</div>
                      <div className={`text-[10px] hidden sm:block ${active ? "opacity-80" : "opacity-60"}`}>{s}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {mode === "url" && (
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Website URL</label>
                <div className="mt-2 relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="url"
                    placeholder="https://example.com/checkout"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-input/50 border border-border focus:border-primary outline-none text-base font-mono transition"
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Try:</span>
                  {EXAMPLE_URLS.map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUrl(u)}
                      className="text-xs glass px-2.5 py-1 rounded-md hover:bg-white/10 transition font-mono"
                    >
                      {u.replace("https://", "")}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  💡 Tip: Checkout, signup, and cancellation flows yield the most actionable findings.
                </p>
              </div>
            )}

            {mode === "upload" && (
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Screenshot</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const f = e.dataTransfer.files?.[0];
                    if (f) handleFile(f);
                  }}
                  onClick={() => fileRef.current?.click()}
                  className={`mt-2 relative cursor-pointer rounded-xl border-2 border-dashed transition p-6 sm:p-8 text-center ${
                    dragOver ? "border-primary bg-primary/10" : "border-border hover:border-primary bg-input/30"
                  }`}
                >
                  {image ? (
                    <div className="relative">
                      <img src={image} alt="preview" className="max-h-64 mx-auto rounded-lg shadow-2xl" />
                      <button
                        onClick={(e) => { e.stopPropagation(); setImage(null); setImageName(null); }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-destructive/20 transition"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="text-xs text-muted-foreground mt-3 inline-flex items-center gap-1.5">
                        <ImageIcon className="w-3 h-3" /> {imageName}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3"
                        style={{ background: "var(--gradient-primary)" }}
                      >
                        <Upload className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="text-sm font-medium">Drop a screenshot or click to upload</div>
                      <div className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP · up to 6 MB</div>
                    </>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                  />
                </div>
              </div>
            )}

            {mode === "text" && (
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Popup / UI text</label>
                <textarea
                  placeholder={`Paste a popup, modal copy, or consent banner...\n\nExample:\n"Your free trial ends in 23h 47m! Subscribe now or lose your saved data forever."`}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={8}
                  className="mt-2 w-full px-4 py-3.5 rounded-xl bg-input/50 border border-border focus:border-primary outline-none text-sm font-mono resize-none transition"
                />
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Examples:</span>
                  {EXAMPLE_TEXTS.map((t, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setText(t)}
                      className="text-xs glass px-2.5 py-1 rounded-md hover:bg-white/10 transition inline-flex items-center gap-1.5"
                    >
                      <Wand2 className="w-3 h-3 text-primary" /> Sample {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 text-sm text-destructive bg-destructive/10 border border-destructive/40 rounded-lg px-4 py-2.5 flex items-start gap-2">
                <X className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={submit}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold text-primary-foreground glow-primary hover:scale-[1.01] active:scale-[0.99] transition"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Sparkles className="w-5 h-5" /> Analyze with Gemini AI
            </button>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-success" /> Secure scan</span>
              <span className="inline-flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-success" /> Data deleted after scan</span>
              <span>No account required</span>
            </div>
          </div>
        </div>

        {/* Helpful hints */}
        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          {[
            { I: Globe, t: "URL audits", d: "Best for live checkout, signup, and cancellation flows." },
            { I: ImageIcon, t: "Screenshot audits", d: "Best for popups, consent banners, and pricing modals." },
            { I: FileText, t: "Text audits", d: "Best for evaluating copy in isolation — confirmshaming, urgency text." },
          ].map(({ I, t, d }) => (
            <div key={t} className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2.5 mb-2">
                <I className="w-4 h-4 text-primary" />
                <div className="font-display font-semibold text-sm">{t}</div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-muted-foreground">
          Want to see a sample first?{" "}
          <Link to="/results" className="text-primary hover:underline inline-flex items-center gap-1">
            View example report <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function ScanningState({ stage }: { stage: number }) {
  const pct = Math.round(((stage + 1) / SCAN_STAGES.length) * 100);
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 aurora opacity-60" />
      <ParticleField className="opacity-50" />
      <div className="relative glass-strong rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 overflow-hidden bg-muted/30">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${pct}%`, background: "var(--gradient-primary)" }}
          />
        </div>

        <div className="relative inline-flex">
          <div
            className="w-24 h-24 rounded-full glass flex items-center justify-center"
            style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
          >
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-3 h-3 -mt-1.5 -ml-1.5 rounded-full bg-primary"
              style={{
                animation: `orbit ${4 + i}s linear infinite`,
                animationDelay: `${i * 0.6}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>

        <h2 className="mt-8 text-2xl font-display font-bold tracking-tight">Scanning deceptive patterns</h2>
        <p className="mt-2 text-sm text-muted-foreground min-h-[1.25rem]">{SCAN_STAGES[stage]}</p>

        <div className="mt-6 space-y-1.5 text-left">
          {SCAN_STAGES.map((s, i) => {
            const done = i < stage;
            const active = i === stage;
            return (
              <div
                key={s}
                className={`flex items-center gap-2 text-xs transition ${
                  done ? "text-success" : active ? "text-foreground" : "text-muted-foreground/50"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    done ? "bg-success" : active ? "bg-primary animate-pulse" : "bg-muted"
                  }`}
                />
                {s}
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-[10px] uppercase tracking-widest text-muted-foreground">
          {pct}% · Powered by Google Gemini
        </div>
      </div>
    </div>
  );
}
