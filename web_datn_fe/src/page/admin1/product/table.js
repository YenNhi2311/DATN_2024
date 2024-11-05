
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
  TextField,
  CircularProgress,
  Collapse,
  Checkbox
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { tokens } from "../../../theme";
import Header from "../../../component/chart/Header";
import { apiClient } from "../../../config/apiClient";
import Form from "./form";
import ProductForm from "./productform";
import { Edit, Delete } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import "../../../assets/css/producttable.css";

const ProductLists = (initialValues = {}, onSubmit) => {
  const theme = useTheme();
  const color = tokens(theme.palette.mode);

  const minRows = 1;
  const maxRows = 5;

  const [productRows, setProductRows] = useState([{}]);

  const [rows, setRows] = useState([{
    colorId: "", skintypeId: "", capacityId: "", ingredientId: "", benefitId: "", price: "", quantity: "", imagePreview: ""
  }]);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({ name: "", place: "" });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [products, setProducts] = useState([]);
  const [skintypes, setSkintypes] = useState([]);

  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editProductData, setEditProductData] = useState(null);
  const [productId, setProductId] = useState(null);
  const [colorId, setColorId] = useState(null);
  const [skintypeId, setSkinTypeId] = useState(null);
  const [capacityId, setCapacityId] = useState(null);
  const [ingredientId, setIngredientId] = useState(null);
  const [benefitId, setBenefitId] = useState(null);

  const [editingRows, setEditingRows] = useState({});


  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [categoriesResponse, brandsResponse, productsResponse] = await Promise.all([
        apiClient.get("/api/categories"),
        apiClient.get("/api/brands"),
        apiClient.get("/api/products"),
      ]);

      setCategories(categoriesResponse.data);
      setBrands(brandsResponse.data);

      const formattedData = await Promise.all(productsResponse.data.map(async (item) => {
        const detailsResponse = await apiClient.get(`api/productdetails/product/${item.productId}/details`);
        return {
          productId: item.productId,
          name: item.name,
          description: item.description,
          categoryId: item.categoryId,
          brandId: item.brandId,
          categoryName: categoriesResponse.data.find((cat) => cat.categoryId === item.categoryId)?.name || "Không có tên danh mục",
          brandName: brandsResponse.data.find((brand) => brand.brandId === item.brandId)?.name || "Không có tên thương hiệu",
          details: detailsResponse.data,
        };
      }));
      setProductRows(formattedData);
    } catch (error) {
      console.error("Xảy ra lỗi khi nạp dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();  // Gọi hàm này khi component được render
  }, [fetchProducts]);  // Đảm bảo fetchProducts không thay đổi giữa các lần render


  const fetchProductDetails = async (productId) => {
    setLoadingDetails(true);
    try {
      const detailsResponse = await apiClient.get(`http://localhost:8080/api/productdetails/product/${productId}/details`);

      console.log("Dữ liệu trả về:", detailsResponse.data);

      const productDetailsArray = Array.isArray(detailsResponse.data) ? detailsResponse.data : [];

      setProductDetails((prevDetails) => ({
        ...prevDetails,
        [productId]: productDetailsArray,
      }));
    } catch (error) {
      console.error("Lỗi tìm nạp chi tiết sản phẩm:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchAdditionalData = useCallback(async () => {
    try {
      const [productsResponse, skintypesResponse, capacitiesResponse, colorsResponse, ingredientsResponse, benefitsResponse] = await Promise.all([
        apiClient.get("/api/products"),
        apiClient.get("/api/skintypes"),
        apiClient.get("/api/capacities"),
        apiClient.get("/api/colors"),
        apiClient.get("/api/ingredients"),
        apiClient.get("/api/benefits"),
      ]);
      setProducts(productsResponse.data);
      setSkintypes(skintypesResponse.data);
      setCapacities(capacitiesResponse.data);
      setColors(colorsResponse.data);
      setIngredients(ingredientsResponse.data);
      setBenefits(benefitsResponse.data);
    } catch (error) {
      console.error("Lỗi tìm nạp dữ liệu bổ sung:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchAdditionalData();
  }, [fetchProducts, fetchAdditionalData]);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const filteredRows = productRows.filter((row) => {
    return (
      row.name && row.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      row.description.toLowerCase().includes(filters.place.toLowerCase())
    );
  });

  const handleCloseForm = (product = null) => {
    setEditData(product);
    setIsFormOpen(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenProductForm = (product = null) => {
    setEditProductData(product);  // Khi không có sản phẩm nào được truyền, giá trị sẽ là null => Thêm mới
    setIsProductFormOpen(true);   // Mở form sản phẩm
  };

  //////////////////

  const handleToggleDetails = (row) => {
    if (expandedProduct === row.productId) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(row.productId);
      if (!productDetails[row.productId]) {
        fetchProductDetails(row.productId);
      }
      setProductId(row.productId);
      console.log(row.productId)
    }
  };

  const [formValues, setFormValues] = useState({
    colorId: initialValues.colorId || "",
    skintypeId: initialValues.skintypeId || "",
    capacityId: initialValues.capacityId || "",
    ingredientId: initialValues.ingredientId || "",
    benefitId: initialValues.benefitId || "",
    img: initialValues.img || "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [capacities, setCapacities] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [benefits, setBenefits] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const responses = await Promise.all([
          apiClient.get("/api/colors"),
          apiClient.get("/api/skintypes"),
          apiClient.get("/api/capacities"),
          apiClient.get("/api/ingredients"),
          apiClient.get("/api/benefits"),
        ]);

        setColors(responses[0].data);
        setSkinTypes(responses[1].data);
        setCapacities(responses[2].data);
        setIngredients(responses[3].data);
        setBenefits(responses[4].data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (editData) {
      setFormValues({
        colorId: editData.detail?.colorId || "",
        skintypeId: editData.detail?.skintypeId || "",
        capacityId: editData.detail?.capacityId || "",
        ingredientId: editData.detail?.ingredientId || "",
        benefitId: editData.detail?.benefitId || "",
        img: editData.detail?.img || "",
      });

      if (editData.detail?.img) {
        setImagePreview(`http://localhost:8080/assets/img/${editData.detail.img}`);
      }
    }
  }, [editData]);

  const handleChange = (productDetailId, name, value, index) => {
    // Kiểm tra xem value có hợp lệ không
    if (value === undefined) {
      console.error("Value is undefined");
      return;
    }

    // Cập nhật trạng thái của rows
    setRows((prevRows) => {
      const newRows = [...prevRows];
      // Cập nhật trường tương ứng
      newRows[index] = {
        ...newRows[index],
        [name]: value
      };
      return newRows;
    });

    // Cập nhật trạng thái của productDetails
    setProductDetails((prevDetails) => {
      const updatedDetails = prevDetails[productId].map((detail) =>
        detail.productDetailId === productDetailId
          ? { ...detail, [name]: value } // Cập nhật trường tương ứng
          : detail
      );

      return {
        ...prevDetails,
        [productId]: updatedDetails,
      };
    });
  };


  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const updatedRows = [...rows];
      updatedRows[index] = { ...updatedRows[index], imageFile: file, imagePreview: URL.createObjectURL(file) };
      setRows(updatedRows);
    } else {
      Swal.fire({
        icon: "error",
        title: "Ảnh không hợp lệ!",
        text: "Vui lòng tải lên tệp hình ảnh hợp lệ.",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requests = rows.map(async (row) => {
        const formData = new FormData();

        Object.entries(row).forEach(([key, value]) => {
          formData.append(key, value);
        });

        if (productId) {
          formData.append("productId", productId);
        }

        if (row.imageFile) {
          formData.append("img", row.imageFile);
        } else if (row.imagePreview) {
          formData.append("img", row.img);
        }

        if (editData && editData.detail && editData.detail.productDetailId) {
          return apiClient.put(`/api/productdetails/${editData.detail.productDetailId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          return apiClient.post("/api/productdetails", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      });
      await Promise.all(requests);
      Swal.fire({
        icon: "success",
        title: "Thêm mới thành công!",
        text: "Chi tiết sản phẩm đã được lưu thành công.",
      });
      fetchProductDetails(productId);
      handleCloseForm(false);
    } catch (error) {
      console.error("Xảy ra lỗi:", error);
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.";
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: errorMessage,
      });
    }
  };

  const handleAddRow = () => {
    if (rows.length < maxRows) {
      setRows([...rows, { colorId: "", skintypeId: "", capacityId: "", ingredientId: "", benefitId: "", price: "", quantity: "", imagePreview: "" }]);
    }
  };

  const handleRemoveRow = () => {
    if (rows.length > minRows) {
      setRows(rows.slice(0, -1));
    }
  };

  const handleDelete = async (productDetailId) => {
    try {
      await apiClient.delete(`/api/productdetails/${productDetailId}`);
      fetchProductDetails(productId); // Tải lại dữ liệu sau khi xóa
      Swal.fire({
        icon: "success",
        title: "Xóa thành công!",
        text: "Chi tiết sản phẩm đã được xóa.",
      });
    } catch (error) {
      console.error("Lỗi khi xóa chi tiết sản phẩm:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Đã xảy ra lỗi, vui lòng thử lại.",
      });
    }
  };

  const handleEditClick = (productDetailId) => {
    setEditingRows((prevEditingRows) => ({
      ...prevEditingRows,
      [productDetailId]: true, // Bật chế độ chỉnh sửa cho hàng hiện tại
    }));
  };

  const handleSaveClick = async (productDetailId, price, quantity) => {
    try {
      // Lấy thông tin chi tiết sản phẩm từ API
      const { data: productDetail } = await apiClient.get(`http://localhost:8080/api/productdetails/${productDetailId}`);

      console.log("product detail được lấy: ", productDetail);

      // Lấy các giá trị ID từ dữ liệu API trả về
      const productId = productDetail.productId;
      const colorId = productDetail.colorId;
      const skintypeId = productDetail.skintypeId;
      const capacityId = productDetail.capacityId;
      const ingredientId = productDetail.ingredientId;
      const benefitId = productDetail.benefitId;

      // Chuyển đổi giá trị từ input
      const priceValue = parseFloat(price);
      const quantityValue = parseInt(quantity, 10);

      // Kiểm tra nếu các ID là hợp lệ
      if ([colorId, skintypeId, capacityId, ingredientId, benefitId].some(id => id === undefined || id === null)) {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Một hoặc nhiều ID không hợp lệ.",
        });
        return;
      }

      const formData = new FormData();
      formData.append("price", priceValue);
      formData.append("quantity", quantityValue);
      formData.append("productId", productId);
      formData.append("colorId", colorId);
      formData.append("skintypeId", skintypeId);
      formData.append("capacityId", capacityId);
      formData.append("ingredientId", ingredientId);
      formData.append("benefitId", benefitId);

      // Gửi yêu cầu cập nhật
      await apiClient.put(`http://localhost:8080/api/productdetails/${productDetailId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Cập nhật danh sách chi tiết sản phẩm
      fetchProductDetails(productId);
      setEditingRows((prev) => ({
        ...prev,
        [productDetailId]: false,
      }));

      Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        text: "Giá và số lượng đã được cập nhật.",
      });

    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Đã xảy ra lỗi khi cập nhật, vui lòng thử lại.",
      });
    }
  };

  const handleSubmitProduct = async (formValues) => {
    try {
      if (formValues.productId) {
        await apiClient.put(`/api/products/${formValues.productId}`, {
          name: formValues.name,
          description: formValues.description,
          categoryId: formValues.categoryId,
          brandId: formValues.brandId,
        });
        Swal.fire({
          icon: "success",
          title: "Cập nhật thành công!",
          text: "Sản phẩm đã được cập nhật.",
        });
      } else {
        await apiClient.post("/api/products", {
          name: formValues.name,
          description: formValues.description,
          categoryId: formValues.categoryId,
          brandId: formValues.brandId,
        });
        Swal.fire({
          icon: "success",
          title: "Thêm thành công!",
          text: "Sản phẩm đã được thêm.",
        });
      }
      setIsProductFormOpen(false); // đóng form
      onSubmit(); // làm mới
      fetchProducts();
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
    }
  };

  return (
    <Box m="20px">
      <Header subtitle="Quản lý sản phẩm" />
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          name="name"
          label="Tìm kiếm theo tên sản phẩm"
          variant="outlined"
          value={filters.name}
          onChange={handleFilterChange}
          sx={{ width: "48%" }}
        />
      </Box>

      <div style={{ justifyContent: "end", display: "flex" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenProductForm()}  // Không truyền tham số để thêm mới sản phẩm
          sx={{
            marginBottom: "20px",
            justifyContent: "end",
            display: "flex",
            textAlign: "right",
          }}
        >
          Thêm Mới Sản Phẩm
        </Button>
      </div>

      <TableContainer sx={{ maxHeight: 1600, overflow: "hidden", width: 1150 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><strong>Tên sản phẩm</strong></TableCell>
              <TableCell><strong>Tên thương hiệu</strong></TableCell>
              <TableCell><strong>Tên danh mục</strong></TableCell>
              <TableCell style={{ width: "150px" }}><strong>Hành động</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: "center" }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <React.Fragment key={row.productId}>
                    <TableRow
                      selected={selected.indexOf(row.productId) !== -1}
                      onClick={() => {
                        handleClick(row.productId);
                        handleToggleDetails(row);
                      }}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: selected.indexOf(row.productId) !== -1 ? color.blueAccent[300] : "inherit",
                      }}
                    >
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.brandName}</TableCell>
                      <TableCell>{row.categoryName}</TableCell>
                      <TableCell>
                        <IconButton
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleOpenProductForm(row)}  // Truyền dữ liệu sản phẩm để chỉnh sửa
                        >
                          <Edit />
                        </IconButton>
                        <IconButton variant="outlined" color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} style={{ padding: 0 }}>
                        <Collapse in={expandedProduct === row.productId} timeout="auto" unmountOnExit>
                          <div style={{ padding: '16px' }}>
                            <form onSubmit={handleSubmit}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell><strong>Màu sắc</strong></TableCell>
                                    <TableCell><strong>Loại da</strong></TableCell>
                                    <TableCell><strong>Dung tích</strong></TableCell>
                                    <TableCell><strong>Thành phần</strong></TableCell>
                                    <TableCell><strong>Lợi ích</strong></TableCell>
                                    <TableCell><strong>Giá</strong></TableCell>
                                    <TableCell><strong>Số lượng</strong></TableCell>
                                    <TableCell>
                                      <Button variant="contained" color="primary" onClick={handleAddRow} disabled={rows.length >= maxRows} className="btn-add-remove">Thêm dòng</Button>
                                      <hr></hr>
                                      <Button variant="contained" color="primary" onClick={handleRemoveRow} disabled={rows.length <= minRows} className="btn-add-remove">Xóa dòng</Button>
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {rows.map((row, index) => (
                                    <TableRow key={index} className="tablerowedit">
                                      <TableCell className="tablecelldetail">
                                        <select name="colorId" value={row.colorId || ""} onChange={(e) => handleChange(index, e)} className="selectform">
                                          <option value="" disabled>Màu sắc</option>
                                          {colors.map((color) => (
                                            <option key={color.colorId} value={color.colorId}>{color.name}</option>
                                          ))}
                                        </select>
                                      </TableCell>
                                      <TableCell className="tablecelldetail">
                                        <select name="skintypeId" value={row.skintypeId || ""} onChange={(e) => handleChange(index, e)} className="selectform">
                                          <option value="" disabled>Loại da</option>
                                          {skinTypes.map((type) => (
                                            <option key={type.skintypeId} value={type.skintypeId}>{type.name}</option>
                                          ))}
                                        </select>
                                      </TableCell>
                                      <TableCell className="tablecelldetail">
                                        <select name="capacityId" value={row.capacityId || ""} onChange={(e) => handleChange(index, e)} className="selectform">
                                          <option value="" disabled>Dung tích</option>
                                          {capacities.map((capacity) => (
                                            <option key={capacity.capacityId} value={capacity.capacityId}>{capacity.value}</option>
                                          ))}
                                        </select>
                                      </TableCell>
                                      <TableCell className="tablecelldetail">
                                        <select name="ingredientId" value={row.ingredientId || ""} onChange={(e) => handleChange(index, e)} className="selectformTP">
                                          <option value="" disabled>Thành phần</option>
                                          {ingredients.map((ingredient) => (
                                            <option key={ingredient.ingredientId} value={ingredient.ingredientId}>{ingredient.name}</option>
                                          ))}
                                        </select>
                                      </TableCell>
                                      <TableCell className="tablecelldetail">
                                        <select name="benefitId" value={row.benefitId || ""} onChange={(e) => handleChange(index, e)} className="selectform">
                                          <option value="" disabled>Lợi ích</option>
                                          {benefits.map((benefit) => (
                                            <option key={benefit.benefitId} value={benefit.benefitId}>{benefit.name}</option>
                                          ))}
                                        </select>
                                      </TableCell>
                                      <TableCell className="tablecelldetail">
                                        <input className="inputForm2"
                                          type="number"
                                          name="price"
                                          value={row.price || ""}
                                          onChange={(e) => handleChange(index, e)}
                                          placeholder="Giá (VND)"
                                          required
                                        />
                                      </TableCell>
                                      <TableCell className="tablecelldetail">
                                        <input className="inputForm2"
                                          type="number"
                                          name="quantity"
                                          value={row.quantity || ""}
                                          onChange={(e) => handleChange(index, e)}
                                          placeholder="Số lượng"
                                          required
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <div className="image-preview" onClick={() => document.getElementById(`imageInput${index}`).click()}>
                                          {row.imagePreview ? (
                                            <img src={row.imagePreview} alt="Preview" className="preview-image" />
                                          ) : (
                                            <div className="preview-placeholder">Thêm ảnh</div>
                                          )}
                                          <input
                                            type="file"
                                            id={`imageInput${index}`}
                                            hidden
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(index, e)}
                                          />
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                              <hr></hr>
                              <Button className="btnAdddetail" variant="contained" color="primary" type="submit">Thêm</Button>
                              <hr></hr>
                            </form>
                            <label><strong>Danh sách chi tiết sản phẩm</strong></label>
                            <hr></hr>
                            <div style={{ padding: '16px' }}>
                              {loadingDetails ? (
                                <CircularProgress />
                              ) : (
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell><strong>ID</strong></TableCell>
                                      <TableCell><strong>Hình Ảnh</strong></TableCell>
                                      <TableCell><strong>Chi Tiết</strong></TableCell>
                                      <TableCell><strong>Giá</strong></TableCell>
                                      <TableCell><strong>Số Lượng</strong></TableCell>
                                      <TableCell><strong>Hành Động</strong></TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {productDetails[row.productId]?.map((details) => (
                                      <TableRow key={details.productDetailId}>
                                        <TableCell>{details.productDetailId}</TableCell>
                                        <TableCell>
                                          <img src={`http://localhost:8080/assets/img/${details.img}`} alt="Hình Ảnh" style={{ width: "100px", height: "70px" }} />
                                        </TableCell>
                                        <TableCell>
                                          {`${skintypes.find((s) => s.skintypeId === details.skintypeId)?.name || "Không có loại da"} dung tích 
                                            ${capacities.find((c) => c.capacityId === details.capacityId)?.value || "Không có dung tích"} ml 
                                            [${colors.find((c) => c.colorId === details.colorId)?.name || "Không có màu"}]`}
                                        </TableCell>
                                        <TableCell>
                                          {editingRows[details.productDetailId] ? (
                                            <TextField
                                              value={details.price}
                                              onChange={(e) => handleChange(details.productDetailId, "price", e.target.value)}
                                              type="number"
                                            />
                                          ) : (
                                            new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(details.price)
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          {editingRows[details.productDetailId] ? (
                                            <TextField
                                              value={details.quantity}
                                              onChange={(e) => handleChange(details.productDetailId, "quantity", e.target.value)}
                                              type="number"
                                            />
                                          ) : (
                                            details.quantity
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          {editingRows[details.productDetailId] ? (
                                            <Button
                                              variant="outlined"
                                              color="primary"
                                              onClick={() => handleSaveClick(details.productDetailId, details.price, details.quantity)}
                                            >
                                              Lưu
                                            </Button>
                                          ) : (
                                            <Button
                                              variant="outlined"
                                              color="secondary"
                                              onClick={() => handleEditClick(details.productDetailId)}
                                            >
                                              Cập nhật
                                            </Button>
                                          )}
                                          <IconButton
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDelete(details.productDetailId)}
                                          >
                                            <Delete />
                                          </IconButton>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              )}
                            </div>
                          </div>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={isProductFormOpen} onClose={() => setIsProductFormOpen(false)}>
        <DialogTitle>
          {editProductData ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
          <IconButton
            onClick={() => setIsProductFormOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ProductForm
            initialValues={{
              productId: editProductData?.productId || "",
              name: editProductData?.name || "",
              description: editProductData?.description || "",
              categoryId: editProductData?.categoryId || "",
              brandId: editProductData?.brandId || "",
            }}
            onSubmit={handleSubmitProduct}
            categories={categories}
            brands={brands}
            onClose={() => setIsProductFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProductLists;
