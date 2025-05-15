import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { apiRequest, apiUrl } from "../../utils/api";

export default function PasswordChange({ onClose }) {
   const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validationSchema = Yup.object({
    current: Yup.string().required("Поточний пароль обов'язковий"),
    new: Yup.string()
      .min(6, "Мінімум 6 символів")
      .matches(/^[A-Za-z0-9]*$/, "Лише латинські літери та цифри")
      .matches(/[A-Z]/, "Має містити хоча б одну велику літеру")
      .matches(/[0-9]/, "Має містити хоча б одну цифру")
      .notOneOf([Yup.ref("current")], "Новий пароль не може збігатися з поточним")
      .required("Новий пароль обов'язковий"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const res = await apiRequest(apiUrl.changePassword, "PATCH", {
      currentPassword: values.current,
      newPassword: values.new,
    });

    if (res.error) {
      toast.error(`Помилка: ${res.error}`);
    } else {
      toast.success("Пароль успішно змінено");
      resetForm();
      setTimeout(() => {
        onClose();
      }, 1500);
    }

    setSubmitting(false);
  };

  return (
    <div className="password-change-overlay fixed inset-0 bg-gray-600/50 font-[Inter] flex items-center justify-center z-50">
      <div className="password-change-modal bg-white rounded-lg p-6 max-w-md w-full relative">
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Зміна паролю</h2>

        <Formik
          initialValues={{ current: "", new: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ getFieldProps, errors, touched, isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Поточний пароль
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    {...getFieldProps("current")}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.current && touched.current
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-500"
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.current && touched.current && (
                  <p className="text-red-500 text-sm mt-1">{errors.current}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Новий пароль
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    {...getFieldProps("new")}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.new && touched.new
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-500"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.new && touched.new && (
                  <p className="text-red-500 text-sm mt-1">{errors.new}</p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Збереження..." : "Зберегти"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
