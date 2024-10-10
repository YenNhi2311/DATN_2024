// src/services/authService.js

import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:8080/", // Đảm bảo baseURL đúng với API của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("/register", userData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Đã xảy ra lỗi khi đăng ký"
    );
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post("/login", credentials); // Sử dụng apiClient thay vì axios
    console.log("Login API Response:", response); // Ghi nhật ký toàn bộ phản hồi API
    return response.data; // Trả về response.data để giữ tính nhất quán
  } catch (error) {
    console.error("Error in loginUser:", error); // Ghi nhật ký lỗi nếu có
    throw new Error(
      error.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập"
    );
  }
};

export const refreshToken = async (token) => {
  try {
    const response = await apiClient.post("/refresh_token", { token });
    localStorage.setItem("token", response.data.access_token);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Đã xảy ra lỗi khi làm mới token"
    );
  }
};
// Thêm hàm lấy thông tin người dùng theo userId
export const getUserData = async (userId, token) => {
  try {
    const response = await apiClient.get(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Đính kèm token vào request
      },
    });

    return response.data; // Trả về dữ liệu người dùng
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Đã xảy ra lỗi khi lấy thông tin người dùng"
    );
  }
};

// Thêm hàm logout người dùng
export const logoutUser = async (token) => {
  try {
    const response = await apiClient.post(
      "/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Đính kèm token vào header
        },
      }
    );

    // Xóa token khỏi localStorage sau khi đăng xuất
    localStorage.removeItem("token");
    return response.data;
  } catch (error) {
    console.error("Error in logoutUser:", error); // Ghi nhật ký lỗi nếu có
    throw new Error(
      error.response?.data?.message || "Đã xảy ra lỗi khi đăng xuất"
    );
  }
};
