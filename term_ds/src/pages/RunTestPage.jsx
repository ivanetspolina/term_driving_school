import Header from "../components/Header.jsx";
import { RunTestHeader } from "../components/test-run/RunTestHeader.jsx";
import { RunTestButton } from "../components/test-run/RunTestButton.jsx";
import StartSection from "../components/test-run/StartSection.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { useEffect, useState } from "react";
import { apiRequest, apiUrl } from "../utils/api.js";
import RuningSection from "../components/test-run/RuningSection.jsx";
import FinishedSection from "../components/test-run/FinishedSection.jsx";

const STATES = {
    START: "start",
    RUNNING: "running",
    PAUSED: "paused",
    FINISHED: "finished",
  };

export default function RunTest() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading} = useAuth();
  const { setAlert } = useUI();
  const { id } = useParams();

  const [testName, setTestName] = useState("");
  const [timer, setTimer] = useState(0);  
  const [isRunning, setIsRunning] = useState(STATES.START);

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
      if (test?.name) {
        setTestName(test.name);
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

return (
  <>
    <Header />

    <main className="h-screen run-test-main center-main">
      <div className="run-test-container mb-4 h-full grid grid-rows-[auto_1fr] grid-cols-[75%_25%]">
        <div className="row-start-1 col-start-1 flex justify-between">
          <RunTestHeader
            timer={timer}
            topic={testName || "Завантаження..."}
            questionCount={20}
          />
        </div>

        {isRunning === STATES.START && (<StartSection handleStart={handleStart} />)}
        {(isRunning === STATES.RUNNING || isRunning === STATES.PAUSED) && (
            <RuningSection />
          )}
        {isRunning === STATES.FINISHED && <FinishedSection />}

        <RunTestButton
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          onPause={() => setIsRunning(STATES.PAUSED)}
          onCancel={resetTest}
          onSnapshot={() => console.log("Snapshot clicked")}
          STATES={STATES} 
        />
      </div>
    </main>
  </>
);
}
