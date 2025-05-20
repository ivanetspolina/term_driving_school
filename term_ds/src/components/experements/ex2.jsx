import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Ex2() {
  const initialGrid = [
    ["grass", "grass", "road-lane1", "grass", "grass"],
    ["grass", "grass", "road-lane1", "grass", "grass"],
    ["car1",  "road-lane1", "intersection", "road-lane2", "car2"],
    ["grass", "grass", "road-lane2", "grass", "grass"],
    ["grass", "grass", "road-lane2", "grass", "grass"],
  ];

  const [grid, setGrid] = useState(initialGrid);
  const [car1Pos, setCar1Pos] = useState([2, 0]);
  const [car2Pos, setCar2Pos] = useState([2, 4]);
  const [car1Finished, setCar1Finished] = useState(false);

  const car1Path = [
    [2, 1],
    [2, 2],
    [1, 2],
    [0, 2]
  ];

  const car2Path = [
    [2, 3],
    [2, 2],
    [3, 2],
    [4, 2]
  ];

  const moveCar = (path, carId, setCarPos, onFinish) => {
    path.forEach(([row, col], i) => {
      setTimeout(() => {
        const curPos = carId === "car1" ? car1Pos : car2Pos;
        const newGrid = grid.map((r) => [...r]);
        const [curRow, curCol] = curPos;
        const cellType = grid[row][col];

        const allowed =
          cellType === "intersection" ||
          (carId === "car1" && cellType === "road-lane1") ||
          (carId === "car2" && cellType === "road-lane2");

        if (!allowed) {
          toast.warn(`🚫 ${carId} не може їхати по чужій смузі: [${row}, ${col}]`);
          return;
        }

        newGrid[curRow][curCol] = getOriginalCell(curRow, curCol);
        newGrid[row][col] = carId;

        setGrid(newGrid);
        setCarPos([row, col]);

        if (i === path.length - 1 && onFinish) {
          onFinish();
        }
      }, i * 600);
    });
  };

  const getOriginalCell = (row, col) => {
    if (row === 0 && col === 2) return "road-lane1";
    if (row === 1 && col === 2) return "road-lane1";
    if (row === 2 && col === 1) return "road-lane1";
    if (row === 2 && col === 3) return "road-lane2";
    if (row === 3 && col === 2) return "road-lane2";
    if (row === 4 && col === 2) return "road-lane2";
    if (col === 2 && row === 2) return "intersection";
    return "grass";
  };

  const handleCarClick = (carId) => {
    if (carId === "car1") {
      moveCar(car1Path, "car1", setCar1Pos, () => setCar1Finished(true));
    } else if (carId === "car2") {
      if (!car1Finished) {
        toast.error("Помилка!!! Спочатку має рухатись перша машинка.");
      } else {
        moveCar(car2Path, "car2", setCar2Pos);
      }
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold text-center">Рух по вертикальних смугах та перехрестю</h2>

      <div className="grid grid-cols-5 gap-1 w-fit mx-auto border">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isCar1 = car1Pos[0] === rowIndex && car1Pos[1] === colIndex && cell === "car1";
            const isCar2 = car2Pos[0] === rowIndex && car2Pos[1] === colIndex && cell === "car2";

            const baseClasses = "w-20 h-20 flex items-center justify-center border";
            let cellClass = "bg-white";

            if (cell === "road-lane1") cellClass = "bg-gray-400";
            else if (cell === "road-lane2") cellClass = "bg-gray-600";
            else if (cell === "intersection") cellClass = "bg-yellow-300";
            else if (cell === "grass") cellClass = "bg-green-300";
            else if (cell === "car1") cellClass = "bg-blue-500 text-white text-xl cursor-pointer";
            else if (cell === "car2") cellClass = "bg-green-600 text-white text-xl cursor-pointer";

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => {
                  if (isCar1) handleCarClick("car1");
                  if (isCar2) handleCarClick("car2");
                }}
                className={`${baseClasses} ${cellClass}`}
              >
                {cell === "car1" && "🚗"}
                {cell === "car2" && "🚙"}
              </div>
            );
          })
        )}
      </div>

      <ToastContainer position="top-center" />
    </div>
  );
}
