export type Severity = "low" | "medium" | "high" | "critical";

export interface Violation {
  pattern: string;
  severity: Severity;
  description: string;
  why_harmful: string;
  fix: string;
}

export interface AnalysisResult {
  riskScore: number;       // 0-100 (higher = more dark patterns)
  trustScore: number;      // 0-100 (higher = more trustworthy)
  compliance: "safe" | "warning" | "high_risk";
  summary: string;
  violations: Violation[];
  recommendations: string[];
  scannedAt: string;
  source: { type: "url" | "text" | "image"; value: string };
}

const KEY = "fairux:last-result";

export function saveResult(r: AnalysisResult) {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(r));
  }
}

export function loadResult(): AnalysisResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AnalysisResult) : null;
  } catch {
    return null;
  }
}
