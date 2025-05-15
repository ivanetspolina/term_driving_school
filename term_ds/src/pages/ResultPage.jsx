import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import RerunTestBtn from "../components/test-result/RerunTestButton.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  isTestPassed,
  getRandomEncouragingPhrase,
} from "../scripts/resultTestFunc.js";
import { useUI } from "../context/UIContext.jsx";
import { useEffect } from "react";

export default function Result({
  score = 19,
  total = 20,
  userName,
  passingScore = 18,
}) {
  const isPassed = isTestPassed(score, passingScore);
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { setAlert } = useUI();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setAlert("Авторизуйтесь!", "error");
      navigate("/");
    }
  }, [isLoading, isAuthenticated]);

  const testResult = {
    score: score,
    total: total,
    theme: "***",
    time: "***",
    userName: user.name,
    passingScore: passingScore,
  };

  return (
    <>
      <Header />

      <main className="result-main center-main">
        <div className="font-[Inter] flex items-center justify-center">
          <div className="bg-white rounded-lg p-10 max-w-md w-full relative">
            <h2 className="text-xl font-medium text-center">
              {isPassed ? "Тест складено" : "Тест не складено"}
            </h2>

            <div className="space-y-2">
              <p className="font-medium">Тема: ***</p>
              <p className="font-medium">Час: ***</p>
              <p className="font-medium">
                Результат: {score}/{total}
              </p>
            </div>

            <p className="mt-6 text-center">
              {getRandomEncouragingPhrase(userName, score, total)}
            </p>
            <RerunTestBtn />
          </div>
        </div>
      </main>
    </>
  );
}
