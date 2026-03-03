// Для перевірки перешкоди справа
export const rightHand = {
  "4-0": ["7-4"],
  "7-4": ["3-7"],
  "3-7": ["0-3"],
  "0-3": ["4-0"],
};

// Перевіряємо, чи перетинаються два шляхи
export const isPathIntersecting = (pathA, pathB) => {
  const setA = new Set(pathA.map(([r, c]) => `${r},${c}`));
  return pathB.some(([r, c]) => setA.has(`${r},${c}`));
};

export const isOnRoundabout = (pos, roundaboutPositions) =>
  roundaboutPositions.some(([r, c]) => r === pos[0] && c === pos[1]);

// Функція для перевірки чи заблокована машина іншими машинами на колі
export const hasBlockingCar = (path, currentKey, allCars, roundaboutPositions) => {
    const pathKeySet = new Set(path.map(([r, c]) => `${r}-${c}`));
    return allCars.some(({ position }) => {
      const keyOther = `${position[0]}-${position[1]}`;
      return (
        keyOther !== currentKey &&
        isOnRoundabout(position, roundaboutPositions) &&
        pathKeySet.has(keyOther) 
      );
    });
  }

export const addDependency = (graph, inBlocked, from, to, reason = "") => {
    if (!graph[from].has(to)) {
      graph[from].add(to);
      inBlocked[to]++;
      if (reason) console.log(`${from} → ${to} (${reason})`);
    }
  };

export const directionByKey = {
  "0-3": "north",
  "3-7": "east",
  "7-4": "south",
  "4-0": "west",
};

export const areOncoming = (keyA, keyB) => {
  const a = directionByKey[keyA];
  const b = directionByKey[keyB];
  if (!a || !b) return false;

  return (
    (a === "north" && b === "south") ||
    (a === "south" && b === "north") ||
    (a === "east" && b === "west") ||
    (a === "west" && b === "east")
  );
};