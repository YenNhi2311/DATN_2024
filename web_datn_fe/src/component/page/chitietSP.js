import axios from "axios"; // Import axios
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer và toast
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "../../assets/css/loaispplq.css";
import { useCart } from "../../component/page/CartContext";
const ChiTietSP = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null); // State for product details
  const [loading, setLoading] = useState(true); // State for loading status
  const [activeTab, setActiveTab] = useState("about"); // State for active tab
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { cartItems, fetchCartItems } = useCart();
  const [colors, setColors] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [capacities, setCapacities] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [variants, setVariants] = useState([]); // State to hold product variants
  // Handle increase and decrease of quantity
  const handleIncrease = () => {
    if (quantity < product.productDetails?.quantity) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    } else {
      toast.error("Không đủ hàng trong kho");
    }
  };
  // Hàm xử lý khi người dùng nhập số lượng trực tiếp vào ô input
  const handleInputChange = (e) => {
    const inputValue = Number(e.target.value);

    // Kiểm tra xem giá trị có phải là số hợp lệ và không lớn hơn số lượng còn trong kho
    if (inputValue > 0 && inputValue <= product.productDetails?.quantity) {
      setQuantity(inputValue);
    } else if (inputValue > product.productDetails?.quantity) {
      // Nếu số lượng nhập lớn hơn số lượng còn trong kho

      setQuantity(product.productDetails?.quantity); // Đặt lại giá trị tối đa là số lượng còn trong kho
    } else {
      // Nếu người dùng nhập số nhỏ hơn hoặc bằng 0, đặt lại về 1
      setQuantity(1);
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
    const productId = localStorage.getItem("selectedProductId");

    if (!productId) {
      console.error("Product ID not found");
      return;
    }

    const fetchProduct = async () => {
      setLoading(true); // Start loading state
      try {
        // Fetch main product details
        const response = await axios.get(`http://localhost:8080/api/products/${productId}`);
        const productData = response.data;

        // Fetch related product details
        const productDetailsResponse = await axios.get(`http://localhost:8080/api/productdetails/${productData.productId}`);
        const productDetails = productDetailsResponse.data;

        // Fetch brand, category, capacity, skin type, benefits, and ingredients
        const [brandData, categoryData, capacityData, skinTypeData, benefitData, ingredientData] = await Promise.all([
          axios.get(`http://localhost:8080/api/brands/${productData.brandId}`),
          axios.get(`http://localhost:8080/api/categories/${productData.categoryId}`),
          productDetails.capacityId ? axios.get(`http://localhost:8080/api/capacities/${productDetails.capacityId}`) : null,
          productDetails.skintypeId ? axios.get(`http://localhost:8080/api/skintypes/${productDetails.skintypeId}`) : null,
          productDetails.benefitId ? axios.get(`http://localhost:8080/api/benefits/${productDetails.benefitId}`) : null,
          productDetails.ingredientId ? axios.get(`http://localhost:8080/api/ingredients/${productDetails.ingredientId}`) : null,
        ]);

        // Fetch related products
        const relatedProductsResponse = await axios.get(`http://localhost:8080/api/products?categoryId=${productData.categoryId}`);
        const relatedProductsData = relatedProductsResponse.data;

        // Fetch details for each related product
        const relatedProductDetails = await Promise.all(
          relatedProductsData.map(async (relatedProduct) => {
            const detailResponse = await axios.get(`http://localhost:8080/api/productdetails/${relatedProduct.productId}`);
            return {
              ...relatedProduct,
              details: detailResponse.data,
            };
          })
        );

        setRelatedProducts(relatedProductDetails);

        // Set product state
        setProduct({
          ...productData,
          productDetails,
          brand: brandData.data,
          category: categoryData.data,
          capacity: capacityData ? capacityData.data : null,
          skintype: skinTypeData ? skinTypeData.data : null,
          benefit: benefitData ? benefitData.data : null,
          ingredient: ingredientData ? ingredientData.data : null,
        });

        // Fetch product variants if available
        if (productDetails.variants) {
          setVariants(productDetails.variants); // Assuming variants is an array in productDetails
        }

        setLoading(false); // End loading state
      } catch (error) {
        console.error("Error fetching product:", error.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, []); // No need for 'id' dependency anymore

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (!product) {
    return <div>No product found</div>; // Handle case when product is not found
  }

  const handleAddToCart = async (productDetailId, productPromotionId, quantity) => {
    const userData = localStorage.getItem("userData");

    if (!userData) {
      toast.error("Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ hàng.");
      return;
    }

    try {
      const decryptedData = CryptoJS.AES.decrypt(userData, "secret-key").toString(CryptoJS.enc.Utf8);
      const parsedData = JSON.parse(decryptedData);
      const userId = parsedData.user_id;

      if (!userId) {
        toast.error("Không thể xác định người dùng. Vui lòng đăng nhập lại.");
        return;
      }

      const cartResponse = await axios.get(`http://localhost:8080/api/cart/${userId}`);
      const cartData = cartResponse.data;

      if (cartData.length === 0) {
        console.error("Không tìm thấy cartId");
        return;
      }

      const cartId = cartData[0].cartId;

      const cartItemsResponse = await axios.get(`http://localhost:8080/api/cart/items/${userId}`);
      const cartItems = cartItemsResponse.data;

      const existingCartItem = cartItems.find(
        (item) =>
          item.productDetail.productDetailId === productDetailId &&
          (item.productPromotion ? item.productPromotion.productPromotionId === productPromotionId : productPromotionId === 0)
      );

      if (existingCartItem) {
        const updatedQuantity = existingCartItem.quantity + quantity;
        const updateResponse = await axios.post(`http://localhost:8080/api/cart/cartItem/update/${existingCartItem.cartItemId}/${productDetailId}/${productPromotionId}/${updatedQuantity}`);

        if (updateResponse.status === 200) {
          toast.success("Sản phẩm đã được cập nhật số lượng trong giỏ hàng!");
          fetchCartItems(userId);
        }
      } else {
        const addResponse = await axios.post(`http://localhost:8080/api/cart/cartItem/${cartId}/${productDetailId}/0/${quantity}`);

        if (addResponse.status === 201) {
          toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
          fetchCartItems(userId);
        }
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error.message);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const generateBarcode = (productId) => {
    const idString = productId.toString();
    return idString.padStart(6, "0");
  };

  const barcode = product?.id ? generateBarcode(product.id) : "N/A";
  return (
    <div className="container">
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
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
                        src={`http://localhost:8080/assets/img/${product.productDetails?.img || 'default-image.jpg'}`} // Using a default image if not available
                        alt={product.name}
                        className="img-fluid"
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
                    Loại sản phẩm: {product.category?.name || "Chưa xác định"}
                  </p>

                  <div className="d-flex mb-4">
                    <i className="fa fa-star text-secondary"></i>
                    <i className="fa fa-star text-secondary"></i>
                    <i className="fa fa-star text-secondary"></i>
                    <i className="fa fa-star text-secondary"></i>
                    <i className="fa fa-star"></i>
                  </div>
                  <span className="txt_price" id="product-final_price">
                    {product.productDetails?.price?.toLocaleString() || "Chưa có giá"} đ
                  </span>
                  <p className="vat-included">(Đã bao gồm VAT)</p>

                  <div className="d-flex align-items-center mb-3" style={{ width: "100%", maxWidth: "350px" }}>
                    <button className="btn btn-outline-primary" onClick={handleDecrease} disabled={quantity <= 1}>
                      <i className="fa fa-minus"></i>
                    </button>
                    <input
                      type="text"
                      className="form-control mx-2"
                      value={quantity}
                      onChange={(e) => {
                        const inputValue = Math.max(1, parseInt(e.target.value) || 1);
                        if (inputValue <= product.productDetails?.quantity) {
                          setQuantity(inputValue);
                        } else {
                          toast.error("Số lượng nhập vượt quá số lượng trong kho");
                          setQuantity(product.productDetails?.quantity);
                        }
                      }}
                      min="1"
                      style={{ width: "50px", textAlign: "center" }}
                    />
                    <button className="btn btn-outline-primary" onClick={handleIncrease}>
                      <i className="fa fa-plus"></i>
                    </button>

                    {product.productDetails?.quantity > 0 ? (
                      <p className="btn btn-primary border border-secondary rounded-pill px-4 py-2 mb-0 text-white ms-3">
                        Còn {product.productDetails.quantity} sản phẩm
                      </p>
                    ) : (
                      <p className="text-danger">Hết hàng</p>
                    )}
                  </div>

                  <div className="product-variations">
                    <h5>Biến Thể Sản Phẩm</h5>
                    <div className="capacity-selection">
                      <h6>
                        Dung Tích: <span style={{ marginLeft: "10px" }}>{product.productDetails?.capacity?.value || "Chưa có dung tích"} mL</span>
                      </h6>
                    </div>
                    <div className="color-selection">
                      <h6>Màu Sắc:</h6>
                      <div className="color-options">
                        <span>{product.productDetails.color?.name || "Chưa có màu"}</span>
                      </div>
                    </div>
                    <div className="skintype-selection">
                      <h6>Loại Da:</h6>
                      <div className="skintype-options">
                        <span>{product.productDetails.skintype?.name || "Chưa có loại da"}</span>
                      </div>
                    </div>
                    <div className="ingredient-selection">
                      <h6>Thành Phần:</h6>
                      <div className="ingredient-options">
                        <span>{product.productDetails.ingredient?.name || "Chưa có thành phần"}</span>
                      </div>
                    </div>
                    <div className="benefit-selection">
                      <h6>Công dụng:</h6>
                      <div className="benefit-options">
                        <span>{product.productDetails.benefit?.name || "Chưa có lợi ích"}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    className="btn btn-primary border border-secondary rounded-pill px-4 py-2 mb-4 text-white"
                    onClick={() => {
                      handleAddToCart(
                        product.productDetails.productDetailId,
                        product.productDetails.productPromotionId || 0,
                        quantity
                      );
                    }}
                  >
                    <i className="fa fa-shopping-bag me-2 text-white"></i>
                    Thêm Giỏ Hàng
                  </a>

                  <a href="#" className="btn btn-danger border border-secondary rounded-pill px-4 py-2 mb-4 text-white">
                    <i className="fa fa-shopping-bag me-2 text-white"></i>
                    Mua Ngay
                  </a>
                </div>
              </div>

              <nav>
                <div className="nav nav-tabs mb-3">
                  <button
                    className={`nav-link ${activeTab === "about" ? "active" : ""} border-white border-bottom-0`}
                    type="button"
                    onClick={() => handleTabClick("about")}
                  >
                    Thông Tin
                  </button>
                  <button
                    className={`nav-link ${activeTab === "benefits" ? "active" : ""} border-white border-bottom-0`}
                    type="button"
                    onClick={() => handleTabClick("benefits")}
                  >
                    Thông Số
                  </button>
                  <button
                    className={`nav-link ${activeTab === "skinType" ? "active" : ""} border-white border-bottom-0`}
                    type="button"
                    onClick={() => handleTabClick("skinType")}
                  >
                    Cách Dùng
                  </button>
                  <button
                    className={`nav-link ${activeTab === "ingredients" ? "active" : ""} border-white border-bottom-0`}
                    type="button"
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
                    <p>{product.description || "Không có mô tả nào."}</p>
                  </div>
                )}
                {activeTab === "benefits" && (
                  <div className="container">
                    <h2>Thông số sản phẩm</h2>
                    <table className="table">
                      <tbody>
                        <tr>
                          <th>Thông tin</th>
                          <th>Giá trị</th>
                        </tr>
                        <tr>
                          <td className="info-cell">Barcode</td>
                          <td>{generateBarcode(product.productId)}</td>
                        </tr>
                        <tr>
                          <td className="info-cell">Thương Hiệu</td>
                          <td>{product.brand?.name || "Chưa có thương hiệu"}</td>
                        </tr>
                        <tr>
                          <td className="info-cell">Xuất xứ thương hiệu</td>
                          <td>{product.brand?.place || "Chưa có thông tin"}</td>
                        </tr>
                        <tr>
                          <td className="info-cell">Nơi sản xuất</td>
                          <td>{product.brand?.place || "Chưa có thông tin"}</td>
                        </tr>
                        <tr>
                          <td className="info-cell">Loại da</td>
                          <td>{product.skintype?.name || "Không có thông tin"}</td>
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
                        <li dangerouslySetInnerHTML={{ __html: product.benefit.name }} />
                      ) : (
                        <li>Không có hướng dẫn sử dụng.</li>
                      )}
                    </ul>
                  </div>
                )}
                {activeTab === "ingredients" && (
                  <div>
                    <h2>Thành phần</h2>
                    <p>{product.ingredient?.name || "Không có thông tin thành phần."}</p>
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
                            className={`fas fa-star ${i < 5 ? "text-warning" : ""
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
                        <span>{relatedProduct.category?.name}</span>{" "}
                        {/* Hiển thị Category */}
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
    </div>
  );
};

export default ChiTietSP;
