import { createContext, useEffect, useMemo, useState } from "react";
import { getMe, loginUser, registerUser } from "../api/auth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("taskflow_user") || "null"));
  const [token, setToken] = useState(() => localStorage.getItem("taskflow_token"));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("taskflow_token")));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("taskflow_user", JSON.stringify(res.data));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [token]);

  const persistSession = (data) => {
    localStorage.setItem("taskflow_token", data.token);
    localStorage.setItem("taskflow_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (payload) => {
    const res = await loginUser(payload);
    persistSession(res.data);
  };

  const register = async (payload) => {
    const res = await registerUser(payload);
    persistSession(res.data);
  };

  const logout = () => {
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout, isAdmin: user?.role === "ADMIN" }), [user, token, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
