import axios from "axios"; // Import axios
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/brand.css";
import "../../assets/css/card.css";
import "../../assets/css/category.css";
import "../../assets/css/shop.css";
import "../../assets/css/style.css";

const ChiTietSPKM = () => {
  const { productPromotionId, productId } = useParams();
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [productpromotion, setProductPromotion] = useState(null); // State for product details
  const [loading, setLoading] = useState(true); // State for loading status
  const [activeTab, setActiveTab] = useState("about"); // State for active tab
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isPromotionActive, setIsPromotionActive] = useState(true);
  const navigate = useNavigate();

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
      setLoading(true); // Start loading
      try {
        // Fetch the product promotion data by ID
        const productPromotionResponse = await axios.get(
          `http://localhost:8080/api/home/productpromotions/${productPromotionId}`
        );
        const productPromotion = productPromotionResponse.data;

        // Extract the product and promotion data
        const productId = productPromotion.productId;
        const promotionId = productPromotion.promotionId;

        const productResponse = await axios.get(
          `http://localhost:8080/api/products/${productId}`
        );
        const productData = productResponse.data;

        // Fetch product details by product ID
        const productDetailsResponse = await axios.get(
          `http://localhost:8080/api/productdetails/${productId}`
        );
        const productDetails = productDetailsResponse.data;

        // Fetch related brand details
        const brandResponse = await axios.get(
          `http://localhost:8080/api/brands/${productData.brandId}`
        );
        const brandData = brandResponse.data;

        // Fetch related category details
        const categoryResponse = await axios.get(
          `http://localhost:8080/api/categories/${productData.categoryId}`
        );
        const categoryData = categoryResponse.data;

        // Fetch capacity details if available in the product details
        const capacityResponse = await axios.get(
          `http://localhost:8080/api/capacities/${productDetails.capacityId}`
        );
        const capacityData = capacityResponse.data;

        // Fetch skin type details
        const skintypeResponse = await axios.get(
          `http://localhost:8080/api/skintypes/${productDetails.skintypeId}`
        );
        const skinTypeData = skintypeResponse.data;

        // Fetch benefit details
        const benefitResponse = await axios.get(
          `http://localhost:8080/api/benefits/${productDetails.benefitId}`
        );
        const benefitData = benefitResponse.data;

        // Fetch ingredient details
        const ingredientResponse = await axios.get(
          `http://localhost:8080/api/ingredients/${productDetails.ingredientId}`
        );
        const ingredientData = ingredientResponse.data;

        const promotionResponse = await axios.get(
          `http://localhost:8080/api/promotions/${promotionId}`
        );
        const promotionData = promotionResponse.data;

        const relatedProductsResponse = await axios.get(
          `http://localhost:8080/api/products?categoryId=${productData.categoryId}`
        );
        const relatedProductsData = relatedProductsResponse.data;

        // Fetch details and brand for each related product concurrently
        const relatedProductDetails = await Promise.all(
          relatedProductsData.map(async (relatedProduct) => {
            const detailResponse = await axios.get(
              `http://localhost:8080/api/productdetails/${relatedProduct.productId}`
            );
            const brandResponse = await axios.get(
              `http://localhost:8080/api/brands/${relatedProduct.brandId}`
            );

            return {
              ...relatedProduct,
              details: detailResponse.data,
              brand: brandResponse.data, // Add brand data here
            };
          })
        );
        const currentDate = new Date();
        if (new Date(promotionData.endDate) < currentDate) {
          navigate("/"); // Redirect to homepage if promotion has ended
          return;
        }

        // Set sản phẩm liên quan
        setRelatedProducts(relatedProductDetails);

        // Set the product state
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

        // Start the countdown
        startCountdown(promotionData.endDate);

        setLoading(false); // Stop loading
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
          clearInterval(intervalId); // Clear the interval when the promotion ends
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          setIsPromotionActive(false); // Set promotion as inactive
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

      updateTimeLeft(); // Initial call to set the time immediately
      intervalId = setInterval(updateTimeLeft, 1000); // Update the time every second
    };

    fetchProduct();

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [productPromotionId, productId]);

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
  const handleAddToCart = async (
    productDetailId,
    productPromotionId,
    quantity
  ) => {
    const userData = localStorage.getItem("userData");

    if (!userData) {
      alert("Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ hàng.");
      return;
    }

    try {
      // Giải mã dữ liệu người dùng đã lưu để lấy user ID
      const decryptedData = CryptoJS.AES.decrypt(
        userData,
        "secret-key"
      ).toString(CryptoJS.enc.Utf8);
      const parsedData = JSON.parse(decryptedData);
      const userId = parsedData.user_id;

      if (!userId) {
        alert("Không thể xác định người dùng. Vui lòng đăng nhập lại.");
        return;
      }

      // Gọi API để lấy cartId
      const cartResponse = await axios.get(
        `http://localhost:8080/api/cart/${userId}`
      );
      const cartData = cartResponse.data;

      if (cartData.length === 0) {
        console.error("Không tìm thấy cartId");
        return;
      }

      const cartId = cartData[0].cartId; // Lấy cartId từ phản hồi hợp lệ

      // Lấy các mục trong giỏ hàng để kiểm tra
      const cartItemsResponse = await axios.get(
        `http://localhost:8080/api/cart/items/${userId}`
      );
      const cartItems = cartItemsResponse.data;

      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingCartItem = cartItems.find(
        (item) =>
          item.productDetail.productDetailId === productDetailId &&
          (item.productPromotion
            ? item.productPromotion.productPromotionId === productPromotionId
            : productPromotionId === 0)
      );

      if (existingCartItem) {
        // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
        const updatedQuantity = existingCartItem.quantity + quantity;

        // Gửi yêu cầu cập nhật sản phẩm trong giỏ hàng
        const updateResponse = await axios.post(
          `http://localhost:8080/api/cart/cartItem/update/${existingCartItem.cartItemId}/${productDetailId}/${productPromotionId}/${updatedQuantity}`
        );

        if (updateResponse.status === 200) {
          alert("Sản phẩm đã được cập nhật số lượng trong giỏ hàng!");
        }
      } else {
        // Thêm sản phẩm mới vào giỏ hàng nếu chưa có
        const addResponse = await axios.post(
          `http://localhost:8080/api/cart/cartItem/${cartId}/${productDetailId}/${productPromotionId}/${quantity}`
        );

        if (addResponse.status === 201) {
          alert("Sản phẩm đã được thêm vào giỏ hàng!");
        }
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error.message);
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
      <div className="container-fluid page-header py-5 text-center"></div>

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
                    className="input-group quantity mb-5 d-flex align-items-center justify-content-between"
                    style={{ width: "100%", maxWidth: "400px" }} // Adjust width as needed
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
                        productpromotion.productPromotionId, // You can set promotion id here or pass 0 if none
                        quantity
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
            <h1 className="display-5 mb-5 text-dark">Đánh giá sản phẩm</h1>
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
