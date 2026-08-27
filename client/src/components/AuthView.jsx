import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export function AuthView() {
  const { login, register, demoLogin, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getPasswordStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return Math.min(score, 4);
  };

  const strengthLabels = ["", "weak", "fair", "good", "strong"];
  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (isRegister) {
      await register(name, email, password);
    } else {
      await login(email, password);
    }
    setSubmitting(false);
  };

  const handleDemo = async () => {
    setSubmitting(true);
    await demoLogin();
    setSubmitting(false);
  };

  return (
    <>
      {/* Background Scene */}
      <div className="bg-scene">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAisqX5eCn9BoKumOsx_cruqYsb1fSHPHrcR9WLrqxA0LjHpvF8KaBY1qWesMUF5gpc7HwSLMmTWSxWgDhTas66ZcI1hv135qHfmE7LCCUtS9GlieCQfZr1l39hGwAePKxxHpyvemX7AkxbwvAoA0dEpPEZPdqOIB1er7lQ1YVM2i__UVrEbP2v6V3owjG2VMXZk0lic9z-1tAfghp67JbGs-EcPx2essqkH-JrdL2lyLMZwBY5si72"
          alt="Mountain landscape"
        />
        <div className="bg-scene-overlay" />
      </div>

      <div className="auth-container">
        <div className="auth-card">
          {/* Brand */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: "50%", background: "var(--primary-container)", marginBottom: 12 }}>
              <span className="material-symbols-outlined fill" style={{ color: "var(--on-primary-container)", fontSize: 28 }}>landscape</span>
            </div>
            <h1 className="text-headline-md auth-title" style={{ color: "var(--primary)", fontWeight: 900 }}>Task Master</h1>
            <p className="auth-subtitle">Peak Productivity</p>
          </div>

          {/* Demo Button */}
          <button
            className="btn btn-primary btn-lg w-full"
            onClick={handleDemo}
            disabled={submitting}
            id="demo-login-btn"
            style={{ marginBottom: 4 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>play_circle</span>
            {submitting ? "Loading..." : "Try Demo — Instant Access"}
          </button>

          <div className="auth-divider">or {isRegister ? "create an account" : "sign in"}</div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="form-group">
                <label className="form-label" htmlFor="auth-name">Full Name</label>
                <input
                  id="auth-name"
                  className="form-input"
                  type="text"
                  placeholder="Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">Email Address</label>
              <input
                id="auth-email"
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              {isRegister && password && (
                <div className="password-strength">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`password-strength-bar ${strength >= i ? `active ${strengthLabels[strength]}` : ""}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={submitting}
              id="auth-submit-btn"
            >
              {submitting ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="auth-toggle">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => { setIsRegister(!isRegister); setPassword(""); }}>
              {isRegister ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
