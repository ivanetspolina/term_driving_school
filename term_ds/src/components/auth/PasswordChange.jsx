import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";

export default function PasswordChange({ onClose }) {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Очищаємо помилки при вводі
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { current: "", new: "", confirm: "" };

    if (!passwords.current) {
      newErrors.current = "Введіть поточний пароль";
      valid = false;
    }

    if (!passwords.new) {
      newErrors.new = "Введіть новий пароль";
      valid = false;
    } else if (passwords.new.length < 8) {
      newErrors.new = "Пароль має містити не менше 8 символів";
      valid = false;
    }

    if (!passwords.confirm) {
      newErrors.confirm = "Підтвердіть новий пароль";
      valid = false;
    } else if (passwords.new !== passwords.confirm) {
      newErrors.confirm = "Паролі не співпадають";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Пароль змінено", passwords);
      // Тут має бути логіка для відправки на сервер
      onClose();
    }
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

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Поточний пароль
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                name="current"
                value={passwords.current}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.current ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPassword.current ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
            {errors.current && (
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
                name="new"
                value={passwords.new}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.new ? "border-red-500" : "border-gray-300"
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
            {errors.new && (
              <p className="text-red-500 text-sm mt-1">{errors.new}</p>
            )}
          </div>

          {/*<div className="mb-6">*/}
          {/*  <label className="block text-sm font-medium mb-2">*/}
          {/*    Підтвердження нового паролю*/}
          {/*  </label>*/}
          {/*  <div className="relative">*/}
          {/*    <input*/}
          {/*      type={showPassword.confirm ? "text" : "password"}*/}
          {/*      name="confirm"*/}
          {/*      value={passwords.confirm}*/}
          {/*      onChange={handleChange}*/}
          {/*      className={`w-full px-3 py-2 border rounded-md ${*/}
          {/*        errors.confirm ? "border-red-500" : "border-gray-300"*/}
          {/*      }`}*/}
          {/*    />*/}
          {/*    <button*/}
          {/*      type="button"*/}
          {/*      className="absolute right-3 top-2.5 text-gray-500"*/}
          {/*      onClick={() => togglePasswordVisibility("confirm")}*/}
          {/*    >*/}
          {/*      {showPassword.confirm ? (*/}
          {/*        <EyeOff size={18} />*/}
          {/*      ) : (*/}
          {/*        <Eye size={18} />*/}
          {/*      )}*/}
          {/*    </button>*/}
          {/*  </div>*/}
          {/*  {errors.confirm && (*/}
          {/*    <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>*/}
          {/*  )}*/}
          {/*</div>*/}

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800"
            >
              Зберегти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
