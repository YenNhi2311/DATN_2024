import { Box, Button, Grid, TextField } from "@mui/material";
import { useState } from "react";

const BrandForm = ({ initialValues, onSubmit, handleClose }) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [selectedImage, setSelectedImage] = useState(null); // Để lưu trữ ảnh đã chọn

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
        <Grid item xs={6}>
          {/* Hiển thị ảnh đã chọn */}
          {selectedImage && (
            <Box mb={2}>
              <img
                src={selectedImage}
                alt="Selected Brand"
                style={{ width: "100%", height: "auto", objectFit: "contain" }}
              />
            </Box>
          )}
          {/* Input để chọn ảnh từ máy */}
          <Button variant="contained" component="label">
            Chọn hình ảnh
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Tên thương hiệu"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            variant="outlined"
            required
          />
          <TextField
            fullWidth
            label="Xuất xứ"
            name="place"
            value={formValues.place}
            onChange={handleChange}
            variant="outlined"
            required
            sx={{ mt: 2 }}
          />
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

export default BrandForm;
