import useRandomBackground from "../../scripts/useRandomBackground.js";
import { initialGrid } from "../experements/ex6/data1.js";

export default function RuningSection() {
  const bg = useRandomBackground();
  const totalCells = initialGrid.length * initialGrid[0].length;
  const rows = initialGrid.length;
  const cols = initialGrid[0].length;

  return (
    <section
      className="runing-section block h-full min-h-[591px] row-start-2 col-start-1 p-4 rounded-[20px] bg-white relative overflow-hidden rounded-[20px]"
      style={{
        // backgroundImage: bg ? `url(${bg})` : undefined,
        // backgroundPosition: "center",
        // backgroundSize: "cover",
        // backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        height: "100%", 
      }}
    >
      
      <div
        className="w-full h-full grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          width: "100%",
          height: "100%",
        }}
      >
        {initialGrid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="w-10 h-10 border border-gray-400 flex items-center justify-center text-sm text-gray-600"
              style={{ width: "100%", height: "100%" }}
            >
              {cell}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
