// Компонент початкового екрану з кнопкою "Старт", що використовується перед запуском тесту або симуляції
export default function StartSection({ handleStart }) {
  return (
    <div className="row-start-2 h-full min-h-[591px] col-start-1 flex bg-white justify-center items-center rounded-[20px]">
      <button
        onClick={handleStart}
        className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg hover:ring-2 hover:ring-purple-300 transition"
      >
        Старт
      </button>
    </div>
  );
  
}
