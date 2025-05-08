import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false, // якщо не використовуєте HTTP-only cookie
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      // спробувати оновити
      const { data } = await api.get("/auth/refresh");
      localStorage.setItem("jwt", data.accessToken);
      api.defaults.headers.common["Authorization"] =
        `Bearer ${data.accessToken}`;
      err.config.headers["Authorization"] = `Bearer ${data.accessToken}`;
      return axios(err.config);
    }
    return Promise.reject(err);
  },
);

export default api;
