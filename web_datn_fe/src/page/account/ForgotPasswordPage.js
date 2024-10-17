import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Swal from "sweetalert2";
import "../../assets/css/auth.css";
import { apiClient } from "../../services/authService"; // Import apiClient

const ForgotPasswordPage = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Gửi yêu cầu đến endpoint /password-reset/request-otp với dữ liệu username
            const response = await apiClient.post("/password-reset/request-otp", { username });
            
            // Lưu username vào localStorage để sử dụng sau trong quá trình xác thực OTP
            localStorage.setItem("username", username);

            // Hiển thị thông báo thành công với SweetAlert2
            Swal.fire({
                icon: "success",
                title: "Thành công!",
                text: response.data, // Hiển thị thông báo thành công từ API
                confirmButtonText: "OK"
            }).then(() => {
                // Điều hướng sang trang /verify-otp sau khi bấm OK
                navigate("/verify-otp"); // Điều hướng sang trang xác thực OTP
            });
        } catch (error) {
            // Kiểm tra phản hồi lỗi từ API để hiển thị thông báo tương ứng
            if (error.response && error.response.status === 400) {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    text: error.response.data, // Hiển thị thông báo lỗi nếu username không hợp lệ
                    confirmButtonText: "Thử lại"
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Đã xảy ra lỗi",
                    text: "Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại sau.",
                    confirmButtonText: "OK"
                });
            }
            console.error("Lỗi khi gửi yêu cầu quên mật khẩu:", error);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="left-box">
                    <h2>Quên mật khẩu</h2>
                    <form onSubmit={handleSubmit}>
                        <p>Nhập tên đăng nhập</p>
                        <input
                            type="text"
                            placeholder="Tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
