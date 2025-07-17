// Визначаємо, з якого напрямку перехрестя розміщена машинка
export const getFromDirection = (position, grid) => {
  const [row, col] = position;
  if (row === 0) return "north";
  if (row === grid.length - 1) return "south";
  if (col === 0) return "west";
  if (col === grid[0].length - 1) return "east";
  return null;
};

// Визначаємо напрямок руху з точки position по сітці або маршруту
export const getRoundFromDirection = (position, grid, fullPath = []) => {
  const direct = getFromDirection(position, grid);
  if (direct) return direct;

  // Спробуємо знайти індекс
  let index = fullPath.findIndex(
    (p) => p[0] === position[0] && p[1] === position[1]
  );

  // Якщо не знайдено, можливо це path[2]
  if (index === -1 && fullPath.length > 3) {
    const assumed = fullPath[2];
    if (assumed[0] === position[0] && assumed[1] === position[1]) {
      index = 2;
    } else {
      console.warn("Позиція не знайдена в маршруті:", position, fullPath);
      return null;
    }
  }

  if (index + 1 >= fullPath.length) return null;

  const [currRow, currCol] = fullPath[index];
  const [nextRow, nextCol] = fullPath[index + 1];

  if (nextRow < currRow) return "east";
  if (nextRow > currRow) return "west";
  if (nextCol < currCol) return "north";
  if (nextCol > currCol) return "south";

  return null;
};

// Обчислюємо пріоритет машини для проїзду через перехрестя
export const getCarPriority = (
  car,
  grid,
  signPositions,
  blockedDirections,
  signs,
  cars
) => {
  const fromDir = getFromDirection(car.position, grid);  

  // Знаходимо дані про машину за її car_id
  const carData = cars.find(c => c.id === car.car_id);
  const carPriorityValue = carData?.cars_priority ?? 0;

  if (carPriorityValue === 1) {
    // console.log(`Машина '${car.car_id}' з позиції [${car.position}] має абсолютний пріоритет.`);
    return 11;
  }

  if (car.isOnRoundabout) {
    console.log(`Машина '${car.car_id}' з позиції [${car.position}] на колі.`);
    return 10;
  }

  if (!fromDir || blockedDirections.includes(fromDir)) {
    // console.log(`Напрям '${fromDir}' заблокований або не визначений для [${car.position}]`);
    return 0;
  }

  // Знаходимо дорожній знак, який відповідає напрямку руху
  const sign = signPositions.find(s => s.direction === fromDir);
  const signId = sign?.sign_id;

  if (!signId) {
    console.log(`Для напрямку '${fromDir}' немає дорожнього знаку`);
    return 0;
  }

  // Отримуємо деталі знаку 
  const signDetails = signs.find(s => s.id === signId);
  const priority = signDetails ? (10 - signDetails.signs_priority) : 0;

  return priority;
};

// Повертаємо об'єкт із даними знака
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

// Визначаємо координати розміщення знаків 
export const getSignDirectionsMap = (intersectionId) => {
  const defaultMap = {
    west:  { position: [4, 2], style: "bottom" },
    north: { position: [2, 3], style: "left"   },
    east:  { position: [3, 5], style: "top"    },
    south: { position: [5, 4], style: "right"  },
  };

  if (intersectionId === "round_cross") {
    return {
      west:  { position: [4, 1], style: "bottom"  },
      north: { position: [1, 2], style: "right"     },
      east:  { position: [3, 6], style: "top"    },
      south: { position: [6, 4], style: "right" },
    };
  }

  return defaultMap;
};

// Явно задані маршрути для кожного перехрестя та стартової точки
export const specificCarPathsMap = (questionData, carsData, routesData) => {
    const returnData = {};

    const normalPoints = carsData.start_cars_points || [];
    const roundPoints = carsData.start_round_cars_points || [];

    questionData.carsToPlace.forEach(car => {
        // визначаємо, з якого масиву брати точку
        const isRound = typeof car.start_round_cars_points === "number";
        const index = isRound ? car.start_round_cars_points : car.start_cars_points;

        const startData = isRound ? roundPoints[index] : normalPoints[index];
        if (!startData) return;

        const [one, two] = startData.position;
        const keyText = `${one}-${two}`;

        const road = routesData[questionData.id];

        road.forEach(element => {
            const { path, type } = element;
            const matchIndex = isRound ? 2 : 0;

            if (path[matchIndex]?.join("-") === keyText && type === car.path_type) {
                returnData[keyText] = isRound ? path.slice(matchIndex) : path;
            }
        });
    });

    return returnData;
}

// Формуємо остаточний список машинок
export function setCarsToPlace(carsToPlace, carsData) {
  return carsToPlace.map((carConfig) => {
    const { car_id, path_type } = carConfig;

    const isRound = typeof carConfig.start_round_cars_points === "number";
    const index = isRound ? carConfig.start_round_cars_points : carConfig.start_cars_points;

    const startPoint = isRound
      ? carsData.start_round_cars_points?.[index]
      : carsData.start_cars_points?.[index];

    if (!startPoint) {
      console.warn(`Стартова точка з індексом ${index} не знайдена`);
      return null;
    }

    const carInfo = carsData.cars.find((car) => car.id === car_id);
    const cars_priority = carInfo?.cars_priority ?? 0;

    return {
      car_id,
      path_type,
      position: startPoint.position,
      arrow_position: startPoint.arrow_position,
      cars_priority,
      isOnRoundabout: isRound
    };
  }).filter(Boolean);
}
