import { createContext, useContext } from "react";
import { toast } from 'react-toastify';

// Створюємо контекст для UI-повідомлень
const UIContext = createContext();

// Провайдер контексту для надання функцій UI по всьому застосунку
export function UIProvider({ children }) {
    // Функція для виклику спливаючих повідомлень 
    const setAlert = (text, type = 'error') => {
        switch (type) {
            case 'success':
                toast.success(text);
                break;
            case 'info':
                toast.info(text);
                break;
            case 'warning':
                toast.warn(text);
                break;
            case 'error':
            default:
                toast.error(text);
                break;
        }
    };

    return (
        <UIContext.Provider value={{ setAlert }}>
            {children}
        </UIContext.Provider>
    );
}

// Хук для спрощеного доступу до контексту
export function useUI() {
    return useContext(UIContext);
}
