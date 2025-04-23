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
              <SidebarTrigger variant="outline" />
              <span className="truncate text-sm text-green-brand">|</span>
              <Link href="/" className="hover:text-green-brand/90 truncate">
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