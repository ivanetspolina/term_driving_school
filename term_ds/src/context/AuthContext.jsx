import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiUrl } from '../utils/api';
import { toast } from 'react-toastify';

// Створюємо контекст для авторизації
const AuthContext = createContext();

// AuthProvider для надання контексту всім компонентам
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Дані користувача
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Статус авторизації

    // Загальна функція для обробки помилок
    const handleError = (error, message) => {
        console.error(error);
        toast.error(message || "Щось пішло не так.");
    };

    // Функція для авторизації користувача
    const login = (userData, token) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
    };

    // Функція для виходу з системи
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    // Загальна функція для оновлення даних
    const updateData = async (url, data, successMessage, errorMessage) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();
            if (response.ok) {
                toast.success(successMessage);
                return responseData;
            } else {
                handleError(responseData.error, errorMessage);
            }
        } catch (error) {
            handleError(error, errorMessage);
        }
    };

    // Функція для оновлення профілю
    const updateUser = async (userData) => {
        const updatedUser = await updateData(
            `${apiUrl.users}/${user.id}`,
            userData,
            "Профіль оновлено!",
            "Не вдалося оновити профіль!"
        );
        if (updatedUser) {
            const newUser = { ...user, ...userData };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
        }
    };

    // Функція для оновлення пароля
    const updatePassword = async (newPassword) => {
        await updateData(
            apiUrl.updatePassword,
            { password: newPassword },
            "Пароль оновлено!",
            "Не вдалося оновити пароль!"
        );
    };

    // Перевірка токену при завантаженні сторінки
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }

        if (token) {
            fetch(import.meta.env.VITE_API_URL + apiUrl.auth, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.user) {
                    login(data.user, token);
                } else {
                    logout();
                }
            })
            .catch(err => {
                // handleError(err, "Помилка перевірки токену");
                logout();
                console.log("logout:");
            });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser, updatePassword }}>
            {children}
        </AuthContext.Provider>
    );
};

// Хук для доступу до контексту
export const useAuth = () => useContext(AuthContext);