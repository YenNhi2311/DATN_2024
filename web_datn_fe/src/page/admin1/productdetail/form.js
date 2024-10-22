  import React, { useEffect, useState } from "react";
  import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    MenuItem,
    Grid,
    IconButton,
  } from "@mui/material";
  import "../../../assets/css/admin/formProductDetail.css";
  import { apiClient } from "../../../config/apiClient";
  import PhotoCamera from "@mui/icons-material/PhotoCamera";
  import Swal from "sweetalert2";
  import { useParams } from "react-router-dom";
  import CloseIcon from '@mui/icons-material/Close';

  const ProductDetailsForm = ({ open, onClose, onSubmit, initialValues = {} }) => {
    const { id } = useParams();
    const [formValues, setFormValues] = useState({
      price: initialValues.price || 0,
      quantity: initialValues.quantity || 0,
      img: initialValues.img || "",
      productId: initialValues.productId || "",
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
    const [products, setProducts] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch initial data for dropdowns
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const responses = await Promise.all([
            apiClient.get("/api/colors"),
            apiClient.get("/api/skintypes"),
            apiClient.get("/api/capacities"),
            apiClient.get("/api/ingredients"),
            apiClient.get("/api/benefits"),
            apiClient.get("/api/products"),
          ]);

          setColors(responses[0].data);
          setSkinTypes(responses[1].data);
          setCapacities(responses[2].data);
          setIngredients(responses[3].data);
          setBenefits(responses[4].data);
          setProducts(responses[5].data);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);

    useEffect(() => {
      if (initialValues && initialValues.productDetailId) {
        setFormValues((prev) => ({
          ...prev,
          ...initialValues,
        }));
        setImagePreview(initialValues.img ? `http://localhost:8080/assets/img/${initialValues.img}` : "");
      }
    }, [initialValues]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormValues((prev) => ({
        ...prev,
        [name]: name === "price" || name === "quantity" ? parseFloat(value) : value,
      }));
    };
    

    // Handle image upload and preview
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file)); // Update to show the new image
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid File!",
          text: "Please upload a valid image file.",
        });
      }
    };

    // Close the dialog and reset the form
    const handleClose = () => {
      resetForm();
      onClose();
    };

    // Reset form fields
    const resetForm = () => {
      setFormValues({
        price: 0,
        quantity: 0,
        img: "",
        productId: "",
        colorId: "",
        skintypeId: "",
        capacityId: "",
        ingredientId: "",
        benefitId: "",
      });
      setImageFile(null);
      setImagePreview("");
    };

    // Handle form submission
    const handleSubmit = async () => {
      // Validate price and quantity
      if (formValues.price === "" || formValues.price <= 0) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Price!",
          text: "Giá không hợp lệ.",
          customClass: {
            popup: "my-swal-popup",
          },
        });
        return;
      }
      
      if (formValues.quantity <= 0) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Quantity!",
          text: "Số lượng không hợp lệ.",
          customClass: {
            popup: "my-swal-popup",
          },
        });
        return;
      }

      try {
        const formData = new FormData();
        Object.entries(formValues).forEach(([key, value]) => {
          formData.append(key, value);
          console.log("Giá trị Form:", formValues);
        });

        if (imageFile) {
          formData.append("img", imageFile);
        }

        const apiCall = initialValues.productDetailId
          ? apiClient.put(`/api/productdetails/${initialValues.productDetailId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          : apiClient.post("/api/productdetails", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

        const response = await apiCall;

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: initialValues.productDetailId ? "Cập nhật chi tiết sản phẩm thành công." : "Thêm mới chi tiết sản phẩm thành công.",
        });

        onSubmit(response.data); // Notify the parent component of the successful submission
        handleClose();
      } catch (error) {
        console.error("Xảy ra lỗi trong khi thực hiên thao tác:", error);
        const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.";
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: errorMessage,
        });
      }
    };


    return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>
          {initialValues.productDetailId ? "Chỉnh Sửa Sản Phẩm" : "Thêm Chi Tiết Sản Phẩm"}
          <IconButton
                    edge="end"
                    style={{ float: 'right', right: 2, color: 'red', fontWeight: 'bolder' }}
                    onClick={() => handleClose(false)}
                >
                    <CloseIcon />
                </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                component="label"
                startIcon={<PhotoCamera />}
                fullWidth
                style={{ marginTop: 20 }}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {/* Handle image preview */}
              <div style={{ marginTop: 16 }}>
                {imagePreview ? (
                  <img
                    src={imagePreview} // Use the imagePreview state directly
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : initialValues.img ? (
                  <img
                    src={`http://localhost:8080/assets/img/${initialValues.img}`}
                    alt="Existing Image"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                  />
                ) : null}
              </div>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Chọn Sản Phẩm"
                name="productId"
                value={formValues.productId || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
              >
                {products.map((product) => (
                  <MenuItem key={product.productId} value={product.productId}>
                    {product.name}
                  </MenuItem>
                ))}
              </TextField>

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
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  export default ProductDetailsForm;
