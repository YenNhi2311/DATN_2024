import React, { useState, useEffect } from "react";
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
  Tab,
  Tabs,
} from "@mui/material";
import { apiClient } from "../../../config/apiClient";
import Header from "../../../component/chart/Header";
import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme";
import ApplyPromotion from "./applyform";
import Swal from "sweetalert2";
import AddPromotion from "./form";

const PromotionManagement = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isFormOpen, setIsFormOpen] = useState(false); // Quản lý mở/đóng form
  const [editData, setEditData] = useState(null); // Dữ liệu khi sửa khuyến mãi
  const [tabIndex, setTabIndex] = useState(0); // State quản lý tab
  const [productPromotions, setProductPromotions] = useState([]); // Dữ liệu sản phẩm khuyến mãi
  const [promotionsMap, setPromotionsMap] = useState({}); // Lưu trữ khuyến mãi theo ID
  const [productsMap, setProductsMap] = useState({}); // Lưu trữ sản phẩm theo ID

  useEffect(() => {
    fetchPromotions();
    fetchProductPromotions();
    fetchProducts(); // Fetch sản phẩm để lấy tên sản phẩm
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await apiClient.get("/api/promotions");
      setRows(response.data);
      const map = response.data.reduce((acc, promotion) => {
        acc[promotion.promotionId] = promotion;
        return acc;
      }, {});
      setPromotionsMap(map);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get("/api/products");
      const map = response.data.reduce((acc, product) => {
        acc[product.productId] = product;
        return acc;
      }, {});
      setProductsMap(map);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchProductPromotions = async () => {
    try {
      const response = await apiClient.get("/api/product-promotions");
      setProductPromotions(response.data);
    } catch (error) {
      console.error("Error fetching product promotions:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleOpenForm = (promotion = null) => {
    setEditData(promotion); // Cập nhật dữ liệu nếu đang sửa, nếu không sẽ là thêm mới
    setIsFormOpen(true); // Mở form
  };

  const handleCloseForm = () => {
    setIsFormOpen(false); // Đóng form
    setEditData(null); // Xóa dữ liệu edit nếu có
  };

  const handleDeletePromotion = async (id) => {
    try {
      await apiClient.delete(`/api/promotions/${id}`);
      fetchPromotions();
    } catch (error) {
      console.error("Error deleting promotion:", error);
    }
  };

  const handleDeleteProductPromotion = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc không?",
      text: "Bạn sẽ không thể khôi phục lại khuyến mãi này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, xóa nó!",
      cancelButtonText: "Không, giữ lại!",
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/api/product-promotions/${id}`);
        fetchProductPromotions(); // Cập nhật danh sách sau khi xóa thành công
        Swal.fire("Đã xóa!", "Khuyến mãi sản phẩm đã được xóa.", "success");
      } catch (error) {
        console.error("Error deleting product promotion:", error);
        Swal.fire(
          "Lỗi!",
          "Đã xảy ra lỗi khi xóa khuyến mãi sản phẩm.",
          "error"
        );
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

  const handlePromotionApplied = (newPromotion) => {
    setProductPromotions((prev) => [...prev, newPromotion]);
    fetchProductPromotions(); // Tùy chọn, nếu cần cập nhật từ server
  };

  return (
    <Box m="20px">
      <Header title="KHUYẾN MÃI" subtitle="Quản lý khuyến mãi" />
      {/* Tabs */}
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="Chương trình khuyến mãi" />
        <Tab label="Áp dụng khuyến mãi cho sản phẩm" />
      </Tabs>

      {/* Tab 1: Chương trình khuyến mãi */}
      {tabIndex === 0 && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginTop: "10px",
            }}
          >
            <Button variant="contained" onClick={() => handleOpenForm()}>
              Thêm khuyến mãi
            </Button>
          </div>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell>Phần trăm</TableCell>
                  <TableCell>Thời gian bắt đầu</TableCell>
                  <TableCell>Thời gian kết thúc</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.promotionId}>
                      <TableCell>{row.promotionId}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.percent}%</TableCell>
                      <TableCell>{row.startDate}</TableCell>
                      <TableCell>{row.endDate}</TableCell>
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
                          onClick={() => handleDeletePromotion(row.id)}
                          sx={{ ml: 2 }}
                        >
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[15]}
            component="div"
            count={rows.length}
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
        </>
      )}
      {/* Hiển thị form thêm/sửa khuyến mãi */}
      <AddPromotion
        open={isFormOpen}
        onClose={handleCloseForm}
        fetchPromotions={fetchPromotions}
        editData={editData} // Truyền dữ liệu đang chỉnh sửa
      />
      {/* Tab 2: Áp dụng chương trình khuyến mãi cho sản phẩm */}
      {tabIndex === 1 && (
        <>
          <ApplyPromotion onPromotionApplied={handlePromotionApplied} />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Tên khuyến mãi</TableCell>
                  <TableCell>Phần trăm giảm giá</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productPromotions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.productPromotionId}>
                      <TableCell>{row.productPromotionId}</TableCell>
                      <TableCell>
                        {productsMap[row.productId]?.name || "Loading..."}
                      </TableCell>
                      <TableCell>
                        {promotionsMap[row.promotionId]?.name || "Loading..."}
                      </TableCell>
                      <TableCell>
                        {promotionsMap[row.promotionId]?.percent || 0}%
                      </TableCell>
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
                          onClick={() =>
                            handleDeleteProductPromotion(row.productPromotionId)
                          }
                          sx={{ ml: 2 }}
                        >
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[15]}
            component="div"
            count={productPromotions.length} // Cập nhật cho đúng số lượng
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
        </>
      )}
    </Box>
  );
};

export default PromotionManagement;
