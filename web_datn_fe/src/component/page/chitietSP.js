import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "../../assets/css/style.css";
import { useCart } from "../../component/page/CartContext";

import DanhGia from "../../component/page/DanhGia";
import SPlienquan from "../../component/page/SPlienquan";
import ThongTinsp from "../../component/page/ThongTinSP";
import {
  addToCart,
  getBenefitsByProductId,
  getBrandById,
  getCapacityProduct,
  getCartByUserId,
  getCartItemsByUserId,
  getCategoryById,
  getColorsByProductId,
  getIngredientById,
  getProductById,
  getProductDetailById,
  getSkintypeById,
  getSkintypeProduct,
  updateCartItem
} from "../../services/authService"; // Import các hàm API từ authService

const ChiTietSP = () => {
  const [capacities, setCapacities] = useState([]); // State để lưu dung tích
  const [skintypes, setSkintypes] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const { fetchCartItems } = useCart();
  const [selectedDetailIndex, setSelectedDetailIndex] = useState(0); // State để lưu index của productDetail đã chọn
  const navigate = useNavigate();
  const [selectedCapacity, setSelectedCapacity] = useState(null);
  const [selectedSkintype, setSelectedSkintype] = useState(null);
  const [filteredCapacities, setFilteredCapacities] = useState([]); // Trạng thái để lưu dung tích đã lọc
  const [filteredSkintypes, setFilteredSkintypes] = useState([]);
  const [filteredBenefits, setFilteredBenefits] = useState([]);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [filteredColors, setFilteredColors] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);

  const handleIncrease = () => {
    if (quantity < product.productDetails[selectedDetailIndex]?.productDetail.quantity) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    } else {
      toast.error("Không đủ hàng trong kho");
    }
  };
  const handleInputChange = (e) => {
    const inputValue = Number(e.target.value);
    if (inputValue > 0 && inputValue <= product.productDetails?.quantity) {
      setQuantity(inputValue);
    } else if (inputValue > product.productDetails?.quantity) {
      setQuantity(product.productDetails?.quantity);
    } else {
      setQuantity(1);
    }
  };
  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div className="custom-prev" onClick={onClick}>
        <i className="fas fa-chevron-left"></i>
      </div>
    );
  };

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <div className="custom-next" onClick={onClick}>
        <i className="fas fa-chevron-right"></i>
      </div>
    );
  };
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    rtl: false, // Giữ nguyên để đổ từ trái sang phải
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };
  useEffect(() => {
    const initializeProductDetail = async () => {
      const productId = localStorage.getItem("selectedProductId");

      if (productId) {
        try {
          const productData = await getProductById(productId);
          const productDetailsWithPromotions = await getProductDetailById(
            productData.productId
          );

          // Lấy productDetailId từ localStorage
          const productDetailId = localStorage.getItem(
            "selectedProductDetailId"
          );

          // Tìm productDetail phù hợp dựa trên productDetailId hoặc lấy phần tử đầu tiên
          const selectedDetail =
            productDetailsWithPromotions.find(
              (detail) =>
                detail.productDetail.productDetailId ===
                parseInt(productDetailId)
            ) || productDetailsWithPromotions[0];

          if (selectedDetail) {
            setSelectedCapacity(
              capacities.find(
                (c) => c.id === selectedDetail.productDetail.capacityId
              )
            );
            setSelectedSkintype(
              skintypes.find(
                (s) => s.id === selectedDetail.productDetail.skintypeId
              )
            );
            setSelectedBenefit(
              benefits.find(
                (b) => b.id === selectedDetail.productDetail.benefitId
              )
            );
            setSelectedColor(
              colors.find((c) => c.id === selectedDetail.productDetail.colorId)
            );

            // Cập nhật selectedDetailIndex
            const index = productDetailsWithPromotions.indexOf(selectedDetail);
            setSelectedDetailIndex(index);
          } else {
            console.error("Product detail not found for the given ID.");
          }
        } catch (error) {
          console.error("Error initializing product detail:", error);
        }
      }
    };

    initializeProductDetail();
  }, [capacities, skintypes, benefits, colors, product]);

  // Hàm chọn dung tích
  const handleCapacityClick = async (selectedCapacity) => {
    console.log("Selected Capacity:", selectedCapacity);
    setSelectedCapacity(selectedCapacity);

    const index = product.productDetails.findIndex(
      (detail) =>
        detail.productDetail.capacityId === selectedCapacity.id &&
        detail.productDetail.skintypeId === selectedSkintype?.id &&
        detail.productDetail.benefitId === selectedBenefit?.id &&
        detail.productDetail.colorId === selectedColor?.id
    );

    if (index !== -1) {
      setSelectedDetailIndex(index);
    } else {
      console.error("No matching product detail found.");
    }
  };

  // Hàm chọn loại da
  const handleSkintypeClick = async (selectedSkintype) => {
    console.log("Selected Skintype:", selectedSkintype);
    setSelectedSkintype(selectedSkintype);

    const index = product.productDetails.findIndex(
      (detail) =>
        detail.productDetail.skintypeId === selectedSkintype.id &&
        detail.productDetail.capacityId === selectedCapacity?.id &&
        detail.productDetail.benefitId === selectedBenefit?.id &&
        detail.productDetail.colorId === selectedColor?.id
    );

    if (index !== -1) {
      setSelectedDetailIndex(index);
    } else {
      console.error("No matching product detail found.");
    }
  };

  // Hàm chọn lợi ích
  const handleBenefitClick = async (selectedBenefit) => {
    console.log("Selected Benefit:", selectedBenefit);
    setSelectedBenefit(selectedBenefit);

    const index = product.productDetails.findIndex(
      (detail) =>
        detail.productDetail.benefitId === selectedBenefit.id &&
        detail.productDetail.skintypeId === selectedSkintype?.id &&
        detail.productDetail.capacityId === selectedCapacity?.id &&
        detail.productDetail.colorId === selectedColor?.id
    );

    if (index !== -1) {
      setSelectedDetailIndex(index);
    } else {
      console.error("No matching product detail found.");
    }
  };

  // Hàm chọn màu sắc
  const handleColorClick = async (selectedColor) => {
    console.log("Selected Color:", selectedColor);
    setSelectedColor(selectedColor);

    const index = product.productDetails.findIndex(
      (detail) =>
        detail.productDetail.colorId === selectedColor.id &&
        detail.productDetail.skintypeId === selectedSkintype?.id &&
        detail.productDetail.capacityId === selectedCapacity?.id &&
        detail.productDetail.benefitId === selectedBenefit?.id
    );

    if (index !== -1) {
      setSelectedDetailIndex(index);
    } else {
      console.error("No matching product detail found for the selected color.");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      setLoading(true);
      const productId = localStorage.getItem("selectedProductId");

      try {
        // Gọi API để lấy dữ liệu sản phẩm
        const productData = await getProductById(productId);
        console.log("Product Data:", productData);

        // Lấy chi tiết sản phẩm
        const productDetails = await getProductDetailById(
          productData.productId
        );
        console.log("Product Details:", productDetails);

        const productDetail = Array.isArray(productDetails)
          ? productDetails[0]
          : productDetails;

        if (productDetail) {
          const [brandData, categoryData] = await Promise.all([
            getBrandById(productData.brandId),
            getCategoryById(productData.categoryId),
          ]);

          const [capacities, skintypes, benefits, colors] = await Promise.all([
            getCapacityProduct(productId),
            getSkintypeProduct(productId),
            getBenefitsByProductId(productId),
            getColorsByProductId(productId),
          ]);

          setCapacities(getUniqueItems(capacities, "capacityId", "value"));
          setSkintypes(getUniqueItems(skintypes, "skintypeId", "name"));
          setBenefits(getUniqueItems(benefits, "benefitId", "name"));
          setColors(getUniqueItems(colors, "colorId", "name"));

          const [skintypeData, ingredientData] = await Promise.all([
            productDetail.skintypeId
              ? getSkintypeById(productDetail.skintypeId)
              : null,
            productDetail.ingredientId
              ? getIngredientById(productDetail.ingredientId)
              : null,
          ]);

        

          // Thiết lập dữ liệu sản phẩm
          setProduct({
            ...productData,
            productDetails,
            brand: brandData,
            category: categoryData,
            capacity: productDetail.capacityId
              ? capacities.find(
                  (c) => c.capacityId === productDetail.capacityId
                )
              : null,
            skintype: skintypeData,
            benefit: productDetail.benefitId
              ? benefits.find((b) => b.benefitId === productDetail.benefitId)
              : null,
            ingredient: ingredientData,
          });

          // Bắt đầu đếm ngược thời gian khuyến mãi
          const promotionData = productDetail.promotions[0];
          if (promotionData) {
            startCountdown(promotionData.endDate);
          }
        } else {
          console.error("No product detail found.");
        }
      } catch (error) {
        console.error("Error fetching product:", error.message);
      } finally {
        setLoading(false);
      }
    };

    const startCountdown = (endDate) => {
      let intervalId = setInterval(() => {
        const now = new Date();
        const promotionEndDate = new Date(endDate);
        const timeLeft = promotionEndDate - now;

        if (timeLeft < 0) {
          clearInterval(intervalId);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          // setIsPromotionActive(false);
          navigate("/product");
          return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        setTimeLeft({
          days: days < 10 ? `0${days}` : days,
          hours: hours < 10 ? `0${hours}` : hours,
          minutes: minutes < 10 ? `0${minutes}` : minutes,
          seconds: seconds < 10 ? `0${seconds}` : seconds,
        });
      }, 1000);

      // Gọi hàm cập nhật lần đầu tiên ngay lập tức
      intervalId();
    };

    fetchProduct();
  }, []); // Đảm bảo thêm mảng dependency rỗng để chỉ chạy một lần khi component mount

  const getUniqueItems = (items, idField, valueField) => {
    return items.reduce((acc, item) => {
      if (!acc.some((i) => i.id === item[idField])) {
        acc.push({ id: item[idField], [valueField]: item[valueField] });
      }
      return acc;
    }, []);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>No product found</div>;
  }


  const handleAddToCart = async (
    productDetailId,
    productPromotionId,
    quantity
  ) => {
   
    const userData = localStorage.getItem("userData");
  
    let userId;
  
    // Kiểm tra nếu userData tồn tại và giải mã để lấy userId
    if (userData) {
      const decryptedData = CryptoJS.AES.decrypt(userData, "secret-key").toString(CryptoJS.enc.Utf8);
      const parsedData = JSON.parse(decryptedData);
      userId = parsedData.user_id;
    }
  
    if (!userId) {
      alert("Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ hàng.");
      navigate("/login"); // Chuyển hướng đến trang đăng nhập
      return;
    }
  
    try {
      const cartData = await getCartByUserId(userId);
      
      // Kiểm tra sự tồn tại của cartData
      if (cartData.length === 0) {
        console.error("Không tìm thấy cartId cho người dùng.");
        return;
      }
  
      const cartId = cartData[0].cartId;
      const cartItems = await getCartItemsByUserId(userId);
  
      const existingCartItem = cartItems.find(
        (item) =>
          item.productDetail.productDetailId === productDetailId &&
          (item.productPromotion
            ? item.productPromotion.productPromotionId === productPromotionId
            : productPromotionId === 0)
      );
  
      if (existingCartItem) {
        const updatedQuantity = existingCartItem.quantity + quantity;
        await updateCartItem(
          existingCartItem.cartItemId,
          productDetailId,
          productPromotionId,
          updatedQuantity
        );
        fetchCartItems(userId);
        toast.success("Sản phẩm đã được cập nhật số lượng trong giỏ hàng!");
      } else {
        await addToCart(cartId, productDetailId, productPromotionId, quantity);
        fetchCartItems(userId);
        toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error.message);
      toast.error("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!");
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const generateBarcode = (productId) => {
    const idString = productId.toString();
    return idString.padStart(6, "0");
  };

  // Lấy `productDetail` đầu tiên (hoặc có thể điều chỉnh nếu cần chọn `productDetail` cụ thể)
  const productDetail = product.productDetails[selectedDetailIndex];
  const originalPrice = productDetail?.productDetail?.price;

  // Lấy khuyến mãi từ `promotions` trong `productDetail`
  const promotions = productDetail?.promotions || [];
  const promotion = promotions.length > 0 ? promotions[0] : null;

  const discountPercent = promotion ? promotion.percent : 0;
  const promotionname = promotion ? promotion.name : 0;
  const startDate = promotion ? new Date(promotion.startDate) : null;
  const endDate = promotion ? new Date(promotion.endDate) : null;

  // Lấy ngày hiện tại
  const currentDate = new Date();

  // Kiểm tra xem khuyến mãi còn hiệu lực hay không
  const isPromotionActive =
    promotion && currentDate >= startDate && currentDate <= endDate;

  // Tính giá sau khuyến mãi nếu khuyến mãi còn hiệu lực
  const discountedPrice = isPromotionActive
    ? originalPrice - originalPrice * (discountPercent / 100)
    : originalPrice;
const Tietkiem=  originalPrice-discountedPrice;
  const barcode = product?.id ? generateBarcode(product.id) : "N/A";
  return (
    <div className="container">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="container-fluid page-header2 py-5 text-center"></div>
      <div className="container-fluid py-3 mt-3">
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-8 col-xl-12">
              <div className="row">
                <div className="col-lg-6">
                  <div className="border-rounded">
                    <a href="#">
                    <img
  src={`http://localhost:8080/assets/img/${
    product.productDetails?.[selectedDetailIndex]?.productDetail?.img || ""
  }`}
  alt={product.name}
/>

                    </a>
                  </div>
                </div>
                <div className="col-lg-6">
                  <h3 className="name">{product.name}</h3>
                  <p className="category">
                    Loại sản phẩm: {product.category?.name || "Unknown"}
                  </p>

                  <div className="start">
                    {[...Array(5)].map((_, index) => (
                      <i
                        key={index}
                        className={`fa fa-star${
                          index < 4 ? " text-secondary" : ""
                        }`}
                      ></i>
                    ))}
                  </div>

                  {isPromotionActive ? (
                    <div className="flash-deal">
                      <div className="textname">{promotionname}</div>
                      <span className="text">
                        KẾT THÚC TRONG:{" "}
                        {timeLeft && (
                          <>
                            <span className="time">{timeLeft.days}</span>:
                            <span className="time">{timeLeft.hours}</span>:
                            <span className="time">{timeLeft.minutes}</span>:
                            <span className="time">{timeLeft.seconds}</span>
                          </>
                        )}
                      </span>
                    </div>
                  ) : null}

                  <span className="txt_price">
                    {isPromotionActive
                      ? discountedPrice.toLocaleString()
                      : originalPrice.toLocaleString()}{" "}
                    đ
                  </span>
                  <p className="vat-included">(Đã bao gồm VAT)</p>

                  {isPromotionActive && (
                    <div className="txt-price">
                      Giá thị trường:{" "}
                      <span className="old-price">
                        {originalPrice.toLocaleString()} đ
                      </span>{" "}
                      - Tiết kiệm:{" "}
                      <span className="discount">
                        {Tietkiem.toLocaleString()} đ
                        <span className="discount2"> ({discountPercent}%)</span>
                      </span>
                    </div>
                  )}

                  <span className="txt_price" id="product-final_price"></span>
                 
                  <div className="variant">
                    {" "}
                    <div className="capacity-selection">
                      <h6>Dung Tích:</h6>
                      <div className="capacity-options">
                        {(filteredCapacities.length > 0
                          ? filteredCapacities
                          : capacities
                        )
                          .sort((a, b) => a.value - b.value)
                          .map((cap, index) => (
                            <button
                              className={`capacity-btn ${
                                selectedCapacity &&
                                selectedCapacity.id === cap.id
                                  ? "selected"
                                  : ""
                              }`}
                              key={index}
                              onClick={() => handleCapacityClick(cap)}
                            >
                              {cap.value} ml
                            </button>
                          ))}
                      </div>
                    </div>
                    <div className="capacity-selection">
                      <h6>Loại Da:</h6>
                      <div className="capacity-options">
                        {(filteredSkintypes.length > 0
                          ? filteredSkintypes
                          : skintypes
                        ).map((skin, index) => (
                          <button
                            className={`capacity-btn ${
                              selectedSkintype &&
                              selectedSkintype.id === skin.id
                                ? "selected"
                                : ""
                            }`}
                            key={index}
                            onClick={() => {
                              handleSkintypeClick(skin);
                              setSelectedSkintype(skin); // Cập nhật selectedSkintype khi nhấn
                            }}
                          >
                            {skin.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="capacity-selection">
                      <h6>Lợi ích:</h6>
                      <div className="capacity-options">
                        {(filteredBenefits.length > 0
                          ? filteredBenefits
                          : benefits
                        ).map((benefit, index) => (
                          <button
                            className={`capacity-btn ${
                              selectedBenefit &&
                              selectedBenefit.id === benefit.id
                                ? "selected"
                                : ""
                            }`}
                            key={index}
                            onClick={() => {
                              handleBenefitClick(benefit);
                              setSelectedBenefit(benefit); // Cập nhật selectedBenefit khi nhấn
                            }}
                          >
                            {benefit.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="capacity-selection">
                      <h6>Màu sắc:</h6>
                      <div className="capacity-options">
                        {(filteredColors.length > 0
                          ? filteredColors
                          : colors
                        ).map((color, index) => (
                          <button
                            className={`capacity-btn ${
                              selectedColor && selectedColor.id === color.id
                                ? "selected"
                                : ""
                            }`}
                            key={index}
                            onClick={() => {
                              handleColorClick(color);
                              setSelectedColor(color); // Cập nhật selectedColor khi nhấn
                            }}
                          >
                            {color.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div
                    className="d-flex align-items-center mb-3"
                    style={{ width: "100%", maxWidth: "350px" }}
                  >
                    <button
                      className="btn btn-outline-primary"
                      onClick={handleDecrease}
                      disabled={quantity <= 1}
                    >
                      <i className="fa fa-minus"></i>
                    </button>
                    <input
                      type="text"
                      className="form-control text-center mx-2"
                      style={{ width: "50px", marginBottom: "0px" }}
                      value={quantity}
                      onChange={(e) => {
                        const inputValue = parseInt(e.target.value) || 1;
                        if (
                          inputValue > 0 &&
                          inputValue <=
                            product.productDetails[selectedDetailIndex]
                              ?.productDetail.quantity
                        ) {
                          setQuantity(inputValue);
                        } else if (
                          inputValue >
                          product.productDetails[selectedDetailIndex]
                            ?.productDetail.quantity
                        ) {
                          toast.error(
                            "Số lượng nhập vượt quá số lượng trong kho"
                          );
                          setQuantity(
                            product.productDetails[selectedDetailIndex]
                              ?.productDetail.quantity
                          );
                        } else {
                          setQuantity(1);
                        }
                      }}
                      min="1"
                    
                    />
                    <button
                      className="btn btn-outline-primary"
                      onClick={handleIncrease}
                    >
                      <i className="fa fa-plus"></i>
                    </button>

                    {product.productDetails[selectedDetailIndex]?.productDetail
                      .quantity > 0 ? (
                      <p className="btn btn-primary border border-secondary rounded-pill px-4 py-2 mb-0 text-white ms-3">
                        Còn{" "}
                        {
                          product.productDetails[selectedDetailIndex]
                            ?.productDetail.quantity
                        }{" "}
                        sản phẩm
                      </p>
                    ) : (
                      <p className="text-danger">Hết hàng</p>
                    )}
                  </div>
                  <br></br>
                  <a  className="btn btn-primary border border-secondary rounded-pill px-4 py-2 mb-4 text-white">
                 Chia sẽ</a>
                  <a
                    className="btn btn-primary border border-secondary rounded-pill px-4 py-2 mb-4 text-white"
                    onClick={() => {
                      const productDetail =
                        product.productDetails[selectedDetailIndex];
                      handleAddToCart(
                        productDetail?.productDetail.productDetailId,
                        productDetail?.productPromotionId || 0, // Thêm dòng này để lấy productPromotionId
                        quantity
                      );
                    }}
                  >
                    <i className="fa fa-shopping-bag me-2 text-white"></i>
                    Thêm Giỏ Hàng
                  </a>
                  <a
                    href="#"
                    className="btn btn-danger border border-secondary rounded-pill px-4 py-2 mb-4 text-white"
                  >
            
                    Mua Ngay
                  </a>
                </div>
              </div>
<ThongTinsp />
              
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid testimonial py-5">
       <DanhGia />
              </div>
         
            <br></br>
            <br></br>
            <br></br>
            <div className="container-fluid related-products py-5">
           
        <SPlienquan />

            </div>
          </div>
    
  );
};

export default ChiTietSP;
