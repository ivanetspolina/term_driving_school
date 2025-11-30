import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import TestStat from "../components/test-stat/TestStat.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { useEffect, useState } from "react";
import { apiRequest, apiUrl } from "../utils/api";

export default function Statistics() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { setAlert } = useUI();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setAlert("Авторизуйтесь!", "error");
      navigate("/");
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    async function fetchTableData() {
      try {
        const res = await apiRequest(apiUrl.testAnalytics, "GET");
        if (Array.isArray(res)) {
          console.log("Аналітика з бекенду:", res);
          setTableData(res);
        }
      } catch (err) {
        console.error("Помилка завантаження аналітики:", err);
      }
    }
    fetchTableData();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="statistics-main center-main pb-[100px]">
        <div className="statistics-title text-title">
          <h1>Статистика</h1>
        </div>

        <TestStat />

        <h2 className="text-xl font-bold mt-10 mb-4">
          Середній час відповіді (сек) по темах
        </h2>
        <div className="overflow-x-auto shadow rounded-2xl">
          <table className="min-w-full border-collapse text-center">
            <thead>
              <tr className="bg-purple-700 text-white">
                <th className="p-3 text-left">Тема тесту</th>
                <th className="p-3">Має права</th>
                <th className="p-3">Навчається</th>
                <th className="p-3">Не має прав</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-purple-50"}
                >
                  <td className="p-3 text-left font-medium">{row.topicName}</td>
                  <td className="p-3">
                    <span className="px-3 py-1 rounded-full bg-green-500 text-white text-sm">
                      {row.yes != null ? row.yes.toFixed(1) : "~"}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-3 py-1 rounded-full bg-yellow-500 text-white text-sm">
                      {row.learning != null ? row.learning.toFixed(1) : "~"}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-3 py-1 rounded-full bg-red-500 text-white text-sm">
                      {row.no != null ? row.no.toFixed(1) : "~"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
