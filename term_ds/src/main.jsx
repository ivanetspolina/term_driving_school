import "./styles/css/all-css.css";
import "./styles/scss/all-scss.scss";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { UIProvider } from "./context/UIContext.jsx";

createRoot(document.getElementById("root")).render(
  <UIProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </UIProvider>
);

//npm run dev
