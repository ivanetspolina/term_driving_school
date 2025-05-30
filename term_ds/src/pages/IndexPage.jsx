import Header from "../components/Header";
import IndexFooter from "../components/index/Footer";
import sprite from "../assets/svg/sprite.svg";

export default function Index() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="index-main flex-grow center-main">
          <section className="text-title text-purple-900">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">
                Опануйте правила дорожнього руху в інтерактивному форматі!
              </h1>
            </div>
          </section>

          <section className="text py-6">
            <div className="container mx-auto max-w-4xl">
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
                  Чому саме цей сервіс?
                </h3>
                <p className="mb-6">
                  Створена платформа, допоможе Вам пришвидчити вивчення правил
                  дорожнього руху. Замість того, щоб просто запам'ятовувати текст із
                  підручника, ви взаємодієте з інтерактивними елементами,
                  приймаєте рішення та бачите наслідки своїх дій у віртуальному
                  середовищі.
                </p>

                <h3 className="text-2xl font-bold text-purple-950 mb-4">
                  Інтерактивне навчання – ключ до успіху
                </h3>
                <p className="mb-4">
                  Традиційні методи вивчення ПДР часто бувають нудними та
                  малоефективними. Тут підхід базується на принципах, 
                  де ви не просто читаєте про правила,
                  а застосовуєте їх на практиці:
                </p>
                <ul className="list-disc pl-8 mb-6">
                  <li className="mb-2">
                    <span className="font-semibold">Візуалізація ситуацій</span>{" "}
                    – бачите та взаємодійте з реалістичними дорожніми сценаріями
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
                  Кожен засвоює матеріал у своєму темпі, тому
                  додаток адаптується під ваші потреби:
                </p>
                <ul className="list-disc pl-8 mb-6">
                  <li className="mb-2">
                    Відстежуйте свій прогрес у Статиститці
                  </li>
                  <li className="mb-2">
                    Концентруйтеся на темах, які викликають найбільше труднощів
                  </li>
                </ul>

                <h3 className="text-2xl font-bold text-purple-950 mb-4">
                  Повна підготовка до іспиту
                </h3>
                <p className=" mb-4">
                  Застосунок охоплює такі аспекти:
                </p>
                <ul className="list-disc pl-8 mb-6">
                  <li className="mb-2">Дорожні знаки</li>
                  <li className="mb-2">
                    Правила проїзду перехресть
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
                    – отримуйте інформацію про свої відповіді
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
                    але й цікавим процесом. Метою є не просто допомогти
                    скласти іспит, а виховати відповідального та підготовленого
                    учасника дорожнього руху.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="text pb-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-lg shadow-lg p-6">
                <div className="container mx-auto px-4">
                  <h2 className="text-3xl font-bold text-center text-purple-950 mb-12">
                    Переваги
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="index-footer-icon w-8 h-8 text-purple-600">
                          <use href={`${sprite}#icon-idea`}></use>
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
                        <svg className="index-footer-icon w-8 h-8 text-purple-600">
                          <use href={`${sprite}#icon-document`}></use>
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
                        <svg className="index-footer-icon w-8 h-8 text-purple-600">
                          <use href={`${sprite}#icon-library`}></use>
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
