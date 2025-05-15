export const isTestPassed = (score, passingScore = 18) => {
  return score >= passingScore;
};

export const getRandomEncouragingPhrase = (name, score, total) => {
  const scorePercent = (score / total) * 100;
  
  const excellentPhrases = [
    `Неймовірно, ${name}! Ти справжній геній!`,
    `Вражаюче, ${name}! Просто бездоганний результат!`,
    `${name}, ти перевершив усі очікування!`,
    `Фантастично, ${name}! Ти дійсно майстер своєї справи!`,
    `Блискуче, ${name}! Продовжуй дивувати всіх своїми знаннями!`
  ];
  
  const goodPhrases = [
    `Молодець, ${name}! Ти чудово впорався!`,
    `Відмінна робота, ${name}! Твої зусилля дають результат!`,
    `${name}, ти на правильному шляху!`,
    `Браво, ${name}! Це гідний результат!`,
    `${name}, твоя наполегливість заслуговує похвали!`
  ];
  
  const averagePhrases = [
    `${name}, ти вже багато досяг, але є куди рости!`,
    `Не зупиняйся, ${name}! Ти можеш ще краще!`,
    `${name}, твій потенціал значно більший!`,
    `Гарний старт, ${name}! Наступного разу буде ще краще!`,
    `${name}, з кожною спробою ти стаєш сильнішим!`
  ];
  
  const lowPhrases = [
    `${name}, не здавайся! Кожна невдача - це крок до успіху!`,
    `Це лише початок, ${name}! У тебе все вийде!`,
    `${name}, вір у себе! Наступна спроба буде успішнішою!`,
    `Не втрачай надії, ${name}! Практика веде до досконалості!`,
    `${name}, помилки - це найкращі вчителі!`
  ];
  
  let phrasesArray;
  if (scorePercent >= 90) {
    phrasesArray = excellentPhrases;
  } else if (scorePercent >= 75) {
    phrasesArray = goodPhrases;
  } else if (scorePercent >= 60) {
    phrasesArray = averagePhrases;
  } else {
    phrasesArray = lowPhrases;
  }
  
  return phrasesArray[Math.floor(Math.random() * phrasesArray.length)];
};

export const generateNewTest = () => {
  console.log('Генерування нового тесту...');
};