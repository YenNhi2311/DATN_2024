import { Box, Button, Grid, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import SweetAlert
import { apiClient } from "../../../config/apiClient";

const SkinForm = ({ initialValues, onSubmit, handleClose }) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [loading, setLoading] = useState(false); // State để kiểm tra trạng thái loading

  // Cập nhật formValues khi initialValues thay đổi
  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleRefresh = () => {
    setFormValues(initialValues); // Reset form về giá trị ban đầu
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Bắt đầu loading

    try {
      let response;
      if (formValues.id) {
        // Nếu có id, gọi API để cập nhật
        response = await apiClient.put(
          `/api/skintypes/${formValues.id}`,
          formValues
        );
      } else {
        // Nếu không có id, gọi API để thêm mới
        response = await apiClient.post("/api/skintypes", formValues);
      }

      // Hiển thị thông báo thành công
      Swal.fire({
        title: "Thành công!",
        text: formValues.id
          ? "Loại da đã được cập nhật thành công."
          : "Loại da đã được thêm thành công.",
        icon: "success",
        confirmButtonText: "OK",
      });

      onSubmit(response.data); // Gửi dữ liệu đến hàm onSubmit bên ngoài
      handleClose(); // Đóng form nếu cần
    } catch (error) {
      console.error("Error saving skin type:", error);

      // Hiển thị thông báo lỗi
      Swal.fire({
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi lưu loại da. Vui lòng thử lại.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} sx={{ marginTop: "5px" }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Loại da"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            variant="outlined"
            required
          />
        </Grid>
      </Grid>

      {/* Buttons */}
      <Box mt={3} display="flex" justifyContent="space-between">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading} // Disable button khi loading
        >
          {loading ? "Đang thực hiện..." : formValues.id ? "Cập nhật" : "Thêm"}
        </Button>
        <Button onClick={handleRefresh} variant="outlined" color="secondary">
          Làm mới
        </Button>
      </Box>
    </form>
  );
};

export default SkinForm;
