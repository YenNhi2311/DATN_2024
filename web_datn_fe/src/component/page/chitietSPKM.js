import axios from "axios"; // Import axios
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { toast, ToastContainer } from "react-toastify";

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/brand.css";
import "../../assets/css/card.css";
import "../../assets/css/category.css";
import "../../assets/css/shop.css";
import "../../assets/css/style.css";
import { useCart } from "../../component/page/CartContext";
const ChiTietSPKM = () => {
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [productpromotion, setProductPromotion] = useState(null); // State for product details
  const [loading, setLoading] = useState(true); // State for loading status
  const [activeTab, setActiveTab] = useState("about"); // State for active tab
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isPromotionActive, setIsPromotionActive] = useState(true);
  const navigate = useNavigate();
  const [productPromotionId, setProductPromotionId] = useState(null);
  const [productId, setProductId] = useState(null);
  const { cartItems, fetchCartItems } = useCart();
  let intervalId = null; // To store the interval ID for countdown
  // Handle increase and decrease of quantity
  const handleIncrease = () => {
    if (quantity < productpromotion.productDetails?.quantity) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    } else {
      alert("Không đủ hàng trong kho");
    }
  };
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
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
    slidesToShow: 4, // Điều chỉnh lại tùy thuộc vào kích thước item và margin
    slidesToScroll: 4,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5, // Điều chỉnh lại nếu cần
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3, // Điều chỉnh lại nếu cần
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2, // Điều chỉnh lại nếu cần
          slidesToScroll: 1,
        },
      },
    ],
  };
  const calculateMarketPrice = (price, discountPercent) => {
    // Tính giá thị trường = giá - khuyến mãi
    const marketPrice = price - (price * discountPercent) / 100;

    // Tính số tiền tiết kiệm = khuyến mãi = (giá * phần trăm khuyến mãi) / 100
    const savingAmount = (price * discountPercent) / 100;

    return {
      marketPrice: marketPrice.toLocaleString(), // Format thành chuỗi có dấu phẩy
      savingAmount: savingAmount.toLocaleString(),
    };
  };
  // Fetch product details when component mounts or id changes
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true); // Bắt đầu tải dữ liệu
      const productId = localStorage.getItem("selectedProductId");
      const productPromotionId = localStorage.getItem(
        "selectedProductPromotionId"
      );

      try {
        // Lấy dữ liệu khuyến mãi sản phẩm theo ID
        const productPromotionResponse = await axios.get(
          `http://localhost:8080/api/home/productpromotion?id=${productPromotionId}`
        );
        const productPromotion = productPromotionResponse.data;

        // Trích xuất productId và promotionId
        const productId = productPromotion.productId;
        const promotionId = productPromotion.promotionId;

        // Lấy thông tin sản phẩm theo ID
        const productResponse = await axios.get(
          `http://localhost:8080/api/home/product?id=${productId}`
        );
        const productData = productResponse.data;

        // Lấy chi tiết sản phẩm theo ID
        const productDetailsResponse = await axios.get(
          `http://localhost:8080/api/home/productdetail?productId=${productId}`
        );
        const productDetails = productDetailsResponse.data[0];

        // Lấy thông tin thương hiệu liên quan
        const brandResponse = await axios.get(
          `http://localhost:8080/api/home/brand?id=${productData.brandId}`
        );
        const brandData = brandResponse.data;

        // Lấy thông tin danh mục liên quan
        const categoryResponse = await axios.get(
          `http://localhost:8080/api/home/category?id=${productData.categoryId}`
        );
        const categoryData = categoryResponse.data;

        // Lấy thông tin dung tích nếu có
        let capacityData = null;
        if (productDetails.capacityId) {
          const capacityResponse = await axios.get(
            `http://localhost:8080/api/home/capacity?id=${productDetails.capacityId}`
          );
          capacityData = capacityResponse.data;
        }

        // Lấy thông tin loại da
        let skinTypeData = null;
        if (productDetails.skintypeId) {
          const skintypeResponse = await axios.get(
            `http://localhost:8080/api/home/skintype?id=${productDetails.skintypeId}`
          );
          skinTypeData = skintypeResponse.data;
        }

        // Lấy thông tin lợi ích
        let benefitData = null;
        if (productDetails.benefitId) {
          const benefitResponse = await axios.get(
            `http://localhost:8080/api/home/benefit?id=${productDetails.benefitId}`
          );
          benefitData = benefitResponse.data;
        }

        // Lấy thông tin thành phần
        let ingredientData = null;
        if (productDetails.ingredientId) {
          const ingredientResponse = await axios.get(
            `http://localhost:8080/api/home/ingredient?id=${productDetails.ingredientId}`
          );
          ingredientData = ingredientResponse.data;
        }

        // Lấy thông tin khuyến mãi theo ID
        const promotionResponse = await axios.get(
          `http://localhost:8080/api/home/promotion?id=${promotionId}`
        );
        const promotionData = promotionResponse.data;

        // Lấy các sản phẩm liên quan theo categoryId
        const relatedProductsResponse = await axios.get(
          `http://localhost:8080/api/home/products?categoryId=${productData.categoryId}`
        );
        const relatedProductsData = relatedProductsResponse.data;

        // Lấy chi tiết các sản phẩm liên quan
        const relatedProductDetails = await Promise.all(
          relatedProductsData.map(async (relatedProduct) => {
            const detailResponse = await axios.get(
              `http://localhost:8080/api/home/productdetail?productId=${relatedProduct.productId}`
            );
            const relatedBrandResponse = await axios.get(
              `http://localhost:8080/api/home/brand?id=${relatedProduct.brandId}`
            );
            return {
              ...relatedProduct,
              details: detailResponse.data[0], // Lấy phần tử đầu tiên từ mảng chi tiết sản phẩm
              brand: relatedBrandResponse.data,
            };
          })
        );

        // Kiểm tra thời gian khuyến mãi
        const currentDate = new Date();
        if (new Date(promotionData.endDate) < currentDate) {
          navigate("/"); // Điều hướng đến trang chính nếu khuyến mãi đã kết thúc
          return;
        }

        // Set sản phẩm liên quan
        setRelatedProducts(relatedProductDetails);

        // Set trạng thái sản phẩm khuyến mãi
        setProductPromotion({
          productData,
          promotionData,
          productDetails,
          brand: brandData,
          category: categoryData,
          capacity: capacityData,
          skintype: skinTypeData,
          benefit: benefitData,
          ingredient: ingredientData,
        });

        // Bắt đầu đếm ngược thời gian
        startCountdown(promotionData.endDate);
        setLoading(false); // Dừng tải dữ liệu
      } catch (error) {
        console.error("Error fetching product:", error.message);
        setLoading(false);
      }
    };

    const startCountdown = (endDate) => {
      const updateTimeLeft = () => {
        const now = new Date();
        const promotionEndDate = new Date(endDate);
        const timeLeft = promotionEndDate - now;

        if (timeLeft < 0) {
          clearInterval(intervalId); // Dừng đếm ngược khi khuyến mãi kết thúc
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          setIsPromotionActive(false); // Đánh dấu khuyến mãi không còn hiệu lực
          navigate("/");
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
      };

      updateTimeLeft(); // Gọi lần đầu để thiết lập thời gian ngay lập tức
      intervalId = setInterval(updateTimeLeft, 1000); // Cập nhật thời gian mỗi giây
    };

    fetchProduct();

    // Dọn dẹp interval khi component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (!productpromotion) {
    return <div>No product found</div>; // Handle case when product is not found
  }
  const { marketPrice, savingAmount } = calculateMarketPrice(
    productpromotion.productDetails?.price,
    productpromotion.promotionData?.percent || 0
  );
  const handleAddToCart = async (productDetailId, quantity) => {
    const userData = localStorage.getItem("userData");
    const productPromotionId = localStorage.getItem(
      "selectedProductPromotionId"
    );

    if (!userData) {
      alert("Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ hàng.");
      return;
    }

    try {
      const decryptedData = CryptoJS.AES.decrypt(
        userData,
        "secret-key"
      ).toString(CryptoJS.enc.Utf8);
      const parsedData = JSON.parse(decryptedData);
      const userId = parsedData.user_id;

      if (!userId) {
        toast.error("Không thể xác định người dùng. Vui lòng đăng nhập lại.");
        return;
      }

      const cartResponse = await axios.get(
        `http://localhost:8080/api/cart/${userId}`
      );
      const cartData = cartResponse.data;

      if (cartData.length === 0) {
        console.error("Không tìm thấy cartId");
        return;
      }

      const cartId = cartData[0].cartId;

      const cartItemsResponse = await axios.get(
        `http://localhost:8080/api/cart/items/${userId}`
      );
      const cartItems = cartItemsResponse.data;

      const existingCartItem = cartItems.find(
        (item) =>
          item.productDetail.productDetailId === productDetailId &&
          (item.productPromotion
            ? item.productPromotion.productPromotionId === productPromotionId
            : productPromotionId === null || productPromotionId === 0)
      );

      if (existingCartItem) {
        const updatedQuantity = existingCartItem.quantity + quantity;

        const updateResponse = await axios.post(
          `http://localhost:8080/api/cart/cartItem/update/${existingCartItem.cartItemId}/${productDetailId}/${productPromotionId}/${updatedQuantity}`
        );
        console.log("Response from update API:", updateResponse.data); // Thêm dòng này
        if (updateResponse.status === 200) {
          toast.success("Sản phẩm đã được cập nhật số lượng trong giỏ hàng!");
          fetchCartItems(userId);
        }
      } else {
        const addResponse = await axios.post(
          `http://localhost:8080/api/cart/cartItem/${cartId}/${productDetailId}/${productPromotionId}/${quantity}`
        );

        console.log("Response from add API:", addResponse.data); // Thêm dòng này
        if (addResponse.status === 201) {
          toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
          fetchCartItems(userId);
        }
      }
    } catch (error) {
      console.error(
        "Lỗi khi thêm sản phẩm vào giỏ hàng:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab); // Set the active tab
  };
  const generateBarcode = (productId) => {
    const idString = productId.toString(); // Convert product ID to string
    return idString.padStart(6, "0"); // Pad the ID to 6 digits with leading zeros if needed
  };
  const barcode = productpromotion?.id
    ? generateBarcode(productpromotion.id)
    : "N/A";
  return (
    <div>
      <div className="container-fluid page-header3 py-5 text-center"></div>
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
      <div className="container-fluid py-3 mt-3">
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-8 col-xl-12">
              <div className="row">
                <div className="col-lg-6">
                  <div className="border-rounded">
                    <a href="#">
                      <img
                        src={require(`../../assets/img/${productpromotion.productDetails?.img}`)} // Using a default image if not available
                        alt={productpromotion.name}
                      />
                    </a>
                  </div>
                  <div className="img-select">
                    {/* Add your image selection logic here */}
                  </div>
                </div>
                <div className="col-lg-6">
                  <h4 className="fw-bold mb-3">
                    {productpromotion.productData?.name}
                  </h4>
                  <p className="mb-3">
                    Loại sản phẩm:{" "}
                    {productpromotion.category?.name || "Unknown"}
                  </p>
                  <div className="d-flex mb-4">
                    <i className="fa fa-star text-secondary"></i>
                    <i className="fa fa-star text-secondary"></i>
                    <i className="fa fa-star text-secondary"></i>
                    <i className="fa fa-star text-secondary"></i>
                    <i className="fa fa-star"></i>
                  </div>
                  <div class="flash-deal">
                    <div className="textname">
                      {" "}
                      {productpromotion.promotionData.name}
                    </div>

                    {timeLeft && isPromotionActive ? (
                      <span class="text">
                        KẾT THÚC TRONG:{" "}
                        <span className="time">{timeLeft.days}</span>
                        <span className="separator">:</span>
                        <span className="time">{timeLeft.hours}</span>
                        <span className="separator">:</span>
                        <span className="time">{timeLeft.minutes}</span>
                        <span className="separator">:</span>
                        <span className="time">{timeLeft.seconds}</span>
                      </span>
                    ) : (
                      <p>Promotion has ended</p>
                    )}
                  </div>
                  <span class="txt_price">
                    {" "}
                    {marketPrice.toLocaleString() || "Unknown"} đ
                  </span>
                  <p className="vat-included">(Đã bao gồm VAT)</p>
                  <div>
                    Giá thị trường:{" "}
                    <span class="old-price">
                      {productpromotion.productDetails?.price?.toLocaleString()}{" "}
                      đ
                    </span>{" "}
                    - Tiết kiệm:{" "}
                    <span class="discount">
                      {savingAmount} đ
                      <span className="discount2">
                        {" "}
                        ({productpromotion.promotionData.percent || 0}%)
                      </span>
                    </span>
                  </div>
                  <span className="txt_price" id="product-final_price"></span>
                  <div
                    className="d-flex align-items-center mb-3 "
                    style={{ width: "100%", maxWidth: "350px" }} // Adjust width as needed
                  >
                    <button
                      className="btn btn-outline-primary"
                      onClick={handleDecrease}
                      disabled={quantity <= 1} // Disable the button if quantity is 1
                    >
                      <i className="fa fa-minus"></i>
                    </button>
                    <input
                      type="number"
                      className="form-control text-center border-5"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      } // Ensure quantity is at least 1
                      min="1"
                      style={{
                        width: "50px", // Adjust width
                        border: "none", // Remove border for a cleaner look
                        textAlign: "center", // Center text
                      }}
                    />
                    <button
                      className="btn btn-outline-primary"
                      onClick={handleIncrease}
                    >
                      <i className="fa fa-plus"></i>
                    </button>
                    {productpromotion.productDetails?.quantity > 0 ? (
                      <p className="btn btn-primary border border-secondary rounded-pill px-4 py-2 mb-0 text-white ms-3">
                        Còn {productpromotion.productDetails?.quantity} sản phẩm
                      </p>
                    ) : (
                      <p className="text-danger">Hết hàng</p>
                    )}
                  </div>

                  <div className="capacity-selection">
                    <h6>
                      Dung Tích:{" "}
                      <span style={{ marginLeft: "10px" }}>
                        {productpromotion.capacity.value || "N/A"} mL
                      </span>
                    </h6>
                    <div className="capacity-options">
                      {productpromotion.productDetails?.capacities?.map(
                        (cap, index) => (
                          <button className="capacity-btn" key={index}>
                            {cap.value} mL
                          </button>
                        )
                      ) || "N/A"}
                    </div>
                  </div>
                  <a
                    className="btn btn-primary border border-secondary rounded-pill px-4 py-2 mb-4 text-white"
                    onClick={() => {
                      handleAddToCart(
                        productpromotion.productDetails.productDetailId,
                        quantity // Sử dụng quantity từ state
                      );
                    }}
                  >
                    <i className="fa fa-shopping-bag me-2 text-white"></i>
                    Add to cart
                  </a>
                  <a
                    href="#"
                    className="btn btn-danger border border-secondary rounded-pill px-4 py-2 mb-4 text-white"
                  >
                    <i className="fa fa-shopping-bag me-2 text-white"></i>
                    Mua Ngay
                  </a>
                </div>
              </div>
              <nav>
                <div className="nav nav-tabs mb-3">
                  <button
                    className={`nav-link ${
                      activeTab === "about" ? "active" : ""
                    } border-white border-bottom-0`}
                    type="button"
                    role="tab"
                    onClick={() => handleTabClick("about")}
                  >
                    Thông Tin
                  </button>
                  <button
                    className={`nav-link ${
                      activeTab === "benefits" ? "active" : ""
                    } border-white border-bottom-0`}
                    type="button"
                    role="tab"
                    onClick={() => handleTabClick("benefits")}
                  >
                    Thông Số
                  </button>
                  <button
                    className={`nav-link ${
                      activeTab === "skinType" ? "active" : ""
                    } border-white border-bottom-0`}
                    type="button"
                    role="tab"
                    onClick={() => handleTabClick("skinType")}
                  >
                    Cách Dùng
                  </button>
                  <button
                    className={`nav-link ${
                      activeTab === "ingredients" ? "active" : ""
                    } border-white border-bottom-0`}
                    type="button"
                    role="tab"
                    onClick={() => handleTabClick("ingredients")}
                  >
                    Thành phần
                  </button>
                </div>
              </nav>
              <div>
                {activeTab === "about" && (
                  <div>
                    <h2>Thông Tin sản phẩm</h2>
                    <p>
                      {productpromotion?.productData?.description ||
                        "No description available."}
                    </p>
                  </div>
                )}
                {activeTab === "benefits" && (
                  <div class="container">
                    <h2>Thông số sản phẩm</h2>
                    <table class="table">
                      <tbody>
                        <tr>
                          <th>Thông tin</th>
                          <th>Giá trị</th>
                        </tr>
                        <tr>
                          <td class="info-cell">Barcode</td>
                          <td>
                            {generateBarcode(
                              productpromotion.productData.productId
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td class="info-cell">Thương Hiệu</td>
                          <td>{productpromotion.brand?.name}</td>
                        </tr>
                        <tr>
                          <td class="info-cell">Xuất xứ thương hiệu</td>
                          <td>{productpromotion.brand?.place}</td>
                        </tr>
                        <tr>
                          <td class="info-cell">Nơi sản xuất</td>
                          <td>{productpromotion.brand?.place}</td>
                        </tr>
                        <tr>
                          <td class="info-cell">Loại da</td>
                          <td>
                            {productpromotion.skintype
                              ? productpromotion.skintype.name
                              : "No skin type available"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
                {activeTab === "skinType" && (
                  <div>
                    <h2>Hướng Dẫn Sử dụng</h2>
                    <ul>
                      {productpromotion.benefit?.name ? (
                        <li
                          dangerouslySetInnerHTML={{
                            __html: productpromotion.benefit.name.replace(
                              /\n/g,
                              "<br />"
                            ),
                          }}
                        />
                      ) : (
                        <li>No ingredient listed.</li>
                      )}
                    </ul>
                  </div>
                )}
                {activeTab === "ingredients" && (
                  <div>
                    <h2>thành phần sản phẩm</h2>
                    <ul>
                      {productpromotion.ingredient?.name ? (
                        <li
                          dangerouslySetInnerHTML={{
                            __html: productpromotion.ingredient.name.replace(
                              /\n/g,
                              "<br />"
                            ),
                          }}
                        />
                      ) : (
                        <li>No ingredient listed.</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid testimonial py-5">
        <div className="container py-5">
          <div className="testimonial-header text-left">
            <h1 className=" text-dark">Đánh Giá Sản Phẩm</h1>
          </div>
          <div className="owl-carousel testimonial-carousel">
            {[1, 2].map((_, index) => (
              <div
                key={index}
                className="testimonial-item img-border-radius bg-light rounded p-4"
              >
                <div className="position-relative">
                  <i
                    className="fa fa-quote-right fa-2x text-secondary position-absolute"
                    style={{ bottom: "30px", right: "0" }}
                  ></i>
                  <div className="mb-4 pb-4 border-bottom border-secondary">
                    <p className="mb-0"></p>
                  </div>
                  <div className="d-flex align-items-center flex-nowrap">
                    <div className="bg-secondary rounded">
                      <img
                        src={require("../../assets/img/vinh.jpg")}
                        className="img-fluid rounded"
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "40px",
                        }}
                        alt="Testimonial"
                      />
                    </div>
                    <div className="ms-4 d-block">
                      <h4 className="text-dark">Nguyễn Phướng vinh</h4>
                      <p className="m-0 pb-3">sản phẩm quá tốt</p>
                      <div className="d-flex pe-5">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star ${
                              i < 5 ? "text-warning" : ""
                            }`}
                          ></i>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <br></br>
          <br></br>
          <br></br>
          <br></br>

          <div className="row g-4">
            <h1 className="text-dark">Sản Phẩm Liên Quan</h1>
            <Slider {...settings}>
              {relatedProducts.map((relatedProduct) => (
                <div
                  className="pro-container"
                  style={{ marginRight: "15px" }}
                  key={relatedProduct.productId}
                >
                  <div className="pro">
                    <img
                      src={
                        relatedProduct.details?.img
                          ? require(`../../assets/img/${relatedProduct.details.img}`)
                          : require("../../assets/img/hasaki.png") // hoặc một hình ảnh mặc định
                      }
                      alt={relatedProduct.name}
                      className="card-img-top"
                    />
                    <div className="icon-container">
                      <a className="btn">
                        <i className="fas fa-shopping-cart"></i>
                      </a>
                      <a href={`/product/${relatedProduct.productId}`}>
                        <i className="fas fa-eye"></i>
                      </a>
                    </div>
                    <div className="des">
                      <span>{relatedProduct.brand?.name}</span>
                      <h6>{relatedProduct.name}</h6>
                      <div className="star">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="far fa-star"></i>
                      </div>
                      <div className="price">
                        <h4 className="sale-price">
                          {relatedProduct.details?.price?.toLocaleString() ||
                            "Unknown"}{" "}
                          đ
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChiTietSPKM;
