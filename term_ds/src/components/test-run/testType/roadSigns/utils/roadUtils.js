export const getFromDirection = (position, grid) => {
  const [row, col] = position;
  if (row === 0) return "north";
  if (row === grid.length - 1) return "south";
  if (col === 0) return "west";
  if (col === grid[0].length - 1) return "east";
  return null;
};

export const getCarPriority = (car, grid, signPositions, blockedDirections, directionToSignId, signs, cars,  carsToPlace = [], silent = false) => {
  const fromDir = getFromDirection(car.position, grid);
  
  const carIndex = carsToPlace.findIndex(p =>
    p.position[0] === car.position[0] && p.position[1] === car.position[1]
  );
  const carPriorityValue = cars[carIndex]?.cars_priority ?? 0;

  if (carPriorityValue === 1) {
    if (!silent) {
      console.log(`🚓 Машина з [${car.position}] має абсолютний пріоритет`);
    }
    return 10;
  }

  const signData = signPositions[fromDir];
  const signId = directionToSignId[fromDir];

  if (!signData || blockedDirections.includes(fromDir) || !signId) {
    if (!silent) {
      console.log(`🚘 Машина з ${fromDir} (позиція: [${car.position}]) не має знаку або напрям заблокований — пріоритет: 0`);
    }
    return 0;
  }

  const sign = signs.find((s) => s.id === signId);
  const priority = sign ? (10 - sign.signs_priority) : 0;

  if (!silent) {
    console.log(`🚘 Машина з ${fromDir} (позиція: [${car.position}]) — знак '${signId}', пріоритет: ${priority}`);
    console.log(`[DEBUG] car.position: ${car.position}, cars_priority: ${carPriorityValue}`);
  }
  
  return priority;
};


export const getSignForCell = (row, col, signPositions, blockedDirections, directionToSignId, signStyles) => {
  for (const [direction, posData] of Object.entries(signPositions)) {
    if (posData.position[0] === row && posData.position[1] === col) {
      const signId = directionToSignId[direction];
      if (signId && !blockedDirections.includes(direction)) {
        return {
          sign: signStyles[signId],
          positionStyle: posData.style,
          signId,
        };
      }
    }
  }
  return null;
};

export const rightHandDirectionsMap = {
  north: ['east', 'south'],   // ті, хто під'їжджає з east або повертає з south
  east: ['south', 'west'],
  south: ['west', 'north'],
  west: ['north', 'east'],
};

export const getTurnType = (from, to) => {
  const turns = {
    north: { south: "straight", east: "left", west: "right" },
    east: { west: "straight", south: "left", north: "right" },
    south: { north: "straight", west: "left", east: "right" },
    west: { east: "straight", north: "left", south: "right" },
  };
  return turns[from]?.[to] || "unknown";
};

export const isPathIntersecting = (pathA, pathB) => {
  const setA = new Set(pathA.map(([r, c]) => `${r},${c}`));
  return pathB.some(([r, c]) => setA.has(`${r},${c}`));
};

export const hasRightHandObstacle = ( currentCar, allCars, grid, signPositions, blockedDirections, directionToSignId, signs, carPaths, carPriorities) => {
  const currentKey = `${currentCar.position[0]}-${currentCar.position[1]}`;
  const currentFrom = getFromDirection(currentCar.position, grid);
  const currentToCoord = carPaths[currentKey]?.at(-1);
  const currentTo = getFromDirection(currentToCoord, grid);
  const currentTurn = getTurnType(currentFrom, currentTo);
  const currentPriority = carPriorities[currentKey];
  const currentPath = carPaths[currentKey] || [];

  const rightDirs = rightHandDirectionsMap[currentFrom];

  return allCars.find(otherCar => {
    const otherKey = `${otherCar.position[0]}-${otherCar.position[1]}`;
    if (otherKey === currentKey) return false;
    if (!carPaths[otherKey]) return false;

    const otherFrom = getFromDirection(otherCar.position, grid);
    const otherToCoord = carPaths[otherKey]?.at(-1);
    const otherTo = getFromDirection(otherToCoord, grid);
    const otherTurn = getTurnType(otherFrom, otherTo);
    const otherPriority = carPriorities[otherKey];
    const otherPath = carPaths[otherKey];

    const intersecting = isPathIntersecting(currentPath, otherPath);

    return (
      otherPriority === currentPriority &&
      rightDirs.includes(otherFrom) &&
      currentTurn === "left" &&
      (otherTurn === "straight" || otherTurn === "right") &&
      intersecting
    );
  }) || null;
};