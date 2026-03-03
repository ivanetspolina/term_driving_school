/**
 * Клас для генерації питань тестів
 * Притримується принципів DRY, KISS, OOP
 */
class QuestionGenerator {
  constructor() {
    this.INTERSECTION_ID = 'regular_cross';
    this.DIRECTIONS = ['north', 'east', 'south', 'west'];
    this.REGULATORY_SIGNS = ['stop', 'give_way', 'main_road'];
    this.TRAFFIC_LIGHTS = ['traffic_light_red', 'traffic_light_green'];
    this.ALL_SIGNS = [...this.REGULATORY_SIGNS, ...this.TRAFFIC_LIGHTS];
    this.PATH_TYPES = ['straight', 'left_turn', 'right_turn'];
    this.START_POINTS = [0, 1, 2, 3];
    this.MIN_CARS = 2;
    this.MAX_CARS = 4;
  }

  /**
   * Генерує знаки для перехрестя з урахуванням правил
   * @param {string} topicType - 'lights' або 'signs'
   * @returns {Array} Масив об'єктів {direction, sign_id}
   */
  generateSigns(topicType) {
    let availableSigns;
    if (topicType === 'lights') {
      availableSigns = this.TRAFFIC_LIGHTS;
    } else if (topicType === 'both') {
      availableSigns = this.ALL_SIGNS;
    } else {
      availableSigns = this.REGULATORY_SIGNS;
    }
    
    const signPositions = [];
    const usedSigns = {};
    
    // Генеруємо знаки для кожного напрямку
    for (const direction of this.DIRECTIONS) {
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
      usedSigns[signId] = (usedSigns[signId] || 0) + 1;
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
    
    testSigns.forEach(sign => {
      signCounts[sign.sign_id] = (signCounts[sign.sign_id] || 0) + 1;
    });
    
    // Правило 2: Не всі 4 знаки однакові
    const allSame = Object.keys(signCounts).length === 1;
    if (allSame) return false;
    
    // Правило 3: Не може бути 3 однакові знаки (якщо дорожні знаки)
    if (topicType === 'signs') {
      const hasThreeSame = Object.values(signCounts).some(count => count >= 3);
      if (hasThreeSame) return false;
    }
    
    return true;
  }

  /**
   * Генерує машинки для перехрестя
   * @returns {Array} Масив об'єктів {car_id, start_cars_points, path_type}
   */
  generateCars() {
    const numCars = Math.floor(Math.random() * (this.MAX_CARS - this.MIN_CARS + 1)) + this.MIN_CARS;
    const cars = [];
    const usedStartPoints = new Set();
    const hasPolice = Math.random() < 0.3;
    
    // Завжди додаємо поліцейську машину (якщо є місце)
    if (hasPolice && numCars > 0) {
      const policePoint = this.START_POINTS[Math.floor(Math.random() * this.START_POINTS.length)];
      usedStartPoints.add(policePoint);
      cars.push({
        car_id: 'police',
        start_cars_points: policePoint,
        path_type: this.PATH_TYPES[Math.floor(Math.random() * this.PATH_TYPES.length)]
      });
    }
    
    // Генеруємо решту машин
    let carIndex = 1;
    while (cars.length < numCars) {
      let startPoint;
      let attempts = 0;
      
      do {
        startPoint = this.START_POINTS[Math.floor(Math.random() * this.START_POINTS.length)];
        attempts++;
      } while (usedStartPoints.has(startPoint) && attempts < 20);
      
      if (!usedStartPoints.has(startPoint)) {
        usedStartPoints.add(startPoint);
        cars.push({
          car_id: `car${carIndex}`,
          start_cars_points: startPoint,
          path_type: this.PATH_TYPES[Math.floor(Math.random() * this.PATH_TYPES.length)]
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
   * Генерує одне питання
   * @param {string} topicType - 'lights' або 'signs'
   * @returns {Object} Об'єкт питання
   */
generateQuestion(topicType = 'signs') {
    const sign_positions = this.generateSigns(topicType);
    let carsToPlace = this.generateCars();

    if (topicType === 'lights' || topicType === 'both') {
      const greenDirections = sign_positions
        .filter((s) => s.sign_id === 'traffic_light_green')
        .map((s) => s.direction);

      if (greenDirections.length === 3) {
        const directionOrder = ['west', 'north', 'east', 'south'];
        const directionToStartIndex = {
          west: 0,
          north: 1,
          east: 2,
          south: 3,
        };

        const greenIndices = greenDirections
          .map((dir) => directionOrder.indexOf(dir))
          .filter((idx) => idx !== -1);

        if (greenIndices.length === 3) {
          const allIndices = [0, 1, 2, 3];
          const missingIndex = allIndices.find(
            (idx) => !greenIndices.includes(idx)
          );

          if (typeof missingIndex === 'number') {
            const centerIndex = (missingIndex + 2) % 4;
            const middleDir = directionOrder[centerIndex];
            const targetStartIndex = directionToStartIndex[middleDir];

            if (typeof targetStartIndex === 'number') {
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
            }
          }
        }
      }
    }

    return {
      id: this.INTERSECTION_ID,
      sign_positions,
      carsToPlace,
    };
  }

  /**
   * Генерує масив питань
   * @param {number} count - кількість питань
   * @param {string} topicType - 'lights' або 'signs'
   * @returns {Array} Масив питань
   */
  generateQuestions(count = 20, topicType = 'signs') {
    const questions = [];

    // Якщо обрано комбінований режим, генеруємо приблизно 50/50:
    // половина питань тільки зі світлофорами, половина — тільки з дорожніми знаками.
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

    // Звичайний режим: всі питання одного типу    
    for (let i = 0; i < count; i++) {
      questions.push(this.generateQuestion(topicType));
    }
    
    return questions;
  }
}

module.exports = QuestionGenerator;
