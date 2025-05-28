import { hasRightHandObstacle } from "./roadUtils";

export const generateValidOrders = (
  allCars, grid, signPositions, blockedDirections,
  directionToSignId, signs, carPaths, carPriorities
) => {
  const results = [];

  const dfs = (currentOrder, remainingCars) => {
    if (remainingCars.length === 0) {
      results.push(
        currentOrder.map((c) => `${c.position[0]}-${c.position[1]}`)
      );
      return;
    }

    const candidates = remainingCars.filter((car) => {
      if (car.cars_priority === 1) return true;

      const key = `${car.position[0]}-${car.position[1]}`;
      const priority = carPriorities[key];
      const others = remainingCars.filter((c) => c !== car);

      // ❗ Тепер перевіряємо, чи є інші з ВИЩИМ (а не просто меншим!)
      const blockedByHigher = others.some((other) => {
        if (other.cars_priority === 1) return true;
        const otherKey = `${other.position[0]}-${other.position[1]}`;
        return carPriorities[otherKey] > priority;
      });

      const rightBlocker = hasRightHandObstacle(
        car,
        others,
        grid,
        signPositions,
        blockedDirections,
        directionToSignId,
        signs,
        carPaths,
        carPriorities
      );

      return !blockedByHigher && !rightBlocker;
    });

    for (const car of candidates) {
      dfs(
        [...currentOrder, car],
        remainingCars.filter((c) => c !== car)
      );
    }
  };

  dfs([], allCars);


  console.log("🔄 Можливі правильні послідовності проїзду:");
  results.forEach((order, idx) => console.log(`${idx + 1}) ${order.join(" → ")}`));
  console.log("carPriorities:", carPriorities);
  console.log("allCars:", allCars.map(car => `${car.position} → ${carPriorities[`${car.position[0]}-${car.position[1]}`]}`));

  return results;
};
