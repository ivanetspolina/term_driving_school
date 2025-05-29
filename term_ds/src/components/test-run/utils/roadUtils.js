export const getFromDirection = (position, grid) => {
  const [row, col] = position;
  if (row === 0) return "north";
  if (row === grid.length - 1) return "south";
  if (col === 0) return "west";
  if (col === grid[0].length - 1) return "east";
  return null;
};


/**
 * Обчислює пріоритет машинки на перехресті, враховуючи знаки, напрямок, блокування та тип ТЗ.
 *
 * @param {Object} car - Машина з position, car_id, path_type
 * @param {Array} grid - Сітка перехрестя (матриця 8x8)
 * @param {Array} signPositions - Масив знаків [{ direction, sign_id, position, style }]
 * @param {Array} blockedDirections - Напрямки, які заблоковано
 * @param {Array} signs - Усі знаки з conditions.json
 * @param {Array} cars - Усі машини з cars.json (для пріоритету)
 * @param {Array} carsToPlace - Лише машини в поточному питанні
 *
 * @returns {number} - Числовий пріоритет (чим більше — тим вищий)
 */
export const getCarPriority = (
  car,
  grid,
  signPositions,
  blockedDirections,
  signs,
  cars,
  carsToPlace = []
) => {
  // Визначаємо, з якого напрямку приїжджає машинка
  const fromDir = getFromDirection(car.position, grid);

  // Якщо напрямок не визначено або заблокований — пріоритет нульовий
  if (!fromDir || blockedDirections.includes(fromDir)) {
    console.log(`🚫 Напрям '${fromDir}' заблокований або не визначений для [${car.position}]`);
    return 0;
  }

  // Знаходимо дані про машину за її car_id
  const carData = cars.find(c => c.id === car.car_id);
  const carPriorityValue = carData?.cars_priority ?? 0;

  // Спецмашини (наприклад, поліція) мають абсолютний пріоритет
  if (carPriorityValue === 1) {
    console.log(`🚓 Машина '${car.car_id}' з позиції [${car.position}] має абсолютний пріоритет.`);
    return 10;
  }

  // Знаходимо дорожній знак, який відповідає напрямку руху
  const sign = signPositions.find(s => s.direction === fromDir);
  const signId = sign?.sign_id;

  // Якщо знаку немає — пріоритет нульовий
  if (!signId) {
    console.log(`ℹ️ Для напрямку '${fromDir}' немає дорожнього знаку`);
    return 0;
  }

  // Отримуємо деталі знаку з conditions.json
  const signDetails = signs.find(s => s.id === signId);
  const priority = signDetails ? (10 - signDetails.signs_priority) : 0;

  console.log(`🚗 Машина '${car.car_id}' з ${fromDir} — знак '${signId}', пріоритет: ${priority}`);
  return priority;
};




export const getSignForCell = (row, col, signList, blockedDirections, signStyles) => {
  for (const sign of signList) {
    if (
      sign.position[0] === row &&
      sign.position[1] === col &&
      !blockedDirections.includes(sign.direction)
    ) {
      return {
        signId: sign.sign_id,
        positionStyle: sign.style,
        sign: signStyles[sign.sign_id],
      };
    }
  }
  return null;
};


export const rightHandDirectionsMap = {
  north: ['east', 'south'],   // ті, хто під'їжджає з east або повертає з south
  east: ['south', 'west'],
  south: ['west', 'north'],
  west: ['north', 'east'],
};

export const getTurnType = (from, to) => {
  const turns = {
    north: { south: "straight", east: "left", west: "right" },
    east: { west: "straight", south: "left", north: "right" },
    south: { north: "straight", west: "left", east: "right" },
    west: { east: "straight", north: "left", south: "right" },
  };
  return turns[from]?.[to] || "unknown";
};

export const isPathIntersecting = (pathA, pathB) => {
  const setA = new Set(pathA.map(([r, c]) => `${r},${c}`));
  return pathB.some(([r, c]) => setA.has(`${r},${c}`));
};

export const hasRightHandObstacle = ( currentCar, allCars, grid, signPositions, blockedDirections, directionToSignId, signs, carPaths, carPriorities) => {
  const currentKey = `${currentCar.position[0]}-${currentCar.position[1]}`;
  const currentFrom = getFromDirection(currentCar.position, grid);
  const currentToCoord = carPaths[currentKey]?.at(-1);
  const currentTo = getFromDirection(currentToCoord, grid);
  const currentTurn = getTurnType(currentFrom, currentTo);
  const currentPriority = carPriorities[currentKey];
  const currentPath = carPaths[currentKey] || [];

  const rightDirs = rightHandDirectionsMap[currentFrom];

  return allCars.find(otherCar => {
    const otherKey = `${otherCar.position[0]}-${otherCar.position[1]}`;
    if (otherKey === currentKey) return false;
    if (!carPaths[otherKey]) return false;

    const otherFrom = getFromDirection(otherCar.position, grid);
    const otherToCoord = carPaths[otherKey]?.at(-1);
    const otherTo = getFromDirection(otherToCoord, grid);
    const otherTurn = getTurnType(otherFrom, otherTo);
    const otherPriority = carPriorities[otherKey];
    const otherPath = carPaths[otherKey];

    const intersecting = isPathIntersecting(currentPath, otherPath);

    return (
      otherPriority === currentPriority &&
      rightDirs.includes(otherFrom) &&
      currentTurn === "left" &&
      (otherTurn === "straight" || otherTurn === "right") &&
      intersecting
    );
  }) || null;
};