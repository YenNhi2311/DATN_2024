import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "../../assets/css/category.css";
import { useCart } from '../../component/page/CartContext';
import {
  fetchProductPromotions,
  getBrandById,
  getProductById,
  getProductDetailById,
  getPromotionById
} from '../../services/authService';

const KhuyenMai = () => {
  const [productPromotions, setProductPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { cartItems, fetchCartItems } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promotions = await fetchProductPromotions();
        const productPromotionsWithDetails = await Promise.all(
          promotions.map(async (productPromotion) => {
            const productId = productPromotion.productId;
            const promotionId = productPromotion.promotionId;

            const productResponse = await getProductById(productId);
            const productDetailResponse = await getProductDetailById(productId);
            const brandResponse = await getBrandById(productResponse.brandId);
            const promotionResponse = await getPromotionById(promotionId);

            return {
              brand: brandResponse,
              promotion: promotionResponse,
              product: productResponse,
              productDetail: productDetailResponse[0] || {},
              productPromotionId: productPromotion.productPromotionId,
            };
          })
        );

        const currentDate = new Date();
        const activeProductPromotions = productPromotionsWithDetails.filter(
          (promotion) => new Date(promotion.promotion.endDate) > currentDate
        );

        setProductPromotions(activeProductPromotions);
      } catch (error) {
        console.error("Error fetching product promotions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProductClick = (productPromotion) => {
    const { product } = productPromotion;
    localStorage.setItem("selectedProductId", product.productId);
    navigate('/product');
  };

  if (loading) {
    return <p>Loading promotions...</p>;
  }

  const limitedProductPromotions = productPromotions.slice(0, 300);

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
                    const { promotion, product, brand, productDetail } = productPromotion;
                    const promotionPercent = promotion?.percent || 0;
                    const productImage = productDetail?.productDetail.img || "suatam.jpg";
                    const productPrice = productDetail?.productDetail.price || 0;
                    const discountAmount = (productPrice * promotionPercent) / 100;
                    const originalPrice = productPrice - discountAmount;
                    const productBrand = brand?.name || "Brand unavailable";
                    const productName = product?.name || "Product name unavailable";

                    return (
                      <div key={index} className="col-md-6 col-lg-4 col-xl-3 col-sm-6 col-6">
                        <div className="pro-container">
                          <div className="pro">
                            <span className="sale">{promotionPercent}%</span>
                            <a onClick={() => handleProductClick(productPromotion)}>
                            <img src={(`http://localhost:8080/assets/img/${productImage}`)} alt={productName} />
                            </a>
                            <div className="icon-container">
                              <a onClick={() => handleProductClick(productPromotion)}>
                                <i className="fas fa-eye"></i>
                              </a>
                            </div>
                            <div className="des">
                              <div className="price">
                                <h4 className="sale-price">{originalPrice.toLocaleString()} đ</h4>
                                <h4><s>{productPrice.toLocaleString()} đ</s></h4>
                              </div>
                              <span>{productBrand}</span>
                              <h6>{productName}</h6>
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
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KhuyenMai;
