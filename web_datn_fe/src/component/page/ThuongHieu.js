import axios from "axios"; // Import axios
import React, { Component } from "react";
import { apiClient } from "../../config/apiClient";

export default class ThuongHieu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brands: [],
    };
  }

  componentDidMount() {
    // Sử dụng axios để fetch data từ API
    apiClient
      .get("http://localhost:8080/api/brands")
      .then((response) => {
        this.setState({ brands: response.data });
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }

  render() {
    const { brands } = this.state;

    return (
      <div className="container-fluid py-5">
        <div className="container py-5">
          <div
            className="text-center mx-auto mb-5"
            style={{ maxWidth: "700px" }}
          >
            <h1 className="display-2 text-blue">Thương hiệu</h1>
            <p>
              Vẻ đẹp không chỉ là làn da, mà là sự tự tin bạn mang theo mỗi
              ngày. Chăm sóc bản thân để tỏa sáng từ bên trong
            </p>
          </div>

          <div className="brand-sliders-container">
            {/* Slider for Even IDs */}
            <div
              className="brand-slider"
              style={{
                "--width": "200px",
                "--height": "190px",
                "--quantity": "5",
              }}
            >
              <div className="list">
                {brands
                  .filter((brand) => brand.brandId % 2 === 0) // Filter even IDs
                  .map((brand, index) => (
                    <div
                      className="item"
                      key={brand.brandId}
                      style={{ "--position": index + 1 }}
                    >
                      <a href={`/products?brandId=${brand.brandId}`}>
                        <img src={require(`../../assets/img/${brand.img}`)} />
                        {this.state.showName && <span>{brand.name}</span>}
                      </a>
                    </div>
                  ))}
              </div>
            </div>

            {/* Slider for Odd IDs */}
            <div
              className="brand-slider"
              style={{
                "--width": "200px",
                "--height": "190px",
                "--quantity": "5",
              }}
              reverse="true"
            >
              <div className="list">
                {brands
                  .filter((brand) => brand.brandId % 2 !== 0) // Filter odd IDs
                  .map((brand, index) => (
                    <div
                      className="item"
                      key={brand.brandId}
                      style={{ "--position": index + 1 }}
                    >
                      <a href={`/products?brandId=${brand.brandId}`}>
                        <img
                          src={require(`../../assets/img/${brand.img}`)}
                          alt={`Brand ${brand.name}`}
                        />
                        {this.state.showName && <span>{brand.name}</span>}
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
