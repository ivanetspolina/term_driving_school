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
              <a
                href="https://green-way.com.ua/uk/dovidniki/pdr-slider/rozdil-1/punkt-1"
                target="_blank"
                rel="noopener noreferrer"
                className="list-item-wrapper"
              >
                Загальні положення
              </a>
          </li>

          <li>
              <a
                href="https://green-way.com.ua/uk/dovidniki/pdr-slider/rozdil-8/punkt-4_a"
                target="_blank"
                rel="noopener noreferrer"
                className="list-item-wrapper"
              >
                Регулювання дорожнього руху
              </a>
          </li>

          <li className="list-item-wrapper">
              <a
                href="https://green-way.com.ua/uk/dovidniki/pdr-slider/rozdil-16/punkt-1"
                target="_blank"
                rel="noopener noreferrer"
                className="list-item-wrapper"
              >
                Проїзд перехресть
              </a>
          </li>

          <li>
              <a
                href="https://green-way.com.ua/uk/dovidniki/pdr-slider/rozdil-35/punkt-1_daty-dorogu"
                target="_blank"
                rel="noopener noreferrer"
                className="list-item-wrapper"
              >
                Знаки пріоритету
              </a>
          </li>

          <li>
              <a
                href="https://green-way.com.ua/uk/dovidniki/pdr-slider/rozdil-42/punkt-opis-gorizontalnoi-rozmitki-1"
                target="_blank"
                rel="noopener noreferrer"
                className="list-item-wrapper"
              >
                Дорожня розмітка
              </a>
          </li>
        </ul>
      </main>
    </>
  );
}
