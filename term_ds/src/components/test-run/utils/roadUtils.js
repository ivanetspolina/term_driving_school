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
  cars
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





export const getTurnType = (from, to) => {
  const turns = {
    north: { south: "straight", east: "left", west: "right" },
    east: { west: "straight", south: "left", north: "right" },
    south: { north: "straight", west: "left", east: "right" },
    west: { east: "straight", north: "left", south: "right" },
  };
  return turns[from]?.[to] || "unknown";
};

export const signDirectionsMap = {
  west: {
    position: [4, 2],
    style: "bottom"
  },
  north: {
    position: [2, 3],
    style: "left"
  },
  east: {
    position: [3, 5],
    style: "top"
  },
  south: {
    position: [5, 4],
    style: "right"
  }
};


// Явно задані маршрути для кожного перехрестя та стартової точки
export const specificCarPathsMap = (questionData, carsData, routesData) => {

    // Заглушка для повернення
    const returnData = {};

    // перебираємо всі машини, які є в цьому питанні
    questionData.carsToPlace.forEach(car => {
        
        // відносно позиції машини відибраємо її координати
        const [one, two] = carsData.start_cars_points[car.start_cars_points].position;
        
        // Текстовий варіант ключа
        const keyText = `${one}-${two}`;

        // Отримуємо потрібний вигляд дороги
        const road = routesData[questionData.id];        

        // Перебираємо масив, щоб знайти потрібний шлях
        road.forEach(element => {
            
            // Відбираємо перший індекс
            const { path, type } = element;

            // Шукаємо в кого початковий індекс відповідє нашій позиції машини
            if (path[0].join('-') == keyText && type == car.path_type) {
                returnData[keyText] = path;
            }
        });
    });

    // Формуємо масив де позиція машини має мати from & to
    return returnData;
}



export const isPathIntersecting = (pathA, pathB) => {
  const setA = new Set(pathA.map(([r, c]) => `${r},${c}`));
  return pathB.some(([r, c]) => setA.has(`${r},${c}`));
};

export const rightHandDirectionsMap = {
  north: ['east', 'south'],   // ті, хто під'їжджає з east або повертає з south
  east: ['south', 'west'],
  south: ['west', 'north'],
  west: ['north', 'east'],
};


export const hasRightHandObstacle = (
  currentCar, allCars, grid,
  signPositions, blockedDirections,
  signs, carPaths, carPriorities
) => {
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

    const isBlockingByRight = (
      currentPriority === otherPriority &&
      rightDirs.includes(otherFrom) &&
      intersecting &&
      (
        (currentTurn === "left" && (otherTurn === "straight" || otherTurn === "right")) ||
        (currentTurn === "straight" && (otherTurn === "straight" || otherTurn === "right")) ||
        (currentTurn === "right" && otherTurn === "straight")
      )
    );

    return isBlockingByRight;
  }) || null;
};



export function setCarsToPlace(carsToPlace, carsData) {
  return carsToPlace.map((carConfig) => {
    const { car_id, start_cars_points, path_type } = carConfig;

    // Знаходимо координати стартової точки і стрілки за індексом
    const startPoint = carsData.start_cars_points[start_cars_points];

    if (!startPoint) {
      console.warn(`❗ Стартова точка з індексом ${start_cars_points} не знайдена`);
      return null;
    }

    // Знаходимо пріоритет машинки за її ID
    const carInfo = carsData.cars.find((car) => car.id === car_id);
    const cars_priority = carInfo?.cars_priority ?? 0;

    return {
      car_id,
      path_type,
      position: startPoint.position,
      arrow_position: startPoint.arrow_position,
      cars_priority
    };
  }).filter(Boolean); // Відфільтровуємо null (якщо щось пішло не так)
}
