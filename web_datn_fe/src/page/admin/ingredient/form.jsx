import { Box, Button, Grid, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { apiClient } from "../../../config/apiClient"; // Ensure the path to apiClient is correct
import Swal from "sweetalert2";

const IngredientForm = ({ initialValues, onSubmit, handleClose }) => {
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

      // Determine if we are creating or updating an ingredient
      if (formValues.id) {
        // If ID exists, update existing ingredient
        response = await apiClient.put(
          `/api/ingredients/${formValues.id}`,
          formValues
        );
        Swal.fire(
          "Cập nhật thành công!",
          "Thành phần đã được cập nhật.",
          "success"
        );
      } else {
        // If ID does not exist, create a new ingredient
        response = await apiClient.post("/api/ingredients", formValues);
        Swal.fire(
          "Thêm thành công!",
          "Thành phần mới đã được thêm.",
          "success"
        );
      }

      // Call the onSubmit prop to notify the parent component
      onSubmit(response.data);
      handleClose(); // Close the form/modal
    } catch (error) {
      console.error("Error saving ingredient:", error);
      Swal.fire("Có lỗi xảy ra!", "Vui lòng thử lại.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} sx={{ marginTop: "5px" }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Thành phần"
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
          Lưu
        </Button>
        <Button onClick={handleRefresh} variant="outlined" color="secondary">
          Làm mới
        </Button>
      </Box>
    </form>
  );
};

export default IngredientForm;
