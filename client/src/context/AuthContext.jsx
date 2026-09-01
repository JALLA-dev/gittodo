import { createContext, useContext, useState } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const name = email ? email.split("@")[0] : "Signed In User";
    setUser({ id: email || "local_user", name: name.charAt(0).toUpperCase() + name.slice(1) });
    setLoading(false);
    return true;
  };

  const register = async (name, email, password) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const displayName = name?.trim() || (email ? email.split("@")[0] : "New User");
    setUser({ id: email || "new_user", name: displayName });
    setLoading(false);
    return true;
  };

  const demoLogin = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setUser({ id: "demo_user", name: "Demo User" });
    setLoading(false);
    return true;
  };

  const logout = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 150));
    setUser(null);
    setLoading(false);
    return true;
  };

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
