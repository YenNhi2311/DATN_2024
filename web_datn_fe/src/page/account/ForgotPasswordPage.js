import React, { useState } from "react";
import "../../assets/css/auth.css";
import { Link } from "react-router-dom";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic gửi email khôi phục mật khẩu ở đây
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="left-box">
          <h2>Quên mật khẩu</h2>
          <p>Nhập tên đăng nhập và email để đặt lại mật khẩu</p>
          <form onSubmit={handleSubmit}>
            <input
              type="username"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Gửi</button>
          </form>
          <Link to="/">
            <ArrowBackIcon /> Về trang chủ
          </Link>
        </div>
        <div className="right-box">
          <h2>Chào bạn!</h2>
          <p>Nếu bạn quên mật khẩu, hãy đăng ký!</p>
          <Link to="/login" type="submit">
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
