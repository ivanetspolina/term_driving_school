import { isPathIntersecting, isOnRoundabout, hasBlockingCar, addDependency } from "./validUtils";

// Генеруємо всі можливі правильні послідовності проїзду машин використовуючи топологічне сортування
export const generateTopologicalValidOrders = (
  allCars,
  carPaths,
  carPriorities,
  { isRoundabout = false, roundaboutPositions = [] } = {}
) => {
  const start = performance.now(); 
  const results = [];
  const graph = {}; // Орієнтований граф залежностей: key → Set інших машин, які мають їхати після key
  const inBlocked = {}; // Кількість вхідних ребер для кожної машини (тобто скільки інших машин її блокують)
  console.log("carPaths:", carPaths);

  // Генеруємо унікальні ключі машин за позицією
  const keys = allCars.map((car) => `${car.position[0]}-${car.position[1]}`);
  keys.forEach((key) => {
    graph[key] = new Set();
    inBlocked[key] = 0;
  });

  // Поліцейські машини мають абсолютний пріоритет — всі інші залежать від них
  const policeKeys = allCars
    .filter((car) => car.cars_priority === 1)
    .map((car) => `${car.position[0]}-${car.position[1]}`);
    
  for (const key of keys) {
    for (const policeKey of policeKeys) {
      if (key !== policeKey) {
        graph[policeKey].add(key);
        inBlocked[key]++;
      }
    }
  }  
  
  // Побудова графа залежностей на основі правил пріоритету, напрямків і перешкод
  for (let i = 0; i < allCars.length; i++) {
    const carA = allCars[i];
    const keyA = `${carA.position[0]}-${carA.position[1]}`;
    const pathA = carPaths[keyA];
    const prioA = carPriorities[keyA];
    const dirA = carA.path_type;

    for (let j = 0; j < allCars.length; j++) {
      if (i === j) continue;

      const carB = allCars[j];
      const keyB = `${carB.position[0]}-${carB.position[1]}`;
      const pathB = carPaths[keyB];
      const prioB = carPriorities[keyB];
      const dirB = carB.path_type;

      if (carA.cars_priority === 1 || carB.cars_priority === 1) continue; // Поліцію ми вже врахували, тут не розглядаємо

      const intersecting = isPathIntersecting(pathA, pathB);
      if (!intersecting) continue; // Якщо не перетинаються, немає залежності
            
      if (prioA > prioB) { // Якщо одна машина має вищий пріоритет — вона їде раніше
        addDependency(graph, inBlocked, keyA, keyB);
        continue;
      }

      // Спеціальні правила для кругового перехрестя
      if (isRoundabout) {     
        // Визначення, чи машини вже на колі     
        const isAOn = isOnRoundabout(carA.position, roundaboutPositions);
        const isBOn = isOnRoundabout(carB.position, roundaboutPositions);
        const isRightA = dirA === "right_turn";
        const isRightB = dirB === "right_turn";

        // Машина, що вже на колі, має пріоритет над тією, що в'їжджає
        if (isAOn && !isBOn && intersecting) {
          addDependency(graph, inBlocked, keyA, keyB);
          continue;
        }
        if (!isAOn && isBOn && intersecting) {
          addDependency(graph, inBlocked, keyB, keyA);
          continue;
        }      
        
        // Якщо обидві вже на колі — перевірка правих поворотів і блокувань
        if (isAOn && isBOn) {
          // Правий поворот має перевагу
          if (isRightA && !isRightB) {
            addDependency(graph, inBlocked, keyA, keyB);
            continue;
          }
          if (!isRightA && isRightB) {
            addDependency(graph, inBlocked, keyB, keyA);
            continue;
          }

          console.log("Викликаємо hasBlockingCar для", keyA, "і", keyB);

          const aBlocked = hasBlockingCar(pathA, keyA, allCars, roundaboutPositions);
          const bBlocked = hasBlockingCar(pathB, keyB, allCars, roundaboutPositions);

          // Пріоритет має та машина, що не заблокована
          if (isRightA && !aBlocked) continue;
          if (isRightB && !bBlocked) continue;

          // Якщо лише одна машина заблокована — інша їде першою
          if (aBlocked && !bBlocked) {
            addDependency(graph, inBlocked, keyB, keyA);
            continue;
          }
          if (bBlocked && !aBlocked) {
            addDependency(graph, inBlocked, keyA, keyB);
            continue;
          }

          // Якщо обидві заблоковані — перевіряємо взаємне блокування
          if (aBlocked && bBlocked) {
            const aBlocksB = pathA.some(([r, c]) => r === carB.position[0] && c === carB.position[1]);
            const bBlocksA = pathB.some(([r, c]) => r === carA.position[0] && c === carA.position[1]);
            
            if (aBlocksB && !bBlocksA) {
              addDependency(graph, inBlocked, keyB, keyA);
            } else if (bBlocksA && !aBlocksB) {
              addDependency(graph, inBlocked, keyA, keyB);
            } else {
              // Не додаємо ребро, щоб не зациклювати граф
              console.warn(`Взаємне блокування між ${keyA} і ${keyB}!`);
            }
          }
          continue;
        }        
      } 
    }
  }

  // Топологічне сортування: пошук усіх допустимих порядків
  const backtrack = (path, used, localInBlocked) => {
    if (path.length === keys.length) {
      results.push([...path]); // Зберігаємо повний порядок
      return;
    }

    for (const key of keys) {
      if (used.has(key)) continue;
      if (localInBlocked[key] > 0) continue;

      used.add(key);
      path.push(key);

      // Створюємо копію inBlocked для наступної ітерації
      const updatedInBlocked = { ...localInBlocked };
      for (const neighbor of graph[key]) {
        updatedInBlocked[neighbor]--;
      }

      // Рекурсивно шукаємо далі
      backtrack(path, used, updatedInBlocked);

      used.delete(key);
      path.pop();
    }
  };

  console.log("Граф залежностей:");
  for (const key in graph) {
    console.log(`${key} → [${[...graph[key]].join(", ")}]`);
  }

  // Запуск пошуку всіх допустимих топологічних порядків
  backtrack([], new Set(), inBlocked);

  console.log("Топологічне сортування виконано. Побудовано порядки:", results);

  const end = performance.now();
  console.log(`Час побудови топологічного порядку: ${(end - start).toFixed(2)} мс`);

  return results;
};
