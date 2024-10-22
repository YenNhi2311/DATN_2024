import React, { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  CircularProgress,
  Typography,
  TableContainer
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Header from "../../../component/chart/Header";
import "../../../assets/css/productdetail.css";
import { apiClient } from "../../../config/apiClient";
import ProductDetailsForm from "./form";
import Swal from "sweetalert2";

const ProductDetailList = ({ productId }) => {
  const [details, setDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [skintypes, setSkintypes] = useState([]);
  const [capacities, setCapacities] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho modal
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentDetail, setCurrentDetail] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(24);
  const [page, setPage] = useState(0);

  const fetchProductDetails = async () => {
    setLoading(true); // Set loading to true
    try {
      const response = await apiClient.get(
        `/api/productdetails`
      );

      setDetails(
        Array.isArray(response.data) ? response.data : [response.data]
      );
    } catch (error) {
      console.error("Error fetching product details:", error);
      Swal.fire(
        "Lỗi!",
        "Không thể lấy chi tiết sản phẩm. Vui lòng thử lại.",
        "error"
      );
    } finally {
      setLoading(false); // Set loading to false after fetch
    }
  };

  const fetchAdditionalData = async () => {
    try {
      const [
        productsResponse,
        skintypesResponse,
        capacitiesResponse,
        colorsResponse,
      ] = await Promise.all([
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
      console.error("Xảy ra lỗi trong khi tải dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    fetchAdditionalData();
  }, [productId]);

  const handleEdit = (detail) => {
    setCurrentDetail(detail); // Lưu thông tin sản phẩm vào state
    setOpen(true); // Mở modal
  };

  const handleDelete = async (detailId) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Hành động này sẽ xóa chi tiết sản phẩm!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Có, xóa!",
      cancelButtonText: "Không, hủy!",
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/api/productdetails/${detailId}`);
        fetchProductDetails();
        Swal.fire("Đã xóa!", "Chi tiết sản phẩm đã được xóa.", "success");
      } catch (error) {
        console.error("xảy ra lỗi hi xóa:", error);
        Swal.fire(
          "Có lỗi xảy ra!",
          "Không thể xóa chi tiết sản phẩm. Vui lòng thử lại.",
          "error"
        );
      }
    }
  };

  const handleOpenForm = () => {
    setCurrentDetail(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentDetail(null); // Đặt lại thông tin sản phẩm khi đóng modal
  };

  const handleSubmit = async (formValues) => {
    console.log("Submitting form values:", formValues);
    let updatedDetail;

    if (currentDetail) {
      updatedDetail = await apiClient.put(
        `/api/productdetails/${currentDetail.productDetailId}`,
        formValues
      );
      setDetails((prev) =>
        prev.map((detail) =>
          detail.productDetailId === currentDetail.productDetailId
            ? { ...detail, ...formValues }
            : detail
        )
      );
      Swal.fire("Thành công!", "Cập nhật chi tiết sản phẩm thành công.", "Thành công");
    } else {
      updatedDetail = await apiClient.post("/api/productdetails", formValues);
      setDetails((prev) => [...prev, updatedDetail.data]);
      Swal.fire("Thành công!", "Thêm chi tiết sản phẩm thành công.", "Thành công");
    }

    handleClose();
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    setSortValue(value);
    const sortedData = [...rows].sort((a, b) => {
      if (value === "asc") {
        return a.id - b.id;
      } else if (value === "desc") {
        return b.id - a.id;
      }
      return 0;
    });
    setRows(sortedData);
  };

  const handleRowsPerPageOptionChange = (event) => {
    const value = event.target.value;
    setRowsPerPage(value);
    setPage(0);
  };

  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box >
      <Header subtitle="Danh sách sản phẩm chi tiết" />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "300px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <FormControl variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel id="sort-label">Sort</InputLabel>
            <Select
              labelId="sort-label"
              value={sortValue}
              onChange={handleSortChange}
              label="Sort"
            >
              <MenuItem value="asc">A-Z</MenuItem>
              <MenuItem value="desc">Z-A</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel id="rowsPerPage-label">Hàng</InputLabel>
            <Select
              labelId="rowsPerPage-label"
              value={rowsPerPage}
              onChange={handleRowsPerPageOptionChange}
              label="Rows"
            >
              <MenuItem value={24}>24/trang</MenuItem>
              <MenuItem value={36}>36/trang</MenuItem>
              <MenuItem value={48}>48/trang</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" onClick={() => handleOpenForm()}>
            Thêm mới
          </Button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <TableContainer style={{ flex: '1', minHeight: '400px', maxHeight: '400px', overflowY: 'auto', marginTop: '30px' }}>
          {loading ? ( // Display loading indicator
            <CircularProgress />
          ) : details.length === 0 ? (
            <Typography variant="h6" color="textSecondary">
              Chưa có chi tiết sản phẩm nào.
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Hình ảnh</TableCell>
                  <TableCell style={{ width: "100px" }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.map((detail) => (
                  <TableRow key={detail.productDetailId}>
                    <TableCell>{detail.productDetailId}</TableCell>
                    <TableCell>
                      {`${products.find((p) => p.productId === detail.productId)
                        ?.name || "Không có tên"
                        } 
                  dành cho ${skintypes.find((s) => s.skintypeId === detail.skintypeId)
                          ?.name || "Không có loại da"
                        } 
                  dung tích ${capacities.find((c) => c.capacityId === detail.capacityId)
                          ?.value || "Không có dung tích"
                        }
                      [${colors.find((c) => c.colorId === detail.colorId)?.name ||
                        "Không có màu"
                        }]`}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(detail.price)}
                    </TableCell>

                    <TableCell>{detail.quantity}</TableCell>
                    <TableCell>
                      <img
                        src={`http://localhost:8080/assets/img/${detail.img}`}
                        alt={`Hình ảnh của chi tiết ${detail.productDetailId}`}
                        style={{ width: "100px", height: "70px" }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(detail)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(detail.productDetailId)}
                      >
                        <Delete color="secondary" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </div>
      <ProductDetailsForm
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialValues={currentDetail || {}}
      />
    </Box>
  );
};

export default ProductDetailList;
