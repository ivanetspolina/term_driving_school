import AuthHeader from "../components/auth/AuthHeader";
import AuthButton from "../components/auth/AuthButton";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { apiRequest, apiUrl } from "../utils/api";

export default function Registration() {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Ім'я повинно містити принаймні 2 символи")
      .required("Ім'я обов'язкове"),
    email: Yup.string()
      .email("Невірний формат пошти")
      .required("Пошта обов'язкова"),
    password: Yup.string()
      .min(6, "Пароль повинен містити принаймні 6 символів")
      .required("Пароль обов'язковий"),
  });

  const handleRegister = async (values, { setSubmitting }) => {

    // Відправляємо дані форми до API
    const result = await apiRequest(apiUrl.reg, 'POST', values);
    
    if (result.error){
      toast.error(result.error);
    } else{
      toast.success('Реєстрація пройшла успішно!');

      setTimeout(() => {
        navigate('/auth');
      }, 1500)
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
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Ім'я</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Емілі"
                    className="block w-full border focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 p-2.5 text-sm rounded-lg"
                    {...getFieldProps('name')}
                  />
                  {touched.name && errors.name && (
                    <div className="text-red-600 text-sm">{errors.name}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Пошта</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    className="block w-full border focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 p-2.5 text-sm rounded-lg"
                    {...getFieldProps('email')}
                  />
                  {touched.email && errors.email && (
                    <div className="text-red-600 text-sm">{errors.email}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Пароль</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Введіть пароль"
                    className="block w-full border focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 p-2.5 text-sm rounded-lg"
                    {...getFieldProps('password')}
                  />
                  {touched.password && errors.password && (
                    <div className="text-red-600 text-sm">{errors.password}</div>
                  )}
                </div>

                {errors.general && (
                  <div className="text-red-600 text-sm">{errors.general}</div>
                )}

                <AuthButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Реєстрація..." : "Зареєструватися"}
                </AuthButton>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}