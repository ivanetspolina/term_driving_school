import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CornerDownLeft, CornerDownRight, MoveDown } from "lucide-react";

export default function Ex5() {
  // Створюємо початкову сітку згідно з наданим зображенням
  // 0 - трава, 1 - дорога, 2 - перехрестя, 3 - червона машина, 4 - синя машина, 5 - жовтий квадратик, 6 - червоний квадратик
  const initialGrid = [
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 4, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [1, 1, 1, 2, 2, 1, 1, 1],
    [1, 3, 1, 2, 2, 1, 1, 1],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
  ];  

  const squarePositions = [
    [2, 2], // верхня ліва позиція (#)
    [2, 5], // верхня права позиція (*)
    [5, 2], // нижня ліва позиція (*)
    [5, 5], // нижня права позиція (#)
  ];

  const [grid, setGrid] = useState(initialGrid);
  const [redCarPos, setRedCarPos] = useState([4, 1]); // початкова позиція червоної машини
  const [blueCarPos, setBlueCarPos] = useState([1, 3]); // початкова позиція синьої машини
  const [redFinished, setRedFinished] = useState(false);
  const [blueFinished, setBlueFinished] = useState(false);
  const [redDirection, setRedDirection] = useState(null);
  const [blueDirection, setBlueDirection] = useState(null);
  const [redCarPath, setRedCarPath] = useState([]);
  const [blueCarPath, setBlueCarPath] = useState([]);
  const [showDirectionIndicator, setShowDirectionIndicator] = useState(false);
  const gridSize = [initialGrid.length, initialGrid[0].length]; // розмір сітки [8, 8]
  const intersectionPos = [3, 3]; // лівий верхній кут перехрестя

  // Вектори руху для кожного напрямку
  const DIRECTIONS = {
    'north': [-1, 0],
    'south': [1, 0],
    'east': [0, 1],
    'west': [0, -1]
  };

  // Карта поворотів (який напрямок буде після повороту)
  const TURN_MAP = {
    'north': { 'left': 'west', 'right': 'east', 'straight': 'north' },
    'south': { 'left': 'east', 'right': 'west', 'straight': 'south' },
    'east': { 'left': 'north', 'right': 'south', 'straight': 'east' },
    'west': { 'left': 'south', 'right': 'north', 'straight': 'west' }
  };

  // Функція для випадкового вибору напрямку
  const getRandomDirection = () => {
    const directions = ["straight", "left", "right"];
    const randomIndex = Math.floor(Math.random() * directions.length);
    return directions[randomIndex];
  };

  // Ініціалізація сітки з квадратиками та генерація шляхів машинок при першому рендері
  useEffect(() => {
    // Створюємо нову сітку на основі початкової
    const newGrid = initialGrid.map((row) => [...row]);

    // Випадково вибираємо 2 позиції для жовтих квадратиків
    const shuffledPositions = [...squarePositions].sort(
      () => Math.random() - 0.5
    );
    const yellowPositions = shuffledPositions.slice(0, 2);
    const redPositions = shuffledPositions.slice(2, 4);

    // Розміщуємо жовті квадратики
    yellowPositions.forEach(([row, col]) => {
      newGrid[row][col] = 5; // 5 - жовтий квадратик
    });

    // Розміщуємо червоні квадратики
    redPositions.forEach(([row, col]) => {
      newGrid[row][col] = 6; // 6 - червоний квадратик
    });

    setGrid(newGrid);
    
    // Генеруємо випадкові напрямки для обох машин
    const redRandomDirection = getRandomDirection();
    const blueRandomDirection = getRandomDirection();
    
    // Зберігаємо напрямки
    setRedDirection(redRandomDirection);
    setBlueDirection(blueRandomDirection);
    
    // Генеруємо шляхи для обох машин
    const redPath = generatePath(redCarPos, redRandomDirection, gridSize, intersectionPos);
    const bluePath = generatePath(blueCarPos, blueRandomDirection, gridSize, intersectionPos);
    
    // Зберігаємо шляхи
    setRedCarPath(redPath);
    setBlueCarPath(bluePath);
    
    // Показуємо індикатор напрямку для синьої машинки
    setShowDirectionIndicator(true);
    
  }, []);  

  // Визначення напрямку підходу до перехрестя
  const getApproachDirection = (startPos, intersectionPos) => {
    const [startRow, startCol] = startPos;
    const [intersectionRow, intersectionCol] = intersectionPos;
    
    if (Math.abs(startRow - intersectionRow) > Math.abs(startCol - intersectionCol)) {
      return startRow < intersectionRow ? "south" : "north";
    } else {
      return startCol < intersectionCol ? "east" : "west";
    }
  };

  // Перевірка, чи знаходиться машина на перехресті
  const isAtIntersection = (pos, intersectionPos) => {
    const [row, col] = pos;
    const [intersectionRow, intersectionCol] = intersectionPos;
    return row >= intersectionRow && row <= intersectionRow + 1 && 
           col >= intersectionCol && col <= intersectionCol + 1;
  };

  // Допоміжна функція для руху в заданому напрямку
  const moveInDirection = (pos, direction) => {
    const [row, col] = pos;
    const [dr, dc] = DIRECTIONS[direction];
    return [row + dr, col + dc];
  };

  // Перевірка, чи є позиція в межах сітки
  const isValidPosition = (pos, gridSize) => {
    const [row, col] = pos;
    const [rows, cols] = gridSize;
    return row >= 0 && row < rows && col >= 0 && col < cols;
  };

  // Спрощена функція для генерації шляху
  const generatePath = (startPos, turnDirection, gridSize, intersectionPos) => {
    const [rows, cols] = gridSize;
    const path = [];
    
    // 1. Визначаємо напрямок підходу до перехрестя
    const approachDirection = getApproachDirection(startPos, intersectionPos);
    
    // 2. Будуємо шлях до перехрестя
    let currentPos = [...startPos];
    while (!isAtIntersection(currentPos, intersectionPos)) {
      currentPos = moveInDirection(currentPos, approachDirection);
      path.push([...currentPos]);
    }
    
    // 3. Визначаємо шлях через перехрестя залежно від напрямку повороту
    if (turnDirection === 'straight') {
      // Просто продовжуємо рух у тому ж напрямку
      for (let i = 0; i < 5; i++) {
        currentPos = moveInDirection(currentPos, approachDirection);
        if (isValidPosition(currentPos, gridSize)) {
          path.push([...currentPos]);
        } else {
          break;
        }
      }
    } 
    else if (turnDirection === 'left') {
      // Спочатку проїжджаємо перехрестя прямо
      currentPos = moveInDirection(currentPos, approachDirection);
      if (isValidPosition(currentPos, gridSize)) {
        path.push([...currentPos]);
      }
      
      // Потім повертаємо ліворуч
      const newDirection = TURN_MAP[approachDirection]['left'];
      currentPos = moveInDirection(currentPos, newDirection);
      if (isValidPosition(currentPos, gridSize)) {
        path.push([...currentPos]);
      }
      
      // Продовжуємо рух у новому напрямку
      for (let i = 0; i < 3; i++) {
        currentPos = moveInDirection(currentPos, newDirection);
        if (isValidPosition(currentPos, gridSize)) {
          path.push([...currentPos]);
        } else {
          break;
        }
      }
    }
    else if (turnDirection === 'right') {
      // Для повороту направо
      const newDirection = TURN_MAP[approachDirection]['right'];
      currentPos = moveInDirection(currentPos, newDirection);
      if (isValidPosition(currentPos, gridSize)) {
        path.push([...currentPos]);
      }
      
      // Продовжуємо рух у новому напрямку
      for (let i = 0; i < 4; i++) {
        currentPos = moveInDirection(currentPos, newDirection);
        if (isValidPosition(currentPos, gridSize)) {
          path.push([...currentPos]);
        } else {
          break;
        }
      }
    }
    
    return path;
  };

  // Функція руху машини по заздалегідь визначеному шляху
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

    // Використовуємо заздалегідь згенерований шлях
    moveCar(redCarPath, "red", setRedCarPos, () => {
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

    // Використовуємо заздалегідь згенерований шлях
    moveCar(blueCarPath, "blue", setBlueCarPos, () => {
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

    // Починаємо рух за заздалегідь визначеним шляхом
    moveRedCar();
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
    
    // Через 1 секунду запускаємо рух і приховуємо індикатор
    setTimeout(() => {
      setShowDirectionIndicator(false);
      moveBlueCar();
    }, 400);
  };
// Чи праворуч від машини жовтий квадратик
  const hasYellowOnRight = (carPos) => {
    const [row, col] = carPos;
    const rightCol = col + 1;
    if (
      row >= 0 && row < grid.length &&
      rightCol >= 0 && rightCol < grid[0].length
    ) {
      return grid[row][rightCol] === 5;
    }
    return false;
  };

  // Функція для відображення клітинки
  const renderCell = (type, row, col) => {
    const isRedCar = redCarPos[0] === row && redCarPos[1] === col;
    const isBlueCar = blueCarPos[0] === row && blueCarPos[1] === col;
    const isSquarePosition = squarePositions.some(
      ([squareRow, squareCol]) => squareRow === row && squareCol === col
    );
    // Перевірка, чи є клітинка індикатором перед синьою машиною
    const isBlueCarIndicator =
      blueCarPos[0] === 1 && blueCarPos[1] === 3 && row === 2 && col === 3;

    const isRedCarIndicator =
      redCarPos[0] === 4 && redCarPos[1] === 1 && row === 4 && col === 2;

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
    } else if (type === 5) {
      cellClass += "bg-yellow-500"; // жовтий квадратик
    } else if (type === 6) {
      cellClass += "bg-red-700"; // червоний квадратик
    }

    return (
      <div
        key={`${row}-${col}`}
        className={cellClass}
        onClick={() => {
          if (isRedCar) {
            handleRedCarClick();
          } else if (isBlueCar) {
            handleBlueCarClick();
          } 
        }}
      >
        {isRedCar && "🚗"}
        {isBlueCar && "🚙"}
        {type === 5 && "🟨"}
        {type === 6 && "🟥"}

        {/* Відображення індикатора напрямку перед синьою машиною */}
        {isBlueCarIndicator && showDirectionIndicator && blueDirection === "left" && (
            <CornerDownRight size={24} />
          )}
        {isBlueCarIndicator && showDirectionIndicator && blueDirection === "right" && (
            <CornerDownLeft size={24}/>
          )}
        {isBlueCarIndicator && showDirectionIndicator && blueDirection === "straight" && (
            <MoveDown size={24} />
          )}

        {/* Відображення індикатора напрямку перед червоною машиною */}
        {isRedCarIndicator && redDirection === "left" && (
          <CornerDownRight size={24} style={{ transform: "rotate(270deg)" }} />
        )}
        {isRedCarIndicator && redDirection === "right" && (
          <CornerDownLeft size={24} style={{ transform: "rotate(270deg)" }} />
        )}
        {isRedCarIndicator && redDirection === "straight" && (
          <MoveDown size={24} style={{ transform: "rotate(270deg)" }} />
        )}
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
          Напрямок руху обирається при завантаженні сторінки і завжди відображається для синьої машинки
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Натисніть на квадратик, щоб перемішати кольори та згенерувати нові шляхи
        </p>
      </div>

    </div>
  );
}