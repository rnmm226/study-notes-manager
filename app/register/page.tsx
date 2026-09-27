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
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { error } = await authClient.signUp.email({ name, email, password });
      if (error) { setError(error.message || "Unable to create account."); return; }
      router.push("/"); router.refresh();
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try { await authClient.signIn.social({ provider: "google", callbackURL: "/" }); }
    catch { setError("Google sign-in failed."); setGoogleLoading(false); }
  }

  const busy = loading || googleLoading;

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthMeta = [null,
    { label: "Too short", color: "#dc2626" },
    { label: "Could be stronger", color: "#d97706" },
    { label: "Strong", color: "#16a34a" },
  ][strength];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* ── Left brand panel ── */}
      <div style={{
        flex: "0 0 42%", display: "none",
        background: "#0f0e14",
        flexDirection: "column", justifyContent: "space-between",
        padding: "2.5rem", position: "relative", overflow: "hidden",
      }} className="auth-panel">
        <div style={{ position: "absolute", top: "-120px", left: "-120px", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,106,247,0.28) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", right: "-80px", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", position: "relative" }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1rem", color: "white" }}>S</div>
          <span style={{ color: "white", fontWeight: 700, fontSize: "1.0625rem" }}>Study Notes</span>
        </div>

        <div style={{ position: "relative" }}>
          <div style={{ width: 40, height: 3, borderRadius: 999, background: "var(--primary)", marginBottom: "1.5rem" }} />
          <p style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.45, fontFamily: "var(--font-fraunces), serif", letterSpacing: "-0.02em" }}>
            "An investment in knowledge pays the best interest."
          </p>
          <p style={{ color: "rgba(255,255,255,0.45)", marginTop: "1rem", fontSize: "0.875rem" }}>— Benjamin Franklin</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", position: "relative" }}>
          {["Free to use, always", "All notes in one place", "Organised by subject"].map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(124,106,247,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem" }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem", background: "#fafaf9" }}>
        <div style={{ width: "100%", maxWidth: 380 }} className="animate-fade-up">

          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "2.25rem" }} className="auth-mobile-logo">
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white", fontSize: "1rem" }}>S</div>
            <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--foreground)" }}>Study Notes</span>
          </div>

          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.025em", lineHeight: 1.2, fontFamily: "var(--font-fraunces), serif" }}>
            Create account
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "var(--muted)", marginBottom: "1.75rem" }}>
            Start organising your study notes today.
          </p>

          {error && (
            <div className="animate-scale-in" style={{ marginBottom: "1.25rem", padding: "0.75rem 1rem", borderRadius: 10, background: "var(--danger-light)", border: "1px solid #fca5a5", fontSize: "0.875rem", color: "#991b1b", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{ flexShrink: 0 }}><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
              {error}
            </div>
          )}

          {/* Google */}
          <button
            type="button" onClick={handleGoogle} disabled={busy}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem", padding: "0.7rem 1rem", borderRadius: 10, border: "1.5px solid var(--border)", background: "white", fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)", cursor: busy ? "not-allowed" : "pointer", transition: "all 0.18s", boxShadow: "var(--shadow-sm)", marginBottom: "1.125rem", opacity: busy ? 0.6 : 1 }}
            onMouseEnter={e => { if (!busy) { (e.currentTarget as HTMLButtonElement).style.borderColor = "#d1d5db"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-md)"; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-sm)"; }}
          >
            {googleLoading ? <Spin /> : <GoogleIcon />}
            {googleLoading ? "Redirecting…" : "Sign up with Google"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.125rem" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--muted-light)", fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Field label="Full name">
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="form-input" placeholder="Your name" autoComplete="name" disabled={busy} />
            </Field>

            <Field label="Email address">
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="form-input" placeholder="you@example.com" autoComplete="email" disabled={busy} />
            </Field>

            <Field label="Password">
              <div style={{ position: "relative" }}>
                <input type={showPwd ? "text" : "password"} required minLength={8} value={password} onChange={e => setPassword(e.target.value)} className="form-input" placeholder="At least 8 characters" autoComplete="new-password" style={{ paddingRight: "2.75rem" }} disabled={busy} />
                <button type="button" onClick={() => setShowPwd(v => !v)} tabIndex={-1} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted-light)", lineHeight: 0 }} aria-label={showPwd ? "Hide" : "Show"}>
                  {showPwd ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {password.length > 0 && (
                <div style={{ marginTop: "0.5rem" }}>
                  <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
                    {[1,2,3].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: i <= strength ? strengthMeta?.color : "var(--border)", transition: "background 0.25s" }} />
                    ))}
                  </div>
                  <p style={{ fontSize: "0.75rem", color: strengthMeta?.color, fontWeight: 500 }}>{strengthMeta?.label}</p>
                </div>
              )}
            </Field>

            <button type="submit" disabled={busy} className="primary-button" style={{ width: "100%", justifyContent: "center", marginTop: "0.25rem" }}>
              {loading ? <><Spin />Creating account…</> : "Create account"}
            </button>
          </form>

          <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "var(--muted)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ fontWeight: 600, color: "var(--primary)" }}>Sign in →</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 960px) {
          .auth-panel { display: flex !important; }
          .auth-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.5rem" }}>{label}</label>
      {children}
    </div>
  );
}
function GoogleIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;
}
function Spin() {
  return <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />;
}
function Eye() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function EyeOff() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}
