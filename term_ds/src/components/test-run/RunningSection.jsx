import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import roadData from "./data/road.json";
import carsData from "./data/cars.json";
import routesData from "./data/routes.json";
import conditionsData from "./data/conditions.json";
import carImages from "./utils/carImages";
import {
  getCarPriority,
  getSignForCell,
  setCarsToPlace,
  // signDirectionsMap,
  specificCarPathsMap,
  getSignDirectionsMap 
} from "./utils/roadUtils";
import { renderSign } from "./utils/renderSign";
import { generateValidOrders } from "./utils/validOrders";
import { generateTopologicalValidOrders } from "./utils/validTopologicalOrders";
import { getDirectionIndicators } from "./utils/getDirectionIndicators";
import {
  getInitialRotationFromPath,
  createAnimatedStep,
} from "./utils/animatedCarMovement";
import "../../styles/scss/test.scss";

// Основна сцена симуляції руху машин на перехресті
export default function RunningSection({
  questionData,
  questionIndex,
  setScore,
  setCanGoNext,
}) {
  // Стан керування
  const [movingCars, setMovingCars] = useState({});
  const [isCarMoving, setIsCarMoving] = useState(false);
  const [userOrder, setUserOrder] = useState([]);
  const [hasMistake, setHasMistake] = useState(false);
  const [finishedCars, setFinishedCars] = useState(new Set());

  // Статичні дані
  const cars = carsData.cars;
  const intersection = roadData.intersections.find(
    (i) => i.id === questionData.id
  );
  const grid = intersection.grid;
  const blockedDirections = intersection.blockedDirections || [];
  const cellStyles = roadData.cell_styles;

  // Розміщуємо машинки на основі питання
  const carsToPlace = setCarsToPlace(questionData.carsToPlace, carsData);
  console.log("carsToPlace: ", carsToPlace);

  // Підготовка знаків із напрямком
  const signDirMap = useMemo(
    () => getSignDirectionsMap(questionData.id),
    [questionData.id]
  );

  const signList =
    questionData.sign_positions?.map((item) => ({
      ...item,
      ...signDirMap[item.direction],
    })) || [];
  // const signList =
  //   questionData.sign_positions?.map((item) => ({
  //     ...item,
  //     ...signDirectionsMap[item.direction],
  //   })) || [];

  // Шляхи руху кожної машинки
  const carPaths = useMemo(() => {
    return specificCarPathsMap(questionData, carsData, routesData);
  }, [questionIndex, questionData]);

  // Вказівники напрямку руху
  const indicators = useMemo(
    () =>
      getDirectionIndicators(
        carsToPlace,
        carPaths,
        grid,
        routesData[questionData.id]
      ),
    [carsToPlace, carPaths, grid]
  );

  // Пріоритети машин
  const carPriorities = useMemo(() => {
    const map = {};

    carsToPlace.forEach((car) => {
      const key = `${car.position[0]}-${car.position[1]}`;

      map[key] = getCarPriority(
        car,
        grid,
        signList,
        blockedDirections,
        conditionsData.signs,
        cars
      );
    });

    return map;
  }, [carsToPlace, grid, signList, blockedDirections]);

  // Стилі для знаків
  const signStyles = useMemo(() => {
    const map = {};

    conditionsData.signs.forEach((sign) => {
      map[sign.id] = sign.style;
    });

    return map;
  }, []);

  // Генеруємо всі допустимі правильні послідовності проїзду
  // const validOrders = useMemo(() => {
  //   // return generateValidOrders(
  //   // carsToPlace,
  //   // carPaths,
  //   // carPriorities
  //   // );
  //   return generateTopologicalValidOrders(
  //     carsToPlace,
  //     carPaths,
  //     carPriorities
  //   );
  // }, [
  //   carsToPlace,
  //   carPaths,
  //   carPriorities,
  // ]);
  const validOrders = useMemo(() => {
    return generateTopologicalValidOrders(
      carsToPlace,
      carPaths,
      carPriorities,
      {
        isRoundabout: questionData.id === "round_cross",
        roundaboutPositions: questionData.start_round_cars_points?.map(p => p.position) || []
      }
    );
  }, [carsToPlace, carPaths, carPriorities, questionData.id]);

  // Обробляємо натискання на машинку
  const handleCarClick = (row, col) => {
    if (isCarMoving)
      return toast.info("Зачекайте, поки попередня машинка завершить рух");

    const key = `${row}-${col}`;

    if (finishedCars.has(key)) {
      return toast.info("Ця машинка вже завершила рух");
    }

    const stepPriority = [];
    const currentStep = userOrder.length;

    validOrders.forEach((item) => {
      stepPriority.push(item[currentStep]);
    });

    if (stepPriority.includes(key) === false) {
      setHasMistake(true);
      return toast.error("Невірна послідовність!");
    }

    const updateOrderOnce = () => {
      setUserOrder((prev) => {
        if (prev.includes(key)) return prev;
        return [...prev, key];
      });
    };

    updateOrderOnce();

    const path = carPaths[key];

    if (!path)
      return toast.warning("Ця машинка не має доступного маршруту для руху");

    setIsCarMoving(true);

    const clickedCar = carsToPlace.find(
      (c) => `${c.position[0]}-${c.position[1]}` === key
    );
    if (!clickedCar) return;

    setMovingCars((prev) => ({
      ...prev,
      [key]: {
        position: clickedCar.position,
        rotation: getInitialRotationFromPath(clickedCar.position, path),
      },
    }));

    // Анімація руху машинки
    let step = 0;
    const interval = setInterval(() => {
      if (step >= path.length) {
        clearInterval(interval);
        setIsCarMoving(false);
        setFinishedCars((prev) => new Set([...prev, key]));
      } else {
        const current = step === 0 ? clickedCar.position : path[step - 1];
        const {
          position: next,
          rotation,
          step: nextStep,
        } = createAnimatedStep(key, path, step, current);

        setMovingCars((prev) => ({
          ...prev,
          [key]: { position: next, rotation },
        }));
        step = nextStep;
      }
    }, 100);
  };

  // Оцінюємо відповідь користувача
  useEffect(() => {
    if (userOrder.length > 0 && userOrder.length === validOrders[0]?.length) {
      if (hasMistake) {
        toast.info(
          "Спроба завершена. Правильна відповідь не зарахована через помилки."
        );
      } else {
        toast.success("Правильна послідовність!");
        setScore((prev) => prev + 1);
      }
      setCanGoNext(true);
    }
  }, [userOrder]);

  // Очищаємо стан при переході до нового питання
  useEffect(() => {
    setMovingCars({});
    setIsCarMoving(false);
    setUserOrder([]);
    setHasMistake(false);
    setCanGoNext(false);
    setFinishedCars(new Set());
  }, [questionIndex, questionData]);

  console.log("carPriorities: ", carPriorities);
  // console.log("validOrders: ", validOrders);
  // console.log("carsToPlace: ", carsToPlace);
  // console.log("signList: ", signList);

  return (
    <section className="runing-section max-w-[98%] block h-full min-h-[591px] row-start-2 col-start-1 p-4 rounded-[20px] bg-white relative overflow-hidden">
      <div className="relative">
        <div className="grid grid-cols-8 grid-rows-8 gap-0 grid-test-custom">
          {grid.flatMap((row, rowIndex) =>
            row.map((cell, colIndex) => {
              // Формуємо масив машин, які знаходяться в поточній клітинці сітки
              const carsInCell = carsToPlace
                .map((car, idx) => {
                  const key = `${car.position[0]}-${car.position[1]}`;
                  const path = carPaths[key];

                  // Визначаємо поточну позицію машинки: 
                  // якщо вона рухається — беремо координати з movingCars (анімація),
                  // інакше — використовуємо початкову позицію
                  const current = movingCars[key] || {
                    position: car.position,
                    rotation: getInitialRotationFromPath(car.position, path),
                  };

                  const [carRow, carCol] = current.position;

                  // Якщо машинка на цій клітинці — рендеримо її. Перевіряємо, чи завершила вона рух
                  if (carRow === rowIndex && carCol === colIndex) {
                    const carId = car.car_id;
                    const isFinished = finishedCars.has(key);

                    return (
                      <div
                        key={idx}
                        className={`car-visual ${carId} ${key} ${isFinished ? "car-finished" : "car-clickable"}`}
                        data-type={carId}
                        data-car-key={key}
                        style={{
                          backgroundImage: `url(${carImages[carId]})`,
                          transform: `translate(-50%, -50%) rotate(${current.rotation})`,
                          top: "50%",
                          left: "50%",
                          position: "absolute",
                          opacity: isFinished ? 0.6 : 1,
                          cursor: isFinished ? "not-allowed" : "pointer",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();

                          if (isFinished) {
                            return toast.info("Ця машинка вже завершила рух");
                          }

                          handleCarClick(rowIndex, colIndex);
                        }}
                      />
                    );
                  }
                  return null;
                })
                .filter(Boolean);

              const cellSign = getSignForCell(
                rowIndex,
                colIndex,
                signList,
                blockedDirections,
                signStyles
              );

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-20 h-20 border relative ${cellStyles[cell]}`}
                >
                  {cellSign && (
                    <div
                      className={`custom-sign custom-sign-${cellSign.positionStyle}`}
                    >
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
    </section>
  );
}
