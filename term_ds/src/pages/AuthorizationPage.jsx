import AuthHeader from "../components/auth/AuthHeader.jsx";
import AuthButton from "../components/auth/AuthButton.jsx";
import AuthInputField from "../components/auth/AuthInputField.jsx";
import { useState, useContext } from "react";
import { AuthContext } from "../../backend/context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

export default function Authorization() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Помилка авторизації");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // TODO: реалізувати логіку входу через Google, якщо є бекенд–ендпоінт
  };

  return (
    <>
      <div className="auth-container">
        <div className="fixed font-[Inter] inset-0 bg-gray-100/50 flex items-center justify-center z-50 py-[40px] px-[100px]">
          <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <AuthHeader />

            <form
              onSubmit={handleSubmit}
              className="auth-form flex max-w-md flex-col gap-4"
            >
              <AuthInputField
                id="email"
                label="Пошта"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <AuthInputField
                id="password"
                label="Пароль"
                placeholder="Введіть пароль"
                isPassword={true}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <AuthButton type="submit" disabled={loading}>
                {loading ? "Завантаження..." : "Увійти"}
              </AuthButton>
            </form>

            <div className="my-4 flex items-center">
              <hr className="flex-grow border-gray-300" />
              <span className="px-4 text-sm text-gray-500">або</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <AuthButton
              type="button"
              onClick={handleGoogleAuth}
              className="flex items-center justify-center gap-2"
            >
              <FcGoogle size={20} />
              <span>Увійти через Google</span>
            </AuthButton>

            {/*<HelperText>*/}
            {/*  <span className="font-medium">*/}
            {/*    Пошта чи пароль введені не вірно!*/}
            {/*  </span>*/}
            {/*</HelperText>*/}
            {/*<AuthButton />*/}
            {/*</form>*/}
          </div>
        </div>
      </div>
    </>
  );
}
