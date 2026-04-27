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

Be precise, evidence-based, and constructive. Always return ALL fields via the report_audit
function. Reference relevant regulations (GDPR, ePrivacy, FTC Act §5, EU Digital Services Act,
California ROSCA, India DPDPA) in legalWarning when applicable. Never invent specific quotes —
describe patterns observed.`;

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
          description: "0-100. Higher = more trustworthy. Roughly inverse of riskScore.",
        },
        compliance: {
          type: "string",
          enum: ["safe", "warning", "high_risk"],
          description: "Overall compliance status.",
        },
        severityLevel: {
          type: "string",
          enum: ["low", "medium", "high", "critical"],
          description: "The single highest severity level present in the audit.",
        },
        legalWarning: {
          type: "string",
          description:
            "Plain-language warning citing the most relevant regulation(s) violated, e.g. " +
            "'Pre-ticked consent boxes violate GDPR Art. 7 and ePrivacy Directive.'",
        },
        summary: {
          type: "string",
          description: "A 2-3 sentence executive summary of the audit.",
        },
        violations: {
          type: "array",
          description: "Each detected dark pattern.",
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
      required: [
        "riskScore",
        "trustScore",
        "compliance",
        "severityLevel",
        "legalWarning",
        "summary",
        "violations",
        "recommendations",
      ],
      additionalProperties: false,
    },
  },
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function deriveExtras(parsed: {
  riskScore?: number;
  violations?: Array<{ severity?: string }>;
  legalWarning?: string;
  severityLevel?: string;
}) {
  const order = ["low", "medium", "high", "critical"] as const;
  const maxSeverity =
    parsed.violations?.reduce<(typeof order)[number]>((acc, v) => {
      const s = (v.severity ?? "low") as (typeof order)[number];
      return order.indexOf(s) > order.indexOf(acc) ? s : acc;
    }, "low") ?? "low";

  return {
    severityLevel: parsed.severityLevel ?? maxSeverity,
    legalWarning:
      parsed.legalWarning ??
      "Patterns detected may violate consumer protection rules under the FTC Act §5, EU Digital Services Act, and GDPR/ePrivacy when applied to EU users.",
  };
}

export const Route = createFileRoute("/api/analyze")({
  server: {
    handlers: {
      // Health check — confirms the route is reachable
      GET: async () => {
        return jsonResponse({
          ok: true,
          service: "FairUX AI Analyzer",
          model: "google/gemini-2.5-flash",
          accepts: ["url", "text", "image"],
          method: "POST",
        });
      },

      POST: async ({ request }) => {
        let body: { url?: string; text?: string; image?: string };
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return jsonResponse({ error: "Invalid JSON body." }, 400);
        }

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return jsonResponse(
            {
              error:
                "AI service is not configured. The LOVABLE_API_KEY secret is missing on the server.",
            },
            500,
          );
        }

        const parts: Array<{ type: string; text?: string; image_url?: { url: string } }> = [];
        let sourceLabel = "";

        if (body.image) {
          if (!body.image.startsWith("data:image/")) {
            return jsonResponse(
              { error: "Image must be a data URL (data:image/...;base64,...)." },
              400,
            );
          }
          parts.push({
            type: "text",
            text:
              "Audit this UI screenshot for dark patterns. Be specific about what you observe — " +
              "button hierarchy, copy tone, urgency cues, consent design, hidden options. " +
              "Return a complete report via the report_audit function.",
          });
          parts.push({ type: "image_url", image_url: { url: body.image } });
          sourceLabel = "screenshot";
        } else if (body.url) {
          const url = body.url.trim();
          if (!/^https?:\/\//i.test(url)) {
            return jsonResponse({ error: "URL must start with http:// or https://" }, 400);
          }
          parts.push({
            type: "text",
            text:
              `Audit the website at ${url} for likely dark patterns based on what is typical for ` +
              `products in this category. Be specific about probable violations on checkout, ` +
              `consent, cancellation, and pricing flows. Return a complete report via the ` +
              `report_audit function.`,
          });
          sourceLabel = url;
        } else if (body.text) {
          const text = body.text.trim();
          if (text.length < 10) {
            return jsonResponse({ error: "Provide at least 10 characters of text." }, 400);
          }
          parts.push({
            type: "text",
            text:
              `Audit the following UI copy / popup text for dark patterns. Identify every ` +
              `manipulative technique present. Produce a complete report via the report_audit ` +
              `function.\n\n---\n${text}\n---`,
          });
          sourceLabel = "popup text";
        } else {
          return jsonResponse(
            { error: "Provide one of: url, text, or image (data URL)." },
            400,
          );
        }

        let res: Response;
        try {
          res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
        } catch (err) {
          console.error("AI gateway network error", err);
          return jsonResponse(
            { error: "Could not reach AI service. Please try again." },
            502,
          );
        }

        if (res.status === 429) {
          return jsonResponse(
            { error: "Rate limit reached. Please wait a moment and try again." },
            429,
          );
        }
        if (res.status === 402) {
          return jsonResponse(
            {
              error:
                "AI credits exhausted. Add funds in Settings → Workspace → Usage to continue.",
            },
            402,
          );
        }
        if (!res.ok) {
          const errText = await res.text().catch(() => "");
          console.error("AI gateway error", res.status, errText);
          return jsonResponse(
            { error: `AI service returned ${res.status}. Please try again.` },
            502,
          );
        }

        let data: {
          choices?: Array<{
            message?: {
              content?: string | null;
              tool_calls?: Array<{ function?: { arguments?: string } }>;
            };
          }>;
        };
        try {
          data = await res.json();
        } catch (err) {
          console.error("AI response was not JSON", err);
          return jsonResponse({ error: "AI returned an invalid response." }, 502);
        }

        const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
        if (!args) {
          console.error("No tool call in AI response", JSON.stringify(data).slice(0, 1000));
          return jsonResponse(
            { error: "AI did not return a structured audit. Please retry." },
            502,
          );
        }

        let parsed: Record<string, unknown>;
        try {
          parsed = JSON.parse(args);
        } catch (err) {
          console.error("Could not parse tool arguments", err, args.slice(0, 500));
          return jsonResponse(
            { error: "AI returned malformed audit data. Please retry." },
            502,
          );
        }

        const extras = deriveExtras(parsed as Parameters<typeof deriveExtras>[0]);

        return jsonResponse({
          ...parsed,
          ...extras,
          // Aliases for the frontend contract requested by the user
          darkPatternsDetected: parsed.violations,
          recommendedFixes: parsed.recommendations,
          complianceStatus: parsed.compliance,
          scannedAt: new Date().toISOString(),
          sourceLabel,
        });
      },
    },
  },
});
