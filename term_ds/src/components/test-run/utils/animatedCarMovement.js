export const rotationMap = {
  north: "0deg",
  east: "90deg",
  south: "180deg",
  west: "270deg"
};

// Отримуємо початкове обертання машинки на основі її першого кроку шляху
export const getInitialRotationFromPath = (position, path) => {
  if (!path || path.length === 0) return rotationMap.north;
  const direction = getFromDirectionDelta(position, path[0]);
  return rotationMap[direction];
};

// Визначаємо напрямок переміщення з однієї клітинки в іншу
export const getFromDirectionDelta = (from, to) => {
  const [r1, c1] = from;
  const [r2, c2] = to;
  if (r2 < r1) return "north";
  if (r2 > r1) return "south";
  if (c2 < c1) return "west";
  if (c2 > c1) return "east";
  return "north"; 
};

// Створюємо наступний крок для анімації руху машинки
export const createAnimatedStep = (key, path, step, current) => {
  const next = path[step]; // Наступна позиція на шляху
  const direction = getFromDirectionDelta(current, next); // Напрямок переміщення
  const rotation = rotationMap[direction]; // Кут обертання

  return {
    key,
    position: next,
    rotation,
    step: step + 1
  };
} 
