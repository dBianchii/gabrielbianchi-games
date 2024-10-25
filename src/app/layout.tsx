import type { Metadata } from "next";

import "~/app/globals.css";
import { AppSidebar } from "~/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { ReactQueryProvider } from "./_components/providers";

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
      <body className="min-h-screen font-sans text-foreground antialiased">
        <ReactQueryProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-primary/2">
              {/* <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
              </div>
            </header> */}
              {props.children}
            </SidebarInset>
          </SidebarProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
