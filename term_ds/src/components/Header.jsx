import { NavLink, useNavigate } from "react-router-dom";
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import { CircleUserRound } from "lucide-react";
import sprite from "../assets/svg/sprite.svg";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const {user, isAuthenticated, logout} = useAuth();
  const navigate = useNavigate();

  
  return (
    <header className="header flex items-center justify-between">
      <NavLink to="/">
        <svg className="icon-driving-school2 fill-current text-white">
          <use href={`${sprite}#driving-school2`}></use>
        </svg>
      </NavLink>

      <nav className="header-nav flex gap-6 ">
        {/*  ml-[5rem]*/}
        <NavLink
          to="/"
          className="header-nav-link font-[manrope] text-xl font-medium"
        >
          Головна
        </NavLink>
        <NavLink
          to="/theme"
          className="header-nav-link font-[manrope] text-xl font-medium"
        >
          Теми
        </NavLink>
        <NavLink
          to="/tests"
          className="header-nav-link font-[manrope] text-xl font-medium"
        >
          Тести
        </NavLink>
      </nav>

      {isAuthenticated ? (
        <Dropdown
          placement="bottom-end"
          inline
          arrowIcon={false}
          label={
            <CircleUserRound
              size={40}
              className="cursor-pointer stroke-white"
            />
          }
          className="mt-[18px]"
        >
          <DropdownItem className="p-0" onClick={() => navigate("/profile")}>
            <span className="font-[manrope] w-full h-full px-12 py-2">
              Профіль
            </span>
          </DropdownItem>
          <DropdownItem className="p-0" onClick={() => navigate("/statistics")}>
            <span className="font-[manrope] w-full h-full px-12 py-2">
              Статистика
            </span>
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem className="p-0" onClick={() => {logout(); navigate("/");}}
          >
            <span className="font-[manrope] w-full h-full px-12 py-2">
              Вийти
            </span>
          </DropdownItem>
        </Dropdown>
      ) : (
        <CircleUserRound
          size={40}
          className="cursor-pointer stroke-white"
          onClick={() => navigate("/auth")}
        />
      )}
    </header>
  );
}
