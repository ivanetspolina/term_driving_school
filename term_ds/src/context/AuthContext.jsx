import { createContext, useState, useEffect, useContext } from "react";
import { apiUrl } from "../utils/api";

// Створюємо контекст для авторизації
const AuthContext = createContext();

// Маємо AuthProvider для надання контексту компонентам
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Функція для авторизації користувача
  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  // Функція для виходу з системи
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Перевірка токену при завантаженні сторінки
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.setItem("token", token);
    }
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    if (token) {
      fetch(import.meta.env.VITE_API_URL + apiUrl.auth, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            login(data.user, token);
          } else {
            logout();
          }
        })
        .catch(() => logout())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false); 
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Хук для доступу до контексту
export const useAuth = () => useContext(AuthContext);
