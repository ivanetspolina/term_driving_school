/**
 * Виконує HTTP-запит до вашого бэкенду й повертає розпарсений JSON.
 * @param {string} path — шлях від кореня API, наприклад '/api/auth/register'
 * @param {string} [method='POST'] — HTTP-метод
 * @param {object|null} [data=null] — тіло запиту (автоматично JSON.stringify)
 */
export async function apiRequest(path, method = 'POST', data = null) {
  const res = await fetch(`${import.meta.env.VITE_API_URL || ''}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    // у GET/HEAD не передаємо тіло
    ...(data && { body: JSON.stringify(data) }),
  });

  return await res.json();
}


// Посилання всього проекті до api
export const apiUrl = {
    auth: "/auth",
    reg: "/auth/register",
    login: "/auth/login",
}