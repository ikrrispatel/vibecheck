import type { Metadata } from "next";
import "./globals.css";
import { GalaxyBackground } from "@/components/landing/galaxy-background";

export const metadata: Metadata = {
  title: "VibeCheck — Test your creative intent before you publish",
  description:
    "Upload a visual, define the vibe you want it to communicate, and get audience-style feedback, alignment scoring, and concrete suggestions to improve it.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    title: "VibeCheck",
    description: "Test your creative intent before you publish.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning is applied here because browser extensions
    // (Dark Reader, Grammarly, ColorZilla, etc.) routinely inject attributes
    // into <html> and <body> before React hydrates. Without this, the dev
    // overlay throws a hydration mismatch on every page load for users with
    // those extensions installed. This only suppresses the warning for the
    // root element itself — child components still hydrate strictly.
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen text-text-primary"
        suppressHydrationWarning
      >
        {/* Full-screen galaxy background — fixed, behind all content */}
        <div
          aria-hidden
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <GalaxyBackground />
        </div>

        {/* Page content sits above the galaxy */}
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
