import { getCarPriority, hasRightHandObstacle } from "./roadUtils";

export const generateValidOrders = ( allCars, grid, signPositions, blockedDirections, directionToSignId, signs, carPaths, carPriorities) => {
  const results = [];

  const dfs = (currentOrder, remainingCars) => {
    if (remainingCars.length === 0) {
      results.push(currentOrder.map(c => `${c.position[0]}-${c.position[1]}`));
      return;
    }

    const canMove = remainingCars.filter((car) => {
      const others = remainingCars.filter(c => c !== car);
      const key = `${car.position[0]}-${car.position[1]}`;
      const priority = carPriorities[key];

      const blockedByHigher = others.some((other) => {
        const otherKey = `${other.position[0]}-${other.position[1]}`;
        return carPriorities[otherKey] < priority;
      });

      const rightBlocker = hasRightHandObstacle( car, others, grid, signPositions, blockedDirections, directionToSignId, signs, carPaths, carPriorities);

      return !blockedByHigher && !rightBlocker;
    });

    for (const car of canMove) {
      dfs([...currentOrder, car], remainingCars.filter(c => c !== car));
    }
  };

  dfs([], allCars);

  console.log("🔄 Можливі правильні послідовності проїзду:");
  results.forEach((order, idx) => console.log(`${idx + 1}) ${order.join(" → ")}`));

  return results;
};