// src/services/authService.js
import axios from "axios";
import CryptoJS from "crypto-js";

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
export const getUserData = () => {
  const encryptedUserData = localStorage.getItem("userData");
  if (encryptedUserData) {
    try {
      const decryptedData = CryptoJS.AES.decrypt(encryptedUserData, "secret-key").toString(CryptoJS.enc.Utf8);
      const userData = JSON.parse(decryptedData);
      return userData;
    } catch (err) {
      console.error("Error decrypting user data:", err);
      return null;
    }
  }
  return null;
};


// Thêm hàm lấy giỏ hàng theo userId
export const getCartByUserId = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/cart/${userId}`);
    console.log("Response from cart API:", response.data); // Ghi nhật ký phản hồi
    return response.data; // Trả về giỏ hàng nếu tồn tại
  } catch (error) {
    console.error("Error fetching cart by userId:", error);
    throw new Error(
      error.response?.data?.message || "Đã xảy ra lỗi khi lấy giỏ hàng"
    );
  }
};

// Thêm hàm lấy các mục trong giỏ hàng
export const getCartItems = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/cart/items/${userId}`); // Giả sử bạn có endpoint này
    console.log("Response from cart items API:", response.data); // Ghi nhật ký phản hồi
    return response.data; // Giả sử đây là mảng các mục trong giỏ hàng
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error; // Rethrow để xử lý trong component
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
