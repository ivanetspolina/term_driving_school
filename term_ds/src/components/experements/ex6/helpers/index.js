export const getCellKey = (row, col) => `${row},${col}`;

// Отримати тип клітинки: 0 — трава, 1 — дорога
export const getCellType = (grid, row, col) => {
  if (
    row < 0 ||
    col < 0 ||
    row >= grid.length ||
    col >= grid[0].length
  )
    return 0;

  const cell = grid[row][col];
  return (cell === 3 || cell === 4) ? 1 : cell;
};

// Перевірка дозволу на проїзд маршрутом (світлофори)
export const isPathAllowed = (conditions, path) => {
  for (let [row, col] of path) {
    const key = `${row},${col}`;
    if (conditions[key]?.name === "red") {
      return { allowed: false, blockedAt: [row, col] };
    }
  }
  return { allowed: true };
};

// Оновлення сітки при русі машини
export const updateGridWithCar = (grid, from, to, carColor) => {
  const newGrid = grid.map((row) => [...row]);

  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;

  const toCellType = getCellType(grid, toRow, toCol);
  if (toCellType !== 1) return null;

  newGrid[fromRow][fromCol] = getCellType(grid, fromRow, fromCol);
  newGrid[toRow][toCol] = carColor === "red" ? 3 : 4;

  return newGrid;
};

// Знайти машину в певній клітинці
export const findCarAt = (cars, row, col) => {
  return cars.find((c) => c.position[0] === row && c.position[1] === col);
};


export const calculateCarOrder = (questionData) => {
    console.log("questionData: ", questionData);
    const { cars, conditions} = questionData;
    const result = [];

  for (const car of cars) {
    const { path, id, color } = car;

    // Перевіряємо весь шлях машини на світлофор
    const { allowed } = isPathAllowed(conditions, path);

    if (!allowed) continue; // 🚫 Пропускаємо машину з червоним на маршруті

    // Визначаємо перший крок
    const [firstRow, firstCol] = path[0];
    const key = `${firstRow},${firstCol}`;
    const condition = conditions?.name || "green";

    result.push({
      id,
      color,
      condition,
      priority: condition === "green" ? 0 : 1, // зелений — вищий пріоритет
    });
  }

  // Сортуємо так, щоб машини з зеленим світлом йшли першими
  result.sort((a, b) => a.priority - b.priority);
  console.log("🚦 Order:", result.map(c => c.id)); 
  return result.map((c) => c.id); // або залиште повний список, якщо треба
};
