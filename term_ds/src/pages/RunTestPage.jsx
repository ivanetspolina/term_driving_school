import Header from "../components/Header.jsx";
import { RunTestHeader } from "../components/test-run/RunTestHeader.jsx";
import { RunTestButton } from "../components/test-run/RunTestButton.jsx";
import StartSection from "../components/test-run/StartSection.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { lazy, Suspense, useEffect, useState } from "react";
import { apiRequest, apiUrl } from "../utils/api.js";
import RunningSection from "../components/test-run/RunningSection.jsx";

const STATES = {
  START: "start",
  RUNNING: "running",
  PAUSED: "paused"
};

export default function RunTest() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { setAlert } = useUI();
  const { id } = useParams();

  const [testData, setTestData] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(STATES.START);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [canGoNext, setCanGoNext] = useState(false);

  const handleStart = () => {
    setTimer(0);
    setIsRunning(STATES.RUNNING);
  };

  const resetTest = () => {
    setTimer(0);
    setIsRunning(STATES.START);
    navigate("/tests");
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setAlert("Авторизуйтесь!", "error");
      navigate("/");
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    const fetchTest = async () => {
      const { test } = await apiRequest(`${apiUrl.tests}/${id}`, "GET", null);
      if (test) {
        setTestData(test);
      }
    };
    if (id) fetchTest();
  }, [id]);

  useEffect(() => {
    let interval;
    if (isRunning === STATES.RUNNING) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
     async function getQuestion() {
      const question = await apiRequest(`/questions/${testData?.type}/q${currentQuestionIndex + 1}.json`, 'GET', false, false);
      setQuestionData(question);
    }
    if (testData) {
      getQuestion();
    }
  }, [currentQuestionIndex, testData])
  
  return (
    <>
      <Header />

      <main className="run-test-main center-main">
        <div className="run-test-container mb-4 h-full grid grid-rows-[auto_1fr_auto] grid-cols-[75%_25%]">
          <div className="row-start-1 col-start-1 flex justify-between">
            <RunTestHeader
              timer={timer}
              topic={testData?.name || "Завантаження..."}
              questionCount={20}
              currentQuestionIndex={currentQuestionIndex}
              score={score}
              isRunning={isRunning === STATES.RUNNING}
            />
          </div>

          {isRunning === STATES.START && (
            <StartSection handleStart={handleStart} />
          )}

          {(isRunning === STATES.RUNNING || isRunning === STATES.PAUSED) && (
            <RunningSection
              score={score}
              setScore={setScore}
              questionIndex={currentQuestionIndex}
              questionData={questionData}
              setCanGoNext={setCanGoNext}
            />
          )}

          <div className="row-start-3 col-span-2 px-4 py-2 font-[Inter]">
            <p className="text-sm text-red-500 italic">Зверніть увагу!</p>
            <p className="text-sm italic">
              * Після завершення проїзду всіх транспортних засобів на зелений
              сигнал світлофора слід вважати, що червоний сигнал змінено на
              зелений.
              <br />
              * Завжди вважати, що поліцейський автомобіль рухається з увімкненими
              проблисковими маячками червоного та синього кольору та має
              безумовний пріоритет, тому завжди починає рух першим.
            </p>
          </div>

          <RunTestButton
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            onPause={() => setIsRunning(STATES.PAUSED)}
            onCancel={resetTest}
            onSnapshot={() => console.log("Snapshot clicked")}
            STATES={STATES}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            score={score}
            timer={timer}
            testData={testData}
            canGoNext={canGoNext}
          />
        </div>
      </main>
    </>
  );
}
