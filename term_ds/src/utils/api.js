/**
 * Виконує HTTP-запит до вашого бэкенду й повертає розпарсений JSON.
 * @param {string} path — шлях від кореня API, наприклад '/api/auth/register'
 * @param {string} [method='POST'] — HTTP-метод
 * @param {object|null} [data=null] — тіло запиту (автоматично JSON.stringify)
 */
export async function apiRequest(path, method = 'POST', data = null, apiUrlNeed = true) {
  const token = localStorage.getItem('token');

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
};