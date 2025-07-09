import { CornerDownLeft, CornerDownRight, MoveDown } from "lucide-react";
import { getFromDirection, getRoundFromDirection } from "./roadUtils";

const iconByType = {
  straight: MoveDown,
  left_turn: CornerDownRight,
  right_turn: CornerDownLeft,
};

const rotationMap = {
  north: "0deg",
  east: "90deg",
  south: "180deg",
  west: "270deg",
};

// Генеруємо масив індикаторів напрямку руху для кожної машинки
export const getDirectionIndicators = (startCarsPoints, carPaths, grid, commonRoutes) => {
  return startCarsPoints.map((car, idx) => {
    const key = `${car.position[0]}-${car.position[1]}`;
    const path = carPaths[key];

    console.log(`\n🟦 Машина ${idx + 1}:`, car);
    console.log("🔑 Key:", key);
    console.log("🛣️ Path:", path);

    // Отримуємо напрямок відправлення
    const from = getRoundFromDirection(car.position, grid, path);
    console.log(`🔎 [${idx+1}] from="${from}"   position=[${car.position}]   arrow=[${car.arrow_position}]`);

    // Отримуємо кінцеву точку маршруту
    const endPosition = path[path.length - 1];

    // Отримуємо напрямок прибуття
    const to = getFromDirection(endPosition, grid);

    // Знаходимо відповідний маршрут в commonRoutes для отримання типу
    let routeInfo = commonRoutes.find(
      (route) =>
        route.from === from && route.to === to && route.type === car.path_type
    );
    // let routeInfo = commonRoutes.find(route =>
    //   route.from === from && route.to === to
    // );

    if (!routeInfo) {
      const fullRoute = commonRoutes.find(
        (route) =>
          JSON.stringify(route.path.slice(2)) === JSON.stringify(path) &&
          route.type === car.path_type
      );
      // const fullRoute = commonRoutes.find(route =>
      //   JSON.stringify(route.path.slice(2)) === JSON.stringify(path)
      // );

      if (fullRoute) {
        routeInfo = fullRoute;
      } else {
        console.warn("Не знайдено маршрут навіть для кругового:", path);
        return null;
      }
    }

    console.log("🔎 Визначений маршрут:", routeInfo);
    console.log("📍 Тип:", routeInfo?.type);

    const type = routeInfo.type;
    const Icon = iconByType[type];
    const rotate = rotationMap[from];

    return {
      key: `indicator-${idx}`,
      position: car.arrow_position,
      Icon,
      rotate,
    };
  }).filter(Boolean);
};