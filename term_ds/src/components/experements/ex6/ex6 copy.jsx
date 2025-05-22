import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { carsList, initialGrid, trafficLights } from "./data1";

export default function MultiCarSimulation() {
  const [grid, setGrid] = useState(initialGrid);
  const [cars, setCars] = useState(carsList);
  const [score, setScore] = useState(0);
  const [testNext, setTestNext] = useState(false);
  const [hadMistake, setHadMistake] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [resultsHistory, setResultsHistory] = useState([]);
  const [movementInProgress, setMovementInProgress] = useState(false);

  const getCellType = (row, col) => {
    if (
      row < 0 ||
      col < 0 ||
      row >= initialGrid.length ||
      col >= initialGrid[0].length
    )
      return 0;
    const cell = initialGrid[row][col];
    if (cell === 3 || cell === 4) {
      if ((row === 3 || row === 4) && (col === 3 || col === 4)) return 2;
      return 1;
    }
    return cell;
  };

  const isPathAllowed = (path) => {
    for (let [row, col] of path) {
      const key = `${row},${col}`;
      if (trafficLights[key] === "red") {
        return { allowed: false, blockedAt: [row, col] };
      }
    }
    return { allowed: true };
  };

  function canCarMoveNow(car, cars, grid) {
    // 🔻 Тимчасово завжди true, тут буде твоя логіка ПДР
    return true;
  }

  function rejectMove(message) {
    toast.error(message);
    setHadMistake(true);
    setTestNext(true);
  }

  useEffect(() => {
    if (resultsHistory.length > 0) {
      console.log("📘 Уся історія відповідей:", resultsHistory);
    }
  }, [resultsHistory]);

  const handleCarClick = (carId) => {
    if (answered) return;

    const car = cars.find((c) => c.id === carId);
    if (!car || car.finished) {
      toast.info("Машина вже завершила рух або не знайдена");
      return;
    }

    const { allowed, blockedAt } = isPathAllowed(car.path);

    if (!canCarMoveNow(car, cars, grid)) {
      rejectMove(
        `${car.color.toUpperCase()} машина не має права їхати згідно з ПДР у цій ситуації.`
      );
      return;
    }

    if (!allowed) {
      rejectMove(
        `${car.color.toUpperCase()} машина не може їхати: червоний сигнал на [${blockedAt[0]}, ${blockedAt[1]}]`
      );
      return;
    }

    // toast.info(`${car.color.toUpperCase()} машина почала рух`);
    setAnswered(true);
    setTestNext(true);

    setMovementInProgress(true);

    car.path.forEach(([row, col], i) => {
      setTimeout(() => {
        setCars((prevCars) => {
          return prevCars.map((c) => {
            if (c.id !== carId) return c;

            setGrid((prevGrid) => {
              const newGrid = prevGrid.map((r) => [...r]);
              const [curRow, curCol] = c.position;
              const cellType = getCellType(row, col);

              if (cellType !== 1 && cellType !== 2) {
                toast.warn(
                  `🚫 ${c.color} машина не може їхати по недопустимій клітинці: [${row}, ${col}]`
                );
                setHadMistake(true);
                return prevGrid;
              }

              newGrid[curRow][curCol] = getCellType(curRow, curCol);
              newGrid[row][col] = c.color === "red" ? 3 : 4;
              return newGrid;
            });

            const updated = { ...c, position: [row, col] };
            if (i === c.path.length - 1) {
              updated.finished = true;
              toast.info(`${c.color.toUpperCase()} машина завершила рух`);
              setMovementInProgress(false);
            }
            return updated;
          });
        });
      }, i * 200);
    });
  };

  const renderCell = (type, row, col) => {
    const car = cars.find(
      (c) => c.position[0] === row && c.position[1] === col
    );
    const lightKey = `${row},${col}`;
    const light = trafficLights[lightKey];

    let cellClass =
      "w-12 h-12 flex items-center justify-center border border-gray-300 ";
    if (car) cellClass += car.color === "red" ? "bg-red-500" : "bg-blue-500";
    else if (type === 0) cellClass += "bg-green-100";
    else if (type === 1) cellClass += "bg-gray-400";
    else if (type === 2) cellClass += "bg-yellow-200";

    return (
      <div
        key={`${row},${col}`}
        className={cellClass + (car ? " cursor-pointer" : "")}
        onClick={() => {
          if (car) handleCarClick(car.id);
        }}
      >
        {car?.icon}
        {light === "red" && (
          <div
            className={`custom-rule custom-rule-top custom-rule-${light}`}
          ></div>
        )}
        {light === "green" && (
          <div
            className={`custom-rule custom-rule-bottom custom-rule-${light}`}
          ></div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold text-center">
        Симуляція руху на перехресті (світлофор)
      </h2>
      <div className="grid grid-cols-8 gap-0 w-fit mx-auto">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
        )}
      </div>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Натисніть на будь-яку машину, щоб запустити її рух по маршруту.
        </p>
        <p className="text-sm text-gray-600">
          Якщо на шляху червоне світло — рух буде заборонено.
        </p>
      </div>
      <div className="text-center mt-6">
        <p className="text-lg">
          ✅ Правильних відповідей: <strong>{score}</strong>
        </p>
      </div>
      {testNext && (
        <div className="text-center mt-4">
          <button
            disabled={movementInProgress}
            className={`px-6 py-2 rounded text-white ${
              movementInProgress
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={() => {
              const isCorrect = !hadMistake;
              const newScore = isCorrect ? score + 1 : score;

              const result = {
                correct: !hadMistake,
                scoreGained: newScore,
              };

              setResultsHistory((prev) => [...prev, result]);
              if (isCorrect) setScore(newScore);

              setGrid(initialGrid.map((row) => [...row]));
              setCars(carsList.map((car) => ({ ...car })));
              setHadMistake(false);
              setAnswered(false);
              setTestNext(false);
            }}
          >
            ➡️ Далі
          </button>
        </div>
      )}
    </div>
  );
}
