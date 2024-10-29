import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import "../../assets/css/changePass.css";
import { apiClient } from "../../config/apiClient";
import { getUserData } from "../../services/authService";

const ChangePasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const passwordValidation = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Mật khẩu xác nhận không khớp',
      });
      setLoading(false);
      return;
    }

    if (!passwordValidation(newPassword)) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Mật khẩu phải ít nhất 8 ký tự, bao gồm chữ, số và ký tự đặc biệt.',
      });
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    const userId = localStorage.getItem("user_id"); // Lấy userId từ localStorage

    try {
      const userData = await getUserData(userId, token); // Lấy thông tin người dùng
      if (userData) {
        const response = await apiClient.put(`/user/password`, {
          userId,
          user: JSON.stringify({ password: newPassword }),
        });

        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: `Mật khẩu đã được đổi thành công.`,
          }).then(() => {
            navigate("/login");
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: response.data.message || "Có lỗi xảy ra, vui lòng thử lại.",
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không tìm thấy thông tin người dùng.',
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
      setLoading(false);
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
              name="newPassword"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="change-password-form-group">
            <input
              type="password"
              name="confirmPassword"
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
