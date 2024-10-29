// src/component/LoaiSPBanChay.js

import CryptoJS from "crypto-js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/css/category.css";
import { useCart } from "../../component/page/CartContext";
import {
  addToCart,
  fetchBestSellingProducts,
  getBrandById,
  getCartByUserId,
  getCartItemsByUserId,
  updateCartItem,
} from "../../services/authService";

const LoaiSPBanChay = () => {
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const { fetchCartItems } = useCart();
  const navigate = useNavigate();

  // Chuyển hướng đến trang chi tiết sản phẩm
  const handleViewProduct = (productId) => {
    localStorage.setItem("selectedProductId", productId);
    navigate("/product");
  };

  // Lấy danh sách sản phẩm bán chạy và thông tin thương hiệu
  useEffect(() => {
    fetchProductsWithBrands();
  }, []);

  const fetchProductsWithBrands = async () => {
    try {
      const products = await fetchBestSellingProducts();
      const productBrandsPromises = products.map(async (product) => {
        return product.product.brandId
          ? await getBrandById(product.product.brandId)
          : {};
      });
      const brands = await Promise.all(productBrandsPromises);
      const productsWithBrands = products.map((product, index) => ({
        ...product,
        brand: brands[index] || {},
      }));
      setBestSellingProducts(productsWithBrands);
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy sản phẩm bán chạy:", error);
    }
  };

  // Xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async (
    productDetailId,
    productPromotionId,
    quantity = 1
  ) => {
    const userData = localStorage.getItem("userData");

    if (!userData) {
      alert("Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ hàng.");
      return;
    }

    try {
      // Giải mã và lấy userId từ dữ liệu mã hóa trong localStorage
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

      const cartData = await getCartByUserId(userId);
      if (cartData.length === 0) {
        console.error("Không tìm thấy cartId");
        return;
      }

      const cartId = cartData[0].cartId;
      const cartItems = await getCartItemsByUserId(userId);

      const existingCartItem = cartItems.find(
        (item) =>
          item.productDetail.productDetailId === productDetailId &&
          (item.productPromotion
            ? item.productPromotion.productPromotionId === productPromotionId
            : productPromotionId === 0)
      );

      if (existingCartItem) {
        const updatedQuantity = existingCartItem.quantity + quantity;
        await updateCartItem(
          existingCartItem.cartItemId,
          productDetailId,
          productPromotionId,
          updatedQuantity
        );
        fetchCartItems(userId);
        toast.success("Sản phẩm đã được cập nhật số lượng trong giỏ hàng!");
      } else {
        await addToCart(cartId, productDetailId, productPromotionId, quantity);
        fetchCartItems(userId);
        toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error.message);
      toast.error("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!");
    }
  };

  return (
    <div className="container py-5">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
      />
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
                      <a
                        onClick={() =>
                          handleViewProduct(item.product.productId)
                        }
                      >
                        <img
                          src={require(`../../assets/img/${
                            item.productDetails?.img || "default.jpg"
                          }`)}
                          alt={item.product.name}
                        />
                      </a>
                      <div className="icon-container">
                        <a
                          className="btn"
                          onClick={() =>
                            handleAddToCart(
                              item.productDetails.productDetailId,
                              item.productDetails.productPromotionId || 0,
                              1
                            )
                          }
                        >
                          <i className="fas fa-shopping-cart"></i>
                        </a>
                        <a
                          className="btn"
                          onClick={() =>
                            handleViewProduct(item.product.productId)
                          }
                        >
                          <i className="fas fa-eye"></i>
                        </a>
                      </div>
                      <div className="des">
                        <h6>{item.product.name}</h6>
                        <div className="price">
                          <h4 className="sale-price">
                            {item.productDetails.price.toLocaleString()} đ
                          </h4>
                        </div>
                        <div className="brand-sold-container">
                          <span className="brand-name">
                            {item.brand?.name || "Thương Hiệu"}
                          </span>
                          <div className="sold-quantity-container">
                            <span className="fas fa-shopping-cart"></span>
                            <span className="sold-quantity">
                              {item.totalSold || 0} đã bán
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Không có sản phẩm nào</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoaiSPBanChay;
