"use client"

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ProfileData {
  user: UserProfile;
}

export default function useProfile() {
  const { user, isLoaded } = useUser();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (user) {
      // Create profile data from Clerk user
      try {
        const profileData: ProfileData = {
          user: {
            id: user.id,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.emailAddresses[0]?.emailAddress || "",
          }
        };
        setData(profileData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [user, isLoaded]);

  return { data, loading, error };
} 