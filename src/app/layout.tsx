import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import "~/app/globals.css";

export const metadata: Metadata = {
  title: "Gabriel Bianchi games",
  description: "Games made using react",
  openGraph: {
    title: "Gabriel Bianchi games",
    description: "Games made using react",
    siteName: "GabrielBianchi-Games",
  },
  twitter: {
    card: "summary_large_image",
    site: "@dbianchii",
    creator: "@dbianchii",
  },
};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="text-foreground min-h-screen bg-gradient-to-tl from-purple-500 to-cyan-500 font-sans antialiased">
        <div className="flex min-h-screen flex-col">{props.children}</div>
      </body>
    </html>
  );
}
