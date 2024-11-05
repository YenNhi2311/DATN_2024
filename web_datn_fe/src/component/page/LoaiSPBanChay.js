// src/component/LoaiSPBanChay.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../assets/css/category.css";
import { useCart } from '../../component/page/CartContext';
import {
  fetchBestSellingProducts,
  getBrandById
} from "../../services/authService";

const LoaiSPBanChay = () => {
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const { fetchCartItems } = useCart();
  const navigate = useNavigate();

  // Chuyển hướng đến trang chi tiết sản phẩm
  const handleViewProduct = (productId) => {
    window.scrollTo(0, 0);
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
        return product.product.brandId ? await getBrandById(product.product.brandId) : {};
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

  return (
    <div className="container py-5">
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} />
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
                <div key={index} className="col-md-6 col-lg-4 col-xl-3 col-sm-6 col-6">
                  <div className="pro-container">
                    <div className="pro">
                       {/* Hiển thị phần trăm khuyến mãi nếu còn hiệu lực */}
  {item.promotions && item.promotions.length > 0 && (
    <span className="sale">{item.promotions[0].percent}%</span>
  )}
                      <a onClick={() => handleViewProduct(item.product.productId)}>
                        <img src={(`http://localhost:8080/assets/img/${item.productDetails?.img || "default.jpg"}`)} alt={item.product.name} />
                      </a>
                      <div className="icon-container">
                        
                        <a className="btn" onClick={() => handleViewProduct(item.product.productId)}>
                          <i className="fas fa-eye"></i>
                        </a>
                      </div>
                      <div className="des">
                       
                        <div className="price">
      <h4 className="sale-price">
        {item.discountedPrice ? item.discountedPrice.toLocaleString() : item.productDetails.price.toLocaleString()} đ
      </h4>
      {item.promotions && item.promotions.length > 0 && (
        <span className="original-price" style={{ textDecoration: 'line-through' }}>
          {item.productDetails.price.toLocaleString()} đ
        </span>
      )}
    </div>
                        <div className="brand-sold-container">
                          <span className="brand-name">{item.brand?.name || "Thương Hiệu"}</span>
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
            <p>Không có sản phẩm nào</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoaiSPBanChay;
