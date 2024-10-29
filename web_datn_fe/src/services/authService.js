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
    console.error("Error in loginUser:", error);
    // Ghi nhật ký lỗi nếu có
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
export const getUserDataById = () => {
  const encryptedUserData = localStorage.getItem("userData");
  if (encryptedUserData) {
    try {
      const decryptedData = CryptoJS.AES.decrypt(
        encryptedUserData,
        "secret-key"
      ).toString(CryptoJS.enc.Utf8);

      const userData = JSON.parse(decryptedData);
      return userData;
    } catch (err) {
      console.error("Error decrypting user data:", err);
      return null;
    }
  }
  return null;
};

// Thêm hàm lấy thông tin người dùng theo token
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
export const getCartByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`api/cart?userId=${userId}`);
    return response.data; // Đảm bảo response trả về danh sách giỏ hàng
  } catch (error) {
    // Nếu lỗi 404 (giỏ hàng không tồn tại), ném ra lỗi để xử lý bên ngoài
    if (error.response && error.response.status === 404) {
      throw new Error("Cart not found");
    }
    console.error("Lỗi khi lấy giỏ hàng:", error);
    throw error; // Ném lại lỗi để xử lý bên ngoài nếu không phải 404
  }
};

export const createCartForUser = async (userId) => {
  try {
    // Kiểm tra giỏ hàng trước khi tạo mới
    const existingCart = await getCartByUserId(userId);
    return existingCart; // Nếu có giỏ hàng, trả về
  } catch (error) {
    if (error.message === "Cart not found") {
      // Nếu không tìm thấy giỏ hàng, tiến hành tạo mới
      const response = await apiClient.post(`api/cart?userId=${userId}`); // Gửi userId trong query parameter
      if (response.status === 201) {
        console.log("Giỏ hàng đã được tạo:", response.data);
        return response.data; // Trả về giỏ hàng mới được tạo
      } else {
        console.log("Lỗi khi tạo giỏ hàng:", response);
        throw new Error("Không thể tạo giỏ hàng mới");
      }
    }
    console.error("Lỗi khi tạo giỏ hàng:", error);
    throw error; // Ném lại lỗi nếu không phải lỗi giỏ hàng không tồn tại
  }
};
export const getCartItemsByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`api/cart/items?userId=${userId}`);
    return response.data; // Đảm bảo trả về danh sách sản phẩm trong giỏ hàng
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    throw error; // Bỏ lỗi để xử lý ở nơi gọi hàm
  }
};

// export const getCartItems = async (userId) => {
//   try {
//     const response = await apiClient.get(
//       `http://localhost:8080/api/cart/items/${userId}`
//     ); // Giả sử bạn có endpoint này

//     console.log("Response from cart items API:", response.data); // Ghi nhật ký phản hồi
//     return response.data; // Giả sử đây là mảng các mục trong giỏ hàng
//   } catch (error) {
//     console.error("Error fetching cart items:", error);
//     throw error; // Rethrow để xử lý trong component
//   }
// };

export const deleteCartItem = async (cartItemId) => {
  try {
    await apiClient.delete(`api/cart/cartItem?cartItemId=${cartItemId}`);
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm trong giỏ hàng:", error);
    throw error;
  }
};

export const updateCartItem = async (
  cartItemId,
  productDetailId,
  productPromotionId,
  quantity
) => {
  try {
    const promotionId =
      productPromotionId !== undefined ? productPromotionId : null;
    await apiClient.post(
      `api/cart/cartItem/update?cartItemId=${cartItemId}&productDetailId=${productDetailId}&productPromotionId=${promotionId}&quantity=${quantity}`
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng:", error);
    throw error;
  }
};
//thêm vào giỏ hàng
export const addToCart = async (
  cartId,
  productDetailId,
  productPromotionId,
  quantity
) => {
  try {
    const response = await apiClient.post(
      `/api/cart/cartItem?cartId=${cartId}&productDetailId=${productDetailId}&productPromotionId=${productPromotionId}&quantity=${quantity}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    throw error;
  }
};
// Loại sản phẩm
export const fetchCategories = async () => {
  try {
    const response = await apiClient.get("api/home/categories");
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error("Dữ liệu không phải là mảng:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
//Thương Hiệu
export const fetchBrands = async () => {
  try {
    const response = await apiClient.get("api/home/brands");
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};
//loai sản phẩm bán chạy
export const fetchBestSellingProducts = async () => {
  try {
    const response = await apiClient.get("api/home/products/best-selling");
    return response.data;
  } catch (error) {
    console.error("Có lỗi xảy ra khi lấy sản phẩm bán chạy:", error);
    throw error;
  }
};

export const getBrandById = async (brandId) => {
  try {
    const response = await apiClient.get(`api/home/brand?id=${brandId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thương hiệu:", error);
    throw error;
  }
};
// Thêm hàm lấy danh sách khuyến mãi sản phẩm
export const fetchProductPromotions = async () => {
  try {
    const response = await apiClient.get("api/home/productpromotions");
    return response.data; // Trả về danh sách khuyến mãi sản phẩm
  } catch (error) {
    console.error("Lỗi khi lấy khuyến mãi sản phẩm:", error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await apiClient.get(`api/home/product?id=${productId}`);
    return response.data; // Trả về thông tin sản phẩm
  } catch (error) {
    console.error("Lỗi khi lấy thông tin sản phẩm:", error);
    throw error;
  }
};

// Thêm hàm lấy thông tin khuyến mãi theo ID
export const getPromotionById = async (promotionId) => {
  try {
    const response = await apiClient.get(
      `api/home/promotion?id=${promotionId}`
    );
    return response.data; // Trả về thông tin khuyến mãi
  } catch (error) {
    console.error("Lỗi khi lấy thông tin khuyến mãi:", error);
    throw error;
  }
};

export const getProductDetailById = async (productId) => {
  try {
    const response = await apiClient.get(
      `api/home/productdetail?productId=${productId}`
    );
    return response.data; // Trả về chi tiết sản phẩm
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    throw error;
  }
};
// Hàm lấy địa chỉ
export const fetchAddresses = async () => {
  const response = await apiClient.get("api/addresses");
  return response.data;
};

// Hàm thêm địa chỉ
export const addAddress = async (formData) => {
  const response = await apiClient.post("api/addresses", formData);
  return response.data;
};
// Hàm lấy lợi ích theo ID
export const getBenefitById = async (benefitId) => {
  try {
    const response = await apiClient.get(`api/home/benefit?id=${benefitId}`);
    return response.data; // Trả về thông tin lợi ích
  } catch (error) {
    console.error("Lỗi khi lấy lợi ích:", error);
    throw error;
  }
};

// Hàm lấy dung tích theo ID
export const getCapacityById = async (capacityId) => {
  try {
    const response = await apiClient.get(`api/home/capacity?id=${capacityId}`);
    return response.data; // Trả về thông tin dung tích
  } catch (error) {
    console.error("Lỗi khi lấy dung tích:", error);
    throw error;
  }
};

// Hàm lấy thành phần theo ID
export const getIngredientById = async (ingredientId) => {
  try {
    const response = await apiClient.get(
      `api/home/ingredient?id=${ingredientId}`
    );
    return response.data; // Trả về thông tin thành phần
  } catch (error) {
    console.error("Lỗi khi lấy thành phần:", error);
    throw error;
  }
};

// Hàm lấy các sản phẩm liên quan theo ID sản phẩm
export const getRelatedProducts = async (productId) => {
  try {
    const response = await apiClient.get(
      `api/home/products/related?id=${productId}`
    );
    return response.data; // Trả về danh sách sản phẩm liên quan
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm liên quan:", error);
    throw error;
  }
};

// Hàm lấy loại da theo ID
export const getSkintypeById = async (skintypeId) => {
  try {
    const response = await apiClient.get(`api/home/skintype?id=${skintypeId}`);
    return response.data; // Trả về thông tin loại da
  } catch (error) {
    console.error("Lỗi khi lấy loại da:", error);
    throw error;
  }
};
// Hàm lấy danh mục theo ID
export const getCategoryById = async (categoryId) => {
  try {
    const response = await apiClient.get(`api/home/category?id=${categoryId}`);
    return response.data; // Trả về thông tin danh mục
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    throw error;
  }
};

export const isAdmin = () => {
  const encryptedUserData = localStorage.getItem("userData");
  if (encryptedUserData) {
    try {
      // Giải mã dữ liệu người dùng từ localStorage
      const decryptedData = CryptoJS.AES.decrypt(
        encryptedUserData,
        "secret-key"
      ).toString(CryptoJS.enc.Utf8);
      const userData = JSON.parse(decryptedData);
      console.log(
        userData?.authorities?.some((auth) => auth.authority === "admin")
      );

      // Kiểm tra nếu userData có thuộc tính `authorities` và quyền là admin
      return userData?.authorities?.some((auth) => auth.authority === "admin");
    } catch (error) {
      console.error("Error decrypting user data:", error);
      return false;
    }
  }
  return false;
};
