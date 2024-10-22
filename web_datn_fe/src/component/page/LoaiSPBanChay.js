import axios from "axios";
import CryptoJS from "crypto-js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer và toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS
import "../../assets/css/category.css";
import { useCart } from '../../component/page/CartContext';

const LoaiSPBanChay = () => {
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const { cartItems, fetchCartItems } = useCart();
  const navigate = useNavigate();

  const handleViewProduct = (productId) => {
    localStorage.setItem("selectedProductId", productId); // Lưu productId vào localStorage
    navigate("/product"); // Điều hướng mà không cần truyền id
  };
  
  useEffect(() => {
    fetchBestSellingProducts();
  }, []);

  const fetchBestSellingProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/home/products/best-selling"
      );
      const products = response.data;
      console.log(products); // Kiểm tra cấu trúc dữ liệu

      // Tạo một mảng Promise để lấy thông tin thương hiệu cho từng sản phẩm
      const productBrandsPromises = products.map((product) =>
        axios.get(`http://localhost:8080/api/brands/${product.product.brandId}`)
      );

      const brandsResponses = await Promise.all(productBrandsPromises);
      const brands = brandsResponses.map((res) => res.data);

      // Kết hợp thông tin sản phẩm với thương hiệu tương ứng
      const productsWithBrands = products.map((product, index) => ({
        ...product,
        brand: brands[index] || {}, // Nếu không có thương hiệu, sử dụng object rỗng
      }));

      setBestSellingProducts(productsWithBrands);
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy sản phẩm bán chạy:", error);
    }
  };

  const handleAddToCart = async (
    productDetailId,
    productPromotionId,
    quantity = 1 // Lấy quantity từ input truyền vào
  ) => {
    const userData = localStorage.getItem("userData");

    if (!userData) {
      alert("Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ hàng.");
      return;
    }

    try {
      // Giải mã dữ liệu người dùng đã lưu để lấy user ID
      const decryptedData = CryptoJS.AES.decrypt(
        userData,
        "secret-key"
      ).toString(CryptoJS.enc.Utf8);
      const parsedData = JSON.parse(decryptedData);
      const userId = parsedData.user_id;

      if (!userId) {
        alert("Không thể xác định người dùng. Vui lòng đăng nhập lại.");
        return;
      }

      // Gọi API để lấy cartId
      const cartResponse = await axios.get(
        `http://localhost:8080/api/cart/${userId}`
      );
      const cartData = cartResponse.data;

      if (cartData.length === 0) {
        console.error("Không tìm thấy cartId");
        return;
      }

      const cartId = cartData[0].cartId; // Lấy cartId từ phản hồi hợp lệ

      // Lấy các mục trong giỏ hàng để kiểm tra
      const cartItemsResponse = await axios.get(
        `http://localhost:8080/api/cart/items/${userId}`
      );
      const cartItems = cartItemsResponse.data;

      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingCartItem = cartItems.find(
        (item) =>
          item.productDetail.productDetailId === productDetailId &&
          (item.productPromotion
            ? item.productPromotion.productPromotionId === productPromotionId
            : productPromotionId === 0)
      );

      if (existingCartItem) {
        // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
        const updatedQuantity = existingCartItem.quantity + quantity;

        // Gửi yêu cầu cập nhật sản phẩm trong giỏ hàng
        const updateResponse = await axios.post(
          `http://localhost:8080/api/cart/cartItem/update/${existingCartItem.cartItemId}/${productDetailId}/${productPromotionId}/${updatedQuantity}`
        );

        if (updateResponse.status === 200) {
          fetchCartItems(userId); // Cập nhật lại danh sách giỏ hàng sau khi thay đổi
          toast.success("Sản phẩm đã được cập nhật số lượng trong giỏ hàng!"); // Thông báo thành công
        }
      } else {
        // Thêm sản phẩm mới vào giỏ hàng nếu chưa có
        const addResponse = await axios.post(
          `http://localhost:8080/api/cart/cartItem/${cartId}/${productDetailId}/0/${quantity}`
        );

        if (addResponse.status === 201) {
          fetchCartItems(userId); // Cập nhật lại danh sách giỏ hàng sau khi thay đổi
          toast.success("Sản phẩm đã được thêm vào giỏ hàng!"); // Thông báo thành công
        }
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error.message);
      toast.error("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!"); // Thông báo lỗi
    }
  };

  return (
    <div className="container py-5">
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="tab-class text-center">
        <div className="row g-4">
          <div className="col-lg-5 col-12 text-start">
            <h1 className="text-blue">Loại Sản Phẩm Bán Chạy</h1>
          </div>
        </div>
        <div className="row g-4">
          {bestSellingProducts.length > 0 ? (
            <div className="product-list row g-4">
              {bestSellingProducts.map((item, index) => (
                <div
                  key={index}
                  className="col-md-6 col-lg-4 col-xl-3 col-sm-6 col-6"
                >
                  <div className="pro-container">
                    <div className="pro">
                      <a   onClick={() => handleViewProduct(item.product.productId)}>
                        <img
                          src={require(`../../assets/img/${item.productDetails?.img || "default.jpg"}`)}
                          alt={item.name}
                        />
                      </a>
                      <div className="icon-container">
                        <a
                          className="btn"
                          onClick={() => {
                            const quantity = 1;
                            const productPromotionID = 0; // Set the quantity you want to add
                            handleAddToCart(
                              item.productDetails.productDetailId,
                              item.productDetails.productPromotionId || 0,
                              quantity
                            );
                          }}
                        >
                          <i className="fas fa-shopping-cart"></i>
                        </a>
                        <a
                    className="btn"
                    onClick={() => handleViewProduct(item.product.productId)}
                  >
                    <i className="fas fa-eye"></i>
                  </a>
                      </div>
                      <div className="des">
                        <div className="price">
                          <h4 className="sale-price">
                            {item.productDetails.price.toLocaleString()} đ
                          </h4>
                        </div>
                        <div className="brand-sold-container">
                          <span className="brand-name">{item.brand?.name || "Unnamed Product"}</span>
                          <div className="sold-quantity-container">
                            <span className="fas fa-shopping-cart"></span>
                            <span className="sold-quantity">{item.totalSold || 0} đã bán</span>
                          </div>
                        </div>

                        <h6>{item.product.name}</h6>
                        <div className="star">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="far fa-star"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Không có sản phẩm bán chạy nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoaiSPBanChay;
