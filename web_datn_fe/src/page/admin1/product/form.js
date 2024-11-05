import {
  Box,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import { apiClient } from "../../../config/apiClient";
import "../../../assets/css/productformform.css";

const ProductForm = ({
  initialValues,
  onSubmit,
  handleClose,
  categories,
  brands,
  productId, // Thêm productId vào props
}) => {
  const [formValues, setFormValues] = useState(initialValues);

  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Hàm xử lý thêm hoặc cập nhật sản phẩm
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (productId) {
        // Cập nhật sản phẩm
        await apiClient.put(`/api/products/${productId}`, formValues);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        // Thêm sản phẩm mới
        await apiClient.post("/api/products", formValues);
        alert("Thêm sản phẩm thành công!");
      }
      onSubmit(); // Gọi callback onSubmit để refresh danh sách sau khi thêm/cập nhật
      handleClose(); // Đóng form sau khi thành công
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
      alert("Thao tác không thành công. Vui lòng thử lại!");
    }
  };

  return (
    <form>
      <Grid container spacing={2} sx={{ marginTop: "5px" }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Tên sản phẩm"
            name="name"
            value={formValues.name || ""}
            onChange={handleChange}
            variant="outlined"
            required
          />
          <TextField
            fullWidth
            label="Mô tả"
            name="description"
            value={formValues.description || ""}
            onChange={handleChange}
            variant="outlined"
            required
            sx={{ mt: 2 }}
            multiline
            rows={4}
          />
          {/* ComboBox cho danh mục sản phẩm */}
          <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <InputLabel id="category-label">Danh mục</InputLabel>
            <Select
              labelId="category-label"
              name="categoryId"
              value={formValues.categoryId || ""}
              onChange={handleChange}
              label="Danh mục"
              required
            >
              {categories.map((category) => (
                <MenuItem key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ComboBox cho thương hiệu */}
          <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <InputLabel id="brand-label">Thương hiệu</InputLabel>
            <Select
              labelId="brand-label"
              name="brandId"
              value={formValues.brandId || ""}
              onChange={handleChange}
              label="Thương hiệu"
              required
            >
              {brands.map((brand) => (
                <MenuItem key={brand.brandId} value={brand.brandId}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="contained" color="primary" type="submit" sx={{ marginRight: 2 }} onClick={() => handleSubmit}>
            {productId ? "Cập nhật" : "Thêm"}
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Hủy
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProductForm;
