const BaseGenerator = require('./BaseGenerator');

/**
 * Генератор для Т‑подібних перехресть (t_cross_1..4)
 * Використовує ті ж стартові точки, що й звичайне перехрестя,
 * але відкидає заблоковані напрямки (blockedDirections).
 */
class TCrossGenerator extends BaseGenerator {
  constructor() {
    super();

    this.INTERSECTION_IDS = ['t_cross_1', 't_cross_2', 't_cross_3', 't_cross_4'];

    /** @type {Record<string, string[]>} */
    this.BLOCKED_DIRECTIONS_MAP = {
      t_cross_1: ['north'],
      t_cross_2: ['south'],
      t_cross_3: ['west'],
      t_cross_4: ['east'],
    };
  }

  getIntersectionId() {
    const idx = Math.floor(Math.random() * this.INTERSECTION_IDS.length);
    return this.INTERSECTION_IDS[idx];
  }

  getBlockedDirections(intersectionId) {
    return this.BLOCKED_DIRECTIONS_MAP[intersectionId] || [];
  }

  /**
   * Для Т‑перехресть обмежуємо типи маневрів згідно з наявними маршрутами в routes.json,
   * щоб кожна згенерована машина гарантовано мала шлях.
   * @param {string} intersectionId
   * @param {number} startIndex
   * @returns {string[]}
   */
  getAllowedPathTypes(intersectionId, startIndex) {
    // Визначаємо напрямок за індексом стартової точки
    const directionEntry = Object.entries(this.DIRECTION_TO_START_INDEX).find(
      ([, idx]) => idx === startIndex
    );
    if (!directionEntry) {
      return super.getAllowedPathTypes(intersectionId, startIndex);
    }
    const [direction] = directionEntry;

    // Відповідність доступних маневрів даним у routes.json
    switch (intersectionId) {
      case 't_cross_1': {
        const map = {
          east: ['straight', 'left_turn'],
          south: ['right_turn', 'left_turn'],
          west: ['straight', 'right_turn'],
        };
        return map[direction] || super.getAllowedPathTypes(intersectionId, startIndex);
      }
      case 't_cross_2': {
        const map = {
          north: ['right_turn', 'left_turn'],
          east: ['straight', 'right_turn'],
          west: ['straight', 'left_turn'],
        };
        return map[direction] || super.getAllowedPathTypes(intersectionId, startIndex);
      }
      case 't_cross_3': {
        const map = {
          north: ['straight', 'left_turn'],
          east: ['right_turn', 'left_turn'],
          south: ['straight', 'right_turn'],
        };
        return map[direction] || super.getAllowedPathTypes(intersectionId, startIndex);
      }
      case 't_cross_4': {
        const map = {
          north: ['straight', 'right_turn'],
          south: ['straight', 'left_turn'],
          west: ['right_turn', 'left_turn'],
        };
        return map[direction] || super.getAllowedPathTypes(intersectionId, startIndex);
      }
      default:
        return super.getAllowedPathTypes(intersectionId, startIndex);
    }
  }
}

module.exports = TCrossGenerator;

