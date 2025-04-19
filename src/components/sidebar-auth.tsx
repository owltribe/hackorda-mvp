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
import { useUserProfile } from "@/hooks/user/useUserProfile"

export function SidebarAuth() {
  const { data: user, isLoading } = useUserProfile()
  
  return (
    <>
      <SignedIn>
        {isLoading ? (
          <div className="p-4">Loading...</div>
        ) : user && (
          <NavUser user={user} />
        )}
      </SignedIn>
      
      <SignedOut>
        <SidebarMenu>
          <SidebarMenuItem>
            <SignInButton mode="modal">
              <SidebarMenuButton size="lg" className="border-y border-green-brand hover:bg-green-brand/10 transition-all duration-300 cursor-pointer">
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