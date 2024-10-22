import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
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
  const [open, setOpen] = useState(false);
  const [currentDetail, setCurrentDetail] = useState(null);

  const fetchProductDetails = async () => {
    setLoading(true); // Set loading to true
    try {
      const response = await apiClient.get(
        `/api/productdetails/${productId}/details`
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
      console.error("Error fetching additional data:", error);
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
        fetchProductDetails(); // Làm mới danh sách chi tiết sản phẩm
        Swal.fire("Đã xóa!", "Chi tiết sản phẩm đã được xóa.", "success");
      } catch (error) {
        console.error("Error deleting product detail:", error);
        Swal.fire(
          "Có lỗi xảy ra!",
          "Không thể xóa chi tiết sản phẩm. Vui lòng thử lại.",
          "error"
        );
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentDetail(null); // Đặt lại thông tin sản phẩm khi đóng modal
  };

  const handleSubmit = async (formValues) => {
    try {
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
      } else {
        updatedDetail = await apiClient.post("/api/productdetails", formValues);
        setDetails((prev) => [...prev, updatedDetail.data]); // Thêm ngay vào danh sách chi tiết
      }

      handleClose();
    } catch (error) {
      console.error("Error updating product detail:", error);
      Swal.fire("Có lỗi xảy ra!", "Vui lòng thử lại.", "error");
    }
  };

  return (
    <Box mt={4}>
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
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {details.map((detail) => (
              <TableRow key={detail.productDetailId}>
                <TableCell>{detail.productDetailId}</TableCell>
                <TableCell>
                  {`${
                    products.find((p) => p.productId === detail.productId)
                      ?.name || "Không có tên"
                  } 
                  dành cho ${
                    skintypes.find((s) => s.skintypeId === detail.skintypeId)
                      ?.name || "Không có loại da"
                  } 
                  dung tích ${
                    capacities.find((c) => c.capacityId === detail.capacityId)
                      ?.value || "Không có dung tích"
                  }
              [${
                colors.find((c) => c.colorId === detail.colorId)?.name ||
                "Không có màu"
              }]`}
                </TableCell>
                <TableCell>{detail.price} VND</TableCell>
                <TableCell>{detail.quantity}</TableCell>
                <TableCell>
                  <img
                    src={detail.img}
                    alt={`Hình ảnh của chi tiết ${detail.productDetailId}`}
                    style={{ width: "50px", height: "50px" }}
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
