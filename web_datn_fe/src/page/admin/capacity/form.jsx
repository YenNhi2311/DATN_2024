import { Box, Button, Grid, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import SweetAlert
import { apiClient } from "../../../config/apiClient"; // Thay đổi theo cấu trúc của bạn

const CapacityForm = ({ initialValues, onSubmit, handleClose }) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [loading, setLoading] = useState(false); // State để kiểm tra trạng thái loading

  // Đặt lại giá trị khi initialValues thay đổi
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
      // Kiểm tra nếu có id thì thực hiện PUT, nếu không thì thực hiện POST
      const response = formValues.id
        ? await apiClient.put(`/api/capacities/${formValues.id}`, formValues) // Cập nhật
        : await apiClient.post("/api/capacities", formValues); // Thêm mới

      // Hiển thị thông báo thành công
      Swal.fire({
        title: "Thành công!",
        text: `Dung tích đã được ${
          formValues.id ? "cập nhật" : "thêm"
        } thành công.`,
        icon: "success",
        confirmButtonText: "OK",
      });

      onSubmit(response.data); // Gửi dữ liệu đến hàm onSubmit bên ngoài
      handleClose(); // Đóng form nếu cần
    } catch (error) {
      console.error("Error saving capacity:", error);

      // Hiển thị thông báo lỗi
      Swal.fire({
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi lưu dung tích. Vui lòng thử lại.",
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
            label="Dung tích"
            name="value"
            value={formValues.value}
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

export default CapacityForm;
