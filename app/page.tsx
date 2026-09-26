"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import DashboardPage from "./dashboard/DashboardPage";

export default function HomePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--primary-light)] border-t-[var(--primary)]" />
      </main>
    );
  }

  if (session) {
    return <DashboardPage />;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--background)]">
      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-up">
              <span className="inline-flex items-center rounded-full bg-[var(--primary-light)] px-4 py-2 text-sm font-semibold text-[var(--primary)]">
                ✦ Your personal study space
              </span>
            </div>

            <h1
              className="display-title mt-7 animate-fade-up text-5xl font-bold leading-tight text-[var(--foreground)] sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "80ms" }}
            >
              Organize your learning.
              <span className="block text-[var(--primary)]">
                Study smarter.
              </span>
            </h1>

            <p
              className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg leading-8 text-[var(--muted)] sm:text-xl"
              style={{ animationDelay: "160ms" }}
            >
              Keep all your study notes organized in one simple,
              beautiful workspace. Create, edit, search and manage
              your notes effortlessly.
            </p>

            <div
              className="mt-9 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href="/register"
                className="primary-button w-full sm:w-auto"
              >
                Get Started
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="/login"
                className="w-full rounded-xl border border-[var(--border)] bg-white px-5 py-3 text-center text-sm font-semibold text-[var(--foreground)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--primary)] sm:w-auto"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Preview */}
          <div
            className="mx-auto mt-16 max-w-5xl animate-scale-in"
            style={{ animationDelay: "350ms" }}
          >
            <div className="rounded-2xl border border-[var(--border)] bg-white p-3 shadow-xl shadow-black/5 sm:p-5">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5 sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-3 w-24 rounded-full bg-gray-200" />
                    <div className="mt-3 h-6 w-40 rounded-lg bg-gray-300" />
                  </div>

                  <div className="h-10 w-28 rounded-xl bg-[var(--primary-light)]" />
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="card">
                    <div className="h-5 w-20 rounded-full bg-[var(--primary-light)]" />
                    <div className="mt-5 h-5 w-4/5 rounded bg-gray-200" />
                    <div className="mt-3 h-3 w-full rounded bg-gray-100" />
                    <div className="mt-2 h-3 w-3/4 rounded bg-gray-100" />
                  </div>

                  <div className="card">
                    <div className="h-5 w-24 rounded-full bg-[var(--primary-light)]" />
                    <div className="mt-5 h-5 w-3/4 rounded bg-gray-200" />
                    <div className="mt-3 h-3 w-full rounded bg-gray-100" />
                    <div className="mt-2 h-3 w-2/3 rounded bg-gray-100" />
                  </div>

                  <div className="card">
                    <div className="h-5 w-20 rounded-full bg-[var(--primary-light)]" />
                    <div className="mt-5 h-5 w-4/5 rounded bg-gray-200" />
                    <div className="mt-3 h-3 w-full rounded bg-gray-100" />
                    <div className="mt-2 h-3 w-3/4 rounded bg-gray-100" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[var(--border)] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
              Everything you need
            </p>

            <h2 className="display-title mt-3 text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
              A simpler way to study
            </h2>

            <p className="mt-4 text-[var(--muted)]">
              Focus on learning while Study Notes takes care of
              keeping everything organized.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="card card-hover">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-xl">
                ✎
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Create notes
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Quickly create notes with a title, subject and
                detailed content.
              </p>
            </div>

            <div className="card card-hover">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-xl">
                ◈
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Stay organized
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Keep your subjects and notes organized in one
                central workspace.
              </p>
            </div>

            <div className="card card-hover">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-xl">
                ✓
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Study efficiently
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Find your notes quickly and spend more time
                focusing on what matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--primary)]">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <h2 className="display-title text-3xl font-bold text-white sm:text-4xl">
            Ready to organize your notes?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
            Create your free account and start building your
            personal study workspace.
          </p>

          <Link
            href="/register"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[var(--primary)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Create your account
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] bg-white px-4 py-8 text-center text-sm text-[var(--muted)]">
        © {new Date().getFullYear()} Study Notes Manager
      </footer>
    </main>
  );
}