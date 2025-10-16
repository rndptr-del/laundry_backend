import axios from "axios";

const api = axios.create({
  baseURL: "/api/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Token yang dikirim:", token); // Tambahkan ini sementara
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try{
        const refreshResponse = await axios.get("/api/v1/auth/refresh-token", {
          withCredentials: true,
        });

        const newToken = refreshResponse.data.data.token;
        localStorage.setItem("token", token);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError){
        console.error("Refresh token gagal:", refreshError);

        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
  );


export default api;
