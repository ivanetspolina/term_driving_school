import { CornerDownLeft, CornerDownRight, MoveDown } from "lucide-react";
import { getFromDirection } from "./roadUtils";

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

    // Отримуємо напрямок відправлення
    const from = getFromDirection(car.position, grid);

    // Отримуємо кінцеву точку маршруту
    const endPosition = path[path.length - 1];

    // Отримуємо напрямок прибуття
    const to = getFromDirection(endPosition, grid);

    // Знаходимо відповідний маршрут в commonRoutes для отримання типу
    const routeInfo = commonRoutes.find(route => 
      route.from === from && route.to === to
    );

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