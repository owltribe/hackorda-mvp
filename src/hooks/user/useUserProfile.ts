"use client"

import { useQuery } from "@tanstack/react-query";
import { UserProfile } from "@/types";
// import { useAuth } from "@clerk/nextjs";

export const useUserProfile = () => {
  // Get Clerk authentication state
  // const { isLoaded: isClerkLoaded } = useAuth();

  const getUserProfile = async () => {
    const response = await fetch('/api/users/me');
    if (!response.ok) {
      let errorMsg = `Failed to fetch user data (Status: ${response.status})`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
      throw new Error(errorMsg);
    }
    const userData = await response.json();
    
    if (!userData.success || !userData.data) {
      throw new Error(userData.error || 'Failed to fetch user data');
    }
    
    return userData.data;
  };

  return useQuery<UserProfile, Error>({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    // Add caching and performance optimizations
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Limit retries to reduce unnecessary calls
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    // Only start fetching once Clerk is loaded
    // enabled: isClerkLoaded,
  });
}; 