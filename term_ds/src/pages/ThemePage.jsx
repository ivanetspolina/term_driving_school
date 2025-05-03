import Header from "../components/Header.jsx";

export default function Theme() {
  return (
    <>
      <Header />
      <main className="theme-main center-main">
        <div className="theme-title text-title">
          <h1>Теми для вивчення</h1>
        </div>
        <ul role="list" className="theme-list custom-list ">
          <li>
            <div className="list-item-wrapper">
              <a href="#">Дорожні знаки</a>
            </div>
          </li>

          <li>
            <div className="list-item-wrapper">
              <a href="#">Кругове перехрестя</a>
            </div>
          </li>

          <li>
            <div className="list-item-wrapper">
              <a href="#">Перехрестя</a>
            </div>
          </li>
        </ul>
      </main>
    </>
  );
}
