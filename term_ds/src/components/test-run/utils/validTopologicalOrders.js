import { isPathIntersecting } from "./roadUtils";
import { rightHand } from "./validOrders";

// Генеруємо всі можливі правильні послідовності проїзду машин 
// використовуючи топологічне сортування
export const generateTopologicalValidOrders = (
  allCars,
  carPaths,
  carPriorities
) => {
//   console.log("carPaths: ", carPaths, allCars);
  const results = [];
  const graph = {}; // key -> Set of cars it must go before
  const inBlocked = {}; // key -> number of dependencies

  const keys = allCars.map((car) => `${car.position[0]}-${car.position[1]}`);
  keys.forEach((key) => {
    graph[key] = new Set();
    inBlocked[key] = 0;
  });

  // Будуємо залежності
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

      const intersecting = isPathIntersecting(pathA, pathB);

      // Пріоритетна машина (наприклад, поліція)
      if (prioA < prioB) {
        graph[keyB].add(keyA);
        inBlocked[keyA]++;
      }

      // Лівий поворот чекає на прямо або праворуч
      if (
        dirA === "left_turn" &&
        (dirB === "straight" || dirB === "right_turn") &&
        intersecting &&
        prioA === prioB
      ) {
        console.log(`🛑 ${keyA} (left_turn) чекає на ${keyB} (${dirB})`);
        graph[keyB].add(keyA);
        inBlocked[keyA]++;
      }

      // Правило правої руки — тільки якщо carA НЕ їде прямо чи вправо
      if (
        prioA === prioB &&
        (dirA !== "straight" || dirA !== "right_turn") &&
        rightHand[keyA]?.includes(keyB) &&
        intersecting
      ) {
        graph[keyB].add(keyA);
        inBlocked[keyA]++;
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

  backtrack([], new Set(), inBlocked);

  console.log("✅ Топологічне сортування виконано. Побудовано порядки:", results);
  return results;
};