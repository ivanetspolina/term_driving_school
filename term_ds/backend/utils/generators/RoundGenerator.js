const BaseGenerator = require('./BaseGenerator');

/**
 * Генератор для кругового перехрестя (round_cross)
 * Підтримує як машини «на колі» (start_round_cars_points),
 * так і машини, що під'їжджають з під'їзних доріг (start_cars_points).
 */
class RoundGenerator extends BaseGenerator {
  constructor() {
    super();

    this.INTERSECTION_ID = 'round_cross';

    // Для кругового перехрестя дозволяємо більше машин, ніж для звичайного
    this.MAX_CARS = 6;

    // Для кругового: мапа напрямків → індекс старту на колі
    this.ROUND_DIRECTION_TO_START_INDEX = {
      west: 0,
      north: 1,
      east: 2,
      south: 3,
    };
  }

  getIntersectionId() {
    return this.INTERSECTION_ID;
  }

  generateCars(intersectionId, options = {}) {
    const normalStartPoints = this.getStartPoints(intersectionId);
    const roundStartPoints = Object.values(this.ROUND_DIRECTION_TO_START_INDEX);

    const numCars =
      Math.floor(Math.random() * (this.MAX_CARS - this.MIN_CARS + 1)) +
      this.MIN_CARS;

    const cars = [];
    // Стежимо за використаними стартами окремо для кола та звичайних точок
    const usedStartPoints = new Set(); 

    const makeKey = (type, index) => `${type}-${index}`;

    const createCar = (car_id, startIndex, isRound) => {
      const allowedPathTypes = this.getAllowedPathTypes(
        intersectionId,
        startIndex
      );

      const path_type =
        allowedPathTypes[Math.floor(Math.random() * allowedPathTypes.length)];

      if (isRound) {
        return {
          car_id,
          start_cars_points: startIndex,
          start_round_cars_points: startIndex,
          path_type,
        };
      }

      return {
        car_id,
        start_cars_points: startIndex,
        path_type,
      };
    };

    const hasPolice = Math.random() < 0.3;
    let roundCarsCount = 0;

    if (hasPolice && numCars > 0 && !options.disablePolice) {
      // Випадково обираємо: поліцейська машина може бути як на колі, так і на під'їзді
      let isRoundPolice =
        roundStartPoints.length > 0 &&
        roundCarsCount < 3 &&
        (normalStartPoints.length === 0 || Math.random() < 0.5);

      const pool = isRoundPolice ? roundStartPoints : normalStartPoints;
      const startIndex =
        pool[Math.floor(Math.random() * pool.length)];

      usedStartPoints.add(
        makeKey(isRoundPolice ? 'round' : 'normal', startIndex)
      );

      cars.push(createCar('police', startIndex, isRoundPolice));

      if (isRoundPolice) {
        roundCarsCount++;
      }
    }

    let carIndex = 1;
    while (cars.length < numCars) {
      let startIndex;
      let isRound = false;
      let attempts = 0;

      do {
        let tryRound =
          roundStartPoints.length > 0 &&
          roundCarsCount < 3 &&
          (normalStartPoints.length === 0 || Math.random() < 0.5);

        if (!tryRound && normalStartPoints.length === 0) {
          break;
        }

        const pool = tryRound ? roundStartPoints : normalStartPoints;
        isRound = tryRound;

        if (pool.length === 0) {
          break;
        }

        startIndex = pool[Math.floor(Math.random() * pool.length)];
        attempts++;
      } while (
        usedStartPoints.has(makeKey(isRound ? 'round' : 'normal', startIndex)) &&
        attempts < 20
      );

      const key = makeKey(isRound ? 'round' : 'normal', startIndex);

      if (startIndex == null || usedStartPoints.has(key)) {
        break;
      }

      usedStartPoints.add(key);
      cars.push(createCar(`car${carIndex}`, startIndex, isRound));

      if (isRound) {
        roundCarsCount++;
      }

      carIndex++;
    }

    return cars;
  }
}

module.exports = RoundGenerator;

