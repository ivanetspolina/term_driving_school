import Header from "../components/Header.jsx";
import { RunTestHeader } from "../components/test-run/RunTestHeader.jsx";
import { RunTestButton } from "../components/test-run/RunTestButton.jsx";
import StartSection from "../components/test-run/StartSection.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { lazy, Suspense, useEffect, useState } from "react";
import { apiRequest, apiUrl } from "../utils/api.js";
import RuningSection from "../components/test-run/RuningSection.jsx";

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

  // useEffect(() => {
  //   let interval;
  //   if (isRunning === STATES.RUNNING) {
  //     interval = setInterval(() => {
  //       setTimer((prev) => prev + 1);
  //     }, 1000);
  //   }
  //   return () => clearInterval(interval);
  // }, [isRunning]);

  useEffect(() => {
     async function getQuestion() {
      const question = await apiRequest(`/questions/${testData?.type}/q${currentQuestionIndex + 1}.json`, 'GET', false, false);
      setQuestionData(question);
    }
    if (testData) {
      getQuestion();
    }
  }, [currentQuestionIndex, testData])
  

  // const getTestComponent = (score, setScore) => {
  //   switch (testData?.type) {
  //     case "crossroads":
  //       return <Crossroads score={score} setScore={setScore} questionIndex={currentQuestionIndex} setCanGoNext={setCanGoNext} />;
  //     case "roadSigns":
  //       return <RoadSigns score={score} setScore={setScore} questionIndex={currentQuestionIndex} setCanGoNext={setCanGoNext} />;
  //     default:
  //       return <div>Тип тесту не підтримується</div>;
  //   }
  // };

  return (
    <>
      <Header />

      <main className="run-test-main center-main">
        <div className="run-test-container mb-4 h-full grid grid-rows-[auto_1fr] grid-cols-[75%_25%]">
          <div className="row-start-1 col-start-1 flex justify-between">
            <RunTestHeader
              timer={timer}
              topic={testData?.name || "Завантаження..."}
              questionCount={20}
              score={score}
            />
          </div>

          {isRunning === STATES.START && (
            <StartSection handleStart={handleStart} />
          )}

          {(isRunning === STATES.RUNNING || isRunning === STATES.PAUSED) && (
            <RuningSection score={score} setScore={setScore} questionIndex={currentQuestionIndex} questionData={questionData} setCanGoNext={setCanGoNext} />
            // <RuningSection score={score} setScore={setScore} questionIndex={currentQuestionIndex} questionData={questionData} setCanGoNext={setCanGoNext}>
            //   <Suspense fallback={<div>Завантаження тесту...</div>}>
            //     {getTestComponent(score, setScore, currentQuestionIndex)}
            //   </Suspense>
            // </RuningSection>
          )}

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
