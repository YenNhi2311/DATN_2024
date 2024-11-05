import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Slider from 'react-slick';

import { getBrandById, getProductDetailById, getProductsByCategoryId } from '../../services/authService';
const SPlienquan = ({ categoryId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        // Gọi API lấy sản phẩm liên quan
        const relatedProductsData = await getProductsByCategoryId(categoryId);
        const relatedProductDetails = await Promise.all(
          relatedProductsData.map(async (relatedProduct) => {
            const relatedProductDetail = await getProductDetailById(relatedProduct.productId);
            const relatedBrandResponse = await getBrandById(relatedProduct.brandId);
            return {
              ...relatedProduct,
              details: relatedProductDetail,
              brand: relatedBrandResponse,
            };
          })
        );
        setRelatedProducts(relatedProductDetails);
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    fetchRelatedProducts();
  }, [categoryId]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };
  const handleViewProduct = (productId) => {
    localStorage.setItem("selectedProductId", productId);
    navigate("/product");
  };

  return (
    <div>
      <h1 className="text-dark">Sản Phẩm Liên Quan</h1>
      <Slider {...settings}>
        {relatedProducts.map((relatedProduct) => (
          <div
            className="pro-container"
            key={relatedProduct.productId}
            style={{ marginRight: '15px' }}
          >
            <div className="pro">
              <img
                src={
                  relatedProduct.details?.[0].productDetail.img
                    ? require(`../../assets/img/${relatedProduct.details?.[0].productDetail.img}`)
                    : require('../../assets/img/hasaki.png')
                }
                alt={relatedProduct.name}
                className="card-img-top"
              />

              <div className="icon-container">
                <a className="btn">
                  <i className="fas fa-shopping-cart"></i>
                </a>
                <a onClick={() => handleViewProduct(relatedProduct.productId)}>
                  <i className="fas fa-eye"></i>
                </a>
              </div>

              <div className="des">
                <div className="price">
                  <h4 className="sale-price">
                    {relatedProduct.details?.[0].productDetail.price?.toLocaleString() || 'Unknown'} đ
                  </h4>
                </div>
                <span>{relatedProduct.brand?.name}</span>
                <h6>{relatedProduct.name}</h6>
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
        ))}
      </Slider>
    </div>
  );
};

export default SPlienquan;
