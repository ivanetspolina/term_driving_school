// Пов’язуємо напрямки з конкретними знаками
export const directionToSignId = {
    south: "give_way",
    east: "main_road",
    north: "give_way",
    west: "main_road"
  };

  
// Явно задані маршрути для кожного перехрестя та стартової точки
export const specificCarPathsMap = (commonRoutes) => ([
    {
        '4-0': commonRoutes.find(r => r.from === 'west' && r.to === 'east').path,
        '0-3': commonRoutes.find(r => r.from === 'north' && r.to === 'south').path,
        '3-7': commonRoutes.find(r => r.from === 'east' && r.to === 'west').path,
        '7-4': commonRoutes.find(r => r.from === 'south' && r.to === 'north').path,
    },
    
    {
        '4-0': commonRoutes.find(r => r.from === 'west' && r.to === 'east').path,
        '3-7': commonRoutes.find(r => r.from === 'east' && r.to === 'south').path,
        '7-4': commonRoutes.find(r => r.from === 'south' && r.to === 'west').path,
    },
    {
        '4-0': commonRoutes.find(r => r.from === 'west' && r.to === 'north').path,
        '0-3': commonRoutes.find(r => r.from === 'north' && r.to === 'east').path,
        '3-7': commonRoutes.find(r => r.from === 'east' && r.to === 'west').path,
    },
    {
        '0-3': commonRoutes.find(r => r.from === 'north' && r.to === 'south').path,
        '3-7': commonRoutes.find(r => r.from === 'east' && r.to === 'south').path,
        '7-4': commonRoutes.find(r => r.from === 'south' && r.to === 'east').path,
    },
    {
        '4-0': commonRoutes.find(r => r.from === 'west' && r.to === 'south').path,
        '0-3': commonRoutes.find(r => r.from === 'north' && r.to === 'west').path,
        '7-4': commonRoutes.find(r => r.from === 'south' && r.to === 'west').path,
    }
]);
