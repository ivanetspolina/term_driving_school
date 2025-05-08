import { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("jwt"));

  // після першого рендеру, якщо токен є — декодуємо і ставимо заголовок
  useEffect(() => {
    if (token) {
      const { exp, ...payload } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        logout();
      } else {
        setUser(payload);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    }
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("jwt", data.accessToken);
    setToken(data.accessToken);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
