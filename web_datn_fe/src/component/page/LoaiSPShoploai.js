import axios from "axios";
import CryptoJS from "crypto-js";
import React, { Component } from "react";
import "../../assets/css/style.css";
export default class LoaiSPShoploai extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brands: [],
      categories: [],
      skintypes: [],
      products: [],
      filteredProducts: [],
      selectedBrandId: null,
      selectedCategoryId: null,
      selectedSkintypeId: null,
      selectedPlace: null,
      minPrice: 0,
      maxPrice: Infinity,
      searchQuery: "",
      currentPage: 1,
      totalPages: 1,
      productsPerPage: 12,
      sortOption: "Nổi bật",
      showBrandFilter: false,
    };
  }

  componentDidMount() {
    const categoryId = this.getCategoryIdFromURL();
    this.setState({ selectedCategoryId: categoryId }, () => {
      this.fetchProducts();
      this.fetchBrands();
      this.fetchCategories();
      this.fetchSkins();
    });
  }
  getCategoryIdFromURL = () => {
    // Dùng useParams nếu bạn dùng React Router phiên bản mới
    const urlParts = window.location.pathname.split("/");
    return urlParts[urlParts.length - 1]; // Lấy ID từ cuối URL
  };

  fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      const products = response.data;

      // Fetch details for each product
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
        productsWithDetails.length / this.state.productsPerPage
      );

      this.setState({
        products: productsWithDetails,
        totalPages: totalPages,
      }, this.filterProductsByCategory); // Lọc theo categoryId từ URL
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  // Hàm loại bỏ dấu tiếng Việt
  removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  handleSearch = (event) => {
    const query = this.removeAccents(event.target.value.toLowerCase().trim()); // Bỏ dấu và chuyển thành chữ thường
    this.setState({ searchQuery: query });

    // Kiểm tra và lọc sản phẩm theo tên
    if (query) {
      const filteredProducts = this.state.products.filter((product) => {
        const productName = this.removeAccents(product.name.toLowerCase()); // Bỏ dấu và chuyển thành chữ thường cho tên sản phẩm
        return productName.includes(query); // Lọc sản phẩm theo tên, không phân biệt hoa thường, có dấu và không dấu
      });
      this.setState({ filteredProducts, currentPage: 1 }); // Đặt lại trang hiện tại về 1
    } else {
      // Nếu không có truy vấn tìm kiếm (khoảng trắng hoặc trống), hiển thị lại tất cả sản phẩm
      this.setState({ filteredProducts: this.state.products, currentPage: 1 });
    }
  };

  handleSortChange = (event) => {
    const sortOption = event.target.value;
    this.setState({ sortOption }, this.sortProducts);
  };

  sortProducts = () => {
    const { filteredProducts, sortOption } = this.state;
    let sortedProducts = [...filteredProducts];

    sortedProducts.sort((a, b) => {
      const priceA = a.productDetails.price || 0;
      const priceB = b.productDetails.price || 0;

      switch (sortOption) {
        case "Nổi bật":
          return 0; // Không sắp xếp

        case "Thấp đến cao":
          return priceA - priceB; // Sắp xếp theo giá từ thấp đến cao

        case "Cao đến thấp":
          return priceB - priceA; // Sắp xếp theo giá từ cao đến thấp

        default:
          return 0; // Không sắp xếp
      }
    });

    this.setState({ filteredProducts: sortedProducts, currentPage: 1 }); // Cập nhật danh sách sản phẩm đã lọc
  };

  fetchBrands = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/brands");
      this.setState({ brands: response.data });
    } catch (error) {
      console.error("Error fetching brands:", error.message);
    }
  };


  fetchSkins = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/skintypes");
      this.setState({ skintypes: response.data });
    } catch (error) {
      console.error("Error fetching skin types:", error.message);
    }
  };

  fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categories");
      this.setState({ categories: response.data });
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  filterProductsBybrandId = (brandId) => {
    const { products } = this.state;

    if (brandId) {
      const filteredProducts = products.filter(
        (product) => product.brand.brandId === brandId // Kiểm tra xuất xứ thương hiệu
      );
      this.setState({ filteredProducts, currentPage: 1 });
    } else {
      this.setState({ filteredProducts: products, currentPage: 1 });
    }
  };
  handleBrandSelection = (brandId) => {
    const newSelectedBrandId =
      this.state.selectedBrandId === brandId ? null : brandId;

    this.setState({ selectedBrandId: newSelectedBrandId }, () => {
      // Kết hợp lọc theo tất cả các tiêu chí: brand, category, skintype, place
      this.filterProductsByAll(
        newSelectedBrandId,
        this.state.selectedCategoryId,
        this.state.selectedSkintypeId,
        this.state.selectedPlace
      );
    });
  };

  //hàm lọc xuất xứ thương hiệu
  filterProductsByPlace = (place) => {
    const { products } = this.state;

    if (place) {
      const filteredProducts = products.filter(
        (product) => product.brand.place === place // Kiểm tra xuất xứ thương hiệu
      );
      this.setState({ filteredProducts, currentPage: 1 });
    } else {
      this.setState({ filteredProducts: products, currentPage: 1 });
    }
  };

  handlePlaceSelection = (place) => {
    const newSelectedPlace = this.state.selectedPlace === place ? null : place;
    this.setState({ selectedPlace: newSelectedPlace }, () => {
      // Kết hợp lọc theo tất cả các tiêu chí
      this.filterProductsByAll(
        this.state.selectedBrandId,
        this.state.selectedCategoryId,
        this.state.selectedSkintypeId,
        newSelectedPlace
      );
    });
  };
  filterProductsByCategory = () => {
    const { products, selectedCategoryId } = this.state;

    if (selectedCategoryId) {
      const filteredProducts = products.filter(
        (product) =>
          product.category && product.category.categoryId === Number(selectedCategoryId)
      );
      this.setState({ filteredProducts, currentPage: 1 });
    } else {
      this.setState({ filteredProducts: products, currentPage: 1 });
    }
  };  
  handleCategorySelection = (categoryId) => {
    const newSelectedCategoryId =
      this.state.selectedCategoryId === categoryId ? null : categoryId;
  
    this.setState({ selectedCategoryId: newSelectedCategoryId }, () => {
      // Lọc sản phẩm theo loại sản phẩm, thương hiệu, loại da và xuất xứ thương hiệu
      this.filterProductsByAll(
        this.state.selectedBrandId,
        newSelectedCategoryId,
        this.state.selectedSkintypeId,
        this.state.selectedPlace
      );
    });
  };
  

  handleSkintypeSelection = (skintypeId) => {
    const { selectedSkintypeId } = this.state;
    const newSelectedSkintypeId =
      selectedSkintypeId === skintypeId ? null : skintypeId;

    this.setState({ selectedSkintypeId: newSelectedSkintypeId }, () => {
      // In ra giá trị để kiểm tra
      console.log("Selected Skin Type ID:", newSelectedSkintypeId);
      this.filterProductsByAll(
        this.state.selectedBrandId,
        this.state.selectedCategoryId,
        newSelectedSkintypeId
      );
    });
  };

  // Hàm lọc sản phẩm theo loại da
  filterProductsBySkintype = (skintypeId) => {
    const { products } = this.state;

    if (skintypeId) {
      // Lọc sản phẩm theo loại da nếu có skintypeId
      const filteredProducts = products.filter(
        (product) =>
          product.skintype && product.skintype.skintypeId === skintypeId
      );
      this.setState({ filteredProducts, currentPage: 1 });
    } else {
      // Nếu không có loại da được chọn, hiển thị tất cả sản phẩm
      this.setState({ filteredProducts: products, currentPage: 1 });
    }
  };
  filterProductsByAll = (brandId, categoryId, skintypeId, place) => {
    const { products, minPrice, maxPrice } = this.state;

    let filteredProducts = products;

    // Lọc theo thương hiệu
    if (brandId) {
      filteredProducts = filteredProducts.filter(
        (product) => product.brand && product.brand.brandId === brandId
      );
    }

    // Lọc theo loại sản phẩm
    if (categoryId) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.category && product.category.categoryId === categoryId
      );
    }

    // Lọc theo loại da
    if (skintypeId) {
      filteredProducts = filteredProducts.filter(
        (product) => product.productDetails.skintypeId === skintypeId
      );
    }

    // Lọc theo xuất xứ thương hiệu
    if (place) {
      filteredProducts = filteredProducts.filter(
        (product) => product.brand.place === place
      );
    }

    // Lọc theo khoảng giá
    filteredProducts = filteredProducts.filter((product) => {
      const price = product.productDetails.price;
      return (
        price >= minPrice && price <= (maxPrice === Infinity ? price : maxPrice)
      );
    });

    this.setState({ filteredProducts, currentPage: 1 });
    console.log("Filtered Products:", filteredProducts);
  };

  //hàm tính giá đến ...từ...
  applyPriceFilter = () => {
    const { minPrice, maxPrice } = this.state;
    const { products } = this.state;

    const filteredProducts = products.filter((product) => {
      const price = product.productDetails.price; // Lấy giá của sản phẩm
      return (
        price >= minPrice && price <= (maxPrice === Infinity ? price : maxPrice)
      );
    });

    this.setState({ filteredProducts, currentPage: 1 });
  };

  handleAddToCart = async (
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
          `http://localhost:8080/api/cart/cartItem/${cartId}/${productDetailId}/0/${quantity}`
        );

        if (addResponse.status === 201) {
          alert("Sản phẩm đã được thêm vào giỏ hàng!");
        }
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error.message);
    }
  };

  handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= this.state.totalPages) {
      this.setState({ currentPage: pageNumber });
    }
  };

  render() {
    const {
      products = [],
      filteredProducts = [],
      currentPage,
      totalPages,
      productsPerPage,
      brands,
      selectedBrandId,
      selectedPlace,
      skintypes,
      selectedSkintypeId,
      categories,
      selectedCategoryId,
    } = this.state;

    // Tính toán chỉ số sản phẩm đầu và cuối trên trang hiện tại
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

    // Sử dụng filteredProducts nếu có dữ liệu, nếu không sử dụng products
    const currentProducts = (
      filteredProducts.length > 0 ? filteredProducts : products
    ).slice(indexOfFirstProduct, indexOfLastProduct);

    return (
      <div className="container py-5">
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
                      {brands.map(
                        (brand) =>
                          (selectedBrandId === null ||
                            selectedBrandId === brand.brandId) && (
                            <li    style={{ display: "flex" }} key={brand.brandId}>
                              <input
                                type="checkbox"
                                checked={selectedBrandId === brand.brandId}
                                onChange={() =>
                                  this.handleBrandSelection(brand.brandId)
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
                      {categories.map((category) => (
                        <li    style={{ display: "flex" }} key={category.categoryId}>
                          <input
                            type="checkbox"
                            checked={selectedCategoryId === category.categoryId}
                            onChange={() =>
                              this.handleCategorySelection(category.categoryId)
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
                      {skintypes.map(
                        (skintype) =>
                          (selectedSkintypeId === null ||
                            selectedSkintypeId === skintype.skintypeId) && (
                            <li    style={{ display: "flex" }} key={skintype.skintypeId}>
                              <input
                                type="checkbox"
                                checked={
                                  selectedSkintypeId === skintype.skintypeId
                                }
                                onChange={() =>
                                  this.handleSkintypeSelection(
                                    skintype.skintypeId
                                  )
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
                      {Array.from(
                        new Set(brands.map((brand) => brand.place))
                      ).map(
                        (place) =>
                          (selectedPlace === null ||
                            selectedPlace === place) && (
                            <li    style={{ display: "flex" }} key={place}>
                              <input
                                type="checkbox"
                                checked={selectedPlace === place}
                                onChange={() =>
                                  this.handlePlaceSelection(place)
                                }
                              />
                              {place}
                            </li>
                          )
                      )}
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
                    value={this.state.minPrice}
                    onChange={(e) =>
                      this.setState({ minPrice: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="₫ ĐẾN"
                    min="0"
                    value={
                      this.state.maxPrice === Infinity
                        ? ""
                        : this.state.maxPrice
                    }
                    onChange={(e) =>
                      this.setState({
                        maxPrice: e.target.value ? e.target.value : Infinity,
                      })
                    }
                  />
                </div>
                <button
                  className="apply-button"
                  onClick={this.applyPriceFilter}
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="col-lg-10">
            <div className="container">
              <div className="row mb-4">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm sản phẩm..."
                    onChange={this.handleSearch}
                  />
                </div>

                <div className="col-md-6">
                  <select
                    className="form-control"
                    value={this.state.sortOption}
                    onChange={this.handleSortChange}
                  >
                    <option value="Nổi bật">Nổi bật</option>
                    <option value="Thấp đến cao">Thấp đến cao</option>
                    <option value="Cao đến thấp">Cao đến thấp</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row g-4">
              {this.state.filteredProducts.length > 0 ? (
                this.state.filteredProducts.map((product) => (
                  <div
                    key={product.productId}
                    className="col-md-9 col-lg-4 col-xl-3 col-sm-6 col-6"
                  >
                    <div className="pro-container">
                      <div className="pro">
                      <a href={`/product/${product.productId}`}>
  <img
    src={require(`../../assets/img/${product.productDetails?.img || "default.jpg"}`)}
    alt={product.name}
  />
</a>

                         
                        <div className="icon-container">
                          <a
                            className="btn"
                            onClick={() => {
                              const quantity = 1;
                              const productPromotionID = 0; // Set the quantity you want to add
                              this.handleAddToCart(
                                product.productDetails.productDetailId,
                                product.productDetails.productPromotionId || 0,
                                quantity
                              );
                            }}
                          >
                            <i className="fas fa-shopping-cart"></i>
                          </a>
                          <a href={`/product/${product.productId}`}>
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
                ))
              ) : (
                <p style={{ textAlign: "center" }}>
                  Không có sản phẩm nào phù hợp với tìm kiếm của bạn.
                </p>
              )}
            </div>

            {/* Pagination */}
            <div className="col-12">
              <div className="pagination d-flex justify-content-center mt-5">
                <button
                  className="rounded"
                  onClick={() => this.handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &laquo;
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => this.handlePageChange(index + 1)}
                    className={currentPage === index + 1 ? "active" : ""}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className="rounded"
                  onClick={() => this.handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &raquo;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
