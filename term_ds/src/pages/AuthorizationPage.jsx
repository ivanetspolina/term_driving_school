import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { apiRequest, apiUrl } from "../utils/api";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useAuth } from "../context/AuthContext";
import AuthHeader from "../components/auth/AuthHeader";
import { useUI } from "../context/UIContext";

export default function Authorization() {
  const navigate = useNavigate();
  const {login, isAuthenticated } = useAuth();
  const { setAlert } = useUI()
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setAlert("Ви авторизовані!", "success");
      navigate("/");
    }
  }, [isAuthenticated, navigate, setAlert]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Невірний формат пошти")
      .required("Пошта обов'язкова"),
    password: Yup.string()
      .required("Пароль обов'язковий"),
  });

  const handleFormSubmit = async (values) => {
    const res = await apiRequest(apiUrl.login, "POST", values);
    console.log("res: ", res);

      if (res.error) {
        setAlert(`Помилка авторизації: ${res.error}`, "error");
      } else {
        login(res.user, res.token);
        navigate("/");
      }
  };

  return (
    <>
      <div className="auth-container">
        <div className="fixed font-[Inter] inset-0 bg-gray-100/50 flex items-center justify-center z-50 py-[40px] px-[100px]">
          <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <AuthHeader />

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
            >
              {({ getFieldProps, touched, errors, isSubmitting }) => (
                <Form className="auth-form flex max-w-md flex-col gap-4">
                  <div className="form-group">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Пошта
                    </label>
                    <input
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

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Увійти
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}
