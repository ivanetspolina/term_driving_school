import { useContext } from "react";
import { AuthContext } from "../../backend/context/AuthContext.jsx";
import { Navigate } from "react-router-dom";

export function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}
