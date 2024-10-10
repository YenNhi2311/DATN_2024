import React, { Component } from "react";
import "../../assets/css/category.css"; // Tạo file CSS để tùy chỉnh giao diện
import { apiClient } from "../../config/apiClient";
import { Link } from "react-router-dom";

const handleAddToCart = (event) => {
  event.preventDefault();
  // Logic to add product to the cart
};

export default class KhuyenMai extends Component {
  state = {
    productPromotions: [],
    loading: true,
    timeLeft: {},
    isPromotionActive: true, // State to track if promotion is active
  };

  componentDidMount() {
    this.fetchProductPromotions();
  }

  fetchProductPromotions = () => {
    apiClient
      .get("/api/product-promotions")
      .then((response) => {
        const productPromotionsWithDetails = response.data.map(
          async (productPromotion) => {
            const productId = productPromotion.productId;
            const promotionId = productPromotion.promotionId;

            // Fetch related data
            const productResponse = await apiClient.get(
              `/api/products/${productId}`
            );
            const productDetailResponse = await apiClient.get(
              `/api/productdetails/${productId}`
            );
            const brandResponse = await apiClient.get(
              `/api/brands/${productResponse.data.brandId}`
            );
            const promotionResponse = await apiClient.get(
              `/api/promotions/${promotionId}`
            );

            return {
              brand: brandResponse.data,
              promotion: promotionResponse.data,
              product: productResponse.data,
              productDetail: productDetailResponse.data,
            };
          }
        );

        Promise.all(productPromotionsWithDetails).then(
          (resolvedProductPromotions) => {
            this.setState(
              {
                productPromotions: resolvedProductPromotions,
                loading: false,
              },
              () => {
                this.startCountdown(resolvedProductPromotions); // Start countdown after data is loaded
              }
            );
          }
        );
      })
      .catch((error) => {
        console.error("Error fetching product promotions:", error);
        this.setState({ loading: false });
      });
  };

  startCountdown = (productPromotions) => {
    const { endDate } = productPromotions[0].promotion; // Assuming all promotions have the same end date for simplicity
    this.updateTimeLeft(endDate);
    this.interval = setInterval(() => {
      this.updateTimeLeft(endDate);
    }, 1000);
  };

  updateTimeLeft = (endDate) => {
    const now = new Date();
    const promotionEndDate = new Date(endDate);
    const timeLeft = promotionEndDate - now;

    if (timeLeft < 0) {
      clearInterval(this.interval);
      this.setState({
        timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
        isPromotionActive: false, // Set promotion as inactive
      });
      return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    this.setState({ timeLeft: { days, hours, minutes, seconds } });
  };

  componentWillUnmount() {
    clearInterval(this.interval); // Clear interval on unmount
  }

  render() {
    const { productPromotions, loading, isPromotionActive } = this.state;

    if (loading) {
      return <p>Loading promotions...</p>;
    }

    if (!isPromotionActive) {
      return null; // Do not render anything if promotion is inactive
    }

    const limitedProductPromotions = productPromotions.slice(0, 4);

    return (
      <div className="container py-5">
        <div className="tab-class text-center">
          <div className="row g-4">
            <div className="col-lg-5 col-12 text-start">
              <div className="countdown-timer">
                <h1 className="text-blue">Khuyến mãi</h1>
                <ul>
                  <span className="time">
                    {this.state.timeLeft.days < 10
                      ? `0${this.state.timeLeft.days}`
                      : this.state.timeLeft.days}
                  </span>
                  <span className="separator">:</span>
                  <span className="time">
                    {this.state.timeLeft.hours < 10
                      ? `0${this.state.timeLeft.hours}`
                      : this.state.timeLeft.hours}
                  </span>
                  <span className="separator">:</span>
                  <span className="time">
                    {this.state.timeLeft.minutes < 10
                      ? `0${this.state.timeLeft.minutes}`
                      : this.state.timeLeft.minutes}
                  </span>
                  <span className="separator">:</span>
                  <span className="time">
                    {this.state.timeLeft.seconds < 10
                      ? `0${this.state.timeLeft.seconds}`
                      : this.state.timeLeft.seconds}
                  </span>
                </ul>
              </div>
            </div>
            <div className="col-lg-7 col-12 text-end">
              <ul className="nav nav-pills d-inline-flex text-center mb-5">
                <li className="nav-item">
                  <a
                    className="d-flex m-2 py-2 bg-light rounded-pill active"
                    data-bs-toggle="pill"
                    href="/promotions"
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      Xem Tất Cả
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="tab-content">
            <div id="tab-1" className="tab-pane fade show p-0 active">
              <div className="row g-4">
                <div className="col-lg-12">
                  <div className="product-list row g-4">
                    {limitedProductPromotions.length === 0 ? (
                      <p>No promotions available</p>
                    ) : (
                      limitedProductPromotions.map(
                        (productPromotion, index) => {
                          const productDetail =
                            productPromotion.productDetail || {};
                          const promotionPercent =
                            productPromotion.promotion.percent || 0;
                          const productImage =
                            productDetail.img || "path/to/default_image.jpg";
                          const productPrice =
                            productDetail.price || "Price unavailable";
                          const discountAmount =
                            (productPrice * promotionPercent) / 100;

                          const originalPrice = productPrice + discountAmount;
                          const productBrand =
                            productPromotion.brand?.name || "Brand unavailable";
                          const productName =
                            productPromotion.product?.name ||
                            "Product name unavailable";

                          return (
                            <div
                              key={index}
                              className="col-md-6 col-lg-4 col-xl-3 col-sm-6 col-6"
                            >
                              <div className="pro-container">
                                <div className="pro">
                                  <span className="sale">
                                    {promotionPercent}%
                                  </span>
                                  <img
                                    src={require(`../../assets/img/${productImage}`)}
                                    alt={productName}
                                  />
                                  <div className="icon-container">
                                    <Link
                                      className="btn"
                                      href="#"
                                      onClick={handleAddToCart}
                                    >
                                      <i className="fas fa-shopping-cart"></i>
                                    </Link>
                                    <a
                                      href={`/product/${productPromotion.product?.productId}`}
                                    >
                                      <i className="fas fa-eye"></i>
                                    </a>
                                  </div>
                                  <div className="des">
                                    <div className="price">
                                      <h4 className="sale-price">
                                        {productPrice.toLocaleString()} đ
                                      </h4>
                                      <h4>
                                        <s>
                                          {originalPrice.toLocaleString()} đ
                                        </s>
                                      </h4>
                                    </div>
                                    <span>{productBrand}</span>
                                    <h6>{productName}</h6>
                                    <div className="star">
                                      {[...Array(5)].map((_, starIndex) => (
                                        <i
                                          key={starIndex}
                                          className={
                                            starIndex < productPromotion.rating
                                              ? "fas fa-star"
                                              : "far fa-star"
                                          }
                                        ></i>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )
                    )}
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
