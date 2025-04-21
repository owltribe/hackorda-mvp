"use client"

import {
  LogIn,
} from "lucide-react"
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs"
import { NavUser } from "@/components/nav-user"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function SidebarAuth() {
  const { user, isLoaded } = useUser()
  
  return (
    <>
      <SignedIn>
        {!isLoaded ? (
          <div className="p-4">Loading user...</div>
        ) : user ? (
          <NavUser user={{
            id: user.id,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.primaryEmailAddress?.emailAddress || '',
          }} />
        ) : (
          <div className="p-4">User not found.</div>
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