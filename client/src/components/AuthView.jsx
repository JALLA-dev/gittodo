import { SignIn } from "@clerk/clerk-react";

export function AuthView({ setupMissingKey = false }) {
  if (setupMissingKey) {
    return (
      <>
        <div className="bg-scene">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAisqX5eCn9BoKumOsx_cruqYsb1fSHPHrcR9WLrqxA0LjHpvF8KaBY1qWesMUF5gpc7HwSLMmTWSxWgDhTas66ZcI1hv135qHfmE7LCCUtS9GlieCQfZr1l39hGwAePKxxHpyvemX7AkxbwvAoA0dEpPEZPdqOIB1er7lQ1YVM2i__UVrEbP2v6V3owjG2VMXZk0lic9z-1tAfghp67JbGs-EcPx2essqkH-JrdL2lyLMZwBY5si72"
            alt="Mountain landscape"
          />
          <div className="bg-scene-overlay" />
        </div>

        <div className="auth-container">
          <div className="auth-card auth-setup-card">
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: "50%", background: "var(--primary-container)", marginBottom: 12 }}>
                <span className="material-symbols-outlined fill" style={{ color: "var(--on-primary-container)", fontSize: 28 }}>lock</span>
              </div>
              <h1 className="text-headline-md auth-title" style={{ color: "var(--primary)", fontWeight: 900 }}>Task Master</h1>
              <p className="auth-subtitle">Clerk setup required</p>
            </div>

            <div className="setup-box">
              Add your Clerk publishable key to the client environment file:
              <br />
              <strong>VITE_CLERK_PUBLISHABLE_KEY</strong>
            </div>

            <div className="setup-box secondary">
              Example:
              <br />
              <code>VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxx</code>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-scene">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAisqX5eCn9BoKumOsx_cruqYsb1fSHPHrcR9WLrqxA0LjHpvF8KaBY1qWesMUF5gpc7HwSLMmTWSxWgDhTas66ZcI1hv135qHfmE7LCCUtS9GlieCQfZr1l39hGwAePKxxHpyvemX7AkxbwvAoA0dEpPEZPdqOIB1er7lQ1YVM2i__UVrEbP2v6V3owjG2VMXZk0lic9z-1tAfghp67JbGs-EcPx2essqkH-JrdL2lyLMZwBY5si72"
          alt="Mountain landscape"
        />
        <div className="bg-scene-overlay" />
      </div>

      <div className="auth-container">
        {/* Render Clerk's native SignIn component exclusively.
            It handles routing to SignUp automatically via hash routing.
            The dark theme appearance is managed by ClerkProvider in App.jsx. */}
        <SignIn routing="hash" afterSignInUrl="/" />
      </div>
    </>
  );
}
