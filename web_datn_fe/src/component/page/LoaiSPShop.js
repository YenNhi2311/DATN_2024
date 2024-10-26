import axios from "axios";
import CryptoJS from "crypto-js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer và toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS
import { useCart } from "../../component/page/CartContext";

import { apiClient } from "../../config/apiClient";

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
  const navigate = useNavigate();
  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchSkins();
    fetchProducts();
  }, []);
  const handleViewProduct = (productId) => {
    localStorage.setItem("selectedProductId", productId); // Lưu productId vào localStorage
    navigate("/product"); // Điều hướng mà không cần truyền id
  };
  
  
  const fetchProducts = async () => {
    try {
      const response = await apiClient.get("api/products");
      const products = response.data;

      const productDetailsPromises = products.map((product) =>
        axios.get(
          `http://localhost:8080/api/productdetails/${product.productId}`
        )
      );

      const productBrandsPromises = products.map((product) =>
        axios.get(`http://localhost:8080/api/brands/${product.brandId}`)
      );

      const productCategoriesPromises = products.map((product) =>
        axios.get(`http://localhost:8080/api/categories/${product.categoryId}`)
      );

      const skintypesResponse = await axios.get(
        "http://localhost:8080/api/skintypes"
      );
      const skintypes = skintypesResponse.data;

      const [
        productDetailsResponses,
        productBrandsResponses,
        productCategoriesResponses,
      ] = await Promise.all([
        Promise.all(productDetailsPromises),
        Promise.all(productBrandsPromises),
        Promise.all(productCategoriesPromises),
      ]);

      const productDetails = productDetailsResponses.map((res) => res.data);
      const productBrands = productBrandsResponses.map((res) => res.data);
      const productCategories = productCategoriesResponses.map(
        (res) => res.data
      );

      const productsWithDetails = products.map((product, index) => {
        const productDetail = productDetails[index];
        const skinTypeId = productDetail.skintypeId;

        return {
          ...product,
          productDetails: productDetail,
          brand: productBrands[index],
          category: productCategories[index],
          skintype:
            skintypes.find((type) => type.skintypeId === skinTypeId) || null,
        };
      });

      const totalPages = Math.ceil(
        productsWithDetails.length / productsPerPage
      );
      setProducts(productsWithDetails);
      setFilteredProducts(productsWithDetails);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching products:", error.message);
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
      const response = await axios.get("http://localhost:8080/api/brands");
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error.message);
    }
  };

  const fetchSkins = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/skintypes");
      setSkintypes(response.data);
    } catch (error) {
      console.error("Error fetching skin types:", error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  const filterProductsByBrandId = (brandId) => {
    if (brandId) {
      const filtered = products.filter(
        (product) => product.brand.brandId === brandId
      );
      setFilteredProducts(filtered);
      setCurrentPage(1);
    } else {
      setFilteredProducts(products);
      setCurrentPage(1);
    }
  };

  const handleBrandSelection = (brandId) => {
    const newSelectedBrandId = selectedBrandId === brandId ? null : brandId;
    setSelectedBrandId(newSelectedBrandId);
    filterProductsByAll(
      newSelectedBrandId,
      selectedCategoryId,
      selectedSkintypeId,
      selectedPlace
    );
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

  const handlePlaceSelection = (place) => {
    const newSelectedPlace = selectedPlace === place ? null : place;
    setSelectedPlace(newSelectedPlace);
    filterProductsByAll(
      selectedBrandId,
      selectedCategoryId,
      selectedSkintypeId,
      newSelectedPlace
    );
  };

  const filterProductsByCategory = (categoryId) => {
    if (categoryId) {
      const filtered = products.filter(
        (product) => product.category.categoryId === categoryId
      );
      setFilteredProducts(filtered);
      setCurrentPage(1);
    } else {
      setFilteredProducts(products);
      setCurrentPage(1);
    }
  };

  const handleCategorySelection = (categoryId) => {
    const newSelectedCategoryId =
      selectedCategoryId === categoryId ? null : categoryId;
    setSelectedCategoryId(newSelectedCategoryId);
    filterProductsByAll(
      selectedBrandId,
      newSelectedCategoryId,
      selectedSkintypeId,
      selectedPlace
    );
  };

  const handleSkintypeSelection = (skintypeId) => {
    const newSelectedSkintypeId =
      selectedSkintypeId === skintypeId ? null : skintypeId;
    setSelectedSkintypeId(newSelectedSkintypeId);
    filterProductsByAll(
      selectedBrandId,
      selectedCategoryId,
      newSelectedSkintypeId
    );
  };

  const filterProductsByAll = (brandId, categoryId, skintypeId, place) => {
    let filtered = products;

    if (brandId) {
      filtered = filtered.filter(
        (product) => product.brand.brandId === brandId
      );
    }

    if (categoryId) {
      filtered = filtered.filter(
        (product) => product.category.categoryId === categoryId
      );
    }

    if (skintypeId) {
      filtered = filtered.filter(
        (product) => product.skintype.skintypeId === skintypeId
      );
    }

    if (place) {
      filtered = filtered.filter((product) => product.brand.place === place);
    }

    // Filter by price range
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
  const handlePageChange = (pageNumber) => {
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
    setCurrentPage(1); // Đặt lại currentPage về 1
  };
  const handleAddToCart = async (
    productDetailId,
    productPromotionId,
    quantity = 1 // Lấy quantity từ input truyền vào
  ) => {
    const userData = localStorage.getItem("userData");

    if (!userData) {
      toast.error("Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ hàng.");
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
        toast.error("Không thể xác định người dùng. Vui lòng đăng nhập lại.");
        navigate("/login");
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
          toast.success("Sản phẩm đã được cập nhật số lượng trong giỏ hàng!");
          fetchCartItems(userId);
        }
      } else {
        // Thêm sản phẩm mới vào giỏ hàng nếu chưa có
        const addResponse = await axios.post(
          `http://localhost:8080/api/cart/cartItem/${cartId}/${productDetailId}/0/${quantity}`
          
        );

        if (addResponse.status === 201) {
          fetchCartItems(userId);
          toast.success("Sản phẩm đã được thêm vào giỏ hàng!"); // Thông báo thành công
        }
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error.message);
    }
  };
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  return (
    <div className="container py-5">
        <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
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
                      .map(
                        (brand) =>
                          (selectedBrandId === null ||
                            selectedBrandId === brand.brandId) && (
                            <li style={{ display: "flex" }} key={brand.brandId}>
                              <input
                                type="checkbox"
                                checked={selectedBrandId === brand.brandId}
                                onChange={() =>
                                  handleBrandSelection(brand.brandId)
                                }
                              />{" "}
                              {brand.name}
                            </li>
                          )
                      )}
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
                      .map(
                        (category) =>
                          (selectedCategoryId === null ||
                            selectedCategoryId === category.categoryId) && (
                            <li
                              style={{ display: "flex" }}
                              key={category.categoryId}
                            >
                              <input
                                type="checkbox"
                                checked={
                                  selectedCategoryId === category.categoryId
                                }
                                onChange={() =>
                                  handleCategorySelection(category.categoryId)
                                }
                              />
                              {category.name}
                            </li>
                          )
                      )}
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
                      .map(
                        (skintype) =>
                          (selectedSkintypeId === null ||
                            selectedSkintypeId === skintype.skintypeId) && (
                            <li
                              style={{ display: "flex" }}
                              key={skintype.skintypeId}
                            >
                              <input
                                type="checkbox"
                                checked={
                                  selectedSkintypeId === skintype.skintypeId
                                }
                                onChange={() =>
                                  handleSkintypeSelection(skintype.skintypeId)
                                }
                              />{" "}
                              {skintype.name}
                            </li>
                          )
                      )}
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
                    {Array.from(new Set(brands.map((brand) => brand.place)))
                      .sort((a, b) => a.localeCompare(b)) // Sắp xếp theo thứ tự ABC
                      .map((place) => (
                        <li style={{ display: "flex" }} key={place}>
                          <input
                            type="checkbox"
                            checked={selectedPlace === place}
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
        filteredProducts.map((product) => (
          <div
            key={product.productId}
            className="col-md-9 col-lg-4 col-xl-3 col-sm-6 col-6"
          >
            <div className="pro-container">
              <div className="pro">
              <a
                   
                    onClick={() => handleViewProduct(product.productId)}
                    >
                <img
                  src={require(`../../assets/img/${
                    product.productDetails?.img || "default.jpg"
                  }`)}
                  alt={product.name}
                />
                 
                   
                   </a>
                <div className="icon-container">
                  <a
                    className="btn"
                    onClick={() => {
                      const quantity = 1;
                      handleAddToCart(
                        product.productDetails.productDetailId,
                        product.productDetails.productPromotionId || 0,
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
                      {product.productDetails.price.toLocaleString()} đ
                    </h4>
                  </div>
                  <span>{product?.brand?.name}</span>
                  <h6>{product?.name}</h6>
                </div>
              </div>
            </div>
          </div>
        ))
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
                onClick={() => handlePageChange(index + 1)}
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
