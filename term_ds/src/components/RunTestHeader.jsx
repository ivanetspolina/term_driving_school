import PropTypes from "prop-types";

export function RunTestHeader({ topic, questionCount }) {
  return (
    <>
      <div className="w-2/3 font-[Nunito_Sans]">
        <h2 className="font-bold text-xl break-all white-space">
          Тести на тему: {topic}
        </h2>
        <p className="text-lg">{questionCount} питань</p>
      </div>
      <div className="w-1/3 flex items-end justify-center font-[Inter] text-[16px]/[18px] mb-[3px]">
        <div>Таймер: 00:00</div>
      </div>
    </>
  );
}

RunTestHeader.propTypes = {
  topic: PropTypes.string.isRequired,
  questionCount: PropTypes.number.isRequired,
};
