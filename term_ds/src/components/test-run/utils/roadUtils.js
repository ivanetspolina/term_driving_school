// Визначаємо, з якого напрямку перехрестя розміщена машинка
export const getFromDirection = (position, grid) => {
  const [row, col] = position;
  if (row === 0) return "north";
  if (row === grid.length - 1) return "south";
  if (col === 0) return "west";
  if (col === grid[0].length - 1) return "east";
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
    const returnData = {};

    // Перебираємо всі машини, які є в цьому питанні
    questionData.carsToPlace.forEach(car => {
        
        // Відносно позиції машини відибраємо її координати
        const [one, two] = carsData.start_cars_points[car.start_cars_points].position;
        const keyText = `${one}-${two}`;

        // Отримуємо потрібний вигляд дороги
        const road = routesData[questionData.id];        

        // Перебираємо масив, щоб знайти потрібний шлях
        road.forEach(element => {
            const { path, type } = element;

            // Шукаємо в кого початковий індекс відповідє нашій позиції машини
            if (path[0].join('-') == keyText && type == car.path_type) {
                returnData[keyText] = path;
            }
        });
    });
    return returnData;
}

// Перевіряємо, чи перетинаються два шляхи
export const isPathIntersecting = (pathA, pathB) => {
  const setA = new Set(pathA.map(([r, c]) => `${r},${c}`));
  return pathB.some(([r, c]) => setA.has(`${r},${c}`));
};

// Формуємо остаточний список машинок
export function setCarsToPlace(carsToPlace, carsData) {
  return carsToPlace.map((carConfig) => {
    const { car_id, start_cars_points, path_type } = carConfig;

    // Знаходимо координати стартової точки і стрілки за індексом
    const startPoint = carsData.start_cars_points[start_cars_points];

    if (!startPoint) {
      console.warn(`Стартова точка з індексом ${start_cars_points} не знайдена`);
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
  }).filter(Boolean); 
}
