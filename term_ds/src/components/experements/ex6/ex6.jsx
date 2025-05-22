import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import {
  calculateCarOrder,
  isPathAllowed,
  updateGridWithCar,
  findCarAt,
} from "./helpers";

export default function MultiCarSimulation() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionData, setQuestionData] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState([]);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    fetch(`/questions/q${currentQuestionIndex + 1}.json`)
      .then((res) => res.json())
      .then((data) => {
        setQuestionData({
          ...data,
          conditions: data.conditions || {}, // Підстраховка
        });
        setCurrentAnswer([]);
        setQuestionAnswered(false);
      })
      .catch(() => toast.error("❌ Не вдалося завантажити питання"));
  }, [currentQuestionIndex]);

  const carMoveOrder = useMemo(() => {
    return questionData ? calculateCarOrder(questionData) : [];    
  }, [questionData]);
  

  if (!questionData) return <div>Завантаження...</div>;

  const moveCar = (carId) => {
    const car = questionData.cars.find((c) => c.id === carId);
    if (!car || car.finished) return;

    const { allowed } = isPathAllowed(questionData.conditions, car.path);
    if (!allowed) return;

    car.path.forEach(([row, col], i) => {
      setTimeout(() => {
        setQuestionData((prev) => {
          if (!prev) return prev;

          const updatedCars = prev.cars.map((c) => {
            if (c.id !== carId) return c;

            const updatedGrid = updateGridWithCar(prev.grid, c.position, [row, col], c.color);

            const updatedCar = { ...c, position: [row, col] };
            if (i === car.path.length - 1) updatedCar.finished = true;

            return updatedCar;
          });

          const updatedGrid = updateGridWithCar(prev.grid, car.position, [row, col], car.color);

          return {
            ...prev,
            cars: updatedCars,
            grid: updatedGrid || prev.grid,
          };
        });
      }, i * 200);
    });
  };

  const handleCarClick = (carId) => {
    if (questionAnswered || currentAnswer.includes(carId)) return;

    const newAnswer = [...currentAnswer, carId];
    setCurrentAnswer(newAnswer);
    moveCar(carId);

    if (newAnswer.length === carMoveOrder.length) {
      const isCorrect = newAnswer.every((id, i) => id === carMoveOrder[i]);

      setUserAnswers((prev) => [
        ...prev,
        {
          question: currentQuestionIndex,
          userOrder: newAnswer,
          correct: isCorrect,
        },
      ]);

      toast[isCorrect ? "success" : "error"](
        isCorrect
          ? "✅ Правильна послідовність!"
          : "❌ Неправильна послідовність!"
      );

      setQuestionAnswered(true);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 2000);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-center mb-4">
        Питання #{currentQuestionIndex + 1}
      </h2>
      <div className="grid grid-cols-8 gap-0 w-fit mx-auto">
        {questionData.grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const car = findCarAt(questionData.cars, rowIndex, colIndex);
            const condition = questionData.conditions[`${rowIndex},${colIndex}`];
            let cellClass =
              "w-12 h-12 flex items-center justify-center border border-gray-300 ";
            if (car)
              cellClass += car.color === "red" ? "bg-red-500" : "bg-blue-500";
            else if (cell === 0) cellClass += "bg-green-100";
            else if (cell === 1) cellClass += "bg-gray-400";

            return (
              <div
                key={`${rowIndex},${colIndex}`}
                className={cellClass + (car ? " cursor-pointer" : "")}
                onClick={() => car && handleCarClick(car.id)}
              >
                {car?.icon}
                {condition?.name === "red" && (
                  <div className={`custom-rule ${condition.cssClass} custom-rule-red`}></div>
                )}
                {condition?.name === "green" && (
                  <div className={`custom-rule ${condition.cssClass} custom-rule-green`}></div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
