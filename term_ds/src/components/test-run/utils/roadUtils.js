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

  console.log("📦 fullPath:", JSON.stringify(fullPath));
  console.log("📍 Очікувана позиція (має бути path[2]):", position);

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
      console.warn("❌ Позиція не знайдена в маршруті:", position, fullPath);
      return null;
    }
  }

  if (index + 1 >= fullPath.length) return null;

  const [currRow, currCol] = fullPath[index];
  const [nextRow, nextCol] = fullPath[index + 1];

  if (nextRow < currRow) return "west";
  if (nextRow > currRow) return "east";
  if (nextCol < currCol) return "north";
  if (nextCol > currCol) return "south";

  return null;
};


// export const getRoundFromDirection = (position, grid, fullPath = []) => {
//   const direct = getFromDirection(position, grid);
//   if (direct) return direct;

  // // Якщо не край сітки — шукаємо позицію у повному шляху
  // const index = fullPath.findIndex((p) => p[0] === position[0] && p[1] === position[1]);
// };

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

  if (!fromDir || blockedDirections.includes(fromDir)) {
    console.log(`Напрям '${fromDir}' заблокований або не визначений для [${car.position}]`);
    return 0;
  }

  // Знаходимо дані про машину за її car_id
  const carData = cars.find(c => c.id === car.car_id);
  const carPriorityValue = carData?.cars_priority ?? 0;

  if (carPriorityValue === 1) {
    console.log(`Машина '${car.car_id}' з позиції [${car.position}] має абсолютний пріоритет.`);
    return 10;
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

  console.log(`Машина '${car.car_id}' з ${fromDir} — знак '${signId}', пріоритет: ${priority}`);
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
// export const specificCarPathsMap = (questionData, carsData, routesData) => {
//     const returnData = {};

//     // Перебираємо всі машини, які є в цьому питанні
//     questionData.carsToPlace.forEach(car => {
        
//         // Відносно позиції машини відибраємо її координати
//         const [one, two] = carsData.start_cars_points[car.start_cars_points].position;
//         const keyText = `${one}-${two}`;

//         // Отримуємо потрібний вигляд дороги
//         const road = routesData[questionData.id];        

//         // Перебираємо масив, щоб знайти потрібний шлях
//         road.forEach(element => {
//             const { path, type } = element;

//             // Шукаємо в кого початковий індекс відповідє нашій позиції машини
//             if (path[0].join('-') == keyText && type == car.path_type) {
//                 returnData[keyText] = path;
//             }
//         });
//     });
//     return returnData;
// }

// Перевіряємо, чи перетинаються два шляхи
export const isPathIntersecting = (pathA, pathB) => {
  const setA = new Set(pathA.map(([r, c]) => `${r},${c}`));
  return pathB.some(([r, c]) => setA.has(`${r},${c}`));
};

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
      cars_priority
    };
  }).filter(Boolean);
}
// export function setCarsToPlace(carsToPlace, carsData) {
//   return carsToPlace.map((carConfig) => {
//     const { car_id, start_cars_points, path_type } = carConfig;

//     // Знаходимо координати стартової точки і стрілки за індексом
//     const startPoint = carsData.start_cars_points[start_cars_points];

//     if (!startPoint) {
//       console.warn(`Стартова точка з індексом ${start_cars_points} не знайдена`);
//       return null;
//     }

//     // Знаходимо пріоритет машинки за її ID
//     const carInfo = carsData.cars.find((car) => car.id === car_id);
//     const cars_priority = carInfo?.cars_priority ?? 0;

//     return {
//       car_id,
//       path_type,
//       position: startPoint.position,
//       arrow_position: startPoint.arrow_position,
//       cars_priority
//     };
//   }).filter(Boolean); 
// }
