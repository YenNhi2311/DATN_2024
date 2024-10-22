import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../../../assets/css/product.css";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { apiClient } from "../../../config/apiClient";

const ProductForm = ({
  initialValues = {},
  onSubmit,
  handleClose,
  categories,
  brands,
  editData,
}) => {
  const [formValues, setFormValues] = useState({
    name: initialValues.name || "",
    description: initialValues.description || "",
    price: initialValues.price || 0,
    quantity: initialValues.quantity || 0,
    img: initialValues.img || "",
    productId: initialValues.productId || "",
    colorId: initialValues.colorId || "",
    skintypeId: initialValues.skintypeId || "",
    capacityId: initialValues.capacityId || "",
    ingredientId: initialValues.ingredientId || "",
    benefitId: initialValues.benefitId || "",
    categoryId: initialValues.categoryId || "",
    brandId: initialValues.brandId || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [capacities, setCapacities] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [benefits, setBenefits] = useState([]);

  // Fetch data when component mounts
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
        ]);

        setColors(responses[0].data);
        setSkinTypes(responses[1].data);
        setCapacities(responses[2].data);
        setIngredients(responses[3].data);
        setBenefits(responses[4].data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Populate form values with editData
  useEffect(() => {
    if (editData) {
      setFormValues({
        name: editData.product?.name || "",
        description: editData.product?.description || "",
        price: editData.detail?.price || 0,
        quantity: editData.detail?.quantity || 0,
        img: editData.detail?.img || "", // Giữ lại tên hình ảnh cũ
        productId: editData.product?.productId || "",
        colorId: editData.detail?.colorId || "",
        skintypeId: editData.detail?.skintypeId || "",
        capacityId: editData.detail?.capacityId || "",
        ingredientId: editData.detail?.ingredientId || "",
        benefitId: editData.detail?.benefitId || "",
        categoryId: editData.product?.categoryId || "",
        brandId: editData.product?.brandId || "",
      });

      // Đặt hình ảnh xem trước
      if (editData.detail?.img) {
        setImagePreview(`http://localhost:8080/assets/img/${editData.detail.img}`);
      }
    }
  }, [editData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? parseFloat(value) : value,
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      Swal.fire({
        icon: "error",
        title: "Ảnh không hợp lệ!",
        text: "Vui lòng tải lên tệp hình ảnh hợp lệ.",
      });
    }
  };

  // Form validation
  const validateForm = () => {
    if (!formValues.price || formValues.price <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Giá không hợp lệ!",
        text: "Vui lòng nhập giá hợp lệ.",
      });
      return false;
    }

    if (formValues.quantity <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Số lượng không hợp lệ!",
        text: "Vui lòng nhập số lượng hợp lệ.",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const formData = new FormData();
      Object.entries(formValues).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Handle image file
      if (imageFile) {
        formData.append("img", imageFile);
      } else {
        formData.append("img", formValues.img);
      }

      let productId;

      if (!formValues.productId) {
        const createProductResponse = await apiClient.post("/api/products", formData);
        productId = createProductResponse.data.productId;

        // Chuẩn bị dữ liệu cho chi tiết sản phẩm
        const productDetailFormData = new FormData();
        productDetailFormData.append("productId", productId);
        Object.entries(formValues).forEach(([key, value]) => {
          if (!["name", "description", "categoryId", "brandId", "productId"].includes(key)) {
            productDetailFormData.append(key, value);
          }
        });

        const detailResponse = await apiClient.post("/api/productdetails", productDetailFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Chi tiết sản phẩm đã được thêm:", detailResponse.data);
      } else {
        // Nếu có productId, cập nhật sản phẩm đã tồn tại
        await apiClient.put(`/api/products/${formValues.productId}`, formData);

        const productDetailFormData = new FormData();
        productDetailFormData.append("productId", formValues.productId);
        Object.entries(formValues).forEach(([key, value]) => {
          if (!["name", "description", "categoryId", "brandId", "productId"].includes(key)) {
            productDetailFormData.append(key, value);
          }
        });

        // Kiểm tra editData.detail để chắc chắn có detailId
        if (editData && editData.detail && editData.detail.productDetailId) {
          const detailResponse = await apiClient.put(`/api/productdetails/${editData.detail.productDetailId}`, productDetailFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          console.log("Chi tiết sản phẩm đã được cập nhật:", detailResponse.data);
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi!",
            text: "Không tìm thấy thông tin chi tiết sản phẩm để cập nhật.",
          });
          return;
        }
      }

      // In ra dữ liệu sau khi cập nhật
      console.log("Updated product data:", formValues);

      Swal.fire({
        icon: "success",
        title: editData ? "Cập nhật thành công!" : "Thêm mới thành công!",
        text: "Sản phẩm và chi tiết sản phẩm đã được lưu thành công.",
      });

      onSubmit(productId);
      handleClose();
    } catch (error) {
      console.error("Xảy ra lỗi:", error);
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.";
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: errorMessage,
      });
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="product-form">
        <div className="modal-header">
          <h2>{initialValues.productId ? "Cập Nhật Sản Phẩm" : "Thêm Mới Sản Phẩm"}</h2>
          <IconButton className="iconbuttonclose" onClick={handleClose} style={{ color: 'red' }}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="form-form">
          <div className="image-form">
            <div className="image-preview" onClick={() => document.getElementById("imageInput").click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="preview-image" />
              ) : editData.detail?.img ? (
                <img src={`http://localhost:8080/assets/img/${editData.detail.img}`} alt="Existing Image" className="preview-image" />
              ) : (
                <div className="preview-placeholder">Nhấp vào để thêm ảnh</div>
              )}
              <input
                type="file"
                id="imageInput"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="form-column">
            <input
              className="inputForm"
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              placeholder="Tên sản phẩm"
              required
              disabled={!!formValues.productId} // Không cho phép chỉnh sửa khi có productId
            />

            <textarea
              className="inputForm"
              name="description"
              value={formValues.description}
              onChange={handleChange}
              placeholder="Mô tả"
              required
              disabled={!!formValues.productId} // Không cho phép chỉnh sửa khi có productId
            />

            <select
              className="inputForm"
              name="categoryId"
              value={formValues.categoryId || ""}
              onChange={handleChange}
              required
              disabled={!!formValues.productId} // Không cho phép chỉnh sửa khi có productId
            >
              <option value="" disabled>Danh mục</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              className="inputForm"
              name="brandId"
              value={formValues.brandId || ""}
              onChange={handleChange}
              required
              disabled={!!formValues.productId} // Không cho phép chỉnh sửa khi có productId
            >
              <option value="" disabled>Thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand.brandId} value={brand.brandId}>
                  {brand.name}
                </option>
              ))}
            </select>

          </div>

          <div className="form-column">
            <select className="inputForm2"
              name="colorId"
              value={formValues.colorId || ""}
              onChange={handleChange}
            >
              <option value="" disabled>
                Màu sắc
              </option>
              {colors.map((color) => (
                <option key={color.colorId} value={color.colorId}>
                  {color.name}
                </option>
              ))}
            </select>

            <select className="inputForm2"
              name="skintypeId"
              value={formValues.skintypeId || ""}
              onChange={handleChange}
            >
              <option value="" disabled>
                Loại da
              </option>
              {skinTypes.map((type) => (
                <option key={type.skintypeId} value={type.skintypeId}>
                  {type.name}
                </option>
              ))}
            </select>

            <select className="inputForm2"
              name="capacityId"
              value={formValues.capacityId || ""}
              onChange={handleChange}
            >
              <option value="" disabled>
                Dung tích
              </option>
              {capacities.map((capacity) => (
                <option key={capacity.capacityId} value={capacity.capacityId}>
                  {capacity.value}
                </option>
              ))}
            </select>

            <select className="inputForm2"
              name="ingredientId"
              value={formValues.ingredientId || ""}
              onChange={handleChange}
            >
              <option value="" disabled>
                Thành phần
              </option>
              {ingredients.map((ingredient) => (
                <option key={ingredient.ingredientId} value={ingredient.ingredientId}>
                  {ingredient.name}
                </option>
              ))}
            </select>

            <select className="inputForm2"
              name="benefitId"
              value={formValues.benefitId || ""}
              onChange={handleChange}
            >
              <option value="" disabled>
                Lợi ích
              </option>
              {benefits.map((benefit) => (
                <option key={benefit.benefitId} value={benefit.benefitId}>
                  {benefit.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-column">
            <input className="inputForm2"
              type="number"
              name="price"
              value={formValues.price || ""}
              onChange={handleChange}
              placeholder="Giá (VND)"
              required
            />
            <input className="inputForm2"
              type="number"
              name="quantity"
              value={formValues.quantity || ""}
              onChange={handleChange}
              placeholder="Số lượng"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          {/* <button type="button" onClick={handleRefresh} className="refresh-button">
            Làm mới
          </button> */}
          <button type="submit" className="submit-button">
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
