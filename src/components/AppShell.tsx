"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

// Pages that don't use the sidebar layout
const AUTH_PATHS = ["/login", "/register"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = AUTH_PATHS.some(p => pathname.startsWith(p));

  if (isAuth) {
    return <>{children}</>;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        {children}
      </div>
    </div>
  );
}
