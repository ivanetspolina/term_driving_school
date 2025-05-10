import Header from "../components/Header";
import IndexFooter from "../components/index/Footer";
import { useAuth } from "../context/AuthContext";

export default function Index() {

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="index-main flex-grow center-main">
          {/* Hero Section */}
          <section className="text-title text-purple-900">
            {/*<div className="container mx-auto px-4">*/}
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">
                Опануйте правила дорожнього руху в інтерактивному форматі!
              </h1>
            </div>
            {/*</div>*/}
          </section>

          {/* Main Content */}
          <section className="text py-6">
            <div className="container mx-auto max-w-4xl">
              {/*<div className="bg-white rounded-lg shadow-lg p-6">*/}
              <div className="rounded-lg shadow-lg p-6">
                <h2 className="text-3xl font-bold font-[Montserrat] text-center text-purple-950 mb-6">
                  Ласкаво просимо до застосунку!
                </h2>

                <p className="mb-6 text-lg">
                  Додаток забезпечує сучасний підхід до вивчення правил
                  дорожнього руху, який перетворює складний теоретичний матеріал
                  на інтерактивний та захопливий процес навчання.
                </p>

                <h3 className="text-2xl font-bold text-purple-950 mb-4">
                  Чому саме наш сервіс?
                </h3>
                <p className="mb-6">
                  Створено платформу, яка не лише допоможе вам вивчити правила
                  дорожнього руху, але й підготує до реальних ситуацій на
                  дорозі. Замість того, щоб просто запам'ятовувати текст із
                  підручника, ви взаємодієте з інтерактивними елементами,
                  приймаєте рішення та бачите наслідки своїх дій у віртуальному
                  середовищі.
                </p>

                <h3 className="text-2xl font-bold text-purple-950 mb-4">
                  Інтерактивне навчання – ключ до успіху
                </h3>
                <p className="mb-4">
                  Традиційні методи вивчення ПДР часто бувають нудними та
                  малоефективними. Наш підхід базується на принципах
                  інтерактивного навчання, де ви не просто читаєте про правила,
                  а застосовуєте їх на практиці:
                </p>
                <ul className="list-disc pl-8 mb-6">
                  <li className="mb-2">
                    <span className="font-semibold">Візуалізація ситуацій</span>{" "}
                    – бачте та взаємодійте з реалістичними дорожніми сценаріями
                  </li>
                  <li className="mb-2">
                    <span className="font-semibold">Активна участь</span> –
                    керуйте віртуальними автомобілями, регулюйте рух, приймайте
                    рішення як справжній водій
                  </li>
                </ul>

                <h3 className="text-2xl font-bold text-purple-950 mb-4">
                  Персоналізоване навчання
                </h3>
                <p className="mb-4">
                  Ми розуміємо, що кожен засвоює матеріал у своєму темпі, тому
                  наша система адаптується під ваші потреби:
                </p>
                <ul className="list-disc pl-8 mb-6">
                  <li className="mb-2">
                    Відстежуйте свій прогрес у особистому кабінеті
                  </li>
                  <li className="mb-2">
                    Аналізуйте статистику правильних та неправильних відповідей
                  </li>
                  <li className="mb-2">
                    Концентруйтеся на темах, які викликають найбільше труднощів
                  </li>
                </ul>

                <h3 className="text-2xl font-bold text-purple-950 mb-4">
                  Повна підготовка до іспиту
                </h3>
                <p className=" mb-4">
                  Наш застосунок охоплює всі аспекти теоретичного іспиту з ПДР:
                </p>
                <ul className="list-disc pl-8 mb-6">
                  <li className="mb-2">Дорожні знаки та розмітка</li>
                  <li className="mb-2">
                    Правила проїзду перехресть та регульованих ділянок
                  </li>
                  <li className="mb-2">Маневрування та обгін</li>
                  <li className="mb-2">Проїзд особливих ділянок дороги</li>
                  <li className="mb-2">
                    Надання першої допомоги та технічні аспекти
                  </li>
                </ul>

                <h3 className="text-2xl font-bold text-purple-950 mb-4">
                  Як це працює?
                </h3>
                <ol className="list-decimal pl-8 mb-6">
                  <li className="mb-2">
                    <span className="font-semibold">Реєструйтеся</span> –
                    створіть персональний обліковий запис для збереження вашого
                    прогресу
                  </li>
                  <li className="mb-2">
                    <span className="font-semibold">Обирайте тему</span> –
                    почніть з базових тем або одразу перейдіть до складних
                    розділів
                  </li>
                  <li className="mb-2">
                    <span className="font-semibold">Проходьте тести</span> –
                    вирішуйте інтерактивні завдання з можливістю взаємодії з
                    елементами
                  </li>
                  <li className="mb-2">
                    <span className="font-semibold">Аналізуйте результати</span>{" "}
                    – отримуйте детальну інформацію про свої відповіді
                  </li>
                  <li className="mb-2">
                    <span className="font-semibold">Вдосконалюйтеся</span> –
                    повторюйте складні теми до повного засвоєння матеріалу
                  </li>
                </ol>

                <h3 className="text-2xl font-bold text-purple-950 mb-4">
                  Готуйтеся до іспиту з упевненістю
                </h3>

                <div className="bg-purple-50 border-l-4 border-purple-800 p-6 rounded mb-6">
                  <h4 className="text-xl font-bold text-purple-950 mb-2">
                    Почніть зараз і забудьте про хвилювання перед іспитом!
                  </h4>
                  <p>
                    Зареєструйтеся, пройдіть перший тест та переконайтеся, що
                    вивчення правил дорожнього руху може бути не лише корисним,
                    але й цікавим процесом. Наша мета – не просто допомогти
                    скласти іспит, а виховати відповідального та підготовленого
                    учасника дорожнього руху.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Content */}
          <section className="text pb-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-lg shadow-lg p-6">
                <div className="container mx-auto px-4">
                  <h2 className="text-3xl font-bold text-center text-purple-950 mb-12">
                    Наші переваги
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-purple-950 mb-2">
                        Інтерактивне навчання
                      </h3>
                      <p>
                        Взаємодійте з віртуальними ситуаціями та елементами
                        дорожнього руху
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-purple-950 mb-2">
                        Детальна статистика
                      </h3>
                      <p>
                        Відстежуйте свій прогрес та аналізуйте результати
                        тестування
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-purple-950 mb-2">
                        Актуальні матеріали
                      </h3>
                      <p>Навчайтесь за найновішими правилами дорожнього руху</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <IndexFooter />
      </div>
    </>
  );
}
