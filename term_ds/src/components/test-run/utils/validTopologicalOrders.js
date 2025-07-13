import { isPathIntersecting, rightHand } from "./roadUtils";

// Генеруємо всі можливі правильні послідовності проїзду машин 
// використовуючи топологічне сортування
export const generateTopologicalValidOrders = (
  allCars,
  carPaths,
  carPriorities,
  { isRoundabout = false, roundaboutPositions = [] } = {}
) => {
  // const start = performance.now(); 
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

  const isOnRoundabout = (pos) =>
    roundaboutPositions.some(([r, c]) => r === pos[0] && c === pos[1]);

  const addDependency = (from, to, reason = "") => {
    if (!graph[from].has(to)) {
      graph[from].add(to);
      inBlocked[to]++;
      if (reason) console.log(`${from} → ${to} (${reason})`);
    }
  };

  const hasBlockingCar = (path, currentKey) =>
    allCars.some(({ position }) => {
      const keyOther = `${position[0]}-${position[1]}`;
      return (
        keyOther !== currentKey &&
        isOnRoundabout(position) &&
        path.some(([r, c]) => r === position[0] && c === position[1])
      );
    });

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
        addDependency(keyA, keyB, "пріоритет");
        continue;
      }

      // Спеціальні правила для кругового перехрестя
      if (isRoundabout) {     
        // Визначення, чи машини вже на колі     
        const isAOn = isOnRoundabout(carA.position);
        const isBOn = isOnRoundabout(carB.position);
        const isRightA = dirA === "right_turn";
        const isRightB = dirB === "right_turn";

        if (isAOn && !isBOn && intersecting) {
          addDependency(keyA, keyB, "в'їзд на коло");
          continue;
        }
        if (!isAOn && isBOn && intersecting) {
          addDependency(keyB, keyA, "в'їзд на коло");
          continue;
        }      
        
        if (isAOn && isBOn) {
          if (isRightA && !isRightB) {
            addDependency(keyA, keyB, "правий поворот");
            continue;
          }
          if (!isRightA && isRightB) {
            addDependency(keyB, keyA, "правий поворот");
            continue;
          }

          console.log("Викликаємо hasBlockingCar для", keyA, "і", keyB);

          const aBlocked = hasBlockingCar(pathA, keyA);
          const bBlocked = hasBlockingCar(pathB, keyB);

          if (isRightA && !aBlocked) continue;
          if (isRightB && !bBlocked) continue;

          if (aBlocked && !bBlocked) {
            addDependency(keyB, keyA, "A заблокована");
            continue;
          }
          if (bBlocked && !aBlocked) {
            addDependency(keyA, keyB, "B заблокована");
            continue;
          }

          if (aBlocked && bBlocked) {
            console.log(`Обидві машини заблоковані: ${keyA} і ${keyB}`);
            
            // Знаходимо, хто кого блокує безпосередньо
            const aBlocksB = pathA.some(([r, c]) => r === carB.position[0] && c === carB.position[1]);
            const bBlocksA = pathB.some(([r, c]) => r === carA.position[0] && c === carA.position[1]);
            
            if (aBlocksB && !bBlocksA) {
              addDependency(keyB, keyA, "взаємне блокування: A проходить через B");
            } else if (bBlocksA && !aBlocksB) {
              addDependency(keyA, keyB, "взаємне блокування: B проходить через A");
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
          addDependency(keyB, keyA, "лівий поворот");
        }

        // Правило правої руки — тільки якщо carA НЕ їде прямо чи вправо
        if (
          prioA === prioB &&
          //(dirA !== "straight" || dirA !== "right_turn") &&
          rightHand[keyA]?.includes(keyB) &&
          intersecting
        ) {
          addDependency(keyB, keyA, "правило правої руки");
        }
      }
    }
  }

  // Пошук усіх допустимих топологічних порядків
  const backtrack = (path, used, localinBlocked) => {
    if (path.length === keys.length) {
      results.push([...path]);
      return;
    }

    for (const key of keys) {
      if (used.has(key)) continue;
      if (localinBlocked[key] > 0) continue;

      // використовуємо машину
      used.add(key);
      path.push(key);

      const updatedinBlocked = { ...localinBlocked };
      for (const neighbor of graph[key]) {
        updatedinBlocked[neighbor]--;
      }

      backtrack(path, used, updatedinBlocked);

      // відкочуємо
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

  // const end = performance.now();
  // console.log(`⏱️ Час побудови топологічного порядку: ${(end - start).toFixed(2)} мс`);

  return results;
};
