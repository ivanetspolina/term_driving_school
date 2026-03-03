import Header from "../components/Header.jsx";
import ProgressBar from "../components/test/ProgressBar.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { useEffect, useState } from "react";
import { apiRequest, apiUrl } from "../utils/api";
import { Trash2 } from "lucide-react";

export default function GeneratedTests() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { setAlert } = useUI();
  const [generatedTests, setGeneratedTests] = useState([]);
  const [isLoadingTests, setIsLoadingTests] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roadType, setRoadType] = useState("regular");
  const [signsType, setSignsType] = useState("lights");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setAlert("Авторизуйтесь!", "error");
      navigate("/");
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    const fetchGeneratedTests = async () => {
      setIsLoadingTests(true);
      try {
        console.log("Запит на отримання згенерованих тестів поточного користувача...");
        const result = await apiRequest(apiUrl.generatedTests, "GET", null);
        console.log("Отримано відповідь:", result);
        
        if (Array.isArray(result)) {
          console.log(`Знайдено ${result.length} згенерованих тестів користувача`);
          setGeneratedTests(result);
        } else {
          console.error("Помилка при завантаженні згенерованих тестів:", result?.error || result);
          setAlert("Не вдалося завантажити згенеровані тести", "error");
        }
      } catch (error) {
        console.error("Помилка при завантаженні згенерованих тестів:", error);
        setAlert(`Помилка при завантаженні згенерованих тестів: ${error.message}`, "error");
      } finally {
        setIsLoadingTests(false);
      }
    };

    if (isAuthenticated) {
      fetchGeneratedTests();
    }
  }, [isAuthenticated]);

  const handleGenerateNewTest = async () => {
    setIsLoadingTests(true);
    try {
      const result = await apiRequest(`${apiUrl.tests}/generate`, "POST", {
        roadType,
        topicType: signsType,
      });
      if (result && result.test) {
        setAlert("Новий тест успішно згенеровано!", "success");
        setGeneratedTests((prev) => [
          { ...result.test, success: 0, error: 0 },
          ...prev,
        ]);
      } else {
        setAlert(result?.error || "Не вдалося згенерувати тест", "error");
      }
    } catch (error) {
      console.error("Помилка при генерації тесту:", error);
      setAlert("Помилка при генерації тесту", "error");
    } finally {
      setIsLoadingTests(false);
      setIsModalOpen(false);
    }
  };

  const handleDeleteTest = async (testId) => {
    try {
      const result = await apiRequest(`${apiUrl.tests}/${testId}`, "DELETE", null);

      if (result && !result.error) {
        setGeneratedTests((prev) => prev.filter((t) => t._id !== testId));
        setAlert("Тест успішно видалено", "success");
      } else {
        setAlert(result?.error || "Не вдалося видалити тест", "error");
      }
    } catch (error) {
      console.error("Помилка при видаленні тесту:", error);
      setAlert("Помилка при видаленні тесту", "error");
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="test-main center-main">
        <div className="test-title text-title">
          <div className="flex justify-between items-center mb-4">
            <h1>Згенеровані тести</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isLoadingTests}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-[manrope] text-lg font-medium"
            >
              Згенерувати новий тест
            </button>
          </div>
          <p className="text-gray-600 text-lg mt-2">
            Тут відображаються динамічно згенеровані тести. Ви можете створити новий тест натиснувши кнопку вище.
          </p>
        </div>

        {isLoadingTests && generatedTests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Завантаження згенерованих тестів...</p>
          </div>
        ) : generatedTests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Поки що немає згенерованих тестів</p>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isLoadingTests}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-[manrope] text-lg font-medium"
            >
              Згенерувати перший тест
            </button>
          </div>
        ) : (
          <ul role="list" className="test-list custom-list">
            {generatedTests.map((test) => {
              return (
                <li key={test._id}>
                  <div className="list-item-wrapper flex items-center justify-between gap-4">
                    <NavLink to={`/runtest/${test._id}`} className="flex-1">
                      {test.name}
                      {test.isGenerated && (
                        <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          Згенеровано
                        </span>
                      )}
                    </NavLink>
                    <div className="list-progress-bar">
                      <ProgressBar success={test.success || 0} error={test.error || 0} />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteTest(test._id)}
                      className="ml-2 inline-flex items-center justify-center rounded-full p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      aria-label="Видалити тест"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>                  
                </li>
              );
            })}
          </ul>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-semibold mb-4 font-[manrope]">
                Налаштування генерації тесту
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тип перехрестя
                  </label>
                  <select
                    value={roadType}
                    onChange={(e) => setRoadType(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="regular">Звичайне перехрестя</option>
                    <option value="t_cross">Т-подібне перехрестя</option>
                    <option value="round">Кругове перехрестя</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тип знаків
                  </label>
                  <select
                    value={signsType}
                    onChange={(e) => setSignsType(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="lights">Лише світлофори</option>
                    <option value="signs">Лише дорожні знаки</option>
                    <option value="both">Світлофори та дорожні знаки</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoadingTests}
                >
                  Скасувати
                </button>
                <button
                  type="button"
                  onClick={handleGenerateNewTest}
                  disabled={isLoadingTests}
                  className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingTests ? "Генерація..." : "Згенерувати"}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </>
  );
}
