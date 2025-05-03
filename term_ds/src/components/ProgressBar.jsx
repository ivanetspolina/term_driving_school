export default function ProgressBar({ success = 0, error = 0 }) {
  const total = Math.min(success + error, 100);
  const successPercent = (success / total) * 100;
  const errorPercent = (error / total) * 100;

  return (
    <div
      className="relative w-[200px] h-5 rounded-full bg-gray-200
                    overflow-hidden shadow-sm text-[12px]
                    font-semibold text-white"
    >
      {/* Success bar */}
      <div
        className="absolute top-0 left-0 h-full bg-red-400"
        style={{ width: `${successPercent}%` }}
      ></div>

      {/* Error bar - позиціонується правильно за допомогою left у style */}
      <div
        className="absolute top-0 h-full bg-green-400"
        style={{
          left: `${successPercent}%`,
          width: `${errorPercent}%`,
        }}
      ></div>

      {/* Success text */}
      <div
        className="absolute top-0 left-0 h-full flex items-center justify-center z-10"
        style={{ width: `${successPercent}%` }}
      >
        <span>{Math.round(successPercent)}%</span>
      </div>

      {/* Error text */}
      <div
        className="absolute top-0 h-full flex items-center justify-center z-10"
        style={{
          left: `${successPercent}%`,
          width: `${errorPercent}%`,
        }}
      >
        <span>{Math.round(errorPercent)}%</span>
      </div>
    </div>
  );
}
