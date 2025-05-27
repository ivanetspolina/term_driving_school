import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import RerunTestBtn from "../components/test-result/RerunTestButton.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  isTestPassed,
  getRandomEncouragingPhrase,
} from "../scripts/resultTestFunc.js";
import { useUI } from "../context/UIContext.jsx";
import { useEffect } from "react";
import { TimerDisplay } from "../components/test-run/elements/Timer.jsx";
import { apiRequest, apiUrl } from "../utils/api.js";

export default function Result({
  total = 20,
  passingScore = 18,
}) { 
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  console.log("user: ", user);
  const { setAlert } = useUI();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setAlert("Авторизуйтесь!", "error");
      navigate("/");
    }
  }, [isLoading, isAuthenticated]);

  const score = Number(searchParams.get("score"));
  const scoreIncorrect = total - score;
  const time = Number(searchParams.get("time"));
  const topic = searchParams.get("topic");
  const topicid = searchParams.get("topicid");
  const isPassed = isTestPassed(score, passingScore);

  const sendTestData = {
    user: user._id,
    score,
    scoreIncorrect,
    time,
    topicid
  } 

  useEffect(() => {
    if (user?._id && topicid) {
      apiRequest(apiUrl.testResult, "POST", sendTestData)
        .then((res) => {
          if (res.message) console.log("✅", res.message);
          else console.warn("⚠️", res.error);
        })
        .catch((err) => console.error("❌", err));
    }
  }, [user?._id, topicid]);
console.log("topicid: ", topicid);

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
              <p className="font-medium">Тема: {topic}</p>
              <p className="font-medium">Час: {<TimerDisplay timer={time} />}</p>
              <p className="font-medium">
                Результат: {score}/{total}
              </p>
            </div>

            <p className="mt-6 text-center">
              {getRandomEncouragingPhrase(user.name, score, total)}
            </p>
            <RerunTestBtn testId={topicid} />
          </div>
        </div>
      </main>
    </>
  );
}
