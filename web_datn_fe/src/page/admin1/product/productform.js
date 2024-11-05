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
import Swal from "sweetalert2";

const ProductForm = ({
  initialValues,
  onSubmit,
  handleClose,
  categories,
  brands,
  productId,
}) => {
  const [formValues, setFormValues] = useState(initialValues);

  useEffect(() => {
    setFormValues(initialValues); // Đảm bảo formValues được khởi tạo từ initialValues
  }, [initialValues]);

  useEffect(() => {
    console.log("Current productId:", productId);
    if (!productId) {
      console.log("Adding new product");
    } else {
      console.log("Updating existing product");
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();  // Prevent default form submission
    if (onSubmit) {
      onSubmit(formValues);  // Call the onSubmit function passed via props
    } else {
      console.error("onSubmit function is not defined");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (productId) {
  //       // Cập nhật sản phẩm nếu productId tồn tại
  //       await apiClient.put(`/api/products/${productId}`, {
  //         name: formValues.name,
  //         description: formValues.description,
  //         categoryId: formValues.categoryId,
  //         brandId: formValues.brandId,
  //       });
  //       Swal.fire({
  //         icon: "success",
  //         title: "Cập nhật thành công!",
  //         text: "Sản phẩm đã được cập nhật.",
  //       });
  //     } else {
  //       // Thêm mới sản phẩm nếu productId không tồn tại
  //       await apiClient.post("/api/products", {
  //         name: formValues.name,
  //         description: formValues.description,
  //         categoryId: formValues.categoryId,
  //         brandId: formValues.brandId,
  //       });
  //       Swal.fire({
  //         icon: "success",
  //         title: "Thêm thành công!",
  //         text: "Sản phẩm đã được thêm.",
  //       });
  //     }
  //     onSubmit();
  //     handleClose();
  //   } catch (error) {
  //     console.log(error)
  //     console.error("Lỗi khi lưu sản phẩm:", error);
  //     alert("Có lỗi xảy ra khi lưu sản phẩm. Vui lòng thử lại!");
  //   }
  // };

  return (
    <form onSubmit={handleSubmit}>
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
          <Button variant="contained" color="primary" type="submit" sx={{ marginRight: 2 }}>
            Lưu
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
