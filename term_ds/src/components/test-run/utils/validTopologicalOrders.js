import { isPathIntersecting, rightHand, isOnRoundabout, hasBlockingCar, addDependency } from "./validUtils";

// Генеруємо всі можливі правильні послідовності проїзду машин 
// використовуючи топологічне сортування
export const generateTopologicalValidOrders = (
  allCars,
  carPaths,
  carPriorities,
  { isRoundabout = false, roundaboutPositions = [] } = {}
) => {
  const start = performance.now(); 
  const results = [];
  const graph = {}; 
  const inBlocked = {}; 
  console.log("carPaths:", carPaths);

  const keys = allCars.map((car) => `${car.position[0]}-${car.position[1]}`);
  keys.forEach((key) => {
    graph[key] = new Set();
    inBlocked[key] = 0;
  });

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

      if (carA.cars_priority === 1 || carB.cars_priority === 1) continue;

      const intersecting = isPathIntersecting(pathA, pathB);
      // if (!isRoundabout && !intersecting) continue;
      if (!intersecting) continue;
            
      if (prioA > prioB) {
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

        if (isAOn && !isBOn && intersecting) {
          addDependency(graph, inBlocked, keyA, keyB);
          continue;
        }
        if (!isAOn && isBOn && intersecting) {
          addDependency(graph, inBlocked, keyB, keyA);
          continue;
        }      
        
        if (isAOn && isBOn) {
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

          if (isRightA && !aBlocked) continue;
          if (isRightB && !bBlocked) continue;

          if (aBlocked && !bBlocked) {
            addDependency(graph, inBlocked, keyB, keyA);
            continue;
          }
          if (bBlocked && !aBlocked) {
            addDependency(graph, inBlocked, keyA, keyB);
            continue;
          }

          if (aBlocked && bBlocked) {
            console.log(`Обидві машини заблоковані: ${keyA} і ${keyB}`);
            
            // Знаходимо, хто кого блокує безпосередньо
            const aBlocksB = pathA.some(([r, c]) => r === carB.position[0] && c === carB.position[1]);
            const bBlocksA = pathB.some(([r, c]) => r === carA.position[0] && c === carA.position[1]);
            
            if (aBlocksB && !bBlocksA) {
              addDependency(graph, inBlocked, keyB, keyA);
            } else if (bBlocksA && !aBlocksB) {
              addDependency(graph, inBlocked, keyA, keyB);
            } else {
              console.warn(`Взаємне блокування між ${keyA} і ${keyB}!`);
            }
          }
          continue;
        }        

      } else {
        // Лівий поворот чекає на прямо або праворуч
        if (
          dirA === "left_turn" &&
          (dirB === "straight" || dirB === "right_turn") &&
          intersecting &&
          prioA === prioB
        ) {
          addDependency(graph, inBlocked, keyB, keyA);
        }

        // Правило правої руки — тільки якщо carA НЕ їде прямо чи вправо
        if (
          prioA === prioB &&
          rightHand[keyA]?.includes(keyB) &&
          intersecting
        ) {
          addDependency(graph, inBlocked, keyB, keyA);
        }
      }
    }
  }

  // Пошук усіх допустимих топологічних порядків
  const backtrack = (path, used, localInBlocked) => {
    if (path.length === keys.length) {
      results.push([...path]);
      return;
    }

    for (const key of keys) {
      if (used.has(key)) continue;
      if (localInBlocked[key] > 0) continue;

      used.add(key);
      path.push(key);

      const updatedInBlocked = { ...localInBlocked };
      for (const neighbor of graph[key]) {
        updatedInBlocked[neighbor]--;
      }

      backtrack(path, used, updatedInBlocked);

      used.delete(key);
      path.pop();
    }
  };

  console.log("Граф залежностей:");
  for (const key in graph) {
    console.log(`${key} ← [${[...graph[key]].join(", ")}]`);
  }

  backtrack([], new Set(), inBlocked);

  console.log("✅ Топологічне сортування виконано. Побудовано порядки:", results);

  const end = performance.now();
  console.log(`⏱️ Час побудови топологічного порядку: ${(end - start).toFixed(2)} мс`);

  return results;
};
