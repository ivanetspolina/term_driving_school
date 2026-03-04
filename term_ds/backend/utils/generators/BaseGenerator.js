/**
 * Базовий клас для генерації питань тестів
 * Містить спільну логіку для всіх типів перехресть
 */
class BaseGenerator {
  constructor() {
    // Дорожні знаки
    this.REGULATORY_SIGNS = ['stop', 'give_way', 'main_road'];
    this.TRAFFIC_LIGHTS = ['traffic_light_red', 'traffic_light_green'];
    this.ALL_SIGNS = [...this.REGULATORY_SIGNS, ...this.TRAFFIC_LIGHTS];

    // Типи руху
    this.PATH_TYPES = ['straight', 'left_turn', 'right_turn'];

    // Мапа напрямків → індекс стартової точки для звичайного перехрестя
    this.DIRECTION_TO_START_INDEX = {
      west: 0,
      north: 1,
      east: 2,
      south: 3,
    };

    // Ліміти кількості машин
    this.MIN_CARS = 2;
    this.MAX_CARS = 4;
  }

  /**
   * Має повернути ідентифікатор перехрестя для конкретного питання
   * Наприклад: 'regular_cross', 't_cross_1', 'round_cross'
   */
  getIntersectionId() {
    throw new Error('getIntersectionId() must be implemented in subclass');
  }

  /**
   * Заблоковані напрямки для конкретного перехрестя
   * Використовується для Т‑перехресть
   * @param {string} intersectionId
   * @returns {string[]} масив напрямків: ['north','east','south','west']
   */
  getBlockedDirections(intersectionId) {
    return [];
  }

  /**
   * Повертає список напрямків, для яких потрібно згенерувати знаки
   * За замовчуванням: усі, крім заблокованих
   * @param {string} intersectionId
   * @returns {string[]}
   */
  getDirections(intersectionId) {
    const all = ['north', 'east', 'south', 'west'];
    const blocked = this.getBlockedDirections(intersectionId);
    return all.filter((dir) => !blocked.includes(dir));
  }

  /**
   * Повертає список дозволених стартових індексів машин
   * За замовчуванням: усі, крім тих, що ведуть у заблокований напрямок
   * @param {string} intersectionId
   * @returns {number[]}
   */
  getStartPoints(intersectionId) {
    const blocked = this.getBlockedDirections(intersectionId);
    return Object.entries(this.DIRECTION_TO_START_INDEX)
      .filter(([dir]) => !blocked.includes(dir))
      .map(([, index]) => index);
  }

  /**
   * Повертає дозволені типи руху для стартової точки
   * За замовчуванням: всі типи
   * @param {string} intersectionId
   * @param {number} startIndex
   * @returns {string[]}
   */
  getAllowedPathTypes(intersectionId, startIndex) {
    // Можна перевизначити в нащадках для тонкого налаштування Т‑/кругових перехресть
    return this.PATH_TYPES;
  }

  /**
   * Генерує знаки для перехрестя з урахуванням правил
   * @param {string} topicType - 'lights' | 'signs' | 'both'
   * @param {string} intersectionId
   * @returns {Array} Масив об'єктів {direction, sign_id}
   */
  generateSigns(topicType, intersectionId) {
    let availableSigns;
    if (topicType === 'lights') {
      availableSigns = this.TRAFFIC_LIGHTS;
    } else if (topicType === 'both') {
      availableSigns = this.ALL_SIGNS;
    } else {
      availableSigns = this.REGULATORY_SIGNS;
    }

    const directions = this.getDirections(intersectionId);

    const signPositions = [];

    // Генеруємо знаки для кожного напрямку
    for (const direction of directions) {
      let signId;
      let attempts = 0;
      const maxAttempts = 50;

      do {
        signId = availableSigns[Math.floor(Math.random() * availableSigns.length)];
        attempts++;

        // Перевіряємо правила
        const isValid = this.validateSignRules(signPositions, signId, topicType);
        if (isValid) break;
      } while (attempts < maxAttempts);

      signPositions.push({ direction, sign_id: signId });
    }

    return signPositions;
  }

  /**
   * Валідує правила для знаків
   * @param {Array} currentSigns - поточні знаки
   * @param {string} newSignId - новий знак для додавання
   * @param {string} topicType - тип теми
   * @returns {boolean} true якщо валідний
   */
  validateSignRules(currentSigns, newSignId, topicType) {
    // Симулюємо додавання нового знака
    const testSigns = [...currentSigns, { sign_id: newSignId }];
    const signCounts = {};

    testSigns.forEach((sign) => {
      signCounts[sign.sign_id] = (signCounts[sign.sign_id] || 0) + 1;
    });

    // Правило: Не всі знаки однакові
    const allSame = Object.keys(signCounts).length === 1;
    if (allSame) return false;

    // Правило: Не може бути 3 однакові знаки (якщо дорожні знаки)
    if (topicType === 'signs') {
      const hasThreeSame = Object.values(signCounts).some((count) => count >= 3);
      if (hasThreeSame) return false;
    }

    return true;
  }

  /**
   * Генерує машинки для перехрестя
   * Базова реалізація для звичайного перехрестя / Т‑перехресть
   * @param {string} intersectionId
   * @param {Object} options
   * @returns {Array} Масив об'єктів {car_id, start_cars_points, path_type}
   */
  generateCars(intersectionId, options = {}) {
    const startPoints = this.getStartPoints(intersectionId);

    const numCars =
      Math.floor(Math.random() * (this.MAX_CARS - this.MIN_CARS + 1)) +
      this.MIN_CARS;

    const cars = [];
    const usedStartPoints = new Set();

    const hasPolice = Math.random() < 0.3;

    // Додаємо поліцейську машину (якщо є місце і це дозволено)
    if (hasPolice && numCars > 0 && !options.disablePolice) {
      const policePoint =
        startPoints[Math.floor(Math.random() * startPoints.length)];
      usedStartPoints.add(policePoint);
      const policePathTypes = this.getAllowedPathTypes(intersectionId, policePoint);

      cars.push({
        car_id: 'police',
        start_cars_points: policePoint,
        path_type:
          policePathTypes[Math.floor(Math.random() * policePathTypes.length)],
      });
    }

    // Генеруємо решту машин
    let carIndex = 1;
    while (cars.length < numCars) {
      let startPoint;
      let attempts = 0;

      do {
        startPoint =
          startPoints[Math.floor(Math.random() * startPoints.length)];
        attempts++;
      } while (usedStartPoints.has(startPoint) && attempts < 20);

      if (!usedStartPoints.has(startPoint)) {
        usedStartPoints.add(startPoint);

        const allowedPathTypes = this.getAllowedPathTypes(
          intersectionId,
          startPoint
        );

        cars.push({
          car_id: `car${carIndex}`,
          start_cars_points: startPoint,
          path_type:
            allowedPathTypes[
              Math.floor(Math.random() * allowedPathTypes.length)
            ],
        });
        carIndex++;
      } else {
        // Якщо не вдалося знайти вільну точку, зупиняємося
        break;
      }
    }

    return cars;
  }

  /**
   * Додаткова обробка питання (наприклад, спеціальні правила для світлофорів)
   * За замовчуванням — нічого не робимо
   * @param {Object} question
   * @param {string} topicType
   * @returns {Object}
   */
  postProcessQuestion(question, topicType) {
    return question;
  }

  /**
   * Генерує одне питання
   * @param {string} topicType - 'lights' | 'signs' | 'both'
   * @returns {{id: string, sign_positions: Array, carsToPlace: Array}}
   */
  generateQuestion(topicType = 'signs') {
    const intersectionId = this.getIntersectionId();
    const sign_positions = this.generateSigns(topicType, intersectionId);
    const carsToPlace = this.generateCars(intersectionId);

    const baseQuestion = {
      id: intersectionId,
      sign_positions,
      carsToPlace,
    };

    return this.postProcessQuestion(baseQuestion, topicType);
  }

  /**
   * Генерує масив питань
   * @param {number} count - кількість питань
   * @param {string} topicType - 'lights' | 'signs' | 'both'
   * @returns {Array}
   */
  generateQuestions(count = 20, topicType = 'signs') {
    const questions = [];

    if (topicType === 'both') {
      const lightsCount = Math.floor(count / 2);
      const signsCount = count - lightsCount;

      for (let i = 0; i < lightsCount; i++) {
        questions.push(this.generateQuestion('lights'));
      }
      for (let i = 0; i < signsCount; i++) {
        questions.push(this.generateQuestion('signs'));
      }

      // Перемішуємо, щоб питання йшли у випадковому порядку
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }

      return questions;
    }

    for (let i = 0; i < count; i++) {
      questions.push(this.generateQuestion(topicType));
    }

    return questions;
  }
}

module.exports = BaseGenerator;

