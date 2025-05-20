import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FinishedSection() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/result_test"); // або `/result/${id}` якщо результат залежить від тесту
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="text-center text-xl font-semibold p-8">
      Обробка результатів...
    </div>
  );
}