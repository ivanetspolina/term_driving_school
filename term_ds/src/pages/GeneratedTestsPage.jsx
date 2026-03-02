import Header from "../components/Header.jsx";
import ProgressBar from "../components/test/ProgressBar.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { useEffect, useState } from "react";
import { apiRequest, apiUrl } from "../utils/api";

export default function GeneratedTests() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { setAlert } = useUI();
  const [generatedTests, setGeneratedTests] = useState([]);
  const [isLoadingTests, setIsLoadingTests] = useState(false);

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
        console.log("Запит на отримання згенерованих тестів...");
        const result = await apiRequest(apiUrl.generatedTests, "GET", null);
        console.log("Отримано відповідь:", result);
        
        if (Array.isArray(result)) {
          console.log(`Знайдено ${result.length} згенерованих тестів`);
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
      const result = await apiRequest(`${apiUrl.tests}/generate`, "POST", null);
      if (result && result.test) {
        setAlert("Новий тест успішно згенеровано!", "success");
        // Оновлюємо список тестів
        const updatedTests = await apiRequest(apiUrl.generatedTests, "GET", null);
        if (Array.isArray(updatedTests)) {
          setGeneratedTests(updatedTests);
        }
      } else {
        setAlert(result?.error || "Не вдалося згенерувати тест", "error");
      }
    } catch (error) {
      console.error("Помилка при генерації тесту:", error);
      setAlert("Помилка при генерації тесту", "error");
    } finally {
      setIsLoadingTests(false);
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
              onClick={handleGenerateNewTest}
              disabled={isLoadingTests}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-[manrope] text-lg font-medium"
            >
              {isLoadingTests ? "Генерація..." : "Згенерувати новий тест"}
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
              onClick={handleGenerateNewTest}
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
                  <div className="list-item-wrapper">
                    <NavLink to={`/runtest/${test._id}`}>
                      {test.name}
                      {test.isGenerated && (
                        <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          Згенеровано
                        </span>
                      )}
                    </NavLink>
                  </div>

                  <div className="list-progress-bar">
                    <ProgressBar success={test.success || 0} error={test.error || 0} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
