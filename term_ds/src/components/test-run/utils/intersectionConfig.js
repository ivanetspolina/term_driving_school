// Пов’язуємо напрямки з конкретними знаками
export const directionToSignId = {
    south: "traffic_light_red",
    east: "traffic_light_green",
    north: "traffic_light_red",
    west: "traffic_light_green"
  };

  
// Явно задані маршрути для кожного перехрестя та стартової точки
export const specificCarPathsMap = (questionData, carsData, routesData) => {

    // Заглушка для повернення
    const returnData = {};

    // перебираємо всі машини, які є в цьому питанні
    questionData.carsToPlace.forEach(car => {
        
        // відносно позиції машини відибраємо її координати
        const [one, two] = carsData.start_cars_points[car.start_cars_points].position;
        
        // Текстовий варіант ключа
        const keyText = `${one}-${two}`;

        // Отримуємо потрібний вигляд дороги
        const road = routesData[questionData.id];        

        // Перебираємо масив, щоб знайти потрібний шлях
        road.forEach(element => {
            
            // Відбираємо перший індекс
            const { path, type } = element;

            // Шукаємо в кого початковий індекс відповідє нашій позиції машини
            if (path[0].join('-') == keyText && type == car.path_type) {
                returnData[keyText] = path;
            }
        });
    });

    // Формуємо масив де позиція машини має мати from & to
    return returnData;
}



// [
//     {
//         '4-0': commonRoutes.find(r => r.from === 'west' && r.to === 'east').path,
//         '0-3': commonRoutes.find(r => r.from === 'north' && r.to === 'south').path,
//         '3-7': commonRoutes.find(r => r.from === 'east' && r.to === 'west').path,
//         '7-4': commonRoutes.find(r => r.from === 'south' && r.to === 'north').path,
//     },
    
//     {
//         '4-0': commonRoutes.find(r => r.from === 'west' && r.to === 'east').path,
//         '3-7': commonRoutes.find(r => r.from === 'east' && r.to === 'south').path,
//         '7-4': commonRoutes.find(r => r.from === 'south' && r.to === 'west').path,
//     },
//     {
//         '4-0': commonRoutes.find(r => r.from === 'west' && r.to === 'north').path,
//         '0-3': commonRoutes.find(r => r.from === 'north' && r.to === 'east').path,
//         '3-7': commonRoutes.find(r => r.from === 'east' && r.to === 'west').path,
//     },
//     {
//         '0-3': commonRoutes.find(r => r.from === 'north' && r.to === 'south').path,
//         '3-7': commonRoutes.find(r => r.from === 'east' && r.to === 'south').path,
//         '7-4': commonRoutes.find(r => r.from === 'south' && r.to === 'east').path,
//     },
//     {
//         '4-0': commonRoutes.find(r => r.from === 'west' && r.to === 'south').path,
//         '0-3': commonRoutes.find(r => r.from === 'north' && r.to === 'west').path,
//         '7-4': commonRoutes.find(r => r.from === 'south' && r.to === 'west').path,
//     }
// ]);
