import axios from "axios"; // Import axios
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "../../assets/css/loaispplq.css";
import { useCart } from '../../component/page/CartContext';
const ChiTietSP = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null); // State for product details
  const [loading, setLoading] = useState(true); // State for loading status
  const [activeTab, setActiveTab] = useState("about"); // State for active tab
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { cartItems, fetchCartItems } = useCart();
  // Handle increase and decrease of quantity
  const handleIncrease = () => {
    if (quantity < product.productDetails?.quantity) {
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
  
  

  // Fetch product details when component mounts or id changes
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true); // Start loading
      try {
        // Fetch product details by product ID
        const response = await axios.get(
          `http://localhost:8080/api/products/${id}`
        );
        const productData = response.data;

        // Fetch the product details related to the fetched product
        const productDetailsResponse = await axios.get(
          `http://localhost:8080/api/productdetails/${productData.productId}`
        );
        const productDetails = productDetailsResponse.data;

        // Fetch brand details related to the fetched product
        const brandResponse = await axios.get(
          `http://localhost:8080/api/brands/${productData.brandId}`
        );
        const brandData = brandResponse.data;

        // Fetch category details related to the fetched product
        const categoryResponse = await axios.get(
          `http://localhost:8080/api/categories/${productData.categoryId}`
        );
        const categoryData = categoryResponse.data;

        // Fetch capacity details if available in the product details
        const capacityResponse = await axios.get(
          `http://localhost:8080/api/capacities/${productDetails.capacityId}`
        );
        const capacityData = capacityResponse.data;

        const skintypeResponse = await axios.get(
          `http://localhost:8080/api/skintypes/${productDetails.skintypeId}`
        );
        const skinTypeData = skintypeResponse.data;

        const benefitResponse = await axios.get(
          `http://localhost:8080/api/benefits/${productDetails.benefitId}`
        );
        const benefitData = benefitResponse.data;

        const ingredientResponse = await axios.get(
          `http://localhost:8080/api/ingredients/${productDetails.ingredientId}`
        );
        const ingredientData = ingredientResponse.data;

        // Fetch related products
        const relatedProductsResponse = await axios.get(
          `http://localhost:8080/api/products?categoryId=${productData.categoryId}`
        );

        // Fetch details and brand for each related product concurrently
        const relatedProductsData = relatedProductsResponse.data;
        console.log("Related Products Data:", relatedProductsData);
    
        // Sử dụng productData.categoryId để định nghĩa selectedCategoryId
        const selectedCategoryId = productData.categoryId;
    
        // Fetch details and category for each related product concurrently
        const relatedProductDetails = await Promise.all(
          relatedProductsData
            .filter(product => product.categoryId === selectedCategoryId) // Lọc sản phẩm thuộc cùng category
            .map(async (relatedProduct) => {
              const detailResponse = await axios.get(
                `http://localhost:8080/api/productdetails/${relatedProduct.productId}`
              );
              const categoryResponse = await axios.get(
                `http://localhost:8080/api/categories/${relatedProduct.categoryId}`
              );
              
              return {
                ...relatedProduct,
                details: detailResponse.data,
                category: categoryResponse.data, // Thay vì brand, trả về category
              };
            })
        );

        // Set sản phẩm liên quan
        setRelatedProducts(relatedProductDetails);

        // Set the main product state
        setProduct({
          ...productData,
          productDetails,
          brand: brandData,
          category: categoryData,
          capacity: capacityData,
          skintype: skinTypeData,
          benefit: benefitData,
          ingredient: ingredientData,
        });

        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching product:", error.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (!product) {
    return <div>No product found</div>; // Handle case when product is not found
  }

  const handleAddToCart = async (
    productDetailId,
    productPromotionId,
    quantity // Lấy quantity từ input truyền vào
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
          fetchCartItems(userId); // Cập nhật lại danh sách giỏ hàng sau khi thay đổi
        }
      } else {
        // Thêm sản phẩm mới vào giỏ hàng nếu chưa có
        const addResponse = await axios.post(
          `http://localhost:8080/api/cart/cartItem/${cartId}/${productDetailId}/0/${quantity}`
        );
  
        if (addResponse.status === 201) {
          fetchCartItems(userId); // Lấy lại giỏ hàng sau khi thêm sản phẩm
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
  const barcode = product?.id ? generateBarcode(product.id) : "N/A";
  return (
    <div className="container">
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
                        src={require(`../../assets/img/${product.productDetails?.img}`)} // Using a default image if not available
                        alt={product.name}
                      />
                    </a>
                  </div>
                  <div className="img-select">
                    {/* Add your image selection logic here */}
                  </div>
                </div>
                <div className="col-lg-6">
                  <h4 className="fw-bold mb-3">{product.name}</h4>
                  <p className="mb-3">
                    Loại sản phẩm: {product.category?.name || "Unknown"}
                  </p>

                  <div className="d-flex mb-4">
                    <i className="fa fa-star text-secondary"></i>
                    <i className="fa fa-star text-secondary"></i>
                    <i className="fa fa-star text-secondary"></i>
                    <i className="fa fa-star text-secondary"></i>
                    <i className="fa fa-star"></i>
                  </div>
                  <span className="txt_price" id="product-final_price">
                    {product.productDetails?.price?.toLocaleString() ||
                      "Unknown"}{" "}
                    đ
                  </span>
                  <p className="vat-included">(Đã bao gồm VAT)</p>

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
                        type="text"
                        className="form-control mx-2" // Thêm margin cho khoảng cách giữa các phần tử
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        } // Ensure quantity is at least 1
                        min="1"
                        style={{
                          width: "50px", // Điều chỉnh chiều rộng để dễ nhập hơn
                          textAlign: "center", // Center text
                        }}
                      />

                      <button
                        className="btn btn-outline-primary"
                        onClick={handleIncrease}
                      >
                        <i className="fa fa-plus"></i>
                      </button>
                 

                    {product.productDetails?.quantity > 0 ? (
                      <p className="btn btn-primary border border-secondary rounded-pill px-4 py-2 mb-0 text-white ms-3">
                        Còn {product.productDetails?.quantity} sản phẩm
                      </p>
                    ) : (
                      <p className="text-danger">Hết hàng</p>
                    )}
                  </div>

                  <div className="capacity-selection">
                    <h6>
                      Dung Tích:{" "}
                      <span style={{ marginLeft: "10px" }}>
                        {product.capacity.value || "N/A"} mL
                      </span>
                    </h6>
                    <div className="capacity-options">
                      {product.productDetails?.capacities?.map((cap, index) => (
                        <button className="capacity-btn" key={index}>
                          {cap.value} mL
                        </button>
                      )) || "N/A"}
                    </div>
                  </div>
                  <a
                    className="btn btn-primary border border-secondary rounded-pill px-4 py-2 mb-4 text-white"
                    onClick={() => {
                      handleAddToCart(
                        product.productDetails.productDetailId,
                        product.productDetails.productPromotionId || 0, // You can set promotion id here or pass 0 if none
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
                    <p>{product.description || "No description available."}</p>
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
                          <td>{generateBarcode(product.productId)}</td>
                        </tr>
                        <tr>
                          <td class="info-cell">Thương Hiệu</td>
                          <td>{product.brand.name}</td>
                        </tr>
                        <tr>
                          <td class="info-cell">Xuất xứ thương hiệu</td>
                          <td>{product.brand.place}</td>
                        </tr>
                        <tr>
                          <td class="info-cell">Nơi sản xuất</td>
                          <td>{product.brand.place}</td>
                        </tr>
                        <tr>
                          <td class="info-cell">Loại da</td>
                          <td>
                            {product.skintype
                              ? product.skintype.name
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
                      {product.benefit?.name ? (
                        <li
                          dangerouslySetInnerHTML={{
                            __html: product.benefit.name.replace(
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
                      {product.ingredient?.name ? (
                        <li
                          dangerouslySetInnerHTML={{
                            __html: product.ingredient.name.replace(
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
            <br></br>
            <br></br>
            <br></br>
            <div className="container-fluid related-products py-5">
  <h2 className="text-left mb-4">Sản Phẩm Liên Quan</h2>
  <Slider {...settings}>
    {relatedProducts.map((relatedProduct) => (
      <div
        className="pro-container"
        key={relatedProduct.productId}
        style={{ marginRight: "15px" }} // Khoảng cách giữa các card
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
            <span>{relatedProduct.category?.name}</span> {/* Hiển thị Category */}
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
                {relatedProduct.details?.price?.toLocaleString() || "Unknown"} đ
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
    </div>
  );
};

export default ChiTietSP;
