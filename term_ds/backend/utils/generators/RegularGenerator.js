const BaseGenerator = require('./BaseGenerator');

/**
 * Генератор для звичайного перехрестя (regular_cross)
 * В основному повторює поточну логіку, включно з правилом про 3 зелених світлофори
 */
class RegularGenerator extends BaseGenerator {
  constructor() {
    super();
    this.INTERSECTION_ID = 'regular_cross';
  }

  getIntersectionId() {
    return this.INTERSECTION_ID;
  }

  /**
   * Спеціальне правило для світлофорів:
   * якщо на перехресті є рівно три зелені світлофори,
   * то для машини, що "по середині", завжди ставимо поворот праворуч.
   */
postProcessQuestion(question, topicType) {
    if (topicType !== 'lights' && topicType !== 'both') {
      return question;
    }

    const { sign_positions } = question;
    let { carsToPlace } = question;

    const directionOrder = ['west', 'north', 'east', 'south'];
    const directionToStartIndex = this.DIRECTION_TO_START_INDEX;

    // Хелпер: застосувати правило "три однакові світлофори"
    const applyThreeSameTrafficLightsRule = (lightId) => {
      const directions = sign_positions
        .filter((s) => s.sign_id === lightId)
        .map((s) => s.direction);

      if (directions.length !== 3) return;

      const indices = directions
        .map((dir) => directionOrder.indexOf(dir))
        .filter((idx) => idx !== -1);

      if (indices.length !== 3) return;

      const allIndices = [0, 1, 2, 3];
      const missingIndex = allIndices.find((idx) => !indices.includes(idx));
      if (typeof missingIndex !== 'number') return;

      const centerIndex = (missingIndex + 2) % 4;
      const middleDir = directionOrder[centerIndex];
      const targetStartIndex = directionToStartIndex[middleDir];
      if (typeof targetStartIndex !== 'number') return;

      let updated = false;
      carsToPlace = carsToPlace.map((car) => {
        if (!updated && car.start_cars_points === targetStartIndex) {
          updated = true;
          return {
            ...car,
            path_type: 'right_turn',
          };
        }
        return car;
      });
    };

    // Правило тільки для світлофорів (зелені / червоні)
    applyThreeSameTrafficLightsRule('traffic_light_green');
    applyThreeSameTrafficLightsRule('traffic_light_red');

    return {
      ...question,
      carsToPlace,
    };
  }
}

module.exports = RegularGenerator;

