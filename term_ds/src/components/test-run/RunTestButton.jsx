import { useState } from "react";
import ConfirmModal from "../ConfirmModal.jsx";
import { useNavigate } from "react-router-dom";

// Компонент для кнопок керування тестом: пауза, скасування, перехід далі та завершення
export function RunTestButton({
  onPause = () => {},
  onCancel = () => {},
  isRunning,
  setIsRunning,
  STATES,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  score,
  timer,
  testData,
  canGoNext,
}) {
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  const navigate = useNavigate();

  const isLastQuestion = currentQuestionIndex >= 19;

  const handlePauseClick = () => {
    onPause();
    setShowPauseConfirm(true);
  };
  
  const handleConfirmPause = () => {
    setShowPauseConfirm(false);
    setIsRunning(STATES.RUNNING);
  };

  const handleCancelClick = () => {
    onCancel();
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleFinishTest = () => {
    const params = new URLSearchParams({
      score: score,
      time: timer,
      topicid: testData?._id,
      topic: testData?.name || "Невідома тема",
    });

    navigate(`/result_test?${params.toString()}`);
  };

  return (
    <>
      <aside className="row-start-2 col-start-2 p-[32px] space-y-4">
        <button
          onClick={handlePauseClick}
          disabled={isRunning !== STATES.RUNNING}
          className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 transition
              ${
                isRunning === STATES.RUNNING
                  ? "bg-purple-700 hover:bg-purple-800 hover:ring-2 hover:ring-purple-300"
                  : "bg-purple-400 cursor-not-allowed"
              }`}
        >
          Пауза
        </button>

        <button
          onClick={handleCancelClick}
          disabled={isRunning !== STATES.RUNNING}
          className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 transition
              ${
                isRunning === STATES.RUNNING
                  ? "bg-purple-700 hover:bg-purple-800 hover:ring-2 hover:ring-red-300"
                  : "bg-purple-400 cursor-not-allowed"
              }`}
        >
          Скасувати проходження
        </button>

        {!isLastQuestion && (
          <button
            onClick={handleNextQuestion}
            disabled={!canGoNext}
            className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 transition
      ${
        canGoNext
          ? "bg-purple-700 hover:bg-purple-800 hover:ring-2 hover:ring-green-300"
          : "bg-purple-400 cursor-not-allowed"
      }`}
          >
            Наступне питання
          </button>
        )}

        {isLastQuestion && (
          <button
            onClick={handleFinishTest}
            className="w-full text-white bg-purple-700 hover:bg-purple-800 focus:outline-none hover:ring-2 hover:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Завершити тестування
          </button>
        )}
      </aside>

      {showPauseConfirm && (
        <ConfirmModal
          title="Тест призупинено"
          description="Продовжити проходження тесту?"
          confirmLabel="Так, продовжити"
          cancelLabel="Ні, скасувати проходження"
          onConfirm={handleConfirmPause}
          onCancel={() => {
            setShowPauseConfirm(false);
            handleCancelClick();
          }}
        />
      )}
    </>
  );
}
