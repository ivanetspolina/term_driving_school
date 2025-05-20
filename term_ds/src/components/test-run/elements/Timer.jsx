import PropTypes from "prop-types";

export function TimerDisplay({ timer }) {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <span className="timer-display">{minutes}:{seconds.toString().padStart(2, '0')}</span>
  );
}

TimerDisplay.propTypes = {
  timer: PropTypes.number.isRequired,
};
