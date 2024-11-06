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
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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

  const handleDescriptionChange = (event, editor) => {
    const data = editor.getData();
    handleChange({ target: { name: "description", value: data } });
  };

  const handleUseChange = (event, editor) => {
    const data = editor.getData();
    handleChange({ target: { name: "use", value: data } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} sx={{ marginTop: "5px", maxWidth: "1000px" }}>
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
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel shrink>Mô tả</InputLabel>
            <CKEditor
              editor={ClassicEditor}
              data={formValues.description || ""}
              onChange={handleDescriptionChange}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel shrink>Hướng dẫn sử dụng</InputLabel>
            <CKEditor
              editor={ClassicEditor}
              data={formValues.use || ""}
              onChange={handleUseChange}  
            />
          </FormControl>
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
