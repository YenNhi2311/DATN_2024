import React, { useState } from "react";
import "../../assets/css/auth.css";
import { Link } from "react-router-dom";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    // Xử lý logic đổi mật khẩu tại đây
    console.log("Mật khẩu đã được đổi thành công");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="left-box">
          <h2>Đổi mật khẩu</h2>
          <p>Nhập mật khẩu cũ, mật khẩu mới và xác nhận để đặt lại mật khẩu</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Mật khẩu cũ"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit">Đổi mật khẩu</button>
          </form>
          <Link to="/">
            <ArrowBackIcon /> Về trang chủ
          </Link>
        </div>
        <div className="right-box">
          <h2>Chào bạn!</h2>
          <p>Nếu bạn muốn thay đổi thông tin cá nhân, vui lòng vào đây</p>
          <Link to="/login" type="submit">
            Cập nhật
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
