import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import roadData from "./road.json";
import carsData from "./cars.json";
import conditionsData from "./conditions.json";
import "../../../../styles/scss/test.scss";
import { getCarPriority, getSignForCell, hasRightHandObstacle, getFromDirection } from "./utils/roadUtils";
import { directionToSignId, specificCarPathsMap } from "./utils/intersectionConfig";
import { renderSign } from "./utils/renderSign";
import { generateValidOrders } from "./utils/validOrders";
import { getDirectionIndicators } from "./utils/getDirectionIndicators";

export default function RoadSigns({ score, setScore, questionIndex }) {
  const cars = carsData.cars;
  const [movingCars, setMovingCars] = useState({});
  const [isCarMoving, setIsCarMoving] = useState(false);
  const [userOrder, setUserOrder] = useState([]);
  const [validOrders, setValidOrders] = useState([]);
  const [hasMistake, setHasMistake] = useState(false);

  const intersection = roadData.intersections[questionIndex];
  const grid = intersection.grid;
  const cellStyles = roadData.cell_styles;
  const blockedDirections = intersection.blockedDirections || [];

  // 🟡 Використовуємо масив sign_positions
  const signPositions = conditionsData.sign_positions[questionIndex] || {};

  const carsToPlace = useMemo(() => {
    const all = carsData.start_cars_points;
    switch (questionIndex) {
      case 0: return all.slice(0, 4);
      case 1: return [all[0], all[2], all[3]];
      case 2: return [all[0], all[1], all[2]];
      case 3: return [all[1], all[2], all[3]];
      case 4: return [all[0], all[1], all[3]];
      default: return all.slice(0, 4);
    }
  }, [questionIndex]);

  const carPaths = useMemo(() => {
    const allPaths = specificCarPathsMap(roadData.commonRoutes);
    return allPaths[questionIndex] || {};
  }, [questionIndex]);

  const indicators = useMemo(() => (
    getDirectionIndicators(carsToPlace, carPaths, grid, roadData.commonRoutes)
  ), [carsToPlace, carPaths, grid]);

  const carPriorities = useMemo(() => {
    const map = {};
    carsToPlace.forEach((car) => {
      const key = `${car.position[0]}-${car.position[1]}`;
      map[key] = getCarPriority(
        car, grid, signPositions, blockedDirections,
        directionToSignId, conditionsData.signs, true
      );
    });
    return map;
  }, [carsToPlace, grid, signPositions, blockedDirections]);

  const signStyles = useMemo(() => {
    const map = {};
    conditionsData.signs.forEach((sign) => {
      map[sign.id] = sign.style;
    });
    return map;
  }, []);

  const handleCarClick = (row, col) => {
    if (isCarMoving) {
      toast.info("Зачекайте, поки попередня машинка завершить рух");
      return;
    }
    const key = `${row}-${col}`;
    const path = carPaths[key];
    if (!path) {
      toast.warning("Ця машинка не має доступного маршруту для руху");
      return;
    }

    const selectedCar = carsToPlace.find(
      (car) => car.position[0] === row && car.position[1] === col
    );
    const selectedPriority = carPriorities[key];

    const others = carsToPlace.filter((car) => {
      const otherKey = `${car.position[0]}-${car.position[1]}`;
      return otherKey !== key && !movingCars[otherKey];
    });

    const blockedBy = others.find((car) => {
      const otherKey = `${car.position[0]}-${car.position[1]}`;
      return carPriorities[otherKey] < selectedPriority;
    });

    const updateOrderOnce = () => {
      setUserOrder((prev) => {
        if (prev[prev.length - 1] === key) return prev;
        return [...prev, key];
      });
    };

    if (blockedBy) {
      updateOrderOnce();
      toast.error("❌ Неправильна послідовність — ця машинка повинна дати дорогу іншій");
      setHasMistake(true); 
      return;
    }

    const rightHandBlocker = hasRightHandObstacle(
      selectedCar, others, grid, signPositions,
      blockedDirections, directionToSignId,
      conditionsData.signs, carPaths, carPriorities
    );

    if (rightHandBlocker) {
      updateOrderOnce();
      toast.error("❌ Неправильна послідовність — є перешкода справа");
      setHasMistake(true); 
      return;
    }

    updateOrderOnce();
    setIsCarMoving(true);

    let step = 0;
    const interval = setInterval(() => {
      if (step >= path.length) {
        clearInterval(interval);
        setIsCarMoving(false);
      } else {
        setMovingCars((prev) => ({ ...prev, [key]: path[step++] }));
      }
    }, 200);
  };

  useEffect(() => {
    const valid = generateValidOrders(
      carsToPlace, grid, signPositions, blockedDirections,
      directionToSignId, conditionsData.signs, carPaths, carPriorities
    );
    setValidOrders(valid);
  }, [questionIndex, carPaths]);

  useEffect(() => {
    if (userOrder.length === carsToPlace.length && validOrders.length > 0) {
      const isCorrect = validOrders.some(
        (order) => JSON.stringify(order) === JSON.stringify(userOrder)
      );
      if (isCorrect && !hasMistake) {
        toast.success("✅ Правильна послідовність!");
        setScore((prev) => prev + 1);        
      }  else {
        toast.info("ℹ️ Спроба завершена. Правильна відповідь не зарахована через помилки.");
      }
    }
  }, [userOrder]);

  useEffect(() => {
    // Очистка всіх станів при зміні питання
    setMovingCars({});
    setIsCarMoving(false);
    setUserOrder([]);
    setHasMistake(false);
  }, [questionIndex]);

  return (
    <div className="relative">
      <div className="grid grid-cols-8 grid-rows-8 gap-0 grid-test-custom">
        {grid.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const carsInCell = carsToPlace
              .map((car, idx) => {
                const key = `${car.position[0]}-${car.position[1]}`;
                const currentPos = movingCars[key] || car.position;
                if (currentPos[0] === rowIndex && currentPos[1] === colIndex) {
                  return (
                    <div
                      key={idx}
                      className={`absolute cursor-pointer car-item car-${cars[idx].id}`}
                      style={{ top: `${idx * 6}px`, left: `${idx * 6}px` }}
                    >
                      {cars[idx % cars.length]?.style.icon}
                    </div>
                  );
                }
                return null;
              })
              .filter(Boolean);

            const hasCar = carsInCell.length > 0;
            const cellSign = getSignForCell(
              rowIndex, colIndex, signPositions,
              blockedDirections, directionToSignId, signStyles
            );

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-20 h-20 border relative ${cellStyles[cell]}`}
                onClick={() => hasCar && handleCarClick(rowIndex, colIndex)}
              >
                {cellSign && (
                  <div className={`custom-sign custom-sign-${cellSign.positionStyle}`}>
                    {renderSign(cellSign.signId)}
                  </div>
                )}
                {carsInCell}
              </div>
            );
          })
        )}
      </div>

      {indicators.map(({ key, position, Icon, rotate }) => {
        const [row, col] = position;
        return (
          <div
            key={key}
            className="absolute"
            style={{
              top: `${row * 87}px`,
              left: `${col * 87}px`,
              transform: `rotate(${rotate})`,
              zIndex: 10,
            }}
          >
            <Icon size={32} />
          </div>
        );
      })}
    </div>
  );
}

