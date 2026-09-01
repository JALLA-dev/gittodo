import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";
import { AppDashboard } from "./components/AppDashboard.jsx";
import { AuthView } from "./components/AuthView.jsx";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function App() {
  if (!clerkPublishableKey) {
    return (
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AuthView setupMissingKey />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ClerkProvider publishableKey={clerkPublishableKey}>
            <TaskProvider>
              <SignedIn>
                <AppDashboard />
              </SignedIn>
              <SignedOut>
                <AuthView />
              </SignedOut>
            </TaskProvider>
          </ClerkProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
