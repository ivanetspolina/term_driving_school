import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import ScreenshotsSection from "../components/test-stat/ScreenshotsSection.jsx";
import TestStat from "../components/test-stat/TestStat.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { useState, useEffect } from "react";

export default function Statistics() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { setAlert } = useUI();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setAlert("Авторизуйтесь!", "error");
      navigate("/");
    }
  }, [isLoading, isAuthenticated]);

  return (
    <>
      <Header />
      <main className="statistics-main center-main">
        <div className="statistics-title text-title">
          <h1>Статистика</h1>
        </div>

        <ScreenshotsSection />
        <TestStat />
      </main>
    </>
  );
}
