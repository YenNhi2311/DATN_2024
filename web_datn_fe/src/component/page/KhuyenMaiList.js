import axios from 'axios';
import CryptoJS from "crypto-js";
import React, { Component } from 'react';

import "../../assets/css/category.css"; // Tạo file CSS để tùy chỉnh giao diện
import { notify } from "../../component/web/CustomToast";


export default class KhuyenMaiList extends Component {
  state = {
    productPromotions: [],
    loading: true,
  };

  componentDidMount() {
    this.fetchProductPromotions();
  }

  fetchProductPromotions = () => {
    axios.get('http://localhost:8080/api/home/productpromotions')
      .then(response => {
        const productPromotionsWithDetails = response.data.map(async (productPromotion) => {
          const productId = productPromotion.productId;
          const promotionId = productPromotion.promotionId;

          // Fetch related data
          const productResponse = await axios.get(`http://localhost:8080/api/products/${productId}`);
          const productDetailResponse = await axios.get(`http://localhost:8080/api/productdetails/${productId}`);
          const brandResponse = await axios.get(`http://localhost:8080/api/brands/${productResponse.data.brandId}`);
          const promotionResponse = await axios.get(`http://localhost:8080/api/promotions/${promotionId}`);

          return {
            brand: brandResponse.data,
            promotion: promotionResponse.data,
            product: productResponse.data,
            productDetail: productDetailResponse.data,
          };
        });

        Promise.all(productPromotionsWithDetails).then((resolvedProductPromotions) => {
          // Filter out expired promotions based on the end date
          const currentDate = new Date();
          const activeProductPromotions = resolvedProductPromotions.filter(promotion => 
            new Date(promotion.promotion.endDate) > currentDate
          );

          this.setState({ 
            productPromotions: activeProductPromotions, 
            loading: false 
          });
        });
      })
      .catch(error => {
        console.error('Error fetching product promotions:', error);
        this.setState({ loading: false });
      });
  };

  handleAddToCart = async (productDetailId, productPromotionId, quantity = 1) => {
    const userData = localStorage.getItem("userData");

    if (!userData) {
      alert("Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ hàng.");
      return;
    }

    try {
      // Giải mã dữ liệu người dùng đã lưu để lấy user ID
      const decryptedData = CryptoJS.AES.decrypt(userData, "secret-key").toString(CryptoJS.enc.Utf8);
      const parsedData = JSON.parse(decryptedData);
      const userId = parsedData.user_id;

      if (!userId) {
        alert("Không thể xác định người dùng. Vui lòng đăng nhập lại.");
        return;
      }

      // Gọi API để lấy cartId
      const cartResponse = await axios.get(`http://localhost:8080/api/cart/${userId}`);
      const cartData = cartResponse.data;

      if (cartData.length === 0) {
        console.error("Không tìm thấy cartId");
        return;
      }

      const cartId = cartData[0].cartId; // Lấy cartId từ phản hồi hợp lệ

      // Lấy các mục trong giỏ hàng để kiểm tra
      const cartItemsResponse = await axios.get(`http://localhost:8080/api/cart/items/${userId}`);
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
          notify("Sản phẩm đã được cập nhật số lượng trong giỏ hàng!");
        }
      } else {
        // Thêm sản phẩm mới vào giỏ hàng nếu chưa có
        const addResponse = await axios.post(
          `http://localhost:8080/api/cart/cartItem/${cartId}/${productDetailId}/${productPromotionId}/${quantity}`
        );

        if (addResponse.status === 201) {
          notify("Sản phẩm đã được thêm vào giỏ hàng!");
        }
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error.message);
    }
  };

  render() {
    const { productPromotions, loading } = this.state;

    if (loading) {
      return <p>Loading promotions...</p>;
    }

    if (productPromotions.length === 0) {
      return <p>No active promotions available.</p>;
    }

    const limitedProductPromotions = productPromotions.slice(0, 30);

    return (
      <div className="container py-5">
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
                              <a href={`/productpromotion/product/${productPromotion.productPromotionId}/${productPromotion.product?.productId}`}>
                              <img
                                src={require(`../../assets/img/${productImage}`)}
                                alt={productName}
                              />
                              </a>
                              <div className="icon-container">
                                <a
                                  className="btn"
                                  onClick={() => {
                                    const quantity = 1; // Set the quantity you want to add
                                    this.handleAddToCart(
                                      productDetail.productDetailId,
                                      productPromotion.productPromotionId,
                                      quantity
                                    ); // Ensure both IDs are passed
                                  }}
                                >
                                  <i className="fas fa-shopping-cart"></i>
                                </a>
                                <a href={`productpromotion/product/${productPromotion.product?.productId}`}>
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
  }
}
