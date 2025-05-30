import PropTypes from "prop-types";
import { TimerDisplay } from "./elements/Timer";

export function RunTestHeader({ topic, questionCount, timer, currentQuestionIndex, score, isRunning}) {
  return (
    <>
      <div className="w-2/3 font-[Nunito_Sans]">
        <h2 className="font-bold text-xl break-word white-space">
          Тести на тему: {topic}
        </h2>
        <p className="text-lg">
          {isRunning
            ? `Питання ${currentQuestionIndex + 1}/${questionCount}`
            : "Питання"}
        </p>
        <div className="mb-2 text-lg text-purple-700 font-semibold">
          Ваш рахунок: {score} бал{score === 1 ? "" : score < 5 ? "и" : "ів"}
        </div>
      </div>
      <div className="w-1/3 flex items-end justify-center font-[Inter] text-[16px]/[18px] mb-[3px]">
        <div>Таймер: {<TimerDisplay timer={timer} />}</div>
      </div>
    </>
  );
}

RunTestHeader.propTypes = {
  topic: PropTypes.string.isRequired,
  questionCount: PropTypes.number.isRequired,
  timer:  PropTypes.number.isRequired,
};
