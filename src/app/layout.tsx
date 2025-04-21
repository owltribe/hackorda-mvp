import type { Metadata } from "next";
import "./globals.css";
import { TanstackQueryProvider } from './_tanstack-providers';
import { ClerkProvider, SignedIn } from '@clerk/nextjs'
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle/theme-toggle";
import { Toaster } from "sonner";

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
              <SignedIn>
                <SidebarProvider>
                  <div className="flex h-screen w-full mx-2">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col w-full mb-2 mr-2">
                      <header className="sticky top-0 z-10 flex justify-between items-center py-2 shrink-0">
                        <SidebarTrigger />
                        <ThemeToggle />
                      </header>
                      <main className="flex-1 w-full overflow-y-auto py-2">
                        {children}
                      </main>
                    </div>
                  </div>
                  <Toaster 
                    position="top-right" 
                    expand={false} 
                    richColors 
                    closeButton
                    toastOptions={{
                      duration: 4000,
                    }}
                  />
                </SidebarProvider>
              </SignedIn>
            </TanstackQueryProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
