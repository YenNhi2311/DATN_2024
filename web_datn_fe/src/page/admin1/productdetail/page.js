import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  TableBody,
  TableCell,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../../../config/apiClient";
import { Table } from "react-bootstrap";
import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme";
import ProductDetailList from "./list";
import ProductDetailsForm from "./form";
import Swal from "sweetalert2";

const ProductDetailPage = () => {
  const { id } = useParams(); // Lấy id sản phẩm từ URL
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [product, setProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [categoriesResponse, brandsResponse, productsResponse] =
        await Promise.all([
          apiClient.get("/api/categories"),
          apiClient.get("/api/brands"),
          apiClient.get(`/api/products/${id}`),
        ]);

      const formattedData = {
        productId: productsResponse.data.productId,
        name: productsResponse.data.name,
        description: productsResponse.data.description,
        categoryId: productsResponse.data.categoryId,
        brandId: productsResponse.data.brandId,
        categoryName:
          categoriesResponse.data.find(
            (cat) => cat.categoryId === productsResponse.data.categoryId
          )?.name || "Không có tên danh mục",
        brandName:
          brandsResponse.data.find(
            (brand) => brand.brandId === productsResponse.data.brandId
          )?.name || "Không có tên thương hiệu",
      };

      setProduct(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Hàm xử lý gửi form
  const handleSubmit = async (formData) => {
    try {
      if (formData.productDetailId) {
        await apiClient.put(
          `/api/productdetails/${formData.productDetailId}`,
          formData
        );
        Swal.fire(
          "Thành công!",
          "Cập nhật chi tiết sản phẩm thành công.",
          "success"
        );
      } else {
        await apiClient.post("/api/productdetails", formData);
        Swal.fire(
          "Thành công!",
          "Thêm chi tiết sản phẩm thành công.",
          "success"
        );
      }

      // Sau khi thành công, gọi lại hàm fetch để cập nhật danh sách chi tiết sản phẩm
      fetchProducts(); // Gọi lại hàm fetchProducts để cập nhật thông tin sản phẩm
    } catch (error) {
      console.error("Error submitting product details:", error);
      Swal.fire("Có lỗi!", "Vui lòng thử lại.", "error");
    }
  };

  // Style cho TableCell dựa trên theme
  const cellStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    fontWeight: "bold",
    color: colors.primary[200], // Thay đổi màu chữ dựa trên chế độ
  };

  return (
    <Box m="20px">
      {/* Thanh bên trái */}
      <div style={{ boxShadow: "2px 2px 10px #0000002d" }}>
        <Button
          variant="none"
          onClick={() => navigate("/admin/product")}
          style={{
            backgroundColor: "#fff",
            color: colors.primary[200],
            border: "none",
          }}
        >
          Quay lại danh sách sản phẩm
        </Button>
      </div>

      {/* Thông tin sản phẩm */}
      <div
        style={{
          boxShadow: "2px 2px 10px #0000002d",
          marginTop: "50px",
          padding: "15px",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : product ? (
          <Table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          >
            <TableBody>
              <TableRow>
                <TableCell style={cellStyle}>Sản phẩm</TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    color: colors.primary[200],
                  }}
                >
                  {product.name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={cellStyle}>Mô tả</TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    color: colors.primary[200],
                  }}
                >
                  {product.description}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={cellStyle}>Hãng</TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    color: colors.primary[200],
                  }}
                >
                  {product.brandId ? product.brandName : "Chưa cập nhật"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={cellStyle}>Loại sản phẩm</TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    color: colors.primary[200],
                  }}
                >
                  {product.categoryId ? product.categoryName : "Chưa cập nhật"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <p>Không có sản phẩm nào!</p>
        )}
      </div>

      {/* Nút thêm chi tiết sản phẩm */}
      <div style={{ display: "flex", justifyContent: "right" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
          sx={{ mt: 3 }}
        >
          Thêm chi tiết sản phẩm
        </Button>
      </div>

      {/* Danh sách chi tiết sản phẩm */}
      <ProductDetailList productId={id} fetchProductDetails={fetchProducts} />

      {/* Modal thêm chi tiết sản phẩm */}
      <ProductDetailsForm
        open={isModalOpen}
        onClose={handleCloseModal}
        initialValues={{}} // Khởi tạo giá trị ban đầu là rỗng
        onSubmit={handleSubmit} // Truyền onSubmit vào đây
      />
    </Box>
  );
};

export default ProductDetailPage;
