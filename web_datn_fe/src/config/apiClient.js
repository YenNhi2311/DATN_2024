// services/authService.js
import axios from "axios";
import Cookies from "js-cookie";

// Tạo axios instance
export const apiClient = axios.create({
  baseURL: "http://localhost:8080", // Đảm bảo baseURL đúng với API của bạn
  headers: {
    "Content-Type": "application/json",
  }, // URL của API
});

// Sử dụng interceptor để thêm Bearer Token vào headers cho mỗi request
apiClient.interceptors.request.use(
  (config) => {
    const encryptedUserData = localStorage.getItem("userData");
    if (encryptedUserData) {
      try {
        const token = Cookies.get("access_token"); // Lấy access_token từ dữ liệu đã giải mã
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
