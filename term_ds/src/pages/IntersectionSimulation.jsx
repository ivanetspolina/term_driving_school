import React, { useState, useEffect, useRef } from 'react';

const IntersectionSimulation = () => {
  // Визначення координат перехрестя
  const intersection = {
    topLeft: { x: 200, y: 200 },
    topRight: { x: 300, y: 200 },
    bottomLeft: { x: 200, y: 300 },
    bottomRight: { x: 300, y: 300 },
    center: { x: 250, y: 250 }
  };

  // Створення шляхів руху для автомобілів (з правостороннім рухом)
  const paths = {
    northStraight: [
      { x: 230, y: 50 }, // Початкова точка (права смуга для руху на південь)
      { x: 230, y: 180 }, // Перед перехрестям
      { x: 230, y: 320 }, // Після перехрестя
      { x: 230, y: 450 } // Кінцева точка
    ],
    southLeft: [ // Поворот ліворуч з другорядної дороги
      { x: 270, y: 450 }, // Початкова точка (права смуга для руху на північ)
      { x: 270, y: 320 }, // Перед поворотом
      { x: 270, y: 280 }, // Підходить до перехрестя
      { x: 270, y: 260 }, // В'їзд на перехрестя
      { x: 260, y: 250 }, // Перетин центру перехрестя
      { x: 240, y: 240 }, // Виконання повороту
      { x: 220, y: 230 }, // Завершення повороту
      { x: 180, y: 230 }, // Після повороту
      { x: 50, y: 230 } // Кінцева точка (права смуга для руху на схід)
    ],
    eastRight: [ // Поворот праворуч з головної дороги
      { x: 450, y: 230 }, // Початкова точка (права смуга для руху на захід)
      { x: 320, y: 230 }, // Перед поворотом
      { x: 300, y: 230 }, // Початок повороту
      { x: 280, y: 235 }, // Під час повороту 1
      { x: 260, y: 245 }, // Під час повороту 2
      { x: 245, y: 260 }, // Під час повороту 3
      { x: 235, y: 280 }, // Кінець повороту
      { x: 230, y: 320 }, // Після повороту
      { x: 230, y: 450 } // Кінцева точка (права смуга для руху на південь)
    ],
    westStraight: [ // Прямий рух по головній дорозі
      { x: 50, y: 270 }, // Початкова точка (права смуга для руху на схід)
      { x: 180, y: 270 }, // Перед перехрестям
      { x: 320, y: 270 }, // Після перехрестя
      { x: 450, y: 270 } // Кінцева точка
    ],
  };
  
  // Початкові налаштування автомобілів
  const initialCars = [
    { 
      id: 'north', 
      x: 230, y: 50, 
      direction: 'down', 
      priority: 'secondary', 
      route: 'straight', 
      path: paths.northStraight, 
      currentPointIndex: 0, 
      moving: false, 
      completed: false, 
      waiting: false,
      color: '#4CAF50', // Зелений
      label: 'П'
    },
    { 
      id: 'south', 
      x: 270, y: 450, 
      direction: 'up', 
      priority: 'secondary', 
      route: 'left', 
      path: paths.southLeft, 
      currentPointIndex: 0, 
      moving: false, 
      completed: false, 
      waiting: false,
      color: '#9C27B0', // Фіолетовий
      label: 'Пд'
    },
    { 
      id: 'east', 
      x: 450, y: 230, // Змінено на 230 - права смуга для руху на захід
      direction: 'left', 
      priority: 'main', 
      route: 'right', 
      path: paths.eastRight, 
      currentPointIndex: 0, 
      moving: false, 
      completed: false, 
      waiting: false,
      color: '#2196F3', // Синій
      label: 'С'
    },
    { 
      id: 'west', 
      x: 50, y: 270, // Змінено на 270 - права смуга для руху на схід
      direction: 'right', 
      priority: 'main', 
      route: 'straight', 
      path: paths.westStraight, 
      currentPointIndex: 0, 
      moving: false, 
      completed: false, 
      waiting: false,
      color: '#FF9800', // Помаранчевий
      label: 'З'
    },
  ];
  
  const [cars, setCars] = useState(initialCars);
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [status, setStatus] = useState("Підготовка симуляції...");
  const animationFrameId = useRef(null);
  const [resetKey, setResetKey] = useState(0);
  
  // Скидання симуляції
  const resetSimulation = () => {
    setCars(initialCars);
    setSimulationStarted(false);
    setStatus("Підготовка симуляції...");
    setResetKey(prev => prev + 1);
  };
  
  // Запуск симуляції після короткої затримки
  useEffect(() => {
    const timer = setTimeout(() => {
      setSimulationStarted(true);
      setStatus("Симуляція запущена: Дивіться правила пріоритету в дії!");
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [resetKey]);

  // Перевірка, чи автомобіль на перехресті
  const isInIntersection = (car) => {
    const x = car.x;
    const y = car.y;
    return x >= intersection.topLeft.x && x <= intersection.topRight.x && 
           y >= intersection.topLeft.y && y <= intersection.bottomLeft.y;
  };
  
  // Перевірка, чи автомобіль наближається до перехрестя
  const isApproachingIntersection = (car) => {
    return car.currentPointIndex === 1; // Індекс 1 зазвичай перед перехрестям
  };
  
  // Головний цикл анімації
  useEffect(() => {
    if (!simulationStarted) return;
    
    // Функція анімації для руху автомобілів
    const animate = () => {
      setCars(prevCars => {
        // Визначаємо, які автомобілі знаходяться на перехресті
        const carsInIntersection = prevCars.filter(car => isInIntersection(car) && !car.completed);
        
        // Перевіряємо, чи є автомобілі з головної дороги на перехресті або поблизу нього
        const mainRoadCarsInOrNearIntersection = prevCars.filter(
          car => car.priority === 'main' && !car.completed && 
                 (isInIntersection(car) || isApproachingIntersection(car))
        );
        
        // Знаходимо всі автомобілі
        const westCar = prevCars.find(car => car.id === 'west');
        const eastCar = prevCars.find(car => car.id === 'east');
        const northCar = prevCars.find(car => car.id === 'north');
        const southCar = prevCars.find(car => car.id === 'south');
        
        // Визначаємо, чи повинна синя машина чекати оранжеву
        const eastShouldWaitForWest = 
          eastCar && 
          !eastCar.completed && 
          westCar && 
          !westCar.completed && 
          (westCar.currentPointIndex < 2 || isInIntersection(westCar)) && 
          isApproachingIntersection(eastCar);
        
        // Визначаємо, чи повинна фіолетова машина чекати зелену
        const southShouldWaitForNorth = 
          southCar && 
          !southCar.completed && 
          northCar && 
          !northCar.completed && 
          (northCar.currentPointIndex < 2 || isInIntersection(northCar)) && 
          isApproachingIntersection(southCar);
        
        // Визначаємо, чи повинні чекати автомобілі з другорядних доріг
        const secondaryCarsShouldWait = mainRoadCarsInOrNearIntersection.length > 0;
        
        // Оновлюємо статус симуляції
        if (secondaryCarsShouldWait) {
          setStatus("Головна дорога має пріоритет! Другорядні автомобілі повинні чекати.");
        } else if (eastShouldWaitForWest) {
          setStatus("Синя машина (С) повинна пропустити оранжеву машину (З), яка їде прямо!");
        } else if (southShouldWaitForNorth) {
          setStatus("Фіолетова машина (Пд) повинна пропустити зелену машину (П), яка їде прямо!");
        } else if (carsInIntersection.length > 0) {
          setStatus("Перехрестя перетинається...");
        } else if (prevCars.every(car => car.completed)) {
          setStatus("Симуляція завершена. Всі автомобілі проїхали перехрестя.");
        } else {
          setStatus("Симуляція запущена: Дивіться правила пріоритету в дії!");
        }
        
        // Оновлюємо стан автомобілів
        return prevCars.map(car => {
          if (car.completed) return car;
          
          let shouldMove = false;
          let isWaiting = false;
          
          // Спеціальна логіка для синьої машини (схід)
          if (car.id === 'east') {
            if (eastShouldWaitForWest) {
              isWaiting = true;
              shouldMove = false;
            } else {
              shouldMove = true;
            }
          }
          // Спеціальна логіка для фіолетової машини (південь)
          else if (car.id === 'south') {
            if (secondaryCarsShouldWait || southShouldWaitForNorth) {
              isWaiting = true;
              shouldMove = false;
            } else {
              shouldMove = true;
            }
          }
          // Автомобілі з головної дороги мають пріоритет (окрім спеціального випадку для сходу)
          else if (car.priority === 'main') {
            shouldMove = true;
          }
          // Автомобілі з другорядних доріг чекають, якщо на головній є машини
          else if (car.priority === 'secondary') {
            if (secondaryCarsShouldWait) {
              isWaiting = true;
              shouldMove = false;
            } else {
              shouldMove = true;
            }
          }
          
          if (!shouldMove) {
            return { ...car, moving: false, waiting: isWaiting };
          }
          
          // Автомобіль рухається
          // Отримуємо поточну та наступну точки
          const currentPoint = car.path[car.currentPointIndex];
          const nextPointIndex = car.currentPointIndex + 1;
          
          // Якщо досягнуто кінця шляху
          if (nextPointIndex >= car.path.length) {
            return { ...car, completed: true, moving: false, waiting: false };
          }
          
          const nextPoint = car.path[nextPointIndex];
          
          // Розрахунок вектору напрямку
          const dx = nextPoint.x - car.x;
          const dy = nextPoint.y - car.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Якщо дуже близько до наступної точки, переходимо до неї
          if (distance < 2) {
            return { 
              ...car, 
              currentPointIndex: nextPointIndex, 
              x: nextPoint.x, 
              y: nextPoint.y,
              moving: true,
              waiting: false
            };
          }
          
          // Інакше рухаємося до наступної точки
          const step = 1; // Швидкість - знижена для плавнішого руху
          const normDx = dx / distance;
          const normDy = dy / distance;
          
          return {
            ...car,
            x: car.x + normDx * step,
            y: car.y + normDy * step,
            moving: true,
            waiting: false
          };
        });
      });
      
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animationFrameId.current = requestAnimationFrame(animate);
    
    // Очищення
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [simulationStarted, resetKey]);
  
  // Розрахунок повороту автомобіля на основі напрямку руху
  const getCarRotation = (car) => {
    if (car.currentPointIndex >= car.path.length - 1) return 0;
    
    const nextPoint = car.path[car.currentPointIndex + 1];
    const dx = nextPoint.x - car.x;
    const dy = nextPoint.y - car.y;
    
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };
  
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
    },
    title: {
      color: '#333',
      marginBottom: '10px',
    },
    legend: {
      display: 'flex',
      marginBottom: '15px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      margin: '0 10px 10px 0',
      backgroundColor: '#f5f5f5',
      padding: '5px 10px',
      borderRadius: '4px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    legendColor: {
      width: '20px',
      height: '20px',
      marginRight: '8px',
      border: '1px solid #333',
      borderRadius: '3px'
    },
    svgContainer: {
      border: '1px solid #ccc',
      borderRadius: '5px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      overflow: 'hidden',
      margin: '10px 0'
    },
    statusPanel: {
      backgroundColor: '#333',
      color: 'white',
      padding: '10px 15px',
      borderRadius: '4px',
      margin: '15px 0',
      width: '90%',
      textAlign: 'center',
      fontWeight: 'bold'
    },
    infoPanel: {
      margin: '10px 0',
      border: '1px solid #ccc',
      padding: '15px',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9',
      width: '90%'
    },
    infoPanelTitle: {
      margin: '0 0 10px 0',
      color: '#333',
    },
    infoPanelList: {
      paddingLeft: '20px',
      margin: '0'
    },
    buttonContainer: {
      margin: '15px 0'
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#2196F3',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      cursor: 'pointer',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    }
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Симуляція дорожнього руху на перехресті</h1>
      
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{...styles.legendColor, backgroundColor: '#FF9800'}}></div>
          <span>Західна машина (З) - Головна дорога</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{...styles.legendColor, backgroundColor: '#2196F3'}}></div>
          <span>Східна машина (С) - Головна дорога</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{...styles.legendColor, backgroundColor: '#4CAF50'}}></div>
          <span>Північна машина (П) - Другорядна дорога</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{...styles.legendColor, backgroundColor: '#9C27B0'}}></div>
          <span>Південна машина (Пд) - Другорядна дорога</span>
        </div>
      </div>
      
      <div style={styles.statusPanel}>
        {status}
      </div>
      
      <div style={styles.svgContainer}>
        <svg width="500" height="500" viewBox="0 0 500 500">
          {/* Фон */}
          <rect x="0" y="0" width="500" height="500" fill="#7BB661" /> {/* Колір трави */}
          
          {/* Дороги */}
          <rect x="200" y="0" width="100" height="500" fill="#333" /> {/* Вертикальна дорога */}
          <rect x="0" y="200" width="500" height="100" fill="#333" /> {/* Горизонтальна дорога */}
          
          {/* Дорожня розмітка */}
          <line x1="250" y1="0" x2="250" y2="200" stroke="white" strokeWidth="2" strokeDasharray="10,10" />
          <line x1="250" y1="300" x2="250" y2="500" stroke="white" strokeWidth="2" strokeDasharray="10,10" />
          <line x1="0" y1="250" x2="200" y2="250" stroke="white" strokeWidth="2" strokeDasharray="10,10" />
          <line x1="300" y1="250" x2="500" y2="250" stroke="white" strokeWidth="2" strokeDasharray="10,10" />
          
          {/* Краї доріг */}
          <line x1="200" y1="0" x2="200" y2="500" stroke="white" strokeWidth="2" />
          <line x1="300" y1="0" x2="300" y2="500" stroke="white" strokeWidth="2" />
          <line x1="0" y1="200" x2="500" y2="200" stroke="white" strokeWidth="2" />
          <line x1="0" y1="300" x2="500" y2="300" stroke="white" strokeWidth="2" />
          
          {/* Дорожні знаки */}
          {/* Знак головної дороги (жовтий ромб) */}
          <g>
            <polygon points="480,180 500,200 480,220 460,200" fill="yellow" stroke="black" />
            <text x="480" y="205" textAnchor="middle" fontSize="10" fontWeight="bold">Головна</text>
          </g>
          <g>
            <polygon points="20,180 40,200 20,220 0,200" fill="yellow" stroke="black" />
            <text x="20" y="205" textAnchor="middle" fontSize="10" fontWeight="bold">Головна</text>
          </g>
          
          {/* Знаки другорядної дороги (Уступіть дорогу) */}
          <g>
            <polygon points="280,20 270,40 290,40" fill="red" stroke="white" />
            <text x="280" y="60" textAnchor="middle" fontSize="10" fontWeight="bold">Уступіть</text>
          </g>
          <g>
            <polygon points="280,480 270,460 290,460" fill="red" stroke="white" />
            <text x="280" y="445" textAnchor="middle" fontSize="10" fontWeight="bold">Уступіть</text>
          </g>
          
          {/* Індикатори маршрутів */}
          {/* Північ - прямо */}
          <g>
            <text x="200" y="30" textAnchor="end" fontSize="12" fill="#333" fontWeight="bold">П → Прямо</text>
            <line x1="230" y1="30" x2="230" y2="160" stroke="#4CAF50" strokeWidth="2" strokeDasharray="5,5" />
          </g>
          {/* Південь - поворот ліворуч */}
          <g>
            <text x="300" y="470" textAnchor="start" fontSize="12" fill="#333" fontWeight="bold">Пд → Ліворуч</text>
            <path d="M270,450 L270,320 Q270,250 220,230 L50,230" stroke="#9C27B0" strokeWidth="2" strokeDasharray="5,5" fill="none" />
          </g>
          {/* Схід - поворот праворуч */}
          <g>
            <text x="470" y="300" textAnchor="end" fontSize="12" fill="#333" fontWeight="bold">С → Праворуч</text>
            <path d="M450,270 L320,270 Q250,270 230,320 L230,450" stroke="#2196F3" strokeWidth="2" strokeDasharray="5,5" fill="none" />
          </g>
          {/* Захід - прямо */}
          <g>
            <text x="30" y="200" textAnchor="start" fontSize="12" fill="#333" fontWeight="bold">З → Прямо</text>
            <line x1="50" y1="230" x2="450" y2="230" stroke="#FF9800" strokeWidth="2" strokeDasharray="5,5" />
          </g>
          
          {/* Текстові пояснення руху по правій стороні */}
          <text x="180" y="215" fontSize="12" fill="#333" fontWeight="bold">Права смуга для руху на схід →</text>
          <text x="180" y="295" fontSize="12" fill="#333" fontWeight="bold">← Права смуга для руху на захід</text>
          <text x="215" y="180" fontSize="12" fill="#333" fontWeight="bold" transform="rotate(-90,215,180)">Права смуга для руху на південь ↓</text>
          <text x="285" y="180" fontSize="12" fill="#333" fontWeight="bold" transform="rotate(-90,285,180)">↑ Права смуга для руху на північ</text>
          
          {/* Додаткова розмітка для наочності правостороннього руху */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
            refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="yellow" />
            </marker>
          </defs>
          <path d="M230,180 L230,200" stroke="yellow" strokeWidth="4" markerEnd="url(#arrowhead)" />
          <path d="M270,300 L270,320" stroke="yellow" strokeWidth="4" markerEnd="url(#arrowhead)" />
          <path d="M300,230 L320,230" stroke="yellow" strokeWidth="4" markerEnd="url(#arrowhead)" />
          <path d="M200,270 L180,270" stroke="yellow" strokeWidth="4" markerEnd="url(#arrowhead)" />
          
          {/* Автомобілі */}
          {cars.map((car) => (
            <g key={car.id} transform={`translate(${car.x}, ${car.y}) rotate(${getCarRotation(car)})`}>
              {/* Корпус автомобіля */}
              <rect
                x="-15"
                y="-10"
                width="30"
                height="20"
                rx="5"
                ry="5"
                fill={car.color}
                stroke={car.waiting ? 'red' : 'black'}
                strokeWidth={car.waiting ? "2" : "1"}
              />
              {/* Мітка автомобіля */}
              <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                {car.label}
              </text>
              {/* Індикатор напрямку (фари) */}
              <rect
                x="10"
                y="-8"
                width="5"
                height="5"
                fill="yellow"
              />
              <rect
                x="10"
                y="3"
                width="5"
                height="5"
                fill="yellow"
              />
              {/* Індикатор очікування */}
              {car.waiting && (
                <g>
                  <circle cx="0" cy="-20" r="8" fill="red" />
                  <text x="0" y="-16" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">!</text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>
      
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={resetSimulation}>
          Скинути симуляцію
        </button>
      </div>
      
      <div style={styles.infoPanel}>
        <h3 style={styles.infoPanelTitle}>Правила дорожнього руху:</h3>
        <ul style={styles.infoPanelList}>
          <li>Горизонтальна дорога є <strong>головною</strong> (позначена жовтими ромбоподібними знаками)</li>
          <li>Вертикальна дорога є <strong>другорядною</strong> (позначена знаками "Уступіть дорогу")</li>
          <li>Автомобілі на головній дорозі <strong>завжди мають пріоритет</strong> перед автомобілями з другорядних доріг</li>
          <li>За правилами ДР, <strong>автомобіль, що повертає праворуч, повинен пропустити автомобіль, що їде прямо</strong> (синя машина пропускає оранжеву)</li>
          <li>За правилами ДР, <strong>автомобіль, що повертає ліворуч, повинен пропустити автомобіль, що їде прямо</strong> (фіолетова машина пропускає зелену)</li>
          <li>Автомобілі на другорядних дорогах повинні <strong>чекати, доки головна дорога не буде вільною</strong></li>
          <li><strong>Правосторонній рух</strong> - всі автомобілі рухаються по <strong>правій смузі</strong> своєї дороги:</li>
          <ul>
            <li>Для руху на північ - права смуга з координатою x=270</li>
            <li>Для руху на південь - права смуга з координатою x=230</li>
            <li>Для руху на схід - права смуга з координатою y=270</li>
            <li>Для руху на захід - права смуга з координатою y=230</li>
          </ul>
          <li>Східний автомобіль (С) <strong>повертає праворуч</strong> з головної дороги</li>
          <li>Південний автомобіль (Пд) <strong>повертає ліворуч</strong> з другорядної дороги</li>
          <li>При поворотах автомобілі завжди починають рух з <strong>правої смуги</strong> своєї дороги і закінчують на <strong>правій смузі</strong> дороги призначення</li>
        </ul>
      </div>
    </div>
  );
};

export default IntersectionSimulation;