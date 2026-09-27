"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import DashboardPage from "./dashboard/DashboardPage";

export default function HomePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", background: "var(--background)",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "3px solid var(--primary-light)",
          borderTopColor: "var(--primary)",
          animation: "spin 0.75s linear infinite",
        }} />
      </div>
    );
  }

  if (!session) return null;

  return <DashboardPage />;
}
