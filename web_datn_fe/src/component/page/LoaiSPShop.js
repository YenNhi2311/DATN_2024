import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // Import ToastContainer và toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS
import { useCart } from "../../component/page/CartContext";
import {
  fechCategorys,
  fetchBrands,
  fetchProductById,
  fetchSkintypes,
  getBrandById,
  getCategoryById,
  getProductDetailById,
} from "../../services/authService";
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
  const [productPromotions, setProductPromotions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi các hàm để lấy dữ liệu từ API
    fetchBrandsData();
    fetchCategoriesData();
    fetchSkintypesData();
    fetchData(); // Giả sử hàm này sẽ cập nhật products
  }, []);

  useEffect(() => {
    // Kiểm tra xem products đã được tải và có dữ liệu chưa
    window.scrollTo(0, 0);
    if (products.length > 0) {
        const selectedCategoryId = localStorage.getItem("selectedCategoryId");
        const selectedBrandId = localStorage.getItem("selectedBrandId");

        // Nếu chọn một category mới
        if (selectedCategoryId) {
            // Xóa selectedBrandId để tránh lọc theo thương hiệu cũ
            localStorage.removeItem("selectedBrandId");
        }

        // Nếu chọn một brand mới
        if (selectedBrandId) {
            // Xóa selectedCategoryId để tránh lọc theo danh mục cũ
            localStorage.removeItem("selectedCategoryId");
        }

        // Lọc sản phẩm theo categoryId từ selectedCategoryId
        const filteredByCategory = selectedCategoryId
            ? products.filter(product => product.categoryId === parseInt(selectedCategoryId, 10))
            : products;

        // Lọc sản phẩm theo brandId từ selectedBrandId
        const filteredByBrand = selectedBrandId
            ? filteredByCategory.filter(product => product.brandId === parseInt(selectedBrandId, 10))
            : filteredByCategory;

        // Cập nhật sản phẩm đã lọc
        setFilteredProducts(filteredByBrand);
    }
}, [products]);

  const fetchData = async () => {
    try {
      const response = await fetchProductById();
      const products = await Promise.all(
        response.map(async (product) => {
          const productId = product.productId;
          const brandId = product.brandId;
          const categoryId = product.categoryId;

          const [details, brand, category] = await Promise.all([
            getProductDetailById(productId), // Sử dụng getProductDetailById
            getBrandById(brandId),
            getCategoryById(categoryId),
          ]);

          const skintypesResponse = await fetchSkintypes();
          const skintypes = Array.isArray(skintypesResponse)
            ? skintypesResponse
            : [];

          // Tìm skintype tương ứng với chi tiết sản phẩm đầu tiên
          const skintype =
            skintypes.find(
              (type) =>
                type.skintypeId === details[0]?.productDetail?.skintypeId
            ) || null;

          return {
            ...product,
            productDetails: details, // Gán toàn bộ chi tiết sản phẩm với khuyến mãi
            brand: brand || {},
            category: category || {},
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
    console.log("Selected Product ID:", productId); // Kiểm tra productId
    if (productId) {
      localStorage.setItem("selectedProductId", productId);
      navigate("/product");
    } else {
      console.error("Invalid product ID");
    }
  };

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const handleSearch = (event) => {
    const query = removeAccents(event.target.value.toLowerCase().trim());
    setSearchQuery(query);

    if (query) {
      // Tách các từ khóa từ chuỗi truy vấn
      const keywords = query.split(/\s+/).filter(Boolean); // Tách bằng khoảng trắng và lọc các phần tử rỗng

      const filtered = products.filter((product) => {
        const productName = removeAccents(product.name.toLowerCase());
        // Kiểm tra xem tất cả các từ khóa có nằm trong tên sản phẩm không
        return keywords.every((keyword) => productName.includes(keyword));
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
    if (option === "Nổi bật") {
      // Nếu chọn "Nổi bật", khôi phục danh sách sản phẩm về mặc định
      setFilteredProducts(filteredProducts); // originalProducts là danh sách sản phẩm ban đầu
      setCurrentPage(1);
      return;
    }

    let sortedProducts = [...filteredProducts];

    sortedProducts.sort((a, b) => {
      const priceA = a.productDetails[0].productDetail?.price || 0; // Lấy giá từ productDetail
      const priceB = b.productDetails[0].productDetail?.price || 0;

      switch (option) {
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

  const fetchBrandsData = async () => {
    try {
      const data = await fetchBrands();

      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error.message);
    }
  };

  const fetchCategoriesData = async () => {
    try {
      const data = await fechCategorys();

      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  const fetchSkintypesData = async () => {
    try {
      const data = await fetchSkintypes();
      setSkintypes(data);
    } catch (error) {
      console.error("Error fetching skintypes:", error.message);
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
                    {(brands || [])
                      .sort((a, b) => a.name.localeCompare(b.name)) // Sắp xếp nếu có dữ liệu
                      .map((brand) => (
                        <li style={{ display: "flex" }} key={brand.brandId}>
                          <input
                            type="checkbox"
                            checked={selectedBrandIds.includes(brand.brandId)}
                            onChange={() => handleBrandSelection(brand.brandId)}
                          />
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
                  {(categories || [])
                      .sort((a, b) => a.name.localeCompare(b.name)) // Sắp xếp nếu có dữ liệu
                      .map((category) => (
                 
                      <li style={{ display: "flex" }} key={category.categoryId}>
                        <input
                          type="checkbox"
                          checked={selectedCategoryIds.includes(category.categoryId)}
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
                    {(skintypes || [])
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((skintype) => (
                        <li
                          style={{ display: "flex" }}
                          key={skintype.skintypeId}
                        >
                          <input
                            type="checkbox"
                            checked={selectedSkintypeIds.includes(
                              skintype.skintypeId
                            )}
                            onChange={() =>
                              handleSkintypeSelection(skintype.skintypeId)
                            }
                          />
                          {skintype.name}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Xuất Xứ Thương Hiệu */}
            <div className="col-lg-12">
              <div className="mb-3">
                <h6>Xuất Xứ Thương Hiệu</h6>
                <div className="scrollable-container">
                  <ul className="brand-list">
                    {Array.from(
                      new Set((brands || []).map((brand) => brand.place))
                    )
                      .sort((a, b) => a.localeCompare(b))
                      .map((place) => (
                        <li style={{ display: "flex" }} key={place}>
                          <input
                            type="checkbox"
                            checked={selectedPlaces.includes(place)}
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
                <div className="select-container">
                  <select
                    className="form-control"
                    value={sortOption}
                    onChange={handleSortChange}
                  >
                    <option value="Nổi bật">Nổi bật</option>
                    <option value="Thấp đến cao">Thấp đến cao</option>
                    <option value="Cao đến thấp">Cao đến thấp</option>
                  </select>
                  <span className="arrow-down"></span>
                </div>
              </div>
            </div>
          </div>
          {/* Hiển thị sản phẩm */}
          <div className="row g-4">
            {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                // Lấy `productDetail` đầu tiên (hoặc có thể điều chỉnh nếu cần chọn `productDetail` cụ thể)
                const productDetail =
                  product.productDetails && product.productDetails[0];
                const originalPrice = productDetail?.productDetail?.price;

                // Lấy khuyến mãi từ `promotions` trong `productDetail`
                const promotions = productDetail?.promotions || [];
                const promotion = promotions.length > 0 ? promotions[0] : null;

                const discountPercent = promotion ? promotion.percent : 0;
                const startDate = promotion
                  ? new Date(promotion.startDate)
                  : null;
                const endDate = promotion ? new Date(promotion.endDate) : null;

                // Lấy ngày hiện tại
                const currentDate = new Date();

                // Kiểm tra xem khuyến mãi còn hiệu lực hay không
                const isPromotionActive =
                  promotion &&
                  currentDate >= startDate &&
                  currentDate <= endDate;

                // Tính giá sau khuyến mãi nếu khuyến mãi còn hiệu lực
                const discountedPrice = isPromotionActive
                  ? originalPrice - originalPrice * (discountPercent / 100)
                  : originalPrice;

                return (
                  <div
                    key={product.productId}
                    className="col-md-9 col-lg-4 col-xl-3 col-sm-6 col-6"
                  >
                    <div className="pro-container">
                      {/* Nội dung sản phẩm */}
                      <div className="pro">
                        {/* Hiển thị phần trăm khuyến mãi nếu còn hiệu lực */}
                        {isPromotionActive && (
                          <span className="sale">{discountPercent}%</span>
                        )}
                        <a onClick={() => handleViewProduct(product.productId)}>
                          <img
                            src={(`http://localhost:8080/assets/img/${productDetail?.productDetail?.img}`)}
                            alt={product.name}
                          />
                        </a>
                        {/* Các nút chức năng */}
                        <div className="icon-container">
                          <a
                            className="btn"
                            onClick={() => handleViewProduct(product.productId)}
                          >
                            <i className="fas fa-eye"></i>
                          </a>
                        </div>
                        {/* Thông tin sản phẩm */}
                        <div className="des">
                          <div className="price">
                            <h4 className="sale-price">
                              {discountedPrice.toLocaleString()} đ
                            </h4>
                            {/* Luôn hiển thị giá gốc */}
                            {isPromotionActive && (
                              <h4
                                className="original-price"
                                style={{ textDecoration: "line-through" }}
                              >
                                {originalPrice.toLocaleString()} đ
                              </h4>
                            )}
                          </div>
                          <span>
                            {product?.brand?.name || "Chưa có thương hiệu"}
                          </span>
                          <h6>{product.name}</h6>
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

          {/* Pagination */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`page-item ${
                  index + 1 === currentPage ? "active" : ""
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoaiSPShop;
