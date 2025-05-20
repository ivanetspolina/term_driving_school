import { useRef, useEffect } from "react";

export default function CanvasIntersection() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    // Початкова позиція машини (в'їзд знизу)
    let car = {
      x: 185,
      y: 400,
      width: 30,
      height: 50,
      direction: ["straight", "left", "right"][Math.floor(Math.random() * 3)],
      angle: 0,
      step: 0,
    };

    function drawRoad() {
      ctx.fillStyle = "#ccc";
      ctx.fillRect(150, 0, 100, 400); // вертикальна дорога
      ctx.fillRect(0, 150, 400, 100); // горизонтальна дорога
    }

    function drawCar() {
      ctx.save();
      ctx.translate(car.x + car.width / 2, car.y + car.height / 2);
      ctx.rotate(car.angle);
      ctx.fillStyle = "red";
      ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
      ctx.restore();
    }

    function updateCar() {
      if (car.direction === "straight") {
        car.y -= 2;
      } else if (car.direction === "left") {
        if (car.step < 25) {
          car.y -= 2;
        } else if (car.step < 50) {
          car.angle -= Math.PI / 100;
          car.x -= 2;
          car.y -= 1;
        } else {
          car.x -= 2;
        }
        car.step++;
      } else if (car.direction === "right") {
        if (car.step < 25) {
          car.y -= 2;
        } else if (car.step < 50) {
          car.angle += Math.PI / 100;
          car.x += 2;
          car.y -= 1;
        } else {
          car.x += 2;
        }
        car.step++;
      }
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawRoad();
      updateCar();
      drawCar();
      requestAnimationFrame(loop);
    }

    loop();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        border: "2px solid #000",
        display: "block",
        margin: "0 auto",
        background: "#e0e0e0",
      }}
    />
  );
}
