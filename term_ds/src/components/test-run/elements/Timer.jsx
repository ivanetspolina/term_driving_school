import PropTypes from "prop-types";

// Компонент для відображення таймеру у форматі хвилини:секунди
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

// {
//   "id": "regular_cross",
//   "sign_positions": [
//     {
//       "direction": "north",
//       "sign_id": "give_way"
//     },
//     {
//       "direction": "east",
//       "sign_id": "give_way"
//     },
//     {
//       "direction": "south",
//       "sign_id": "main_road"
//     },
//     {
//       "direction": "west",
//       "sign_id": "main_road"
//     }
//   ],
//   "carsToPlace": [
//     {
//       "car_id": "car1",
//       "start_cars_points": 0,
//       "path_type": "right_turn"
//     },
//     {
//       "car_id": "car2",
//       "start_cars_points": 2,
//       "path_type": "left_turn"
//     },
//     {
//       "car_id": "car3",
//       "start_cars_points": 3,
//       "path_type": "left_turn"
//     },
//     {
//       "car_id": "car4",
//       "start_cars_points": 1,
//       "path_type": "straight"
//     }
//   ]
// }