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

const ProductForm = ({
  initialValues,
  onSubmit,
  handleClose,
  categories,
  brands,
}) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [selectedImage, setSelectedImage] = useState(null); // Để lưu trữ ảnh đã chọn

  useEffect(() => {
    setFormValues(initialValues); // Cập nhật giá trị form khi initialValues thay đổi
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Xử lý khi người dùng chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file)); // Tạo URL tạm để hiển thị ảnh
    }
  };

  const handleRefresh = () => {
    setFormValues(initialValues); // Reset form về giá trị ban đầu
    setSelectedImage(null); // Xóa ảnh đã chọn
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues); // Gửi dữ liệu khi nhấn nút Save
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} sx={{ marginTop: "5px" }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Tên sản phẩm"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            variant="outlined"
            required
          />
          <TextField
            fullWidth
            label="Mô tả"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            variant="outlined"
            required
            sx={{ mt: 2 }}
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
      </Grid>

      {/* Buttons */}
      <Box mt={3} display="flex" justifyContent="space-between">
        <Button type="submit" variant="contained" color="primary">
          Lưu
        </Button>
        <Button onClick={handleRefresh} variant="outlined" color="secondary">
          Làm mới
        </Button>
      </Box>
    </form>
  );
};

export default ProductForm;
