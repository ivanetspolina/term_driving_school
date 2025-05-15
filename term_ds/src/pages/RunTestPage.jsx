import Header from "../components/Header.jsx";
import { RunTestHeader } from "../components/test-run/RunTestHeader.jsx";
import { RunTestButton } from "../components/test-run/RunTestButton.jsx";
import StartSection from "../components/test-run/StartSection.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { useEffect } from "react";

export default function RunTest() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
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

      <main className="h-screen run-test-main center-main">
        <div className="h-full grid grid-rows-[auto_1fr] grid-cols-[75%_25%]">
          <div className="row-start-1 col-start-1 flex justify-between">
            <RunTestHeader topic="Правила дорожнього руху" questionCount={20} />
          </div>
          <StartSection />
          <RunTestButton />
        </div>
      </main>
    </>
  );
}
