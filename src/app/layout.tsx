import type { Metadata } from "next";
import "./globals.css";
import { TanstackQueryProvider } from './_tanstack-providers';
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle/theme-toggle";

export const metadata: Metadata = {
  title: "HackOrda MVP",
  description: "Phase 1: Quiz App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background">
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <TanstackQueryProvider>
              <SidebarProvider>
                <div className="flex h-screen w-full mx-2">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col w-full my-2">
                    <header className="sticky top-0 z-10 flex justify-between items-center border-b border-green-brand py-2 shrink-0">
                      <SidebarTrigger />
                      <ThemeToggle />
                    </header>
                    <main className="flex-1 w-full overflow-y-auto py-4 pr-3">
                      {children}
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            </TanstackQueryProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
