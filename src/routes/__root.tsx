import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 bg-mesh">
      <div className="glass-strong max-w-md text-center p-10 rounded-3xl">
        <div className="text-7xl font-bold gradient-text font-display">404</div>
        <h2 className="mt-4 text-xl font-semibold">Signal lost</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page drifted into deep space. Let's get you back.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition glow-primary"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FairUX AI — Detect Dark Patterns Before They Harm Users" },
      {
        name: "description",
        content:
          "AI-powered UX auditing for ethical products. Scan websites and screenshots with Gemini AI to detect dark patterns, manipulative flows, and deceptive design.",
      },
      { name: "author", content: "FairUX AI" },
      { property: "og:title", content: "FairUX AI — Detect Dark Patterns Before They Harm Users" },
      { property: "og:description", content: "FairUX AI detects manipulative UI/UX dark patterns on websites and apps using AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "FairUX AI — Detect Dark Patterns Before They Harm Users" },
      { name: "description", content: "FairUX AI detects manipulative UI/UX dark patterns on websites and apps using AI." },
      { name: "twitter:description", content: "FairUX AI detects manipulative UI/UX dark patterns on websites and apps using AI." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7e743276-bc80-4c02-b6dc-7181f6ebb546/id-preview-be305c93--27c68564-4cc4-45be-8eda-2c02fec780c1.lovable.app-1777300412417.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7e743276-bc80-4c02-b6dc-7181f6ebb546/id-preview-be305c93--27c68564-4cc4-45be-8eda-2c02fec780c1.lovable.app-1777300412417.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
