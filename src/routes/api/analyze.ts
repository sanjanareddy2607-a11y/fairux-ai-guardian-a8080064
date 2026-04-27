import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPT = `You are FairUX AI, an expert UX ethics auditor specializing in detecting dark patterns,
manipulative UI/UX, and deceptive design tricks. You analyze websites, screenshots, and UI text
for the following categories of dark patterns:

- Forced subscriptions / continuity
- Hidden charges / sneak into basket
- Fake urgency (countdown timers, "only X left")
- Misleading buttons (visual hierarchy tricks)
- Disguised ads
- Confirmshaming / guilt popups
- Difficult cancellation / roach motel
- Confusing consent / pre-ticked boxes / cookie walls
- Deceptive free trial traps
- Bait and switch
- Privacy zuckering
- Misdirection

Be precise, evidence-based, and constructive. Always return ALL fields. Never invent specific
quotes — describe patterns observed.`;

const TOOL = {
  type: "function" as const,
  function: {
    name: "report_audit",
    description: "Return a complete dark pattern audit report.",
    parameters: {
      type: "object",
      properties: {
        riskScore: {
          type: "number",
          description: "0-100. Higher = more dark patterns detected.",
        },
        trustScore: {
          type: "number",
          description: "0-100. Higher = more trustworthy. Should roughly inversely correlate with riskScore.",
        },
        compliance: {
          type: "string",
          enum: ["safe", "warning", "high_risk"],
        },
        summary: {
          type: "string",
          description: "A 2-3 sentence executive summary of the audit.",
        },
        violations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              pattern: { type: "string", description: "Short name, e.g. 'Fake urgency timer'." },
              severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
              description: { type: "string", description: "Concrete description of what was observed." },
              why_harmful: { type: "string", description: "1-2 sentences explaining harm to users." },
              fix: { type: "string", description: "Actionable UX fix recommendation." },
            },
            required: ["pattern", "severity", "description", "why_harmful", "fix"],
            additionalProperties: false,
          },
        },
        recommendations: {
          type: "array",
          items: { type: "string" },
          description: "3-6 high-level UX improvement recommendations.",
        },
      },
      required: ["riskScore", "trustScore", "compliance", "summary", "violations", "recommendations"],
      additionalProperties: false,
    },
  },
};

function mockReport(reason: string) {
  return {
    riskScore: 78,
    trustScore: 32,
    compliance: "high_risk" as const,
    summary:
      "Multiple high-severity dark patterns detected. The interface uses urgency manipulation, " +
      "misleading visual hierarchy, and obscured cancellation flows that erode user trust. " +
      `(Demo data — ${reason})`,
    violations: [
      {
        pattern: "Fake urgency countdown",
        severity: "high",
        description: "A countdown timer pressures users to act within minutes without verifiable basis.",
        why_harmful: "Creates anxiety-driven decisions and bypasses rational evaluation, harming user autonomy.",
        fix: "Remove arbitrary timers. Only show real, verifiable deadlines tied to inventory or pricing windows.",
      },
      {
        pattern: "Misleading primary button",
        severity: "high",
        description: "The 'Continue with subscription' CTA is visually dominant while 'No thanks' is greyed out.",
        why_harmful: "Visual hierarchy steers users into the option that benefits the business, not them.",
        fix: "Give both options equal visual weight. Treat decline as a first-class choice.",
      },
      {
        pattern: "Hidden cancellation",
        severity: "critical",
        description: "Cancellation requires 4+ clicks through unrelated upsell screens.",
        why_harmful: "Roach motel pattern — easy to enter, hard to leave. Often illegal under EU/CA consumer law.",
        fix: "Place cancel one click from account settings. No upsell interstitials.",
      },
      {
        pattern: "Forced cookie consent",
        severity: "medium",
        description: "Pre-ticked non-essential cookies with a styled 'Accept All' and a buried 'Reject'.",
        why_harmful: "Violates GDPR/ePrivacy informed consent requirements.",
        fix: "Equal-weight Accept/Reject buttons. No pre-ticked boxes.",
      },
      {
        pattern: "Confirmshaming opt-out",
        severity: "medium",
        description: "Decline label reads 'No, I don't care about saving money.'",
        why_harmful: "Uses guilt to manipulate user choice.",
        fix: "Use neutral language: 'Decline' or 'No thanks'.",
      },
    ],
    recommendations: [
      "Audit every CTA pair for equal visual weight.",
      "Make the cancel/decline path one click from account settings.",
      "Replace urgency timers with real, evidence-based deadlines.",
      "Move to a single-click reject for non-essential cookies.",
      "Run plain-language reviews on all opt-out copy.",
      "Surface total price (incl. taxes/shipping) before checkout.",
    ],
    scannedAt: new Date().toISOString(),
  };
}

export const Route = createFileRoute("/api/analyze")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            url?: string;
            text?: string;
            image?: string; // data URL
          };

          const apiKey = process.env.LOVABLE_API_KEY;

          // Build the user message
          const parts: Array<{ type: string; text?: string; image_url?: { url: string } }> = [];
          let sourceLabel = "";

          if (body.image) {
            parts.push({
              type: "text",
              text: "Audit this UI screenshot for dark patterns. Return a complete report via the report_audit function.",
            });
            parts.push({ type: "image_url", image_url: { url: body.image } });
            sourceLabel = "screenshot";
          } else if (body.url) {
            parts.push({
              type: "text",
              text: `Audit the website at ${body.url} based on common dark patterns found on similar products. Be specific about likely violations and produce a complete report via the report_audit function.`,
            });
            sourceLabel = body.url;
          } else if (body.text) {
            parts.push({
              type: "text",
              text: `Audit the following UI copy / popup text for dark patterns. Produce a complete report via the report_audit function.\n\n---\n${body.text}\n---`,
            });
            sourceLabel = "popup text";
          } else {
            return new Response(JSON.stringify({ error: "Provide url, text, or image." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (!apiKey) {
            return new Response(
              JSON.stringify({ ...mockReport("AI key not configured"), sourceLabel }),
              { headers: { "Content-Type": "application/json" } },
            );
          }

          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: parts },
              ],
              tools: [TOOL],
              tool_choice: { type: "function", function: { name: "report_audit" } },
            }),
          });

          if (res.status === 429) {
            return new Response(
              JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
              { status: 429, headers: { "Content-Type": "application/json" } },
            );
          }
          if (res.status === 402) {
            return new Response(
              JSON.stringify({ error: "AI credits exhausted. Add funds in workspace settings." }),
              { status: 402, headers: { "Content-Type": "application/json" } },
            );
          }

          if (!res.ok) {
            const errText = await res.text();
            console.error("Gateway error", res.status, errText);
            return new Response(
              JSON.stringify({ ...mockReport(`AI gateway returned ${res.status}`), sourceLabel }),
              { headers: { "Content-Type": "application/json" } },
            );
          }

          const data = await res.json() as {
            choices?: Array<{
              message?: {
                tool_calls?: Array<{ function?: { arguments?: string } }>;
              };
            }>;
          };

          const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
          if (!args) {
            return new Response(
              JSON.stringify({ ...mockReport("AI returned no structured output"), sourceLabel }),
              { headers: { "Content-Type": "application/json" } },
            );
          }

          const parsed = JSON.parse(args);
          return new Response(
            JSON.stringify({
              ...parsed,
              scannedAt: new Date().toISOString(),
              sourceLabel,
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        } catch (err) {
          console.error("analyze error", err);
          return new Response(
            JSON.stringify({ ...mockReport("Unexpected server error"), sourceLabel: "fallback" }),
            { headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
