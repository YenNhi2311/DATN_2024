import React, { Component } from "react";
import { apiClient } from "../../config/apiClient";

const handleAddToCart = (event) => {
  event.preventDefault();
  // Logic to add product to the cart
};

export default class KhuyenMaiList extends Component {
  state = {
    productPromotions: [],
    loading: true,
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

        // Use Promise.all to wait for all product detail requests to resolve
        Promise.all(productPromotionsWithDetails).then(
          (resolvedProductPromotions) => {
            this.setState({
              productPromotions: resolvedProductPromotions,
              loading: false,
            });
          }
        );
      })
      .catch((error) => {
        console.error("Error fetching product promotions:", error);
        this.setState({ loading: false });
      });
  };

  render() {
    const { productPromotions, loading } = this.state;

    if (loading) {
      return <p>Loading promotions...</p>;
    }

    return (
      <div className="container py-5">
        <div className="tab-class text-center">
          <div className="tab-content">
            <div id="tab-1" className="tab-pane fade show p-0 active">
              <div className="row g-4">
                <div className="col-lg-12">
                  <div className="product-list row g-4">
                    {productPromotions.length === 0 ? (
                      <p>No promotions available</p>
                    ) : (
                      productPromotions.map((productPromotion, index) => {
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

                        // Calculate the original price
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
                                  <a
                                    className="btn"
                                    href="#"
                                    onClick={handleAddToCart}
                                  >
                                    <i className="fas fa-shopping-cart"></i>
                                  </a>
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
                                      <s>{originalPrice.toLocaleString()} đ</s>
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
                      })
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
