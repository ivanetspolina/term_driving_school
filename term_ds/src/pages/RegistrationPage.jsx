import AuthHeader from "../components/auth/AuthHeader";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { Formik, Form } from "formik";
import { Eye, EyeOff } from "lucide-react";
import * as Yup from "yup";
import { apiRequest, apiUrl } from "../utils/api";
import { emailReg } from "../utils/emails";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { useState } from "react";


export default function Registration() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth()
  const { setAlert } = useUI()
  const [showPassword, setShowPassword] = useState(false);

  
  if (isAuthenticated) {
    setAlert('Ви вже авторизовані!', 'warning');
    return navigate("/");
  }

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Ім'я повинно містити принаймні 2 символи")
      .required("Ім'я обов'язкове"),
    email: Yup.string()
      .email("Невірний формат пошти")
      .required("Пошта обов'язкова"),
    password: Yup.string()
      .min(6, "Пароль повинен містити принаймні 6 символів")
      .matches(/[A-Z]/, "Пароль повинен містити хоча б одну велику літеру")
      .matches(/^[A-Za-z0-9]*$/, "Пароль повинен містити лише латинські літери та цифри")
      .matches(/[0-9]/, "Пароль повинен містити хоча б одну цифру")
      .required("Пароль обов'язковий"),
  });

  const handleRegister = async (values, { setSubmitting }) => {
    // Відправляємо дані форми до API
    const result = await apiRequest(apiUrl.reg, "POST", values);

    if (result.error) {
      toast.error(result.error);
    } else {
      setAlert("Реєстрація пройшла успішно! Активуйте акаунт в листі на пошті", 'success');

      // Дані для відправки ан email
      const emailData = {
        to: result.email,
        subject: "Активація профілю",
        message: emailReg(result.activationToken),
      }

      // Відправмо листа користувачу
      await apiRequest(apiUrl.emailSend, "POST", emailData, false);

      setTimeout(() => {
        navigate("/activate");
      }, 500);
    }

    setSubmitting(false);
  };

  return (
    <div className="auth-container">
      <div className="fixed font-[Inter] inset-0 bg-gray-100/50 flex items-center justify-center z-50 py-[40px] px-[100px]">
        <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <AuthHeader />

          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            {({ getFieldProps, touched, errors, isSubmitting }) => (
              <Form className="auth-form flex max-w-md flex-col gap-4">
                <div className="form-group">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    Ім'я
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Емілі"
                    className="auth-input"
                    {...getFieldProps("name")}
                  />
                  {touched.name && errors.name && (
                    <div className="text-red-600 text-sm">{errors.name}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    Пошта
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    className="auth-input"
                    {...getFieldProps("email")}
                  />
                  {touched.email && errors.email && (
                    <div className="text-red-600 text-sm">{errors.email}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    Пароль
                  </label>
                  <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Введіть пароль"
                        className="auth-input pr-10"
                        {...getFieldProps("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (<EyeOff size={18} />) : (<Eye size={18} />)}
                      </button>
                    </div>
                  {touched.password && errors.password && (
                    <div className="text-red-600 text-sm">
                      {errors.password}
                    </div>
                  )}
                </div>

                {errors.general && (
                  <div className="text-red-600 text-sm">{errors.general}</div>
                )}

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Зареєструватися
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}