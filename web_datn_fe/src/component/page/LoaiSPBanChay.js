import React, { Component } from "react";
import "../../assets/css/category.css";
import { apiClient } from "../../config/apiClient";
import { Link } from "react-router-dom";
export default class LoaiSPBanChay extends Component {
  state = {
    bestSellingProducts: [],
  };

  componentDidMount() {
    this.fetchBestSellingProducts();
  }

  fetchBestSellingProducts = async () => {
    try {
      const response = await apiClient.get("/api/products/best-selling");
      // The API already provides productDetails along with product, so no need for a second call
      this.setState({ bestSellingProducts: response.data });
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy sản phẩm bán chạy:", error);
    }
  };

  handleAddToCart = (productId) => {
    // Xử lý thêm vào giỏ hàng
    console.log(`Thêm sản phẩm với ID: ${productId} vào giỏ hàng.`);
  };

  render() {
    return (
      <div className="cm-3 rounded">
        <h1 className="m-3 rounded">Loại sản phẩm bán chạy trong tháng</h1>

        {this.state.bestSellingProducts.map((item, index) => (
          <div
            key={index}
            className="col-md-6 col-lg-4 col-xl-3 col-sm-6 col-6"
          >
            <div className="pro-container">
              <div className="pro">
                <img
                  src={require(`../../assets/img/${item.productDetails.img}`)}
                  alt={item.product.name}
                />
                <div className="icon-container">
                  <Link
                    className="btn"
                    onClick={() => this.handleAddToCart(item.product.productId)}
                  >
                    <i className="fas fa-shopping-cart"></i>
                  </Link>
                  <a href={`/product/${item.product.productId}`}>
                    <i className="fas fa-eye"></i>
                  </a>
                </div>
                <div className="des">
                  <div className="price">
                    <h4 className="sale-price">
                      {item.productDetails.price.toLocaleString()} đ
                    </h4>
                    <h4>
                      <s>
                        {(item.productDetails.price * 1.428).toLocaleString()} đ
                      </s>
                    </h4>
                  </div>
                  <span>{item.product.brand}</span>
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
    );
  }
}
