"use client"

import {
  LogIn,
} from "lucide-react"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { NavUser } from "@/components/nav-user"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import useProfile from "@/hooks/useProfile"

export function SidebarAuth() {
  const { data, loading } = useProfile()
  
  return (
    <>
      <SignedIn>
        {!loading && data?.user && (
          <NavUser user={data.user} />
        )}
      </SignedIn>
      
      <SignedOut>
        <SidebarMenu>
          <SidebarMenuItem>
            <SignInButton mode="modal">
              <SidebarMenuButton size="lg" className="bg-gray-200 hover:bg-gray-300 transition-all duration-300 cursor-pointer">
                <LogIn className="mr-2 h-4 w-4" />
                <span>Sign In</span>
              </SidebarMenuButton>
            </SignInButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SignedOut>
    </>
  )
} 