export function setCarsToPlace(carsToPlace, carsData) {
  return carsToPlace.map((carConfig) => {
    const { car_id, start_cars_points, path_type } = carConfig;

    // Знаходимо координати стартової точки і стрілки за індексом
    const startPoint = carsData.start_cars_points[start_cars_points];

    if (!startPoint) {
      console.warn(`❗ Стартова точка з індексом ${start_cars_points} не знайдена`);
      return null;
    }

    // Знаходимо пріоритет машинки за її ID
    const carInfo = carsData.cars.find((car) => car.id === car_id);
    const cars_priority = carInfo?.cars_priority ?? 0;

    return {
      car_id,
      path_type,
      position: startPoint.position,
      arrow_position: startPoint.arrow_position,
      cars_priority
    };
  }).filter(Boolean); // Відфільтровуємо null (якщо щось пішло не так)
}
