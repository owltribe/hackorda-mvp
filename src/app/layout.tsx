import type { Metadata } from "next";
import "./globals.css";
import { TanstackQueryProvider } from './_tanstack-providers';
import { ClerkProvider, SignedIn } from '@clerk/nextjs'
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "sonner";
import { BreadcrumbNav } from "@/components/breadcrumb-nav"

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
                      <header className="sticky top-2 z-10 flex items-center pt-2 pb-3">
                        <BreadcrumbNav />
                      </header>
                      <main className="flex-1 w-full overflow-y-auto py-4">
                        {children}
                      </main>
                    </div>
                  </div>  
                  <Toaster 
                    expand={false} 
                    richColors 
                    closeButton
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
