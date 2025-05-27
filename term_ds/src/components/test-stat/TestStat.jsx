import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { apiRequest, apiUrl } from "../../utils/api";
import { uk } from "date-fns/locale";
import {
  parseISO,
  format,
  getDaysInMonth,
  getMonth,
  getYear,
  startOfMonth,
} from "date-fns";

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
  const [results, setResults] = useState([]);
  const [monthOptions, setMonthOptions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(""); // формат: '2025-05'
  const [dailyLabels, setDailyLabels] = useState([]);
  const [dailyCounts, setDailyCounts] = useState([]);

  useEffect(() => {
  async function fetchData() {
    const data = await apiRequest(apiUrl.testResultUser, "GET");
    if (Array.isArray(data)) {
      setResults(data);

      // Визначаємо всі унікальні місяці
        const monthsSet = new Set(
          data.map((r) => format(parseISO(r.createdAt), "yyyy-MM"))
        );
        const sortedMonths = Array.from(monthsSet).sort().reverse(); // новіші зверху
        setMonthOptions(sortedMonths);

        if (!selectedMonth) {
          setSelectedMonth(sortedMonths[0]); // обираємо найсвіжіший місяць
        }
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedMonth || results.length === 0) return;

    const [yearStr, monthStr] = selectedMonth.split("-");
    const year = parseInt(yearStr);
    const month = parseInt(monthStr) - 1;

    const daysInMonth = getDaysInMonth(new Date(year, month));
    const monthDates = [...Array(daysInMonth)].map((_, i) =>
      format(new Date(year, month, i + 1), "yyyy-MM-dd")
    );

    const grouped = {};
    results.forEach((r) => {
      const date = format(parseISO(r.createdAt), "yyyy-MM-dd");
      if (date.startsWith(selectedMonth)) {
        grouped[date] = (grouped[date] || 0) + 1;
      }
    });

    const counts = monthDates.map((d) => grouped[d] || 0);

    setDailyLabels(monthDates);
    setDailyCounts(counts);
  }, [selectedMonth, results]);

  const totalPassed = results.length;
  const passedWithoutMistakes = results.filter(r => r.scoreIncorrect === 0).length;
  const passedWithTwoMistakes = results.filter(r => r.scoreIncorrect === 2).length;
  const averageTimeInSec =
  results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.time || 0), 0) / results.length)
    : 0;

const minutes = Math.floor(averageTimeInSec / 60);
const seconds = averageTimeInSec % 60;

  return (
    <div className="p-6 min-h-screen font-[Inter]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Кількість тестів по днях</h2>

        <label className="block mb-2 font-medium">Оберіть місяць:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 border rounded mb-6"
        >
          {monthOptions.map((month) => (
            <option key={month} value={month}>
              {format(parseISO(`${month}-01`), "LLLL yyyy", {
                locale: uk,
              })}
            </option>
          ))}
        </select>
        <Line
          data={{
            labels: dailyLabels,
            datasets: [
              {
                label: "Тестів у день",
                data: dailyCounts,
                borderColor: "rgb(124, 58, 237)",
                tension: 0.3,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                onClick: () => {}, 
              },
            },
            scales: {
              x: { title: { display: true, text: "Дата" } },
              y: {
                beginAtZero: true,
                title: { display: true, text: "Кількість тестів" },
                ticks: { stepSize: 1 },
              },
            },
          }}
        />

        <div className="grid grid-cols-1 md:grid-rows-4 gap-6 text-base font-medium">
          <div>Загальна кількість пройдених тестів: {totalPassed}</div>
          <div>
            Кількість тестів з допущеними 2-ома помилками:{" "}
            {passedWithTwoMistakes}
          </div>
          <div>
            Кількість вдало пройдених тестів без жодної помилки:{" "}
            {passedWithoutMistakes}
          </div>
          <div>Середній час проходження тесту: {minutes} хв {seconds} сек</div>
        </div>
      </div>
    </div>
  );
}