import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
  TextField,
  CircularProgress,
} from "@mui/material";
import { tokens } from "../../../theme";
import Header from "../../../component/chart/Header";
import { useEffect, useState, useCallback } from "react";
import { apiClient } from "../../../config/apiClient";
import ProductForm from "./form";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { useNavigate } from "react-router-dom";

const ProductLists = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [categoriesResponse, brandsResponse, productsResponse] =
        await Promise.all([
          apiClient.get("/api/categories"),
          apiClient.get("/api/brands"),
          apiClient.get("/api/products"),
        ]);

      setCategories(categoriesResponse.data);
      setBrands(brandsResponse.data);

      const formattedData = productsResponse.data.map((item) => ({
        productId: item.productId,
        name: item.name,
        description: item.description,
        categoryId: item.categoryId,
        brandId: item.brandId,
        categoryName:
          categoriesResponse.data.find(
            (cat) => cat.categoryId === item.categoryId
          )?.name || "Không có tên danh mục",
        brandName:
          brandsResponse.data.find((brand) => brand.brandId === item.brandId)
            ?.name || "Không có tên thương hiệu",
      }));

      setRows(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/api/products/${id}`);
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box m="20px">
      <Header title="SẢN PHẨM" subtitle="Quản lý sản phẩm" />

      {/* Các trường nhập tìm kiếm */}
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
          onClick={() => handleOpenForm()}
          sx={{
            marginBottom: "20px",
            justifyContent: "end",
            display: "flex",
            textAlign: "right",
          }}
        >
          Thêm sản phẩm
        </Button>
      </div>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Tên thương hiệu</TableCell>
              <TableCell>Tên danh mục</TableCell>
              <TableCell>Hành động</TableCell>
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
                  <TableRow
                    key={row.productId}
                    selected={selected.indexOf(row.productId) !== -1}
                    onClick={() => handleClick(row.productId)}
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
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleOpenForm(row)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(row.productId)}
                        sx={{ ml: 2 }}
                      >
                        Xóa
                      </Button>
                      <Button
                        variant="outlined"
                        color="info"
                        onClick={() =>
                          navigate(`/admin/product/${row.productId}`)
                        } // Điều hướng đến trang chi tiết sản phẩm
                        sx={{ ml: 2 }}
                      >
                        <RemoveRedEyeOutlinedIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[15]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          "& .MuiTablePagination-displayedRows": {
            marginBottom: "0px",
          },
          backgroundColor: colors.blueAccent[800],
        }}
      />

      {/* Dialog hiển thị form thêm/sửa */}
      <Dialog
        open={isFormOpen}
        onClose={handleCloseForm}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editData ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
        </DialogTitle>
        <DialogContent>
          <ProductForm
            initialValues={
              editData || {
                name: "",
                description: "",
                categoryId: "",
                brandId: "",
              }
            }
            onSubmit={async (values) => {
              try {
                if (editData) {
                  // Cập nhật sản phẩm
                  await apiClient.put(
                    `/api/products/${editData.productId}`,
                    values
                  );
                } else {
                  // Thêm sản phẩm mới
                  await apiClient.post("/api/products", values);
                }
                handleCloseForm();
                await fetchProducts(); // Gọi lại fetchProducts sau khi thêm/sửa
              } catch (error) {
                console.error("Error saving product:", error);
              }
            }}
            handleClose={handleCloseForm}
            categories={categories}
            brands={brands}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="primary">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductLists;
