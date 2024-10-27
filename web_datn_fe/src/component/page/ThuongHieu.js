import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBrands } from "../../services/authService";

const ThuongHieu = () => {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getBrands = async () => {
      try {
        const data = await fetchBrands();
        setBrands(data);
      } catch (error) {
        console.error("Error loading brands:", error);
      }
    };
    getBrands();
  }, []);

  const handleBrandSelection = (brandId) => {
    navigate(`/shop/brand?brandId=${brandId}`);
  };

  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "700px" }}>
          <h1 className="display-2 text-blue">Thương Hiệu</h1>
          <p>
            Vẻ đẹp không chỉ là làn da, mà là sự tự tin bạn mang theo mỗi ngày. Chăm sóc bản thân để tỏa sáng từ bên trong.
          </p>
        </div>

        <div className="brand-sliders-container">
          {/* Slider cho ID chẵn */}
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
                .filter((brand) => brand.brandId % 2 === 0)
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

          {/* Slider cho ID lẻ */}
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
                .filter((brand) => brand.brandId % 2 !== 0)
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
