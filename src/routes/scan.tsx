import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Upload, Globe, Type, Sparkles, ShieldCheck, Lock, X } from "lucide-react";
import { saveResult, type AnalysisResult } from "@/lib/analysis";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan UI for Dark Patterns — FairUX AI" },
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
  "Parsing UI hierarchy…",
  "Cross-referencing 412 dark pattern signatures…",
  "Evaluating consent flows…",
  "Scoring manipulation risk…",
  "Generating UX fix recommendations…",
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
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.size > 6 * 1024 * 1024) {
      setError("Image must be under 6 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setImageName(f.name);
      setMode("upload");
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
      setStage((s) => (s + 1) % SCAN_STAGES.length);
    }, 900);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok && res.status !== 200) {
        const j = await res.json().catch(() => ({}));
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
    <div className="min-h-screen">
      <SiteHeader />
      <section className="relative mx-auto max-w-5xl px-6 pt-16 pb-24">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-muted-foreground mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Powered by Gemini multimodal AI
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-balance">
            Run a <span className="gradient-text">dark pattern audit</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Upload a UI screenshot, paste a URL, or paste popup text. Get a complete report in seconds.
          </p>
        </div>

        <div className="mt-12 glass-strong rounded-3xl p-1.5">
          <div className="rounded-[20px] bg-card/60 backdrop-blur p-6 sm:p-8">
            {/* Mode switcher */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { k: "url", I: Globe, l: "Website URL" },
                { k: "upload", I: Upload, l: "Screenshot" },
                { k: "text", I: Type, l: "Popup text" },
              ].map(({ k, I, l }) => {
                const active = mode === k;
                return (
                  <button
                    key={k}
                    onClick={() => setMode(k as Mode)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                      active
                        ? "text-primary-foreground glow-primary"
                        : "glass text-muted-foreground hover:text-foreground"
                    }`}
                    style={active ? { background: "var(--gradient-primary)" } : undefined}
                  >
                    <I className="w-4 h-4" /> {l}
                  </button>
                );
              })}
            </div>

            {mode === "url" && (
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Website URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/checkout"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-2 w-full px-4 py-3.5 rounded-xl bg-input/50 border border-border focus:border-primary outline-none text-base font-mono"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Tip: Paste a checkout, signup, or cancellation flow URL for the most actionable findings.
                </p>
              </div>
            )}

            {mode === "upload" && (
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Screenshot</label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files?.[0];
                    if (f) handleFile(f);
                  }}
                  onClick={() => fileRef.current?.click()}
                  className="mt-2 relative cursor-pointer rounded-xl border-2 border-dashed border-border hover:border-primary transition p-8 text-center bg-input/30"
                >
                  {image ? (
                    <div className="relative">
                      <img src={image} alt="preview" className="max-h-64 mx-auto rounded-lg" />
                      <button
                        onClick={(e) => { e.stopPropagation(); setImage(null); setImageName(null); }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-destructive/20"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="text-xs text-muted-foreground mt-3">{imageName}</div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <div className="mt-3 text-sm font-medium">Drop a screenshot or click to upload</div>
                      <div className="text-xs text-muted-foreground mt-1">PNG, JPG up to 6 MB</div>
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
                  placeholder={`Paste a popup, modal copy, or consent banner text...\n\nExample:\n"Your free trial ends in 23h 47m! Subscribe now or lose your saved data forever."`}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={8}
                  className="mt-2 w-full px-4 py-3.5 rounded-xl bg-input/50 border border-border focus:border-primary outline-none text-sm font-mono resize-none"
                />
              </div>
            )}

            {error && (
              <div className="mt-4 text-sm text-destructive bg-destructive/10 border border-destructive/40 rounded-lg px-4 py-2.5">
                {error}
              </div>
            )}

            <button
              onClick={submit}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold text-primary-foreground glow-primary hover:scale-[1.01] transition"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Sparkles className="w-5 h-5" /> Analyze with Gemini AI
            </button>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-success" /> Secure scan</span>
              <span className="inline-flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-success" /> Data deleted after scan</span>
              <span>No account required</span>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function ScanningState({ stage }: { stage: number }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-mesh">
      <div className="glass-strong rounded-3xl p-12 max-w-lg w-full text-center relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 overflow-hidden">
          <div className="h-full w-1/3 rounded-full"
               style={{ background: "var(--gradient-primary)", animation: "shimmer 2s linear infinite" }} />
        </div>

        <div className="relative inline-flex">
          <div className="w-24 h-24 rounded-full glass flex items-center justify-center"
               style={{ animation: "pulse-glow 2s ease-in-out infinite" }}>
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i}
                 className="absolute top-1/2 left-1/2 w-3 h-3 -mt-1.5 -ml-1.5 rounded-full bg-primary"
                 style={{
                   animation: `orbit ${4 + i}s linear infinite`,
                   animationDelay: `${i * 0.6}s`,
                   opacity: 0.6,
                 }} />
          ))}
        </div>

        <h2 className="mt-8 text-2xl font-display font-bold">Scanning deceptive patterns</h2>
        <p className="mt-2 text-sm text-muted-foreground min-h-[1.25rem]">{SCAN_STAGES[stage]}</p>

        <div className="mt-6 space-y-1.5 text-left">
          {SCAN_STAGES.map((s, i) => (
            <div key={s} className={`flex items-center gap-2 text-xs ${i <= stage ? "text-foreground" : "text-muted-foreground/50"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${i <= stage ? "bg-success" : "bg-muted"}`} />
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
