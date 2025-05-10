import { NavLink, useNavigate } from "react-router-dom";
import { X } from "lucide-react";

export default function AuthHeader() {
  const navigate = useNavigate();

  const getNavLinkClass = ({ isActive, isPadLeft = false }) => {
    return `text-[18px] font-bold ${isPadLeft ? "pl-4" : "pr-4"} ${isActive ? "text-blue-600" : "text-gray-900"}`;
  };

  const handleXCancel = () => {
    navigate("/");
  };

  return (
    <>
      <button
        onClick={handleXCancel}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
      >
        <X size={20} />
      </button>

      <div className="auth-header flex justify-center divide-x divide-gray-300 w-full mb-4">
        <NavLink to="/auth" className={(props) => getNavLinkClass(props)}>
          Увійти
        </NavLink>
        <NavLink
          to="/register"
          className={(props) => getNavLinkClass({ ...props, isPadLeft: true })}
        >
          Зареєструватись
        </NavLink>
      </div>
    </>
  );
}
