import React, { useState } from "react";
import "../../assets/css/profile.css"; // Tệp CSS của bạn
import { Link } from "react-router-dom";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

const UpdateProfileForm = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(URL.createObjectURL(file)); // Hiển thị hình ảnh
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    // Xử lý logic cập nhật dữ liệu người dùng tại đây
    console.log("Dữ liệu đã được cập nhật: ", formData);
  };

  return (
    <div className="profile-container">
      <form className="profile-form" onSubmit={handleSubmit}>
        <h2>Cập nhật thông tin</h2>

        {/* Ảnh đại diện */}
        <div className="profile-image-section">
          <label htmlFor="profileImage">
            <img
              src={profileImage || "https://via.placeholder.com/150"}
              alt="Profile"
              className="profile-image"
            />
          </label>
          <input
            type="file"
            id="profileImage"
            onChange={handleImageChange}
            accept="image/*"
            hidden
          />
        </div>

        {/* Các trường thông tin */}
        <div className="form-group">
          <input
            type="text"
            name="fullname"
            placeholder="Họ và tên"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Giới tính */}
        <div className="gender-group">
          <h5>Giới tính</h5>
          <div>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                onChange={handleChange}
              />
              Nam
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                onChange={handleChange}
              />
              Nữ
            </label>
          </div>
        </div>

        <button type="submit">Cập nhật thông tin</button>
      </form>
      <Link to="/">
        <ArrowBackIcon /> Về trang chủ
      </Link>
    </div>
  );
};

export default UpdateProfileForm;
