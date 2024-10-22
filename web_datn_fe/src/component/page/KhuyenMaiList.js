import axios from 'axios';
import CryptoJS from "crypto-js";
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "../../assets/css/category.css"; // Tạo file CSS để tùy chỉnh giao diện
import { useCart } from '../../component/page/CartContext';
const KhuyenMaiList = () => {
  const [productPromotions, setProductPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductPromotions();
  }, []);
  const { cartItems, fetchCartItems } = useCart();
  const fetchProductPromotions = () => {
    axios
      .get("http://localhost:8080/api/home/productpromotions")
      .then(async (response) => {
        const productPromotionsWithDetails = await Promise.all(
          response.data.map(async (productPromotion) => {
            const productId = productPromotion.productId;
            const promotionId = productPromotion.promotionId;

            const productResponse = await axios.get(
              `http://localhost:8080/api/products/${productId}`
            );
            const productDetailResponse = await axios.get(
              `http://localhost:8080/api/productdetails/${productId}`
            );
            const brandResponse = await axios.get(
              `http://localhost:8080/api/brands/${productResponse.data.brandId}`
            );
            const promotionResponse = await axios.get(
              `http://localhost:8080/api/promotions/${promotionId}`
            );

            return {
              brand: brandResponse.data,
              promotion: promotionResponse.data,
              product: productResponse.data,
              productDetail: productDetailResponse.data,
              productPromotionId: productPromotion.productPromotionId,
            };
          })
        );

        const currentDate = new Date();
        const activeProductPromotions = productPromotionsWithDetails.filter(
          (promotion) => new Date(promotion.promotion.endDate) > currentDate
        );

        setProductPromotions(activeProductPromotions);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product promotions:", error);
        setLoading(false);
      });
  };

  const handleAddToCart = async (productDetailId, productPromotionId, quantity = 1) => {
    const userData = localStorage.getItem("userData");

    if (!userData) {
      alert("Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ hàng.");
      return;
    }

    try {
      const decryptedData = CryptoJS.AES.decrypt(userData, "secret-key").toString(CryptoJS.enc.Utf8);
      const parsedData = JSON.parse(decryptedData);
      const userId = parsedData.user_id;

      if (!userId) {
        toast.error("Không thể xác định người dùng. Vui lòng đăng nhập lại.");
        return;
      }

      const cartResponse = await axios.get(`http://localhost:8080/api/cart/${userId}`);
      const cartData = cartResponse.data;

      if (cartData.length === 0) {
        console.error("Không tìm thấy cartId");
        return;
      }

      const cartId = cartData[0].cartId;

      const cartItemsResponse = await axios.get(
        `http://localhost:8080/api/cart/items/${userId}`
      );
      const cartItems = cartItemsResponse.data;

      const existingCartItem = cartItems.find(
        (item) =>
          item.productDetail.productDetailId === productDetailId &&
          (item.productPromotion
            ? item.productPromotion.productPromotionId === productPromotionId
            : productPromotionId === 0)
      );

      if (existingCartItem) {
        const updatedQuantity = existingCartItem.quantity + quantity;

        const updateResponse = await axios.post(
          `http://localhost:8080/api/cart/cartItem/update/${existingCartItem.cartItemId}/${productDetailId}/${productPromotionId}/${updatedQuantity}`
        );

        if (updateResponse.status === 200) {
          toast.success("Sản phẩm đã được cập nhật số lượng trong giỏ hàng!");
          fetchCartItems(userId);
        }
      } else {
        const addResponse = await axios.post(
          `http://localhost:8080/api/cart/cartItem/${cartId}/${productDetailId}/${productPromotionId}/${quantity}`
        );

        if (addResponse.status === 201) {
          toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
          fetchCartItems(userId);
        }
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error.message);
    }
  };
  const handleProductClick = (productPromotion) => {
    const { product } = productPromotion;
    localStorage.setItem("selectedProductId", product.productId);
    localStorage.setItem("selectedProductPromotionId", productPromotion.productPromotionId);
    // Điều hướng tới trang chi tiết sản phẩm
    window.location.href = `/productpromotion`;
  };

  if (loading) {
    return <p>Loading promotions...</p>;
  }

  if (productPromotions.length === 0) {
    return <p>No active promotions available.</p>;
  }

  const limitedProductPromotions = productPromotions.slice(0, 30);

  return (
    <div className="container py-5">
       <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="tab-class text-center">
        <div className="tab-content">
          <div id="tab-1" className="tab-pane fade show p-0 active">
            <div className="row g-4">
              <div className="col-lg-12">
                <div className="product-list row g-4">
                  {limitedProductPromotions.map((productPromotion, index) => {
                    const productDetail = productPromotion.productDetail || {};
                    const promotionPercent = productPromotion.promotion.percent || 0;
                    const productImage = productDetail.img || 'default_image.jpg';
                    const productPrice = productDetail.price || 0;
                    const discountAmount = (productPrice * promotionPercent) / 100;
                    const originalPrice = productPrice + discountAmount;
                    const productBrand = productPromotion.brand?.name || 'Brand unavailable';
                    const productName = productPromotion.product?.name || 'Product name unavailable';

                    return (
                      <div key={index} className="col-md-6 col-lg-4 col-xl-3 col-sm-6 col-6">
                        <div className="pro-container">
                          <div className="pro">
                            <span className="sale">{promotionPercent}%</span>
                            <a onClick={() => handleProductClick(productPromotion)}>
                              <img
                                src={require(`../../assets/img/${productImage}`)}
                                alt={productName}
                              />
                            </a>
                            <div className="icon-container">
                              <a
                                className="btn"
                                onClick={() => {
                                  const quantity = 1;
                                  handleAddToCart(
                                    productDetail.productDetailId,
                                    productPromotion.productPromotionId,
                                    quantity
                                  );
                                }}
                              >
                                <i className="fas fa-shopping-cart"></i>
                              </a>
                              <a
                                onClick={() => handleProductClick(productPromotion)}
                              >
                                <i className="fas fa-eye"></i>
                              </a>
                            </div>
                            <div className="des">
                              <div className="price">
                                <h4 className="sale-price">{productPrice.toLocaleString()} đ</h4>
                                <h4><s>{originalPrice.toLocaleString()} đ</s></h4>
                              </div>
                              <span>{productBrand}</span>
                              <h6>{productName}</h6>
                              <div className="star">
                                {[...Array(5)].map((_, starIndex) => (
                                  <i key={starIndex} className={starIndex < productPromotion.rating ? "fas fa-star" : "far fa-star"}></i>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {/* Other tabs can be handled similarly */}
        </div>
      </div>
    </div>
  );
};

export default KhuyenMaiList;
