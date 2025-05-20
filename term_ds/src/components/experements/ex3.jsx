import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Ex3() {
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
    [0, 0, 0, 1, 1, 0, 0, 0]
  ];

  const [grid, setGrid] = useState(initialGrid);
  const [redCarPos, setRedCarPos] = useState([4, 1]); // початкова позиція червоної машини
  const [blueCarPos, setBlueCarPos] = useState([3, 6]); // початкова позиція синьої машини
  const [redFinished, setRedFinished] = useState(false);
  const [blueFinished, setBlueFinished] = useState(false);
  const [redDirection, setRedDirection] = useState(null);
  const [blueDirection, setBlueDirection] = useState(null);

  // Шлях для червоної машини (поворот вліво)
  const redCarLeftPath = [
    [4, 2], // вперед до перехрестя
    [4, 3], // вперед до перехрестя
    [4, 4], // в центр перехрестя
    [3, 4], // поворот вліво
    [2, 4], // виїзд з перехрестя
    [1, 4], // продовження руху по дорозі
    [0, 4]  // кінцева точка
  ];

  // Шлях для червоної машини (пряма)
  const redCarStraightPath = [
    [4, 2], // вперед до перехрестя
    [4, 3], // вперед до центра перехрестя
    [4, 4], // в центр перехрестя
    [4, 5], // виїзд з перехрестя
    [4, 6], // продовження руху по дорозі
    [4, 7]  // кінцева точка
  ];

  // Шлях для червоної машини (поворот направо)
  const redCarRightPath = [
    [4, 2], // вперед до перехрестя
    [4, 3], // в центр перехрестя
    [5, 3], // поворот направо на ближню смугу
    [6, 3], // продовження руху
    [7, 3], // кінцева точка
  ];

  // Шлях для синьої машини (поворот вліво)
  const blueCarLeftPath = [
    [3, 5], // вперед до перехрестя
    [3, 4], // в центр перехрестя
    [3, 3], // продовжуємо через перехрестя
    [4, 3], // поворот вліво
    [5, 3], // виїзд з перехрестя
    [6, 3], // продовження руху по дорозі
    [7, 3]  // кінцева точка
  ];

  // Шлях для синьої машини (пряма)
  const blueCarStraightPath = [
    [3, 5], // вперед до перехрестя
    [3, 4], // в центр перехрестя
    [3, 3], // продовжуємо рух
    [3, 2], // виїзд з перехрестя
    [3, 1], // продовження руху по дорозі
    [3, 0]  // кінцева точка
  ];

  // Шлях для синьої машини (поворот направо)
  const blueCarRightPath = [
    [3, 5], // вперед до перехрестя
    [3, 4], // в центр перехрестя
    [2, 4], // поворот направо на ближню смугу
    [1, 4], // продовження руху
    [0, 4]  // кінцева точка
  ];

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
    const directions = ['straight', 'left', 'right'];
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
          toast.warn(`🚫 Машина не може їхати по недопустимій клітинці: [${row}, ${col}]`);
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
    if (row < 0 || col < 0 || row >= initialGrid.length || col >= initialGrid[0].length) {
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
    
    let directionText = '';
    if (redDirection === 'left') directionText = 'ліворуч';
    else if (redDirection === 'right') directionText = 'праворуч';
    else directionText = 'прямо';
    
    toast.info(`Червона машина почала рух ${directionText}`);
    
    let path;
    if (redDirection === 'left') path = redCarLeftPath;
    else if (redDirection === 'right') path = redCarRightPath;
    else path = redCarStraightPath;
    
    moveCar(
      path, 
      "red", 
      setRedCarPos, 
      () => {
        setRedFinished(true);
        // Видаляємо всі активні повідомлення перед показом завершального
        toast.dismiss();
        toast.success("Червона машина завершила рух");
      }
    );
  };

  // Функція для руху синьої машини
  const moveBlueCar = () => {
    // Видаляємо всі активні повідомлення перед показом нового
    toast.dismiss();
    
    let directionText = '';
    if (blueDirection === 'left') directionText = 'ліворуч';
    else if (blueDirection === 'right') directionText = 'праворуч';
    else directionText = 'прямо';
    
    toast.info(`Синя машина почала рух ${directionText}`);
    
    let path;
    if (blueDirection === 'left') path = blueCarLeftPath;
    else if (blueDirection === 'right') path = blueCarRightPath;
    else path = blueCarStraightPath;
    
    moveCar(
      path, 
      "blue", 
      setBlueCarPos, 
      () => {
        setBlueFinished(true);
        // Видаляємо всі активні повідомлення перед показом завершального
        toast.dismiss();
        toast.success("Синя машина завершила рух");
      }
    );
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
    
    let cellClass = "w-12 h-12 flex items-center justify-center border border-gray-300 ";
    
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
      <h2 className="text-xl font-semibold text-center">Симуляція руху на перехресті</h2>
      
      <div className="grid grid-cols-8 gap-0 w-fit mx-auto">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
        )}
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 mb-2">Натисніть на машину, щоб вона почала рух</p>
        <p className="text-sm text-gray-600">Червона машина повинна рухатись першою</p>
        <p className="text-sm text-gray-600 mt-2">Напрямок руху обирається випадковим чином</p>
      </div>
      
      <ToastContainer 
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        limit={1}
      />
    </div>
  );
}