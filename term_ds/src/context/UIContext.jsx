import { createContext, useContext } from "react";
import { toast } from 'react-toastify';

const UIContext = createContext();

// eslint-disable-next-line react/prop-types
export function UIProvider({ children }) {
     // Оповіщати між сторіками
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

	// Формування контексту
    return (
        <UIContext.Provider value={{ setAlert }}>
            {children}
        </UIContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUI() {
    return useContext(UIContext);
}
