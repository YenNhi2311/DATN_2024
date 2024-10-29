import axios from "axios";
import CryptoJS from "crypto-js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer và toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS
import { useCart } from "../../component/page/CartContext";

const LoaiSPShop = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skintypes, setSkintypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSkintypeId, setSelectedSkintypeId] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [sortOption, setSortOption] = useState("Nổi bật");
  const { cartItems, fetchCartItems } = useCart();
  const [selectedBrandIds, setSelectedBrandIds] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedSkintypeIds, setSelectedSkintypeIds] = useState([]); // Khởi tạo mảng rỗng
  const [selectedPlaces, setSelectedPlaces] = useState([]); // Khởi tạo mảng rỗng

  const navigate = useNavigate();

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchSkins();

    fetchProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(products); // Đảm bảo hiển thị tất cả sản phẩm ngay từ đầu
  }, [products]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/home/products"
      );
      const products = await Promise.all(
        response.data.map(async (product) => {
          const [detail, brand, category] = await Promise.all([
            axios.get(
              `http://localhost:8080/api/home/productdetail?productId=${product.productId}`
            ),
            axios.get(
              `http://localhost:8080/api/home/brand?id=${product.brandId}`
            ),
            axios.get(
              `http://localhost:8080/api/home/category?id=${product.categoryId}`
            ),
          ]);

          const skintypesResponse = await axios.get(
            "http://localhost:8080/api/home/skintypes"
          );
          const skintypes = Array.isArray(skintypesResponse.data)
            ? skintypesResponse.data
            : [];

          // Log chi tiết để kiểm tra
          console.log("Detail:", detail.data); // Kiểm tra dữ liệu chi tiết
          console.log("Skintypes:", skintypes);

          const skintype =
            skintypes.find(
              (type) => type.skintypeId === detail.data.skintypeId
            ) || null;

          return {
            ...product,
            productDetails: detail.data[0] || {},
            brand: brand.data || {},
            category: category.data || {},
            skintype: skintype,
          };
        })
      );
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  const handleViewProduct = (productId) => {
    localStorage.setItem("selectedProductId", productId);
    navigate("/product");
  };

  const handleAddToCart = async (
    productDetailId,
    productPromotionId,
    quantity = 1 // Lấy quantity từ input truyền vào
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
        `http://localhost:8080/api/cart?userId=${userId}` // Sử dụng query params
      );
      const cartData = cartResponse.data;

      if (cartData.length === 0) {
        console.error("Không tìm thấy cartId");
        return;
      }

      const cartId = cartData[0].cartId; // Lấy cartId từ phản hồi hợp lệ

      // Lấy các mục trong giỏ hàng để kiểm tra
      const cartItemsResponse = await axios.get(
        `http://localhost:8080/api/cart/items?userId=${userId}` // Sử dụng query params
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
          `http://localhost:8080/api/cart/cartItem/update?cartItemId=${existingCartItem.cartItemId}&productDetailId=${productDetailId}&productPromotionId=${productPromotionId}&quantity=${updatedQuantity}` // Sử dụng query params
        );

        if (updateResponse.status === 200) {
          fetchCartItems(userId); // Cập nhật lại danh sách giỏ hàng sau khi thay đổi
          toast.success("Sản phẩm đã được cập nhật số lượng trong giỏ hàng!"); // Thông báo thành công
        }
      } else {
        // Thêm sản phẩm mới vào giỏ hàng nếu chưa có
        const addResponse = await axios.post(
          `http://localhost:8080/api/cart/cartItem?cartId=${cartId}&productDetailId=${productDetailId}&productPromotionId=0&quantity=${quantity}` // Sử dụng query params
        );

        if (addResponse.status === 201) {
          fetchCartItems(userId); // Cập nhật lại danh sách giỏ hàng sau khi thay đổi
          toast.success("Sản phẩm đã được thêm vào giỏ hàng!"); // Thông báo thành công
        }
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error.message);
      toast.error("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!"); // Thông báo lỗi
    }
  };

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const handleSearch = (event) => {
    const query = removeAccents(event.target.value.toLowerCase().trim());
    setSearchQuery(query);

    if (query) {
      const filtered = products.filter((product) => {
        const productName = removeAccents(product.name.toLowerCase());
        return productName.includes(query);
      });
      setFilteredProducts(filtered);
      setCurrentPage(1);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleSortChange = (event) => {
    const sortOption = event.target.value;
    setSortOption(sortOption);
    sortProducts(sortOption);
  };

  const sortProducts = (option) => {
    let sortedProducts = [...filteredProducts];

    sortedProducts.sort((a, b) => {
      const priceA = a.productDetails.price || 0;
      const priceB = b.productDetails.price || 0;

      switch (option) {
        case "Nổi bật":
          return 0;

        case "Thấp đến cao":
          return priceA - priceB;

        case "Cao đến thấp":
          return priceB - priceA;

        default:
          return 0;
      }
    });

    setFilteredProducts(sortedProducts);
    setCurrentPage(1);
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/home/brands");
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error.message);
    }
  };

  const fetchSkins = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/home/skintypes"
      );
      setSkintypes(response.data);
    } catch (error) {
      console.error("Error fetching skin types:", error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/home/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  const filterProductsByBrandIds = (brandIds) => {
    if (brandIds.length > 0) {
      const filtered = products.filter((product) =>
        brandIds.includes(product.brand.brandId)
      );
      setFilteredProducts(filtered);
      setCurrentPage(1);
    } else {
      setFilteredProducts(products);
      setCurrentPage(1);
    }
  };

  const filterProductsByPlace = (place) => {
    if (place) {
      const filtered = products.filter(
        (product) => product.brand.place === place
      );
      setFilteredProducts(filtered);
      setCurrentPage(1);
    } else {
      setFilteredProducts(products);
      setCurrentPage(1);
    }
  };
  const filterProductsByPlaces = (places) => {
    if (places.length > 0) {
      const filtered = products.filter(
        (product) => places.includes(product.place) // Kiểm tra xem product.place có nằm trong mảng places hay không
      );
      setFilteredProducts(filtered);
      setCurrentPage(1);
    } else {
      setFilteredProducts(products);
      setCurrentPage(1);
    }
  };

  const filterProductsByCategoryIds = (categoryIds) => {
    if (categoryIds.length > 0) {
      const filtered = products.filter((product) =>
        categoryIds.includes(product.category.categoryId)
      );
      setFilteredProducts(filtered);
      setCurrentPage(1);
    } else {
      setFilteredProducts(products);
      setCurrentPage(1);
    }
  };

  const handleBrandSelection = (brandId) => {
    const newSelectedBrandIds = selectedBrandIds.includes(brandId)
      ? selectedBrandIds.filter((id) => id !== brandId)
      : [...selectedBrandIds, brandId];

    setSelectedBrandIds(newSelectedBrandIds);
    filterProductsByAll(
      newSelectedBrandIds,
      selectedCategoryIds,
      selectedSkintypeIds,
      selectedPlaces
    );
  };

  const handlePlaceSelection = (place) => {
    const newSelectedPlaces = selectedPlaces.includes(place)
      ? selectedPlaces.filter((p) => p !== place)
      : [...selectedPlaces, place];

    setSelectedPlaces(newSelectedPlaces);
    filterProductsByAll(
      selectedBrandIds,
      selectedCategoryIds,
      selectedSkintypeIds,
      newSelectedPlaces
    );
  };

  // Tương tự cho các hàm lọc khác

  const handleCategorySelection = (categoryId) => {
    const newSelectedCategoryIds = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter((id) => id !== categoryId) // Bỏ chọn nếu đã chọn
      : [...selectedCategoryIds, categoryId]; // Thêm nếu chưa chọn

    setSelectedCategoryIds(newSelectedCategoryIds); // Cập nhật trạng thái mới
    filterProductsByAll(
      selectedBrandIds,
      newSelectedCategoryIds,
      selectedSkintypeIds,
      selectedPlaces
    ); // Gọi hàm lọc với danh sách mới
  };
  const filterProductsBySkintypeIds = (skintypeIds) => {
    if (skintypeIds.length > 0) {
      const filtered = products.filter(
        (product) =>
          product.skintype && skintypeIds.includes(product.skintype.skintypeId) // Kiểm tra sự tồn tại của skintype
      );
      setFilteredProducts(filtered);
      setCurrentPage(1);
    } else {
      setFilteredProducts(products);
      setCurrentPage(1);
    }
  };

  const handleSkintypeSelection = (skintypeId) => {
    const newSelectedSkintypeIds = selectedSkintypeIds.includes(skintypeId)
      ? selectedSkintypeIds.filter((id) => id !== skintypeId) // Bỏ chọn nếu đã chọn
      : [...selectedSkintypeIds, skintypeId]; // Thêm nếu chưa chọn

    setSelectedSkintypeIds(newSelectedSkintypeIds); // Cập nhật trạng thái mới

    // Gọi filterProductsByAll sau khi trạng thái mới đã được cập nhật
    filterProductsByAll(
      selectedBrandIds,
      selectedCategoryIds,
      newSelectedSkintypeIds,
      selectedPlaces
    );
  };

  const filterProductsByAll = (
    selectedBrandIds,
    selectedCategoryIds,
    selectedSkintypeIds,
    selectedPlaces
  ) => {
    let filtered = products;

    // Lọc theo thương hiệu
    if (selectedBrandIds.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrandIds.includes(product.brand.brandId)
      );
    }

    // Lọc theo loại sản phẩm
    if (selectedCategoryIds.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategoryIds.includes(product.category.categoryId)
      );
    }

    // Lọc theo loại da
    if (selectedSkintypeIds.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product.skintype &&
          selectedSkintypeIds.includes(product.skintype.skintypeId) // Kiểm tra sự tồn tại của skintype
      );
    }

    // Lọc theo nơi bán
    if (selectedPlaces.length > 0) {
      filtered = filtered.filter((product) =>
        selectedPlaces.includes(product.brand.place)
      );
    }

    // Lọc theo khoảng giá
    filtered = filtered.filter((product) => {
      const price = product.productDetails.price || 0;
      return price >= minPrice && price <= maxPrice;
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleMinPriceChange = (event) => {
    const value = parseInt(event.target.value);
    setMinPrice(value >= 0 ? value : 0);
  };

  const handleMaxPriceChange = (event) => {
    const value = parseInt(event.target.value);
    setMaxPrice(value >= minPrice ? value : minPrice);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const applyPriceFilter = () => {
    const filteredProducts = products.filter((product) => {
      const price = product.productDetails.price; // Lấy giá của sản phẩm
      return (
        price >= minPrice && price <= (maxPrice === Infinity ? price : maxPrice)
      );
    });

    setFilteredProducts(filteredProducts); // Cập nhật trạng thái filteredProducts
    filterProductsByAll(
      selectedBrandIds,
      selectedCategoryIds,
      selectedSkintypeIds,
      selectedPlaces
    );
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  return (
    <div className="container py-5">
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
      <div className="row g-4">
        {/* Sidebar Filters */}
        <div className="col-lg-2">
          <div className="row g-3">
            {/* Thương hiệu */}
            <div className="col-lg-12">
              <div className="mb-3">
                <h3>Thương Hiệu</h3>
                <div className="scrollable-container">
                  <ul className="brand-list">
                    {brands
                      .sort((a, b) => a.name.localeCompare(b.name)) // Sắp xếp theo thứ tự ABC
                      .map((brand) => (
                        <li style={{ display: "flex" }} key={brand.brandId}>
                          <input
                            type="checkbox"
                            checked={selectedBrandIds.includes(brand.brandId)} // Sử dụng mảng để kiểm tra
                            onChange={() => handleBrandSelection(brand.brandId)}
                          />{" "}
                          {brand.name}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Loại sản phẩm */}
            <div className="col-lg-12">
              <div className="mb-3">
                <h4>Loại Sản Phẩm</h4>
                <div className="scrollable-container">
                  <ul className="brand-list">
                    {categories
                      .sort((a, b) => a.name.localeCompare(b.name)) // Sắp xếp theo thứ tự ABC
                      .map((category) => (
                        <li
                          style={{ display: "flex" }}
                          key={category.categoryId}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategoryIds.includes(
                              category.categoryId
                            )} // Kiểm tra nếu categoryId có trong danh sách đã chọn
                            onChange={() =>
                              handleCategorySelection(category.categoryId)
                            }
                          />
                          {category.name}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Loại da */}
            <div className="col-lg-12">
              <div className="mb-3">
                <h4>Loại da</h4>
                <div className="scrollable-container">
                  <ul>
                    {skintypes
                      .sort((a, b) => a.name.localeCompare(b.name)) // Sắp xếp theo thứ tự ABC
                      .map((skintype) => (
                        <li
                          style={{ display: "flex" }}
                          key={skintype.skintypeId}
                        >
                          <input
                            type="checkbox"
                            checked={selectedSkintypeIds.includes(
                              skintype.skintypeId
                            )} // Kiểm tra nếu skintypeId có trong danh sách đã chọn
                            onChange={() =>
                              handleSkintypeSelection(skintype.skintypeId)
                            }
                          />{" "}
                          {skintype.name}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="mb-3">
                <h6>Xuất Xứ Thương Hiệu</h6>
                <div className="scrollable-container">
                  <ul className="brand-list">
                    {Array.from(new Set(brands.map((brand) => brand.place)))
                      .sort((a, b) => a.localeCompare(b)) // Sắp xếp theo thứ tự ABC
                      .map((place) => (
                        <li style={{ display: "flex" }} key={place}>
                          <input
                            type="checkbox"
                            checked={selectedPlaces.includes(place)} // Kiểm tra nếu place có trong danh sách đã chọn
                            onChange={() => handlePlaceSelection(place)}
                          />
                          {place}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Khoảng giá */}
            <div className="col-lg-12 filter-category">
              <h4>Khoảng giá</h4>
              <div className="price-range-inputs">
                <input
                  type="number"
                  placeholder="₫ TỪ"
                  min="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="₫ ĐẾN"
                  min="0"
                  value={maxPrice === Infinity ? "" : maxPrice}
                  onChange={(e) =>
                    setMaxPrice(e.target.value ? e.target.value : Infinity)
                  }
                />
              </div>
              <button className="apply-button" onClick={applyPriceFilter}>
                Áp dụng
              </button>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="col-lg-10">
          <div className="container">
            <div className="row mb-4">
              <div className="col-md-9">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm sản phẩm..."
                  onChange={handleSearch}
                />
              </div>

              <div className="col-md-3">
                <select
                  className="form-control"
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="Nổi bật">Nổi bật</option>
                  <option value="Thấp đến cao">Thấp đến cao</option>
                  <option value="Cao đến thấp">Cao đến thấp</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row g-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                console.log(product); // Kiểm tra thông tin sản phẩm
                return (
                  <div
                    key={product.productId}
                    className="col-md-9 col-lg-4 col-xl-3 col-sm-6 col-6"
                  >
                    <div className="pro-container">
                      <div className="pro">
                        <a onClick={() => handleViewProduct(product.productId)}>
                          <img
                            src={`../../assets/img/${product.productDetails?.img}`} // Thêm dấu hỏi để tránh lỗi
                            alt={product.name}
                          />
                        </a>
                        <div className="icon-container">
                          <a
                            className="btn"
                            onClick={() => {
                              const quantity = 1;
                              handleAddToCart(
                                product.productDetails?.productDetailId,
                                product.productDetails?.productPromotionId || 0,
                                quantity
                              );
                            }}
                          >
                            <i className="fas fa-shopping-cart"></i>
                          </a>
                          <a
                            className="btn"
                            onClick={() => handleViewProduct(product.productId)}
                          >
                            <i className="fas fa-eye"></i>
                          </a>
                        </div>
                        <div className="des">
                          <div className="price">
                            <h4 className="sale-price">
                              {product.productDetails?.price.toLocaleString()} đ
                            </h4>
                          </div>
                          <span>
                            {product?.brand?.name || "Chưa có thương hiệu"}
                          </span>
                          <h6>{product?.name}</h6>
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
              })
            ) : (
              <div className="no-results" style={{ textAlign: "center" }}>
                Không tìm thấy sản phẩm nào.
              </div>
            )}
          </div>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`page-item ${
                  index + 1 === currentPage ? "active" : ""
                }`}
                // onClick={() => onPageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
    </div>
  );
};

export default LoaiSPShop;
