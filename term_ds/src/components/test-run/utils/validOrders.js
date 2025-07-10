import { isPathIntersecting } from "./roadUtils";

export const rightHand = {
  "4-0": ["7-4"],
  "7-4": ["3-7"],
  "3-7": ["0-3"],
  "0-3": ["4-0"],
};

// Генеруємо всі можливі правильні послідовності проїзду машин 
export const generateValidOrders = (
  allCars,
  carPaths,
  carPriorities
) => {
  // console.log("carPaths: ", carPaths, allCars);
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
      const currentCarDirection = allCars.find(
        (item) =>
          item.position[0] === car.position[0] &&
          item.position[1] === car.position[1]
      )?.path_type;
      let rightBlocker = false; 

      // Перевіряємо чи є ще хтось з таким самим пріоритетом і він справа + шляхи перетинаються
      for (const otherCar of remainingCars) {
        const otherKey = `${otherCar.position[0]}-${otherCar.position[1]}`; 
        if (otherKey === key) continue; // Якщо ключ це ця ж машина тоді нічого не робимо
        const otherPriority = carPriorities[otherKey]; 
        const otherPath = carPaths[otherKey]; 
        const otherCarDirection = allCars.find(
          (item) =>
            item.position[0] === otherCar.position[0] &&
            item.position[1] === otherCar.position[1]
        )?.path_type;

        const intersecting = isPathIntersecting(currentCarPath, otherPath);

        // Додаткова умова: якщо поточна машина повертає ліворуч
        if (
          currentCarDirection === "left_turn" &&
          (otherCarDirection === "straight" ||
            otherCarDirection === "right_turn") &&
          intersecting &&
          otherPriority === priority
        ) {
          rightBlocker = true;
          break;
        }

        // Дивимось в allCars, якщо машина їде прямо чи вправо, тоді шляхи порівнювати не потріно, вона буде їхати перша
        // if (
        //   currentCarDirection != "straight" ||
        //   currentCarDirection != "right_turn"
        // ) {
          if (
            otherPriority === priority &&
            rightHand[key]?.includes(otherKey) &&
            intersecting
          ) {
            rightBlocker = true;
            break;
          }
        // }
      }

      // Створюємо список інших машин (які ще не проїхали)
      const others = remainingCars.filter((c) => c !== car);

      // Якщо є машини з вищим пріоритетом, поточна машина має чекати
      const blockedByHigher = others.some((other) => {
        if (other.cars_priority === 1) return true; // поліція блокує всіх
        const otherKey = `${other.position[0]}-${other.position[1]}`;
        return carPriorities[otherKey] > priority;
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

  console.log("✅ DFS виконано. Побудовано порядки:", results);
  return results;
};
