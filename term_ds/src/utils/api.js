// Універсальна функція для запиту до API
export async function apiRequest(path, method = 'POST', data = null, apiUrlNeed = true) {
  // Отримуємо токен з localStorage (JWT для авторизації)
  const token = localStorage.getItem('token');

  // Формуємо повну URL-адресу
  // якщо `apiUrlNeed === true`, додаємо базову адресу з .env (VITE_API_URL)
  // якщо false, то використовуємо лише `path` як абсолютне посилання
  const res = await fetch(`${apiUrlNeed ? import.meta.env.VITE_API_URL : '' || ''}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    ...(data && { body: JSON.stringify(data) }),
  });

  return await res.json(); 
}

// Об'єкт з маршрутами API для централізованого доступу до них
export const apiUrl = {
  emailSend: "https://api.inderio.com/send-email",
  auth: "/auth",
  reg: "/auth/register",
  login: "/auth/login",
  profile: "/auth/profile", 
  changePassword: "/auth/change_password",
  activate: "/auth/activate",
  updateProfile: "/auth/update_profile",
  deleteAccount: "/auth/delete",
  tests: "/tests",
  testResult: "/tests/result",
  testResultUser: "/tests/results/user",
  testsWithStats: "/tests/with_stats",
  testAnalytics: "/analytics/test",
};