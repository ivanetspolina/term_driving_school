import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function TestStats() {
  const testStats = {
    totalPassed: 47,
    interrupted: 5,
    passedWithoutMistakes: 19,
    passedWithTwoMistakes: 12,
    days: [...Array(30).keys()].map((d) => d + 1), // 1..30
    testsPerDay: Array.from({ length: 30 }, () =>
      Math.floor(Math.random() * 5)
    ), // випадкові значення для графіку
  };

  const chartData = {
    labels: testStats.days.map((d) => `День ${d}`),
    datasets: [
      {
        label: "Пройдені тести",
        data: testStats.testsPerDay,
        borderColor: "rgb(132, 75, 203)", // фіолетовий
        backgroundColor: "rgb(81, 3, 158)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "День",
        },
      },
      y: {
        title: {
          display: true,
          text: "Кількість пройдених тестів",
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="p-6 min-h-screen font-[Inter]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Line data={chartData} options={chartOptions} />
        </div>

        <div className="grid grid-cols-1 md:grid-rows-4 gap-6 text-base font-medium">
          <div>Загальна кількість пройдених тестів: {testStats.totalPassed}</div>
          <div>Кількість тестів з допущеними 2-ома помилками: {testStats.passedWithTwoMistakes}</div>
          <div>Кількість перерваних тестів: {testStats.interrupted}</div>
          <div>Кількість вдало пройдених тестів без жодної помилки: {testStats.passedWithoutMistakes}</div>
        </div>
      </div>
    </div>
  );
}