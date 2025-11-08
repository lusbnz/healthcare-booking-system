import axios from "axios";
import { getAccessToken, refreshAccessToken } from "./client";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Xóa tokens và chuyển hướng về trang login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Sử dụng window.location.href để đảm bảo refresh toàn bộ ứng dụng
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      console.error("Permission denied:", error);
    }

    return Promise.reject(error);
  }
);

export default api;