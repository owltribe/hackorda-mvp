"use client";

import * as React from "react"
import {
  Home,
  User,
  Command,
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
} from "@/components/ui/sidebar"
import { QuizActionButton } from "@/components/quiz-action-button"
import { SidebarAuth } from "@/components/sidebar-auth"
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useEffect, useRef } from "react";

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
  const historyId = parseInt(params.historyId as string);
  const isInQuiz = pathname.startsWith(`/quiz/${historyId}`) && !pathname.includes('/results') && pathname !== '/quiz';
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
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-green-brand text-black">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">HackOrda MVP</span>
                  <span className="truncate text-xs">Phase 1</span>
                </div>
              </Link>
            </SidebarMenuButton>
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
                {secondaryItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="hover:bg-green-brand/10 py-5 dark:hover:bg-[#3a372b]">
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
        </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarAuth />
      </SidebarFooter>
    </Sidebar>
  )
}