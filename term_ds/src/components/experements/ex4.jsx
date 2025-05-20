import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Ex4() {
  // Створюємо початкову сітку згідно з наданим зображенням
  // 0 - трава, 1 - дорога, 2 - перехрестя, 3 - червона машина, 4 - синя машина
  const initialGrid = [
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [1, 1, 1, 2, 2, 1, 4, 1],
    [1, 3, 1, 2, 2, 1, 1, 1],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
  ];

  const [grid, setGrid] = useState(initialGrid);
  const [redCarPos, setRedCarPos] = useState([4, 1]); // початкова позиція червоної машини
  const [blueCarPos, setBlueCarPos] = useState([3, 6]); // початкова позиція синьої машини
  const [redFinished, setRedFinished] = useState(false);
  const [blueFinished, setBlueFinished] = useState(false);
  const [redDirection, setRedDirection] = useState(null);
  const [blueDirection, setBlueDirection] = useState(null);
  const gridSize = [initialGrid.length, initialGrid[0].length]; // розмір сітки [8, 8]
  const intersectionPos = [3, 3]; // лівий верхній кут перехрестя

  // Функція для автоматичного генерування шляху машини
  const generatePath = (startPos, direction, gridSize, intersectionPos) => {
    const [startRow, startCol] = startPos;
    const [intersectionRow, intersectionCol] = intersectionPos;
    const path = [];

    // Визначаємо напрямок руху до перехрестя
    const approachDirection = getApproachDirection(startPos, intersectionPos);

    // Генеруємо шлях до перехрестя
    let currentPos = [...startPos];
    while (!isAtIntersection(currentPos, intersectionPos)) {
      const nextPos = moveTowards(
        currentPos,
        intersectionPos,
        approachDirection
      );
      path.push(nextPos);
      currentPos = nextPos;
    }

    // Генеруємо шлях через перехрестя і далі в залежності від напрямку
    switch (direction) {
      case "straight":
        path.push(
          ...generateStraightPath(currentPos, approachDirection, gridSize)
        );
        break;
      case "left":
        path.push(
          ...generateLeftTurnPath(currentPos, approachDirection, gridSize)
        );
        break;
      case "right":
        path.push(
          ...generateRightTurnPath(currentPos, approachDirection, gridSize)
        );
        break;
    }

    return path;
  };

  // Функція для визначення напрямку підходу до перехрестя
  const getApproachDirection = (startPos, intersectionPos) => {
    const [startRow, startCol] = startPos;
    const [intersectionRow, intersectionCol] = intersectionPos;

    // Визначення основного напрямку руху (північ, південь, схід, захід)
    if (
      Math.abs(startRow - intersectionRow) >
      Math.abs(startCol - intersectionCol)
    ) {
      return startRow < intersectionRow ? "south" : "north";
    } else {
      return startCol < intersectionCol ? "east" : "west";
    }
  };

  // Функція для перевірки, чи знаходиться машина на перехресті
  const isAtIntersection = (pos, intersectionPos) => {
    const [row, col] = pos;
    const [intersectionRow, intersectionCol] = intersectionPos;
    return (
      row >= intersectionRow &&
      row <= intersectionRow + 1 &&
      col >= intersectionCol &&
      col <= intersectionCol + 1
    );
  };

  // Функція для руху до перехрестя
  const moveTowards = (pos, intersectionPos, approachDirection) => {
    const [row, col] = pos;

    switch (approachDirection) {
      case "north":
        return [row - 1, col];
      case "south":
        return [row + 1, col];
      case "east":
        return [row, col + 1];
      case "west":
        return [row, col - 1];
    }
  };

  // Функція для генерування прямого шляху після перехрестя
  const generateStraightPath = (
    intersectionPos,
    approachDirection,
    gridSize
  ) => {
    const [row, col] = intersectionPos;
    const path = [];
    const [rows, cols] = gridSize;

    let currentPos = [...intersectionPos];
    let steps = 5; // Кількість кроків після перехрестя

    while (steps > 0) {
      let nextPos;

      switch (approachDirection) {
        case "north":
          nextPos = [currentPos[0] - 1, currentPos[1]];
          break;
        case "south":
          nextPos = [currentPos[0] + 1, currentPos[1]];
          break;
        case "east":
          nextPos = [currentPos[0], currentPos[1] + 1];
          break;
        case "west":
          nextPos = [currentPos[0], currentPos[1] - 1];
          break;
      }

      // Перевіряємо, чи не виходимо за межі сітки
      if (
        nextPos[0] >= 0 &&
        nextPos[0] < rows &&
        nextPos[1] >= 0 &&
        nextPos[1] < cols
      ) {
        path.push(nextPos);
        currentPos = nextPos;
      } else {
        break; // Вийшли за межі сітки
      }

      steps--;
    }

    return path;
  };

  // Функція для генерування шляху зі поворотом ліворуч
  const generateLeftTurnPath = (
    intersectionPos,
    approachDirection,
    gridSize
  ) => {
    const [row, col] = intersectionPos;
    const path = [];
    const [rows, cols] = gridSize;

    // Спочатку рухаємося прямо через перехрестя на другу клітинку
    let centerPos;
    switch (approachDirection) {
      case "north":
        // Спочатку рухаємося прямо через перехрестя
        centerPos = [row - 1, col];
        path.push(centerPos);
        // Потім повертаємо ліворуч
        path.push([row - 1, col - 1]);
        break;
      case "south":
        // Спочатку рухаємося прямо через перехрестя
        centerPos = [row + 1, col];
        path.push(centerPos);
        // Потім повертаємо ліворуч
        path.push([row + 1, col + 1]);
        break;
      case "east":
        // Спочатку рухаємося прямо через перехрестя
        centerPos = [row, col + 1];
        path.push(centerPos);
        // Потім повертаємо ліворуч
        path.push([row - 1, col + 1]);
        break;
      case "west":
        // Спочатку рухаємося прямо через перехрестя
        centerPos = [row, col - 1];
        path.push(centerPos);
        // Потім повертаємо ліворуч
        path.push([row + 1, col - 1]);
        break;
    }

    // Визначаємо напрямок після повороту
    let newDirection;
    switch (approachDirection) {
      case "north": newDirection = "west"; break;
      case "south": newDirection = "east"; break;
      case "east": newDirection = "north"; break;
      case "west": newDirection = "south"; break;
    }

    // Продовжуємо рух у новому напрямку
    let currentPos = path[path.length - 1]; // остання позиція після повороту
    let steps = 3; // Кількість кроків після повороту

    while (steps > 0) {
      let nextPos;

      switch (newDirection) {
        case "north":
          nextPos = [currentPos[0] - 1, currentPos[1]];
          break;
        case "south":
          nextPos = [currentPos[0] + 1, currentPos[1]];
          break;
        case "east":
          nextPos = [currentPos[0], currentPos[1] + 1];
          break;
        case "west":
          nextPos = [currentPos[0], currentPos[1] - 1];
          break;
      }

      // Перевіряємо, чи не виходимо за межі сітки
      if (
        nextPos[0] >= 0 &&
        nextPos[0] < rows &&
        nextPos[1] >= 0 &&
        nextPos[1] < cols
      ) {
        path.push(nextPos);
        currentPos = nextPos;
      } else {
        break; // Вийшли за межі сітки
      }

      steps--;
    }

    return path;
  };

  // Функція для генерування шляху зі поворотом праворуч
  const generateRightTurnPath = (
    intersectionPos,
    approachDirection,
    gridSize
  ) => {
    const [row, col] = intersectionPos;
    const path = [];
    const [rows, cols] = gridSize;

    // Визначаємо напрямок повороту
    let turnDirection;

    switch (approachDirection) {
      case "north":
        turnDirection = "east";
        break;
      case "south":
        turnDirection = "west";
        break;
      case "east":
        turnDirection = "south";
        break;
      case "west":
        turnDirection = "north";
        break;
    }

    // Додаємо точку повороту
    let turnPos;
    switch (turnDirection) {
      case "north":
        turnPos = [row - 1, col];
        break;
      case "south":
        turnPos = [row + 1, col];
        break;
      case "east":
        turnPos = [row, col + 1];
        break;
      case "west":
        turnPos = [row, col - 1];
        break;
    }

    path.push(turnPos);

    // Продовжуємо рух у новому напрямку
    let currentPos = turnPos;
    let steps = 4; // Кількість кроків після повороту

    while (steps > 0) {
      let nextPos;

      switch (turnDirection) {
        case "north":
          nextPos = [currentPos[0] - 1, currentPos[1]];
          break;
        case "south":
          nextPos = [currentPos[0] + 1, currentPos[1]];
          break;
        case "east":
          nextPos = [currentPos[0], currentPos[1] + 1];
          break;
        case "west":
          nextPos = [currentPos[0], currentPos[1] - 1];
          break;
      }

      // Перевіряємо, чи не виходимо за межі сітки
      if (
        nextPos[0] >= 0 &&
        nextPos[0] < rows &&
        nextPos[1] >= 0 &&
        nextPos[1] < cols
      ) {
        path.push(nextPos);
        currentPos = nextPos;
      } else {
        break; // Вийшли за межі сітки
      }

      steps--;
    }

    return path;
  };

  // Функція для отримання шляху залежно від напрямку
  const getCarPath = (carPos, direction) => {
    return generatePath(carPos, direction, gridSize, intersectionPos);
  };

  // Ефект для спостереження за зміною напрямку червоної машини
  useEffect(() => {
    if (redDirection !== null) {
      moveRedCar();
    }
  }, [redDirection]);

  // Ефект для спостереження за зміною напрямку синьої машини
  useEffect(() => {
    if (blueDirection !== null && redFinished) {
      moveBlueCar();
    }
  }, [blueDirection, redFinished]);

  // Функція для випадкового вибору напрямку
  const getRandomDirection = () => {
    const directions = ["straight", "left", "right"];
    const randomIndex = Math.floor(Math.random() * directions.length);
    return directions[randomIndex];
  };

  // Функція руху машини
  const moveCar = (path, carType, setCarPos, onFinish) => {
    path.forEach(([row, col], i) => {
      setTimeout(() => {
        const curPos = carType === "red" ? redCarPos : blueCarPos;
        const newGrid = grid.map((r) => [...r]);
        const [curRow, curCol] = curPos;
        const cellType = getCellType(row, col);

        // Перевіряємо, чи можна рухатись на цю клітинку (дорога або перехрестя)
        const allowed = cellType === 1 || cellType === 2;

        if (!allowed) {
          toast.warn(
            `🚫 Машина не може їхати по недопустимій клітинці: [${row}, ${col}]`
          );
          return;
        }

        // Оновлюємо сітку
        newGrid[curRow][curCol] = getCellType(curRow, curCol); // повертаємо оригінальний тип клітинки
        newGrid[row][col] = carType === "red" ? 3 : 4; // ставимо машину на нову позицію

        setGrid(newGrid);
        setCarPos([row, col]);

        // Якщо шлях завершено, викликаємо callback
        if (i === path.length - 1 && onFinish) {
          onFinish();
        }
      }, i * 600); // Затримка між кроками руху
    });
  };

  // Функція для отримання оригінального типу клітинки
  const getCellType = (row, col) => {
    if (
      row < 0 ||
      col < 0 ||
      row >= initialGrid.length ||
      col >= initialGrid[0].length
    ) {
      return 0; // за межами сітки - трава
    }

    const cell = initialGrid[row][col];
    // Якщо це машина, повертаємо тип клітинки під нею
    if (cell === 3 || cell === 4) {
      // Перевіряємо, чи це перехрестя
      if ((row === 3 || row === 4) && (col === 3 || col === 4)) {
        return 2; // перехрестя
      }
      return 1; // дорога
    }
    return cell;
  };

  // Функція для руху червоної машини
  const moveRedCar = () => {
    // Видаляємо всі активні повідомлення перед показом нового
    toast.dismiss();

    let directionText = "";
    if (redDirection === "left") directionText = "ліворуч";
    else if (redDirection === "right") directionText = "праворуч";
    else directionText = "прямо";

    toast.info(`Червона машина почала рух ${directionText}`);

    // Отримуємо шлях на основі поточної позиції і напрямку
    const path = getCarPath(redCarPos, redDirection);

    moveCar(path, "red", setRedCarPos, () => {
      setRedFinished(true);
      // Видаляємо всі активні повідомлення перед показом завершального
      toast.dismiss();
      toast.success("Червона машина завершила рух");
    });
  };

  // Функція для руху синьої машини
  const moveBlueCar = () => {
    // Видаляємо всі активні повідомлення перед показом нового
    toast.dismiss();

    let directionText = "";
    if (blueDirection === "left") directionText = "ліворуч";
    else if (blueDirection === "right") directionText = "праворуч";
    else directionText = "прямо";

    toast.info(`Синя машина почала рух ${directionText}`);

    // Отримуємо шлях на основі поточної позиції і напрямку
    const path = getCarPath(blueCarPos, blueDirection);

    moveCar(path, "blue", setBlueCarPos, () => {
      setBlueFinished(true);
      // Видаляємо всі активні повідомлення перед показом завершального
      toast.dismiss();
      toast.success("Синя машина завершила рух");
    });
  };

  // Обробник кліку на червону машину
  const handleRedCarClick = () => {
    if (redFinished) {
      // Видаляємо всі активні повідомлення перед показом нового
      toast.dismiss();
      toast.info("Червона машина вже завершила рух");
      return;
    }

    // Встановлюємо випадковий напрямок руху
    const direction = getRandomDirection();
    setRedDirection(direction);
  };

  // Обробник кліку на синю машину
  const handleBlueCarClick = () => {
    // Видаляємо всі активні повідомлення перед показом нового
    toast.dismiss();

    if (!redFinished) {
      toast.error("Помилка!!! Спочатку має рухатись червона машина.");
      return;
    }

    if (blueFinished) {
      toast.info("Синя машина вже завершила рух");
      return;
    }

    // Встановлюємо випадковий напрямок руху
    const direction = getRandomDirection();
    setBlueDirection(direction);
  };

  // Функція для відображення клітинки
  const renderCell = (type, row, col) => {
    const isRedCar = redCarPos[0] === row && redCarPos[1] === col;
    const isBlueCar = blueCarPos[0] === row && blueCarPos[1] === col;

    let cellClass =
      "w-12 h-12 flex items-center justify-center border border-gray-300 ";

    if (isRedCar) {
      cellClass += "bg-red-500 cursor-pointer";
    } else if (isBlueCar) {
      cellClass += "bg-blue-500 cursor-pointer";
    } else if (type === 0) {
      cellClass += "bg-green-100"; // трава
    } else if (type === 1) {
      cellClass += "bg-gray-400"; // дорога
    } else if (type === 2) {
      cellClass += "bg-yellow-200"; // перехрестя
    }

    return (
      <div
        key={`${row}-${col}`}
        className={cellClass}
        onClick={() => {
          if (isRedCar) handleRedCarClick();
          if (isBlueCar) handleBlueCarClick();
        }}
      >
        {isRedCar && "🚗"}
        {isBlueCar && "🚙"}
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold text-center">
        Симуляція руху на перехресті
      </h2>

      <div className="grid grid-cols-8 gap-0 w-fit mx-auto">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
        )}
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 mb-2">
          Натисніть на машину, щоб вона почала рух
        </p>
        <p className="text-sm text-gray-600">
          Червона машина повинна рухатись першою
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Напрямок руху обирається випадковим чином
        </p>
      </div>

    
    </div>
  );
}