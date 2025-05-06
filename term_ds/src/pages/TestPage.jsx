import Header from "../components/Header.jsx";
import ScreenshotsSection from "../components/ScreenshotsSection.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import { NavLink } from "react-router-dom";

export default function Test() {
  return (
    <>
      <Header />
      <main className="test-main center-main">
        <div className="test-title text-title">
          <h1>Теми для тестування</h1>
        </div>

        <ScreenshotsSection />

        <ul role="list" className="test-list custom-list">
          <li>
            <div className="list-item-wrapper">
              <NavLink to="/runtest">Дорожні знаки</NavLink>
              {/*<a href="#">Дорожні знаки</a>*/}
            </div>

            <div className="list-progress-bar">
              <ProgressBar success={60} error={40} />
            </div>
          </li>

          <li>
            <div className="list-item-wrapper">
              <a href="#">Кругове перехрестя</a>
            </div>

            <div className="list-progress-bar">
              <ProgressBar success={50} error={50} />
            </div>
          </li>

          <li>
            <div className="list-item-wrapper">
              <a href="#">Перехрестя</a>
            </div>

            <div className="list-progress-bar">
              <ProgressBar success={78} error={22} />
            </div>
          </li>
        </ul>
      </main>
    </>
  );
}
