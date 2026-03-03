import { isPathIntersecting, rightHand, areOncoming } from "./validUtils";

// Генеруємо всі можливі правильні послідовності проїзду машин DFS
export const generateValidOrders = (
  allCars,
  carPaths,
  carPriorities
) => {
  const start = performance.now();
  const results = [];

  // Рекурсивна функція для побудови всіх допустимих послідовностей машин
  const dfs = (currentOrder, remainingCars) => {
    // Якщо всі машини вже додано в порядок, зберігаємо результат
    if (remainingCars.length === 0) {
      results.push(
        currentOrder.map((c) => `${c.position[0]}-${c.position[1]}`)
      );
      return;
    }

    // Визначаємо машину, яка може проїхати на поточному кроці
    const candidates = remainingCars.filter((car) => {
      // Машина з пріоритетом 1 (наприклад, поліція) завжди може їхати
      if (car.cars_priority === 1) return true;

      const key = `${car.position[0]}-${car.position[1]}`;
      const priority = carPriorities[key];
      const currentCarPath = carPaths[key];
      const currentCarDirection = car.path_type;

      let rightBlocker = false;

      // Перевіряємо всі інші машини, які ще не проїхали
      for (const otherCar of remainingCars) {
        const otherKey = `${otherCar.position[0]}-${otherCar.position[1]}`;
        if (otherKey === key) continue; // Якщо ключ це ця ж машина тоді нічого не робимо
        const otherPriority = carPriorities[otherKey];
        const otherPath = carPaths[otherKey];
        const otherCarDirection = otherCar.path_type;

        const intersecting = isPathIntersecting(currentCarPath, otherPath);
        if (!intersecting) continue; // Якщо шляхи не перетинаються — не блокує

        // Лівий поворот чекає на прямо або праворуч
        if (
          currentCarDirection === "left_turn" &&
          (otherCarDirection === "straight" ||
            otherCarDirection === "right_turn") &&
          areOncoming(key, otherKey) &&
          intersecting &&
          otherPriority === priority
        ) {
          rightBlocker = true;
          break;
        }

        // Правило правої руки
        if (
          otherPriority === priority &&
          rightHand[key]?.includes(otherKey) &&
          intersecting 
        ) {
          rightBlocker = true;
          break;
        }
      }

      // Формуємо список інших машин (які ще не проїхали)
      const others = remainingCars.filter((c) => c !== car);

      // Перевіряємо, чи машина блокується автомобілем з вищим пріоритетом
      const blockedByHigher = others.some((other) => {
        if (other.cars_priority === 1) return true; // Поліція блокує всіх
        const otherKey = `${other.position[0]}-${other.position[1]}`;
        const otherPriority = carPriorities[otherKey];

        // Якщо інша машина має вищий пріоритет і є перетин — блокує
        if (otherPriority > priority) {
          if (!isPathIntersecting(carPaths[key], carPaths[otherKey])) {
            return false; 
          }
          return true; 
        }
        return false;
      });

      // Машина може їхати лише якщо немає перешкод ні за пріоритетом, ні справа
      return !blockedByHigher && !rightBlocker;
    });

    // Рекурсивно пробуємо кожного з допустимих кандидатів як наступного в порядку
    for (const car of candidates) {
      dfs(
        [...currentOrder, car],
        remainingCars.filter((c) => c !== car)
      );
    }
  };

  // Запуск рекурсії з порожнім порядком
  dfs([], allCars);

  // console.log("DFS виконано. Побудовано порядки:", results);

  const end = performance.now(); 
  console.log(`Час побудови порядків DFS: ${(end - start).toFixed(2)} мс`);

  return results;
};
