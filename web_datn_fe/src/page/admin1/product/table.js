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
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { tokens } from "../../../theme";
import Header from "../../../component/chart/Header";
import { apiClient } from "../../../config/apiClient";
import Form from "./form";
import ProductForm from "./productform";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";


const ProductLists = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [color, setColors] = useState([]);
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({ name: "", place: "" });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [products, setProducts] = useState([]);
  const [skintypes, setSkintypes] = useState([]);
  const [capacities, setCapacities] = useState([]);

  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editProductData, setEditProductData] = useState(null);


  // Fetch products, categories, and brands
  // Fetch products, categories, and brands
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

      setRows(formattedData);
      console.log("Dữ liệu sản phẩm:", formattedData); // Hiển thị dữ liệu sản phẩm ra console
    } catch (error) {
      console.error("Xảy ra lỗi khi nạp dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch product details by product ID
  const fetchProductDetails = async (productId) => {
    setLoadingDetails(true);
    try {
      const detailsResponse = await apiClient.get(`http://localhost:8080/api/productdetails/product/${productId}/details`);
      setProductDetails((prevDetails) => ({
        ...prevDetails,
        [productId]: detailsResponse.data || [], // Ensure it's an array or default to an empty array
      }));
      console.log(`Dữ liệu chi tiết cho sản phẩm ${productId}:`, detailsResponse.data); // Hiển thị dữ liệu chi tiết sản phẩm ra console
    } catch (error) {
      console.error("Lỗi tìm nạp chi tiết sản phẩm:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchAdditionalData = useCallback(async () => {
    try {
      const [productsResponse, skintypesResponse, capacitiesResponse, colorsResponse] = await Promise.all([
        apiClient.get("/api/products"),
        apiClient.get("/api/skintypes"),
        apiClient.get("/api/capacities"),
        apiClient.get("/api/colors"),
      ]);
      setProducts(productsResponse.data);
      setSkintypes(skintypesResponse.data);
      setCapacities(capacitiesResponse.data);
      setColors(colorsResponse.data);
    } catch (error) {
      console.error("Lỗi tìm nạp dữ liệu bổ sung:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchAdditionalData();
  }, [fetchProducts, fetchAdditionalData]);

  const handleToggleDetails = (row) => {
    if (expandedProduct === row.productId) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(row.productId);
      if (!productDetails[row.productId]) {
        fetchProductDetails(row.productId);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
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

  const filteredRows = rows.filter((row) => {
    return (
      row.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      row.description.toLowerCase().includes(filters.place.toLowerCase())
    );
  });

  const handleOpenForm = (product = null) => {
    setEditData(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditData(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenProductForm = (product) => {
    setEditProductData(product);
    setIsProductFormOpen(true);
  };

  const handleOpenFormDetail = async (product = null, productDetailId = null) => {
    setLoadingDetails(true);
    try {
      let detailData = null;
      if (productDetailId) {
        const detailsResponse = await apiClient.get(`/api/productdetails/${productDetailId}`);
        detailData = detailsResponse.data;
      }
      setEditData({ product, detail: detailData }); // lưu trữ cả thông tin sản phẩm và chi tiết sản phẩm
    } catch (error) {
      console.error("Lỗi tìm nạp dữ liệu chi tiết sản phẩm:", error);
    } finally {
      setLoadingDetails(false);
      setIsFormOpen(true);
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
        <TextField
          name="place"
          label="Tìm kiếm theo mô tả"
          variant="outlined"
          value={filters.place}
          onChange={handleFilterChange}
          sx={{ width: "48%" }}
        />
      </Box>

      <div style={{ justifyContent: "end", display: "flex" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenFormDetail()}
          sx={{
            marginBottom: "20px",
            justifyContent: "end",
            display: "flex",
            textAlign: "right",
          }}
        >
          Thêm Mới Sản Phẩm & Chi Tiết
        </Button>
      </div>

      <TableContainer sx={{ maxHeight: 440, overflow: "hidden" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Tên sản phẩm</strong></TableCell>
              <TableCell><strong>Mô tả</strong></TableCell>
              <TableCell><strong>Tên thương hiệu</strong></TableCell>
              <TableCell><strong>Tên danh mục</strong></TableCell>
              <TableCell style={{ width: "150px" }}><trsong>Hành động</trsong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center" }}>
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
                        backgroundColor:
                          selected.indexOf(row.productId) !== -1
                            ? colors.blueAccent[300]
                            : "inherit",
                      }}
                    >
                      <TableCell>{row.productId}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.brandName}</TableCell>
                      <TableCell>{row.categoryName}</TableCell>
                      <TableCell>
                        <IconButton
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleOpenProductForm(row)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          variant="outlined"
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} style={{ padding: 0 }}>
                        <Collapse in={expandedProduct === row.productId} timeout="auto" unmountOnExit>
                          <div style={{ padding: '16px' }}>
                            {loadingDetails ? (
                              <CircularProgress />
                            ) : (
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell><strong>ID</strong></TableCell>
                                    <TableCell><strong>Hình Ảnh</strong></TableCell>
                                    <TableCell><strong>Tên chi tiết</strong></TableCell>
                                    <TableCell><strong>Giá</strong></TableCell>
                                    <TableCell><strong>Số Lượng</strong></TableCell>
                                    <TableCell><strong>Hành động</strong></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {productDetails[row.productId]?.map((details) => ( // Sử dụng productDetails để lấy chi tiết sản phẩm
                                    <TableRow key={details.id}>
                                      <TableCell>{details.productDetailId}</TableCell>
                                      <TableCell>
                                        <img src={`http://localhost:8080/assets/img/${details.img}`} alt="Hình Ảnh" style={{ width: "100px", height: "70px" }} />
                                      </TableCell>
                                      <TableCell>
                                        {`${products.find((p) => p.productId === details.productId)?.name ||
                                          "Không có tên"} dành cho ${skintypes.find((s) => s.skintypeId === details.skintypeId)?.name ||
                                          "Không có loại da"} dung tích ${capacities.find((c) => c.capacityId === details.capacityId)?.value ||
                                          "Không có dung tích"} ml [${color.find((c) => c.colorId === details.colorId)?.name || "Không có màu"}]`}
                                      </TableCell>
                                      <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(details.price)}</TableCell>
                                      <TableCell>{details.quantity}</TableCell>
                                      <TableCell>
                                        <IconButton
                                          variant="outlined"
                                          color="secondary"
                                          onClick={() => handleOpenFormDetail(row, details.productDetailId)}>
                                          <Edit />
                                        </IconButton>

                                        <IconButton
                                          variant="outlined"
                                          color="error"
                                        >
                                          <Delete />
                                        </IconButton></TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            )}
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

      <Dialog open={isFormOpen} >
        <DialogTitle>
          {editData ? "Chỉnh sửa chi tiết sản phẩm" : "Thêm chi tiết sản phẩm"}
          <IconButton
            onClick={() => handleCloseForm(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Form
            editData={editData}
            categories={categories}
            brands={brands}
            onClose={() => handleCloseForm(false)}
            onSave={fetchProducts}
          />
        </DialogContent>
      </Dialog>

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
              productId: editProductData?.productId || "", // Thêm productId vào initialValues
              name: editProductData?.name || "",
              description: editProductData?.description || "",
              categoryId: editProductData?.categoryId || "",
              brandId: editProductData?.brandId || "",
            }}
            editData={editProductData}
            categories={categories}
            brands={brands}
            onClose={() => setIsProductFormOpen(false)}
            onSave={fetchProducts}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProductLists;