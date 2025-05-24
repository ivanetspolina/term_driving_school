import { CornerDownLeft, CornerDownRight, MoveDown } from "lucide-react";
import { getFromDirection } from "./roadUtils";

const iconByType = {straight: MoveDown, left_turn: CornerDownRight, right_turn: CornerDownLeft};

const rotationMap = { north: "0deg", east: "90deg", south: "180deg", west: "270deg" };
export const getDirectionIndicators = (startCarsPoints, carPaths, grid, commonRoutes) => {
  return startCarsPoints.map((car, idx) => {
    const key = `${car.position[0]}-${car.position[1]}`;
    const path = carPaths[key];

    if (!path) {
      console.warn("❗ Немає маршруту для:", key);
      return null;
    }

    if (!car.arrow_position) {
      console.warn("❗ Немає позиції стрілки для:", key);
      return null;
    }

    // Отримуємо напрямок відправлення
    const from = getFromDirection(car.position, grid);
    if (!from) {
      console.warn("❗ Не вдається визначити напрямок відправлення для:", key);
      return null;
    }

    // Отримуємо кінцеву точку маршруту
    const endPosition = path[path.length - 1];
    if (!endPosition) {
      console.warn("❗ Маршрут порожній для:", key);
      return null;
    }

    // Отримуємо напрямок прибуття
    const to = getFromDirection(endPosition, grid);
    if (!to) {
      console.warn("❗ Не вдається визначити напрямок прибуття для:", key);
      return null;
    }

    // Знаходимо відповідний маршрут в commonRoutes для отримання типу
    const routeInfo = commonRoutes.find(route => 
      route.from === from && route.to === to
    );

    if (!routeInfo) {
      console.warn("❗ Не знайдено інформацію про маршрут:", { from, to, key });
      return null;
    }

    const type = routeInfo.type;
    const Icon = iconByType[type];
    const rotate = rotationMap[from];

    if (!Icon || !rotate) {
      console.warn("❗ Некоректні дані для індикатора:", {
        key,
        type,
        from,
      });
      return null;
    }

    return {
      key: `indicator-${idx}`,
      position: car.arrow_position,
      Icon,
      rotate,
    };
  }).filter(Boolean);
};