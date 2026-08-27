import { createContext, useContext } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  // Always return the mock user so the app works without a login page
  const user = { id: "default_user", name: "Local User" };
  const loading = false;

  const login = async () => true;
  const register = async () => true;
  const demoLogin = async () => true;
  const logout = async () => true;
  const refreshUser = async () => {};

  return (
    <AuthContext.Provider value={{ user, loading, login, register, demoLogin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
