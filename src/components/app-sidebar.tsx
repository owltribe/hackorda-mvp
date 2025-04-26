"use client";

import * as React from "react"
import {
  Home,
  User,
  Trophy,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { QuizActionButton } from "@/components/quiz-action-button"
import { SidebarAuth } from "@/components/sidebar-auth"
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useEffect, useRef, MouseEvent } from "react";
import { ThemeToggle } from "./theme-toggle/theme-toggle";
import { toast } from "sonner";

const navItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    isActive: true
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Leaderboard",
    url: "/leaderboard",
    icon: Trophy,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const sessionId = params.sessionId ? parseInt(params.sessionId as string) : NaN;
  const isInQuiz = pathname.startsWith(`/quiz/`) && !pathname.includes('/results') && !isNaN(sessionId);
  const { setOpen } = useSidebar();
  const hasAutoCollapsed = useRef(false);

  // Automatically collapse sidebar 1 time
  useEffect(() => {
    if (isInQuiz && !hasAutoCollapsed.current) {
      setOpen(false);
      hasAutoCollapsed.current = true;
    } else if (!isInQuiz) {
      hasAutoCollapsed.current = false;
    }
  }, [isInQuiz, setOpen]);

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isInQuiz) {
      event.preventDefault();
      toast.warning("Are you sure you want to leave the quiz?",
        {
          description: "You may continue later. from profile page.",
          duration: 10000,
          position: "top-center",
          action: {
            label: "Leave",
            onClick: () => {
              window.location.href = "/";
            },
          },
        }
      );
    }
  };

  return (
    <Sidebar 
      variant="floating"
      collapsible="icon"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex flex-row items-center gap-2">
              <SidebarTrigger variant="outline" />
              <span className="truncate text-sm text-green-brand">|</span>
              <Link 
                href="/" 
                className="hover:text-green-brand/90 truncate"
                onClick={handleLogoClick}
                aria-label="Navigate to homepage. Action is blocked if a quiz is active."
              >
                <h3 className="text-lg">hackorda.kz</h3>
              </Link>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <QuizActionButton />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isInQuiz && (
          <>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="hover:bg-green-brand/10 border-b border-green-brand dark:hover:bg-green-brand/10">
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                <div className="flex flex-row items-center">
                  <ThemeToggle />
                </div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarAuth />
      </SidebarFooter>
    </Sidebar>
  )
}