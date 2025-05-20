import Header from "../components/Header.jsx";
import ProgressBar from "../components/test/ProgressBar.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { useEffect, useState } from "react";
import { apiRequest, apiUrl } from "../utils/api";

export default function Test() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { setAlert } = useUI();
  const [tests, setTests] = useState([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setAlert("Авторизуйтесь!", "error");
      navigate("/");
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    const fetchTests = async () => {
      const result = await apiRequest(apiUrl.tests, "GET", null);
      if (Array.isArray(result)) {
        setTests(result);
      } else {
        console.error("❌ Помилка при завантаженні тестів:", result?.error || result);
      }
    };

    fetchTests();
  }, []);

  return (
    <>
      <Header />
      <main className="test-main center-main">
        <div className="test-title text-title">
          <h1>Теми для тестування</h1>
        </div>

        <ul role="list" className="test-list custom-list">
          {tests.map((test) => (
            <li key={test._id}>
              <div className="list-item-wrapper">
                <NavLink to={`/runtest/${test._id}`}>{test.name}</NavLink>
              </div>

              <div className="list-progress-bar">
                <ProgressBar success={20} error={80} /> {/* Статистику додамо пізніше */}
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
