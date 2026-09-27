import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import AppShell from "@/components/AppShell";
import PomodoroTimer from "@/components/PomodoroTimer";
import "./globals.css";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Study Notes",
  description: "Organize and manage your study notes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${fraunces.variable}`}>
        <AppShell>{children}</AppShell>
        <PomodoroTimer />
      </body>
    </html>
  );
}
