'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardView() {
  const { user } = useAuth();
  const router = useRouter();

  // console.log(user);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return <div>Welcome to the Dashboard, {user?.email}!</div>;
}