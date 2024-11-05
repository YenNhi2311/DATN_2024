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
        const token = Cookies.get("access_token"); 
        // Lấy access_token từ dữ liệu đã giải mã
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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Xử lý khi token không hợp lệ
      console.error("Token không hợp lệ, vui lòng đăng nhập lại.");
      // Có thể điều hướng đến trang đăng nhập hoặc thực hiện hành động khác
    }
    return Promise.reject(error);
  }
);
