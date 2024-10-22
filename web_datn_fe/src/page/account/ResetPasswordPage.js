import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Swal from 'sweetalert2'; // Import SweetAlert2
import "../../assets/css/auth.css";
import { apiClient } from "../../services/authService"; // Import apiClient

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const passwordValidation = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Mật khẩu xác nhận không khớp',
        });
        return;
    }

    // Kiểm tra độ mạnh của mật khẩu
    if (!passwordValidation(newPassword)) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Mật khẩu phải ít nhất 8 ký tự, bao gồm chữ, số và ký tự đặc biệt.',
        });
        return;
    }

    const username = localStorage.getItem("username"); // Lấy username từ localStorage

    // Thực hiện gọi API để đổi mật khẩu
    try {
        const response = await apiClient.post("/password-reset/change-password", {
            username,  // Gửi username đã lưu
            newPassword,
            confirmPassword: newPassword, // Gửi xác nhận mật khẩu
        });

        console.log(response.data); // In phản hồi từ API để kiểm tra

        if (response.status === 200) {
            // const { accessToken, refreshToken, user_id } = response.data; // Lấy user_id

            // Hiển thị thông báo thành công mà không bao gồm mật khẩu mới
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: `Mật khẩu đã được đổi thành công.`  ,
            }).then(() => {
                navigate("/login"); // Chuyển hướng đến trang đăng nhập
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: response.data.message || "Có lỗi xảy ra, vui lòng thử lại.",
            });
        }
    } catch (err) {
        console.error(err); // In lỗi ra console để kiểm tra
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Có lỗi xảy ra khi kết nối với máy chủ, vui lòng thử lại.',
        });
    }
};

  
  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="left-box">
          <h2>Đổi mật khẩu</h2>
          <p>Nhập mật khẩu mới và xác nhận để đặt lại mật khẩu</p>
          <form onSubmit={handleSubmit}>
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

export default ResetPasswordPage;
