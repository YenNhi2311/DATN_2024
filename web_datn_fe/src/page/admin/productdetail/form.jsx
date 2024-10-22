import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  IconButton,
  InputAdornment,
  Grid,
} from "@mui/material";
import { apiClient } from "../../../config/apiClient";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

const ProductDetailsForm = ({
  open,
  onClose,
  onSubmit,
  initialValues = {},
}) => {
  const { id } = useParams();
  const [formValues, setFormValues] = useState({
    price: initialValues.price || 0,
    quantity: initialValues.quantity || 0,
    img: initialValues.img || "",
    productId: id,
    colorId: initialValues.colorId || "",
    skintypeId: initialValues.skintypeId || "",
    capacityId: initialValues.capacityId || "",
    ingredientId: initialValues.ingredientId || "",
    benefitId: initialValues.benefitId || "",
  });

  const [colors, setColors] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [capacities, setCapacities] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  // Fetch data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          apiClient.get("/api/colors"),
          apiClient.get("/api/skintypes"),
          apiClient.get("/api/capacities"),
          apiClient.get("/api/ingredients"),
          apiClient.get("/api/benefits"),
        ]);

        setColors(responses[0].data);
        setSkinTypes(responses[1].data);
        setCapacities(responses[2].data);
        setIngredients(responses[3].data);
        setBenefits(responses[4].data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Set form values when initialValues change
  useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      ...initialValues,
    }));
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormValues((prev) => ({
          ...prev,
          img: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // Validate form inputs
    if (formValues.price < 0 || formValues.quantity < 0) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Giá và số lượng không thể nhỏ hơn 0",
      });
      return;
    }

    try {
      const formData = new FormData();
      for (const key in formValues) {
        formData.append(key, formValues[key]);
      }
      if (imageFile) {
        formData.append("img", imageFile);
      }

      const apiCall = initialValues.productDetailId
        ? apiClient.put(
            `/api/productdetails/${initialValues.productDetailId}`,
            formData
          )
        : apiClient.post("/api/productdetails", formData);

      const response = await apiCall;

      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: initialValues.productDetailId
          ? "Chi tiết sản phẩm đã được cập nhật."
          : "Chi tiết sản phẩm mới đã được thêm.",
      });

      // Gọi onSubmit với response.data
      onSubmit(response.data); // Truyền dữ liệu chi tiết sản phẩm vừa được thêm hoặc cập nhật
      onClose(); // Đóng modal
    } catch (error) {
      console.error("Error saving product detail:", error);
      Swal.fire({
        icon: "error",
        title: "Có lỗi xảy ra!",
        text: "Vui lòng thử lại.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        {initialValues.productDetailId
          ? "Chỉnh Sửa Sản Phẩm"
          : "Thêm Chi Tiết Sản Phẩm"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Hình ảnh"
              name="img"
              value={formValues.img}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton component="label">
                      <PhotoCamera />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {formValues.img && (
              <div style={{ marginTop: 16 }}>
                <img
                  src={formValues.img}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Giá (VND)"
              name="price"
              type="number"
              value={formValues.price || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{ shrink: true }}
            />
            <TextField
              label="Số lượng"
              name="quantity"
              type="number"
              value={formValues.quantity || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{ shrink: true }}
            />
            <TextField
              select
              label="Màu sắc"
              name="colorId"
              value={formValues.colorId || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {colors.map((color) => (
                <MenuItem key={color.colorId} value={color.colorId}>
                  {color.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Loại da"
              name="skintypeId"
              value={formValues.skintypeId || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {skinTypes.map((type) => (
                <MenuItem key={type.skintypeId} value={type.skintypeId}>
                  {type.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Dung tích"
              name="capacityId"
              value={formValues.capacityId || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {capacities.map((capacity) => (
                <MenuItem key={capacity.capacityId} value={capacity.capacityId}>
                  {capacity.value}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Thành phần"
              name="ingredientId"
              value={formValues.ingredientId || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {ingredients.map((ingredient) => (
                <MenuItem
                  key={ingredient.ingredientId}
                  value={ingredient.ingredientId}
                >
                  {ingredient.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Lợi ích"
              name="benefitId"
              value={formValues.benefitId || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {benefits.map((benefit) => (
                <MenuItem key={benefit.benefitId} value={benefit.benefitId}>
                  {benefit.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {initialValues.productDetailId ? "Chỉnh Sửa" : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetailsForm;
