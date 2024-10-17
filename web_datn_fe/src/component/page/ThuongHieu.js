import axios from "axios"; // Import axios
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Sử dụng useNavigate để điều hướng

const ThuongHieu = () => {
  const [brands, setBrands] = useState([]); // Sử dụng useState để quản lý trạng thái
  const [showName, setShowName] = useState(true); // Sử dụng state để hiển thị tên thương hiệu
  const navigate = useNavigate(); // useNavigate để điều hướng

  useEffect(() => {
    // Sử dụng axios để fetch data từ API khi component mount
    axios
      .get("http://localhost:8080/api/home/brands")
      .then((response) => {
        setBrands(response.data); // Cập nhật trạng thái với dữ liệu từ API
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }, []); // Chạy một lần khi component mount

  const handleBrandSelection = (brandId) => {
    navigate(`/shop/brand/${brandId}`); // Điều hướng khi chọn thương hiệu
  };

  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        <div
          className="text-center mx-auto mb-5"
          style={{ maxWidth: "700px" }}
        >
          <h1 className="display-2 text-blue">Thương Hiệu</h1>
          <p>
            Vẻ đẹp không chỉ là làn da, mà là sự tự tin bạn mang theo mỗi ngày. Chăm sóc bản thân để tỏa sáng từ bên trong
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
                    <img
                      src={require(`../../assets/img/${brand.img}`)}
                      alt={`Brand ${brand.name}`}
                      onClick={() => handleBrandSelection(brand.brandId)}
                    />
         
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
                    <img
                      src={require(`../../assets/img/${brand.img}`)}
                      alt={`Brand ${brand.name}`}
                      onClick={() => handleBrandSelection(brand.brandId)}
                    />
            
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThuongHieu;
