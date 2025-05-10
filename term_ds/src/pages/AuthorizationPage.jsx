import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { apiRequest, apiUrl } from "../utils/api";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useAuth } from "../context/AuthContext";

export default function Authorization() {
  const navigate = useNavigate();
  const {login} = useAuth();

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
      toast.error(`Помилка авторизації: ${res.error}`);
    } else {
      toast.success("Авторизація успішна!");

      login(res.user, res.token)

      setTimeout(() => {
        navigate('/');
      }, 1500)
    }
  };

   const inputClass = "block w-full border focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 p-2.5 text-sm rounded-lg";


  return (
    <>
      <div className="auth-container">
        <div className="fixed inset-0 bg-gray-100/50 flex items-center justify-center z-50 py-[40px] px-[100px]">
          <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Увійти</h2>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
            >
              {({ getFieldProps, touched, errors, isSubmitting }) => (
                <Form className="auth-form flex max-w-md flex-col gap-4">
                  <input
                    type="email"
                    placeholder="Enter email"
                    className={inputClass}
                    {...getFieldProps('email')}
                  />
                  {touched.email && errors.email && (
                    <div className="text-red-600 text-sm">{errors.email}</div>
                  )}

                  <input
                    type="password"
                    placeholder="Введіть пароль"
                    className={inputClass}
                    {...getFieldProps('password')}
                  />
                  {touched.password && errors.password && (
                    <div className="text-red-600 text-sm">{errors.password}</div>
                  )}

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >Увійти</button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
