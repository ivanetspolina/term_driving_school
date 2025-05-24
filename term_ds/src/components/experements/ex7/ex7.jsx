import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import roadData from "./road.json";
import carsData from "./cars.json";
import conditionsData from "./conditions.json";
import "../../../styles/scss/test.scss";
import { getCarPriority, getSignForCell, hasRightHandObstacle, getFromDirection } from "./utils/roadUtils";
import { directionToSignId, specificCarPathsMap } from "./utils/intersectionConfig";
import { renderSign } from "./utils/renderSign";
import { generateValidOrders } from "./utils/validOrders";
import { getDirectionIndicators } from "./utils/getDirectionIndicators";

export default function RoadGrid() {
  const cars = carsData.cars;  
  const [intersectionId, setIntersectionId] = useState("regular_cross");
  const [movingCars, setMovingCars] = useState({});
  const [isCarMoving, setIsCarMoving] = useState(false);
  const [userOrder, setUserOrder] = useState([]);
  const [validOrders, setValidOrders] = useState([]);
  const [score, setScore] = useState(0);

  // Похідні дані для обраного перехрестя
  const intersection = useMemo(
    () => roadData.intersections.find((i) => i.id === intersectionId),
    [intersectionId]
  );
  const grid = intersection.grid;
  const cellStyles = roadData.cell_styles;
  const blockedDirections = intersection.blockedDirections || [];

  // Беремо позиції знаків 
  const signPositions = conditionsData.sign_positions[intersectionId] || {};

  // Масив машин біля перехрестя
  const carsToPlace = useMemo(() => {
    const allPoints = carsData.start_cars_points;
    switch (intersectionId) {
      case "regular_cross":
        return allPoints.slice(0, 4);
      case "t_cross_1":
        return [allPoints[0], allPoints[2], allPoints[3]];
      case "t_cross_2":
        return [allPoints[0], allPoints[1], allPoints[2]];
      case "t_cross_3":
        return [allPoints[1], allPoints[2], allPoints[3]];
      case "t_cross_4":
        return [allPoints[0], allPoints[1], allPoints[3]];
      default:
        return allPoints.slice(0, 4);
    }
  }, [intersectionId]);

  const carPriorities = useMemo(() => {
    const map = {};
    carsToPlace.forEach((car) => {
      const key = `${car.position[0]}-${car.position[1]}`;
      map[key] = getCarPriority( car, grid, signPositions, blockedDirections, directionToSignId, conditionsData.signs, true );// <-- silent = true 
    });
    return map;
  }, [carsToPlace, grid, signPositions, blockedDirections]);

  // Готуємо map знаків
  const signStyles = useMemo(() => {
    const map = {};
    conditionsData.signs.forEach((sign) => {
      map[sign.id] = sign.style;
    });
    return map;
  }, []);

  const carPaths = useMemo(() => {
    const allPaths = specificCarPathsMap(roadData.commonRoutes);
    return allPaths[intersectionId] || {};
  }, [intersectionId]);

  const indicators = useMemo(
    () => getDirectionIndicators(carsToPlace, carPaths, grid, roadData.commonRoutes),
    [carsToPlace, carPaths, grid]
  );

  const handleIntersectionChange = (id) => {
    setIntersectionId(id);
    // обнулити рух, якщо змінилося перехрестя
    setMovingCars({});
    setIsCarMoving(false);
    setUserOrder([]);
    setValidOrders([]);
  };

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

    // Знаходимо обрану машинку
    const selectedCar = carsToPlace.find(
      (car) => car.position[0] === row && car.position[1] === col
    );
    const selectedPriority = carPriorities[key];
    // Перевіряємо, чи немає машин з вищим пріоритетом, які ще не рухались
    const others = carsToPlace.filter((car) => {
      const otherKey = `${car.position[0]}-${car.position[1]}`;
      return otherKey !== key && !movingCars[otherKey];
    });

    const blockedBy = others.find((car) => {
        const otherKey = `${car.position[0]}-${car.position[1]}`;
        return carPriorities[otherKey] < selectedPriority;
      } // менше число — більший пріоритет
    );

    const updateOrderOnce = () => {
      setUserOrder((prev) => {
        if (prev[prev.length - 1] === key) return prev;
        return [...prev, key];
      });
    };

    if (blockedBy) {
      updateOrderOnce();
      toast.error("❌ Неправильна послідовність — ця машинка повинна дати дорогу іншій");
      return;
    }

    const rightHandBlocker = hasRightHandObstacle(selectedCar, others, grid, signPositions, blockedDirections, directionToSignId, conditionsData.signs, carPaths, carPriorities );

    if (rightHandBlocker) {
      updateOrderOnce();
      console.log(`🛑 Машинка з ${getFromDirection(selectedCar.position, grid)} має перешкоду справа — машинка з ${getFromDirection(rightHandBlocker.position, grid)}`);
      toast.error("❌ Неправильна послідовність — є перешкода справа");
      return;
    }

    updateOrderOnce(); // ⬅️ додаємо до порядку
    setIsCarMoving(true);    

    let step = 0;
    const interval = setInterval(() => {
      if (step >= path.length) {
        clearInterval(interval);
        setIsCarMoving(false);
        console.log(`Машинка з ${key} завершила маршрут`);
      } else {
        setMovingCars((prev) => ({ ...prev, [key]: path[step++] }));
      }
    }, 200);
  };

  useEffect(() => {
    if (carPaths && grid && signPositions) {
      const valid = generateValidOrders( carsToPlace, grid, signPositions, blockedDirections, directionToSignId, conditionsData.signs, carPaths, carPriorities);
      setValidOrders(valid);
    }
  }, [intersectionId, carPaths]);

  useEffect(() => {
    if (userOrder.length === carsToPlace.length && validOrders.length > 0) {
      const isCorrect = validOrders.some(
        (order) => JSON.stringify(order) === JSON.stringify(userOrder)
      );
      if (isCorrect) {
        toast.success("✅ Правильна послідовність!");
        setScore((prev) => prev + 1);
      } 
    }
  }, [userOrder]);

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="flex gap-2 mb-4">
        {["regular_cross", "t_cross_1", "t_cross_2", "t_cross_3",  "t_cross_4",].map((id) => (
          <button
            key={id}
            onClick={() => handleIntersectionChange(id)}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            {id.replace("_", "-")}{" "}
          </button>
        ))}
      </div>

      <div style={{ position: "relative" }} className="w-fit">
        <div className="grid grid-cols-8 gap-0 w-fit">
          {grid.flatMap((row, rowIndex) =>
            row.map((cell, colIndex) => {
              // Масив всіх машин у цій клітинці
              const carsInCell = carsToPlace
                .map((car, idx) => {
                  const key = `${car.position[0]}-${car.position[1]}`;
                  const currentPos = movingCars[key] || car.position;
                  if ( currentPos[0] === rowIndex &&currentPos[1] === colIndex) {
                    return (
                      <div
                        key={idx}
                        className="absolute cursor-pointer"
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
              const cellSign = getSignForCell(rowIndex, colIndex, signPositions, blockedDirections, directionToSignId, signStyles);

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-12 h-12 border relative ${cellStyles[cell]}`}
                  onClick={() => hasCar && handleCarClick(rowIndex, colIndex)}
                >
                  {/* Рендер знака */}
                  {cellSign && (
                    <div className={`custom-sign  custom-sign-${cellSign.positionStyle}`}>
                      {renderSign(cellSign.signId)}
                    </div>
                  )}

                  {/* Машинки */}
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
                top: `${row * 51}px`,
                left: `${col * 51}px`,
                transform: `rotate(${rotate})`,
                zIndex: 10,
              }}
            >
              <Icon size={24} />
            </div>
          );
        })}
      </div>

      <div className="mb-4 text-gray-700">
        Ваша послідовність: {userOrder.join(" → ") || "поки порожня"}
      </div>
      <div className="mb-2 text-lg text-green-700 font-semibold">
        Ваш рахунок: {score} бал{score === 1 ? "" : score < 5 ? "и" : "ів"}
      </div>
    </div>
  );
}