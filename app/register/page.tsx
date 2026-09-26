"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({ name, email, password });
      if (error) {
        setError(error.message || "Unable to create account.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : 3;

  const strengthLabel = ["", "Weak", "Fair", "Strong"][strength];
  const strengthColor = ["", "#dc2626", "#d97706", "#16a34a"][strength];

  return (
    <main
      className="min-h-screen"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "var(--background)",
      }}
    >
      {/* Left panel — decorative */}
      <div
        className="hidden lg:flex"
        style={{
          background: "linear-gradient(135deg, #6555e0 0%, #7c6af7 50%, #a78bfa 100%)",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "320px", height: "320px", borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-60px",
          width: "260px", height: "260px", borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }} />

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.25rem", fontWeight: 800, color: "white",
          }}>S</div>
          <span style={{ color: "white", fontWeight: 700, fontSize: "1.1rem" }}>Study Notes</span>
        </div>

        <div>
          <blockquote style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.4, fontFamily: "var(--font-fraunces), serif", letterSpacing: "-0.02em" }}>
            "An investment in knowledge pays the best interest."
          </blockquote>
          <p style={{ color: "rgba(255,255,255,0.65)", marginTop: "1rem", fontSize: "0.875rem" }}>
            — Benjamin Franklin
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {["Free to use, always", "All your notes in one place", "Organized by subject"].map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.875rem" }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "2rem 1.5rem",
          gridColumn: "1 / -1",
        }}
        className="lg:grid-cols-none"
      >
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <div style={{ marginBottom: "2rem" }}>
            <h1
              className="display-title"
              style={{ fontSize: "2rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.03em" }}
            >
              Create your account
            </h1>
            <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "var(--muted)" }}>
              Start organizing your study notes today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card animate-scale-in" style={{ padding: "2rem" }}>
            {error && (
              <div
                className="animate-scale-in"
                style={{
                  marginBottom: "1.25rem",
                  borderRadius: "10px",
                  border: "1px solid #fca5a5",
                  background: "var(--danger-light)",
                  padding: "0.75rem 1rem",
                  fontSize: "0.875rem",
                  color: "#991b1b",
                  fontWeight: 500,
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label htmlFor="name" style={labelStyle}>Full name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="form-input"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="email" style={labelStyle}>Email address</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="password" style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    style={{ paddingRight: "2.75rem" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute", right: "0.75rem", top: "50%",
                      transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--muted-light)", padding: "4px",
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password strength */}
                {password.length > 0 && (
                  <div style={{ marginTop: "0.625rem" }}>
                    <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                      {[1, 2, 3].map(i => (
                        <div key={i} style={{
                          flex: 1, height: "3px", borderRadius: "999px",
                          background: i <= strength ? strengthColor : "var(--border)",
                          transition: "background 0.2s ease",
                        }} />
                      ))}
                    </div>
                    <p style={{ fontSize: "0.75rem", color: strengthColor, fontWeight: 500 }}>
                      {strengthLabel}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="primary-button"
                style={{ width: "100%", marginTop: "0.25rem", justifyContent: "center" }}
              >
                {loading ? (
                  <>
                    <span style={{
                      display: "inline-block", width: 14, height: 14,
                      border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "white",
                      borderRadius: "50%", animation: "spin 0.75s linear infinite",
                    }} />
                    Creating account…
                  </>
                ) : "Create account"}
              </button>
            </div>

            <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "var(--muted)" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ fontWeight: 600, color: "var(--primary)", textDecoration: "none" }}>
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.5rem",
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--foreground)",
};
