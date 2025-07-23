"use client";

import { useEffect } from "react";
import { useAuthStore } from "src/store/useAuthStore";

export default function AppInit({ children }: { children: React.ReactNode }) {
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  return <>{children}</>;
}
