import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import roadData from "./road.json";
import carsData from "./cars.json";
import conditionsData from "./conditions.json";
import "../../../../styles/scss/test.scss";
import { getCarPriority, getSignForCell } from "./utils/roadUtils";
import { directionToSignId, specificCarPathsMap } from "./utils/intersectionConfig";
import { renderSign } from "./utils/renderSign";
import { generateValidOrders } from "./utils/validOrders";
import { getDirectionIndicators } from "./utils/getDirectionIndicators";
import { rotationMap, getFromDirectionDelta, getInitialRotationFromPath, createAnimatedStep } from "./utils/animatedCarMovement";
import carImages from './utils/carImages';

export default function RoadSigns({ setScore, questionIndex, setCanGoNext }) {
  const [movingCars, setMovingCars] = useState({});
  const [isCarMoving, setIsCarMoving] = useState(false);
  const [userOrder, setUserOrder] = useState([]);
  const [validOrders, setValidOrders] = useState([]);
  const [hasMistake, setHasMistake] = useState(false);  
  const cars = carsData.cars;
  
  const intersection = roadData.intersections[questionIndex]; // Отримуємо об'єкт перехрестя для поточного запитання (за індексом questionIndex)
  const grid = intersection.grid; // Витягуємо саму сітку (матрицю 8х8), яка описує розташування доріг і тротуарів
  const blockedDirections = intersection.blockedDirections || []; // Отримуємо список напрямків, які заблоковані для руху на цьому перехресті (наприклад, "north", "west" тощо)
  const signPositions = conditionsData.sign_positions[questionIndex] || {}; // Отримуємо об'єкт з позиціями дорожніх знаків для поточного запитання.

  const cellStyles = roadData.cell_styles; // Отримуємо стилі клітинок (наприклад, яка CSS-клас буде для дороги, тротуару тощо)

  // ?????
  // Це обчислення залежить від індексу питання і виконується лише тоді, коли він змінюється (useMemo для оптимізації).
  const carsToPlace = useMemo(() => {
    const all = carsData.start_cars_points; // Всі початкові точки розміщення машин
    switch (questionIndex) {
      case 0: return all.slice(0, 4);                 // Питання 0 — 4 машини: [0], [1], [2], [3]
      case 1: return [all[0], all[2], all[3]];        // Питання 1 — машини: [0], [2], [3]
      case 2: return [all[0], all[1], all[2]];        // Питання 2 — машини: [0], [1], [2]
      case 3: return [all[1], all[2], all[3]];        // Питання 3 — машини: [1], [2], [3]
      case 4: return [all[0], all[1], all[3]];        // Питання 4 — машини: [0], [1], [3]
      default: return all.slice(0, 4);                // За замовчуванням — перші 4 машини
    }
  }, [questionIndex]);

  // Рух машин при кліку, обчислюємо маршрути руху машин для поточного питання (перехрестя).
  const carPaths = useMemo(() => {
    const allPaths = specificCarPathsMap(roadData.commonRoutes); // Створюємо карту всіх маршрутів для кожного питання, використовуючи функцію specificCarPathsMap,
    return allPaths[questionIndex] || {}; // Повертаємо лише ті маршрути, які відповідають поточному індексу питання.
  }, [questionIndex]);


  // Відображаємо стрілку куди буде рухатися машина, за допомогою useMemo обчислюємо індикатори напрямку руху (стрілочки) для кожної машинки.
  const indicators = useMemo(() => (
    getDirectionIndicators(carsToPlace, carPaths, grid, roadData.commonRoutes) // Викликається лише тоді, коли змінюються carsToPlace, carPaths або grid.
  ), [carsToPlace, carPaths, grid]);


  // За допомогою useMemo обчислюємо пріоритет для кожної машинки на полі — хто має їхати раніше.
  // Ці дані залежать від ПДР, знаків, блокувань та службового статусу машини (наприклад, поліція).
  const carPriorities = useMemo(() => {
    const map = {};

    // Перебираємо всі машинки, які мають бути розміщені на цьому питанні
    carsToPlace.forEach((car) => {

      // Створюємо ключ у форматі "рядок-колонка", наприклад: "4-0"
      const key = `${car.position[0]}-${car.position[1]}`;

      // Викликаємо getCarPriority для кожної машинки, щоб визначити її пріоритет
      map[key] = getCarPriority(
        car,                         // поточна машинка
        grid,                        // сітка перехрестя
        signPositions,               // розташування дорожніх знаків
        blockedDirections,           // напрямки, які заблоковано
        directionToSignId,           // відповідність напрямку — знаку
        conditionsData.signs,        // список всіх знаків
        cars,
        carsToPlace,
        true                       // silent = true, щоб не логувати в консоль
      );
    });

    return map; // Повертаємо словник: {"4-0": 3, "0-3": 2, ...}
  }, [carsToPlace, grid, signPositions, blockedDirections]);

  // Зберігаються стилі для кожного типу дорожнього знака.
  const signStyles = useMemo(() => {
    const map = {};

    // Проходимося по всіх знаках, що зберігаються в conditionsData.signs
    conditionsData.signs.forEach((sign) => {
      // Зберігаємо стилі (CSS-оформлення) для кожного знака за його id (наприклад, "stop", "main_road")
      map[sign.id] = sign.style;
    });

    return map; // Повертаємо словник стилів: { stop: {...}, main_road: {...}, ... }
  }, []);


// Слідкуємо за кліком і починаємо рух машин і формування даних
const handleCarClick = (row, col) => {
  // Щоб уникнути одночасного руху кількох машин
  if (isCarMoving)
    return toast.info("Зачекайте, поки попередня машинка завершить рух");

  const key = `${row}-${col}`; // Створюємо унікальний ключ для машинки за її координатами, наприклад: "4-0" для клітинки в 4 рядку та 0 колонці
  const stepPriority = []; // Зберігаємо ключі відносно поточного кроку, які він може вибрати і це буде правильним рішення
  const currentStep = userOrder.length; // Крок відносно відповіді

  // перебираємо всі варіанти
  validOrders.forEach((item) => {
    stepPriority.push(item[currentStep]); // Формуємо ключі поточного кроку
  });

  // Перевіряємо чи є ключ в нашому потчоному кроці пріорітетів
  if (stepPriority.includes(key) === false) {
    setHasMistake(true);
    return toast.error("❌ Невірна послідовність!");
  }

  // Решту коду виконуємо, якщо користувач вибрав правильну послідовніть
  const updateOrderOnce = () => {
    setUserOrder((prev) => {
      // Якщо ця машинка вже є у послідовності — нічого не додаємо
      if (prev.includes(key)) return prev;
      return [...prev, key];
    });
  };

  updateOrderOnce(); // Записуємо ключ вибору машини в вибір користувача

  const path = carPaths[key]; // Отримуємо маршрут для машинки з відповідною позицією

  // Якщо маршруту для цієї машинки немає — повідомляємо користувача і не виконуємо рух
  if (!path)
    return toast.warning("Ця машинка не має доступного маршруту для руху");

  setIsCarMoving(true); // Записуємо, що реї машини почався

  const clickedCar = carsToPlace.find(
    (c) => `${c.position[0]}-${c.position[1]}` === key
  );
  if (!clickedCar) return;

  setMovingCars((prev) => ({
    ...prev, [key]: {
      position: clickedCar.position,
      rotation: getInitialRotationFromPath(clickedCar.position, path),
    },
  }));

  let step = 0; // Початковий індекс кроку для руху машинки по маршруту

  // Запускаємо таймер, який буде рухати машинку по одній клітинці кожні 200 мілісекунд
  const interval = setInterval(() => {
    // Коли ми досягли кінця маршруту — зупиняємо анімацію
    if (step >= path.length) {
      clearInterval(interval); // Зупиняємо інтервал
      setIsCarMoving(false); // Дозволяємо рух іншим машинкам
      // Робити кнопку активною "наступне питання"
    } else {
      // Переміщуємо машинку на наступну позицію з маршруту
      // Оновлюємо стан movingCars: оновлюємо позицію для відповідного ключа
      const current = step === 0 ? clickedCar.position : path[step - 1];
      const { position: next, rotation, step: nextStep } = createAnimatedStep(key, path, step, current, clickedCar, grid);

      setMovingCars((prev) => ({
        ...prev,
        [key]: { position: next, rotation }, // збільшуємо step після кожного кроку
      }));
      step = nextStep;
    }
  }, 200); // Кожен крок руху відбувається з інтервалом 200 мс
};

  // Він викликає функцію, яка генерує всі правильні послідовності проїзду машин відповідно до правил дорожнього руху.
  useEffect(() => {
    // Генеруємо масив правильних варіантів порядку проїзду машин на поточному перехресті
    const valid = generateValidOrders(
      carsToPlace,               // машинки, які присутні на полі
      grid,                      // сітка перехрестя
      signPositions,             // положення дорожніх знаків
      blockedDirections,         // напрямки, які заблоковані
      directionToSignId,         // відповідність напрямку та знака
      conditionsData.signs,      // всі доступні дорожні знаки
      carPaths,                  // шляхи руху кожної машинки
      carPriorities              // розраховані пріоритети кожної машинки
    );

    // Зберігаємо згенеровані варіанти у стані — будемо використовувати для перевірки відповідей користувача
    setValidOrders(valid);
  }, [questionIndex, carPaths]);


  // Цей useEffect реагує на зміну порядку кліків користувача (userOrder).
  useEffect(() => {
    console.log('userOrder:', userOrder, 'validOrders:', validOrders);
    // Якщо користувач обрав стільки машин, скільки є на полі, і вже згенеровані правильні варіанти:
    if (userOrder.length > 0 && userOrder.length === validOrders[0]?.length) {      
      // ❗ Якщо або послідовність неправильна, або були допущені порушення
      if (hasMistake) {
        toast.info("❗ Спроба завершена. Правильна відповідь не зарахована через помилки.");
      } else {
        toast.success("✅ Правильна послідовність!");  // показуємо успішне повідомлення
        setScore((prev) => prev + 1);                 // збільшуємо рахунок користувача
      }
      setCanGoNext(true); // дозволити перехід до наступного питання
    }
  }, [userOrder]);

  useEffect(() => {   // Коли змінюється індекс питання (тобто користувач переходить до нового перехрестя), скидаємо всі внутрішні стани, щоб почати "з чистого аркуша".
    setMovingCars({}); // Очищаємо об'єкт, який зберігає позиції рухомих машин (анімація руху)    
    setIsCarMoving(false); // Скидаємо прапорець, що вказує на те, що якась машинка зараз рухається    
    setUserOrder([]); // Очищаємо порядок, у якому користувач кликав машинки (новий сценарій — новий вибір)    
    setHasMistake(false); // Скидаємо прапорець, що фіксує наявність помилки користувача під час вибору машин
    setCanGoNext(false); // Скидаємо прапорець, що робить видимою кнопку "Наступне питання"
  }, [questionIndex]);

  return (
    <div className="relative">
      <div className="grid grid-cols-8 grid-rows-8 gap-0 grid-test-custom">
        {grid.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const carsInCell = carsToPlace
              .map((car, idx) => {
                const key = `${car.position[0]}-${car.position[1]}`;
                const path = carPaths[key];
                const current = movingCars[key] || {
                  position: car.position,
                  rotation: getInitialRotationFromPath(car.position, path),
                };
                const [carRow, carCol] = current.position;
                

                if (carRow === rowIndex && carCol === colIndex) {
                  const carId = cars[idx]?.id;

                  console.log("carId:", carId, "image:", carImages[carId]);
                  return (
                    <div
                      key={idx}
                      className={`car-visual`}
                      style={{
                        backgroundImage: `url(${carImages[carId]})`,
                        transform: `translate(-50%, -50%) rotate(${current.rotation})`,
                        top: "50%",
                        left: "50%",
                        position: "absolute",
                      }}
                    />
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