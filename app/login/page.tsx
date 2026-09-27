"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({ email, password });
      if (error) {
        setError(error.message || "Invalid email or password.");
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

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--background)" }}>

      {/* ── Left decorative panel (desktop only) ── */}
      <div style={{
        display: "none",
        width: "45%",
        flexShrink: 0,
        background: "linear-gradient(155deg, #5848e8 0%, #7c6af7 45%, #a78bfa 100%)",
        padding: "2.5rem",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }} className="lg-panel">

        {/* decorative circles */}
        <div style={{ position:"absolute", top:"-100px", right:"-100px", width:"350px", height:"350px", borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
        <div style={{ position:"absolute", bottom:"-80px", left:"-80px", width:"280px", height:"280px", borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />
        <div style={{ position:"absolute", top:"40%", right:"10%", width:"120px", height:"120px", borderRadius:"50%", background:"rgba(255,255,255,0.04)" }} />

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", position:"relative" }}>
          <div style={{ width:40, height:40, borderRadius:12, background:"rgba(255,255,255,0.18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.125rem", fontWeight:800, color:"white" }}>
            S
          </div>
          <span style={{ color:"white", fontWeight:700, fontSize:"1.0625rem", letterSpacing:"-0.01em" }}>Study Notes</span>
        </div>

        {/* Quote */}
        <div style={{ position:"relative" }}>
          <div style={{ width:36, height:3, borderRadius:999, background:"rgba(255,255,255,0.4)", marginBottom:"1.25rem" }} />
          <blockquote style={{ color:"white", fontSize:"1.375rem", fontWeight:700, lineHeight:1.45, fontFamily:"var(--font-fraunces),serif", letterSpacing:"-0.02em", margin:0 }}>
            "The secret of getting ahead is getting started."
          </blockquote>
          <p style={{ color:"rgba(255,255,255,0.55)", marginTop:"0.875rem", fontSize:"0.875rem", fontWeight:500 }}>
            — Mark Twain
          </p>
        </div>

        {/* Feature list */}
        <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem", position:"relative" }}>
          {[
            "Write & organize your notes",
            "Filter by subject in seconds",
            "Access from any device",
          ].map(f => (
            <div key={f} style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
              <div style={{ width:20, height:20, borderRadius:"50%", background:"rgba(255,255,255,0.18)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ color:"rgba(255,255,255,0.82)", fontSize:"0.875rem" }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"2.5rem 1.5rem" }}>
        <div style={{ width:"100%", maxWidth:"400px" }} className="animate-fade-up">

          {/* Mobile logo */}
          <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", marginBottom:"2rem" }} className="mobile-logo">
            <div style={{ width:34, height:34, borderRadius:10, background:"var(--primary)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", fontWeight:800, color:"white" }}>S</div>
            <span style={{ fontWeight:700, fontSize:"0.9375rem", color:"var(--foreground)" }}>Study Notes</span>
          </div>

          <h1 className="display-title" style={{ fontSize:"1.875rem", fontWeight:800, color:"var(--foreground)", letterSpacing:"-0.03em", lineHeight:1.2 }}>
            Welcome back
          </h1>
          <p style={{ marginTop:"0.5rem", fontSize:"0.9rem", color:"var(--muted)", marginBottom:"2rem" }}>
            Sign in to access your notes.
          </p>

          {/* Error */}
          {error && (
            <div className="animate-scale-in" style={{ marginBottom:"1.25rem", borderRadius:"10px", border:"1px solid #fca5a5", background:"var(--danger-light)", padding:"0.75rem 1rem", fontSize:"0.875rem", color:"#991b1b", fontWeight:500, display:"flex", alignItems:"center", gap:"0.5rem" }}>
              <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" style={{ flexShrink:0 }}>
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}

          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            style={{
              width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:"0.625rem",
              padding:"0.75rem 1rem", borderRadius:"10px",
              border:"1.5px solid var(--border)", background:"white",
              fontSize:"0.875rem", fontWeight:600, color:"var(--foreground)",
              cursor:"pointer", transition:"all 0.18s ease",
              boxShadow:"var(--shadow-sm)", marginBottom:"1.25rem",
            }}
            onMouseEnter={e => {
              if (!googleLoading && !loading) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-strong)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-md)";
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-sm)";
            }}
          >
            {googleLoading ? (
              <Spinner color="#5f6368" />
            ) : (
              <GoogleIcon />
            )}
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </button>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1.25rem" }}>
            <div style={{ flex:1, height:"1px", background:"var(--border)" }} />
            <span style={{ fontSize:"0.75rem", color:"var(--muted-light)", fontWeight:500, whiteSpace:"nowrap" }}>or sign in with email</span>
            <div style={{ flex:1, height:"1px", background:"var(--border)" }} />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit}>
            <div style={{ display:"flex", flexDirection:"column", gap:"1.125rem" }}>

              <div>
                <label htmlFor="email" style={labelStyle}>Email address</label>
                <input
                  id="email" type="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="form-input" placeholder="you@example.com"
                  autoComplete="email" disabled={loading || googleLoading}
                />
              </div>

              <div>
                <label htmlFor="password" style={labelStyle}>Password</label>
                <div style={{ position:"relative" }}>
                  <input
                    id="password" type={showPassword ? "text" : "password"} required
                    value={password} onChange={e => setPassword(e.target.value)}
                    className="form-input" placeholder="••••••••"
                    autoComplete="current-password"
                    style={{ paddingRight:"2.75rem" }}
                    disabled={loading || googleLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{ position:"absolute", right:"0.75rem", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--muted-light)", padding:"4px", lineHeight:0 }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={loading || googleLoading}
                className="primary-button"
                style={{ width:"100%", justifyContent:"center", marginTop:"0.25rem" }}
              >
                {loading ? <><Spinner color="rgba(255,255,255,0.6)" />Signing in…</> : "Sign in"}
              </button>
            </div>
          </form>

          <p style={{ marginTop:"1.5rem", textAlign:"center", fontSize:"0.875rem", color:"var(--muted)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ fontWeight:600, color:"var(--primary)", textDecoration:"none" }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .lg-panel { display: flex !important; }
          .mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Shared sub-components ── */

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function Spinner({ color }: { color: string }) {
  return (
    <span style={{ display:"inline-block", width:14, height:14, border:`2px solid ${color}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.75s linear infinite" }} />
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

const labelStyle: React.CSSProperties = {
  display:"block", marginBottom:"0.5rem",
  fontSize:"0.8125rem", fontWeight:600, color:"var(--foreground)",
};
