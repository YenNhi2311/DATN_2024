import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import "../../assets/css/changePass.css";
import { apiClient } from "../../config/apiClient";
import { getUserDataById } from "../../services/authService";

const ChangePasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Lấy thông tin người dùng
  const userData = getUserDataById();
  const userId = userData ? userData.user_id : null; // Lấy đúng trường user_id

  // Hàm kiểm tra độ mạnh mật khẩu
  const passwordValidation = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  };

  // Xử lý khi submit form thay đổi mật khẩu
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Kiểm tra nếu không có thông tin người dùng
    if (!userData) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không tìm thấy thông tin người dùng.',
      });
      setLoading(false);
      return;
    }

    // Kiểm tra mật khẩu xác nhận có khớp không
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Mật khẩu xác nhận không khớp.',
      });
      setLoading(false);
      return;
    }

    // Kiểm tra độ mạnh của mật khẩu
    if (!passwordValidation(newPassword)) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Mật khẩu phải ít nhất 8 ký tự, bao gồm chữ, số và ký tự đặc biệt.',
      });
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      // Gửi yêu cầu cập nhật mật khẩu lên API
      const response = await apiClient.put(`/user/password`, {
        userId: userId, // Truyền userId đúng vào payload
        newPassword: newPassword, // Truyền mật khẩu mới
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token cho backend để xác thực
          user_id: userId, // Truyền user_id trong headers nếu backend yêu cầu
        }
      });

      // Kiểm tra phản hồi từ server
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Mật khẩu đã được đổi thành công.',
        }).then(() => {
          navigate("/login");
           // Điều hướng đến trang login sau khi đổi mật khẩu thành công
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: response.data.message || "Có lỗi xảy ra, vui lòng thử lại.",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Có lỗi xảy ra khi kết nối với máy chủ, vui lòng thử lại.',
      });
    } finally {
      setLoading(false); // Dừng trạng thái loading
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-box">
        <h2>Thay Đổi Mật Khẩu</h2>
        <form onSubmit={handleSubmit}>
          <div className="change-password-form-group">
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="change-password-form-group">
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="change-password-form-group">
            <button type="submit" disabled={loading}>
              {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
