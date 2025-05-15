import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { apiRequest, apiUrl } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import sprite from "../assets/svg/sprite.svg";
import { emailReg } from "../utils/emails";

export default function Activate() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { setAlert } = useUI();
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState(false);

  if (isAuthenticated) {
    setAlert('Ви вже авторизовані!', 'warning');
    return navigate("/");
  }

  const { token } = useParams();
  const [status, setStatus] = useState(token ? "loading" : "info");

  useEffect(() => {
    if (!token ) {
      setStatus("info");
      return;
    }  

    const activateUser = async () => {
      const result = await apiRequest(apiUrl.activate, "POST", { token });
      if (result?.message) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    };

     activateUser();

    if (!apiUrl.activate) {
      setStatus("error");
      return;
    }
  }, [token]);

  const handleResendEmail = async () => {
    if (!email) {
      setAlert("Введіть електронну адресу", "error");
      return;
    }

    setIsResending(true);
    setResendError(false);
    setResendSuccess(false);

    try {
      // Запит на отримання нового токена
      const result = await apiRequest("/auth/resend_activation", "POST", { email });
      
      if (result?.activationToken) {
        // Якщо отримали новий токен, відправляємо лист
        const emailData = {
          to: email,
          subject: "Активація профілю",
          message: emailReg(result.activationToken),
        };

        await apiRequest(apiUrl.emailSend, "POST", emailData, false);
        setResendSuccess(true);
        setAlert("Лист з активацією надіслано на вашу пошту", "success");
      } else {
        setResendError(true);
        setAlert(result?.error || "Не вдалося надіслати лист з активацією", "error");
      }
    } catch (error) {
      setResendError(true);
      setAlert("Помилка сервера. Спробуйте пізніше", "error");
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-purple-700 rounded-full animate-spin mb-6"></div>
          <p className="text-xl text-gray-700">Активація вашого профілю...</p>
        </div>
      );
    }

    if (status === "info") {
      return (
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-6">
            <svg className="activate-icon h-12 w-12 text-yellow-600">
              <use href={`${sprite}#icon-activate-warning`}></use>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Завершіть реєстрацію
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-center">
            Перевірте вашу пошту та натисніть на посилання для активації
            акаунту.
          </p>

          <div className="w-full mb-6 flex flex-col items-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Надіслати лист повторно
            </h3>
            <div className="flex flex-col space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ваша електронна пошта"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isResending}
              />
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className={`w-full px-4 py-2 text-white font-medium rounded-lg shadow-md transition-colors duration-300 
                  ${isResending ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}`}
              >
                {isResending ? "Надсилання..." : "Надіслати лист повторно"}
              </button>
            </div>

            {resendSuccess && (
              <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
                Лист з активацією успішно надіслано. Перевірте вашу пошту.
              </div>
            )}

            {resendError && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                Не вдалося надіслати лист. Перевірте електронну адресу або
                спробуйте пізніше.
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300"
          >
            На головну
          </button>
        </div>
      );
    }
    if (status === "success") {
      return (
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg className="activate-icon h-12 w-12 text-green-600">
              <use href={`${sprite}#icon-activate-success`}></use>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Ваш профіль активовано</h1>
          <p className="text-xl text-gray-600 mb-8">Тепер ви можете увійти до системи.</p>
          <button 
            onClick={() => navigate("/auth")} 
            className="px-8 py-3 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300"
          >
            Увійти
          </button>
        </div>
      );
    }

    if (status === "error") {
      return (
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <svg className="activate-icon h-12 w-12 text-red-600">
              <use href={`${sprite}#icon-activate-error`}></use>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Невдала активація</h1>
          <p className="text-xl text-gray-600 mb-8 text-center">Можливо, токен недійсний або вже використано.</p>
          
          <div className="w-full mb-6 flex flex-col items-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Надіслати лист повторно</h3>
            <div className="flex flex-col space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ваша електронна пошта"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isResending}
              />
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className={`w-full px-4 py-2 text-white font-medium rounded-lg shadow-md transition-colors duration-300 
                  ${isResending ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                {isResending ? "Надсилання..." : "Надіслати лист повторно"}
              </button>
            </div>
            
            {resendSuccess && (
              <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
                Лист з активацією успішно надіслано. Перевірте вашу пошту.
              </div>
            )}
            
            {resendError && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                Не вдалося надіслати лист. Перевірте електронну адресу або спробуйте пізніше.
              </div>
            )}
          </div>
          
          <button 
            onClick={() => navigate("/")} 
            className="px-8 py-3 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300"
          >
            Повернутись на головну
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-16 font-[Inter] flex items-center justify-center">
        <div className="w-full max-w-4xl ">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Активація облікового запису</h2>
            <p className="text-xl text-gray-600">Перевіряємо активацію акаунту</p>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
