import axios from "axios";
import CryptoJS from "crypto-js";

// Cấu hình apiClient với baseURL chuẩn của API
export const apiClient = axios.create({
  baseURL: "http://localhost:8080/", // Cập nhật URL phù hợp với server API của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// Hàm xử lý lỗi chung
const handleError = (error, defaultMessage) => {
  console.error(error);
  throw new Error(error.response?.data?.message || defaultMessage);
};

// Hàm đăng ký người dùng mới
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("/register", userData);
    return response.data;
  } catch (error) {
    handleError(error, "Đã xảy ra lỗi khi đăng ký");
  }
};

// Hàm đăng nhập người dùng
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post("/login", credentials);
    console.log("Login API Response:", response);
    return response.data;
  } catch (error) {
    handleError(error, "Đã xảy ra lỗi khi đăng nhập");
  }
};

// Hàm làm mới token
export const refreshToken = async (token) => {
  try {
    const response = await apiClient.post("/refresh_token", { token });
    localStorage.setItem("token", response.data.access_token);
    return response.data;
  } catch (error) {
    handleError(error, "Đã xảy ra lỗi khi làm mới token");
  }
};

// Hàm lấy thông tin người dùng đã được mã hóa từ localStorage
export const getUserData = () => {
  const encryptedUserData = localStorage.getItem("userData");
  if (encryptedUserData) {
    try {
      const decryptedData = CryptoJS.AES.decrypt(encryptedUserData, "secret-key").toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } catch (err) {
      console.error("Error decrypting user data:", err);
      return null;
    }
  }
  return null;
};

// Hàm lấy giỏ hàng theo userId
export const getCartByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/api/cart/${userId}`);
    console.log("Response from cart API:", response.data);
    return response.data;
  } catch (error) {
    handleError(error, "Đã xảy ra lỗi khi lấy giỏ hàng");
  }
};

// Hàm lấy các mục trong giỏ hàng
export const getCartItems = async (userId) => {
  try {
    const response = await apiClient.get(`/api/cart/items/${userId}`);
    console.log("Response from cart items API:", response.data);
    return response.data;
  } catch (error) {
    handleError(error, "Đã xảy ra lỗi khi lấy các mục trong giỏ hàng");
  }
};

// Hàm lấy danh mục sản phẩm
export const getCategories = async () => {
  try {
    const response = await apiClient.get('/api/home/categories');
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error('Dữ liệu không phải là mảng:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Hàm lấy khuyến mãi sản phẩm
export const getProductPromotions = async () => {
  try {
    const response = await apiClient.get('/api/home/productpromotions');
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error('Dữ liệu không phải là mảng:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching product promotions:', error);
    return [];
  }
};

// Hàm lấy thông tin chi tiết của một sản phẩm từ /api/products
export const fetchProductById = async (productId) => {
  try {
    const response = await apiClient.get(`/api/products/${productId}`);
    return response.data;
  } catch (error) {
    handleError(error, "Đã xảy ra lỗi khi lấy thông tin sản phẩm");
  }
};

// Hàm lấy thông tin chi tiết của sản phẩm từ /api/productdetails
export const fetchProductDetailsById = async (productId) => {
  try {
    const response = await apiClient.get(`/api/productdetails/${productId}`);
    return response.data;
  } catch (error) {
    handleError(error, "Đã xảy ra lỗi khi lấy thông tin chi tiết sản phẩm");
  }
};

// Hàm lấy thông tin khuyến mãi từ /api/promotions
export const fetchPromotionById = async (promotionId) => {
  try {
    const response = await apiClient.get(`/api/promotions/${promotionId}`);
    return response.data;
  } catch (error) {
    handleError(error, "Đã xảy ra lỗi khi lấy thông tin khuyến mãi");
  }
};

// Hàm lấy thông tin thương hiệu từ /api/brands
export const fetchBrandById = async (brandId) => {
  try {
    const response = await apiClient.get(`/api/brands/${brandId}`);
    return response.data;
  } catch (error) {
    handleError(error, "Đã xảy ra lỗi khi lấy thông tin thương hiệu");
  }
};

// Hàm lấy giỏ hàng của người dùng từ /api/cart
export const fetchCartByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/api/cart/${userId}`);
    return response.data;
  } catch (error) {
    handleError(error, "Đã xảy ra lỗi khi lấy giỏ hàng của người dùng");
  }
};

// Hàm lấy các item trong giỏ hàng từ /api/cart/items
export const fetchCartItemsByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/api/cart/items/${userId}`);
    return response.data;
  } catch (error) {
    handleError(error, "Đã xảy ra lỗi khi lấy các item trong giỏ hàng");
  }
};

// Hàm thêm sản phẩm vào giỏ hàng
export const addProductToCart = async (cartId, productDetailId, productPromotionId, quantity) => {
  try {
    const response = await apiClient.post(`/api/cart/cartItem/${cartId}/${productDetailId}/${productPromotionId}/${quantity}`);
    return response.data;
  } catch (error) {
    handleError(error, "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng");
  }
};

// Hàm cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemQuantity = async (cartItemId, productDetailId, productPromotionId, quantity) => {
  try {
    const response = await apiClient.post(`/api/cart/cartItem/update/${cartItemId}/${productDetailId}/${productPromotionId}/${quantity}`);
    return response.data;
  } catch (error) {
    handleError(error, "Đã xảy ra lỗi khi cập nhật số lượng sản phẩm trong giỏ hàng");
  }
};

// Hàm đăng xuất người dùng
export const logoutUser = async (token) => {
  try {
    const response = await apiClient.post("/logout", {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Xóa token khỏi localStorage sau khi đăng xuất
    localStorage.removeItem("token");
    return response.data;
  } catch (error) {
    handleError(error, "Đã xảy ra lỗi khi đăng xuất");
  }
};
