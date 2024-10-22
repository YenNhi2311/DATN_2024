import { Box, Button, Grid, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { apiClient } from "../../../config/apiClient"; // Ensure the path to apiClient is correct
import Swal from "sweetalert2";

const BenefitForm = ({ initialValues, onSubmit, handleClose }) => {
  const [formValues, setFormValues] = useState(initialValues);

  useEffect(() => {
    setFormValues(initialValues); // Set initial form values when initialValues prop changes
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
    Swal.fire("Đã làm mới!", "Form đã được làm mới.", "info");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      // Determine if we are creating or updating a benefit
      if (formValues.id) {
        // If ID exists, update existing benefit
        response = await apiClient.put(
          `/api/benefits/${formValues.id}`,
          formValues
        );
        Swal.fire(
          "Cập nhật thành công!",
          "Công dụng đã được cập nhật.",
          "success"
        );
      } else {
        // If ID does not exist, create a new benefit
        response = await apiClient.post("/api/benefits", formValues);
        Swal.fire("Thêm thành công!", "Công dụng mới đã được thêm.", "success");
      }

      // Call the onSubmit prop to notify the parent component
      onSubmit(response.data);
      handleClose(); // Close the form/modal
    } catch (error) {
      console.error("Error saving benefit:", error);
      Swal.fire("Có lỗi xảy ra!", "Vui lòng thử lại.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} sx={{ marginTop: "5px" }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Công dụng"
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
        <Button type="submit" variant="contained" color="primary">
          {formValues.id ? "Cập nhật" : "Thêm"}
        </Button>
        <Button onClick={handleRefresh} variant="outlined" color="secondary">
          Làm mới
        </Button>
      </Box>
    </form>
  );
};

export default BenefitForm;
