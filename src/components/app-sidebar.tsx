"use client";

import * as React from "react"
import {
  Home,
  User,
  Send,
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
import { useEffect, useRef } from "react";
import { ThemeToggle } from "./theme-toggle/theme-toggle";

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

const secondaryItems = [
  {
    title: "Feedback",
    url: "#",
    icon: Send,
  }
];

export function AppSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const sessionId = parseInt(params.sessionId as string);
  const isInQuiz = pathname.startsWith(`/quiz/${sessionId}`) && !pathname.includes('/results') && pathname !== '/quiz';
  const { setOpen } = useSidebar();
  const hasAutoCollapsed = useRef(false);
  
  // Automatically collapse sidebar 1 time
  useEffect(() => {
    if (isInQuiz && !hasAutoCollapsed.current) {
      setOpen(false);
      hasAutoCollapsed.current = true;
    } else if (!isInQuiz) {
      // Reset the flag when leaving quiz
      hasAutoCollapsed.current = false;
    }
  }, [isInQuiz, setOpen]);

  return (
    <Sidebar 
      variant="floating"
      collapsible="icon"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex flex-row items-center gap-2">
              <SidebarTrigger />
              <span className="truncate text-sm text-green-brand">|</span>
              <h3 className="truncate text-lg">hackorda.kz</h3>
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
                <div className="flex flex-row items-center gap-2">
                  <ThemeToggle />
                  {secondaryItems.map((item) => (
                    <SidebarMenuItem key={item.title} className="flex-1">
                      <SidebarMenuButton asChild className="w-full border border-gray py-4.5 hover:bg-green-brand/10 dark:hover:bg-green-brand/10">
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
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