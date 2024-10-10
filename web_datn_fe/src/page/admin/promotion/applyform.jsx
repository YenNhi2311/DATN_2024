import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { apiClient } from "../../../config/apiClient";
import Swal from "sweetalert2";

const ApplyPromotion = ({ onPromotionApplied }) => {
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedPromotions, setSelectedPromotions] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchPromotions();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await apiClient.get("/api/promotions");
      setPromotions(response.data);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  const handlePromotionChange = (event) => {
    const promotionId = event.target.value;
    if (event.target.checked) {
      setSelectedPromotions((prev) => [...prev, promotionId]);
    } else {
      setSelectedPromotions((prev) => prev.filter((id) => id !== promotionId));
    }
  };

  const handleApplyPromotion = async () => {
    if (!selectedProduct) {
      Swal.fire({
        icon: "warning",
        title: "Lỗi",
        text: "Vui lòng chọn sản phẩm.",
      });
      return;
    }

    if (selectedPromotions.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Lỗi",
        text: "Vui lòng chọn ít nhất một chương trình khuyến mãi.",
      });
      return;
    }

    try {
      for (const promotionId of selectedPromotions) {
        const data = {
          productId: selectedProduct,
          promotionId: promotionId,
        };
        await apiClient.post("api/product-promotions", data);

        // Gọi hàm để cập nhật danh sách khuyến mãi ở parent component
        onPromotionApplied({ productId: selectedProduct, promotionId });
      }

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Áp dụng khuyến mãi thành công!",
      });
    } catch (error) {
      console.error("Error applying promotion:", error);
      Swal.fire({
        icon: "error",
        title: "Thất bại",
        text: "Áp dụng khuyến mãi thất bại. Vui lòng thử lại.",
      });
    }
  };

  return (
    <Box p={3}>
      <TextField
        select
        label="Chọn sản phẩm"
        value={selectedProduct}
        onChange={handleProductChange}
        fullWidth
        margin="normal"
      >
        {products.map((product) => (
          <MenuItem key={product.productId} value={product.productId}>
            {product.name}
          </MenuItem>
        ))}
      </TextField>

      <FormGroup>
        {promotions.map((promotion) => (
          <FormControlLabel
            key={promotion.promotionId}
            control={
              <Checkbox
                value={promotion.promotionId}
                onChange={handlePromotionChange}
              />
            }
            label={`${promotion.name} (${promotion.percent}%)`}
          />
        ))}
      </FormGroup>

      <div style={{ display: "flex", justifyContent: "end" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleApplyPromotion}
          sx={{ mt: 2 }}
        >
          Áp dụng khuyến mãi
        </Button>
      </div>
    </Box>
  );
};

export default ApplyPromotion;
