import { useState } from "react";
import useRandomBackground from "../scripts/useRandomBackground.js";

export default function StartSection() {
  const [started, setStarted] = useState(false);
  const bg = useRandomBackground();

  if (!started) {
    return (
      <div className="row-start-2 col-start-1 flex bg-white justify-center items-center">
        <button
          onClick={() => setStarted(true)}
          className="px-6 py-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        >
          Старт
        </button>
      </div>
    );
  }

  return (
    <section
      className="row-start-2 col-start-1 p-4 rounded-[20px] bg-white relative overflow-hidden"
      style={{
        backgroundImage: bg ? `url(${bg})` : undefined,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    ></section>
  );
}
