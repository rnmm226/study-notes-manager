"use client";

import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Sidebar from "./Sidebar";

const NO_SHELL_PATHS = ["/login", "/register"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  // Auth pages: no sidebar
  const isAuthPage = NO_SHELL_PATHS.some(p => pathname.startsWith(p));
  if (isAuthPage) return <>{children}</>;

  // Not logged in (or still loading): no sidebar, just render children
  // (page.tsx will handle the redirect to /login)
  if (isPending || !session) return <>{children}</>;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        {children}
      </div>
    </div>
  );
}
