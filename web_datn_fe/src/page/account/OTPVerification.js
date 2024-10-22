import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../assets/css/OTPVerification.css'; // Nhập CSS cho kiểu dáng
import { apiClient } from "../../services/authService"; // Nhập apiClient

const XacThucOTP = () => {
    const [otp, setOtp] = useState(Array(6).fill('')); // Khởi tạo một mảng để chứa các chữ số OTP
    const [username, setUsername] = useState(''); // Biến để lưu tên người dùng
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy username từ localStorage nếu có
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername); // Lưu vào state
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không tìm thấy tên người dùng. Vui lòng quay lại trang trước.',
            }).then(() => {
                navigate('/forgot-password'); // Chuyển hướng đến trang quên mật khẩu
            });
        }
    }, [navigate]);

    const handleChange = (value, index) => {
        if (value.length > 1 || (value && isNaN(value))) return; // Ngăn chặn nhập không phải số

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Chỉ cho phép ký tự cuối cùng (nếu nhập nhiều hơn một ký tự)

        // Di chuyển con trỏ đến ô nhập tiếp theo nếu có giá trị được nhập
        if (value && index < otp.length - 1) {
            document.getElementById(`otp-input-${index + 1}`).focus();
        } else if (!value && index > 0) {
            // Di chuyển con trỏ đến ô nhập trước nếu ô hiện tại bị xóa
            document.getElementById(`otp-input-${index - 1}`).focus();
        }

        setOtp(newOtp);
    };

    const handlePaste = (e) => {
        const pastedData = e.clipboardData.getData('Text').split('').filter((char) => !isNaN(char)); // Lấy dữ liệu đã dán và lọc các ký tự không phải số
        const newOtp = [...otp];

        // Điền mảng OTP với dữ liệu đã dán
        for (let i = 0; i < pastedData.length && i < otp.length; i++) {
            newOtp[i] = pastedData[i];
        }

        setOtp(newOtp);

        // Tập trung vào ô nhập trống tiếp theo sau khi dán
        const nextEmptyIndex = newOtp.findIndex((digit) => digit === '');
        if (nextEmptyIndex !== -1) {
            document.getElementById(`otp-input-${nextEmptyIndex}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join(''); // Kết hợp mảng thành một chuỗi duy nhất

        try {
            // Gửi OTP và username đến backend để xác thực
            const response = await apiClient.post('/password-reset/verify-otp', { username, otp: otpString });
            if (response.status === 200) {
                // Nếu OTP hợp lệ, chuyển hướng đến trang đặt lại mật khẩu
                Swal.fire({
                    icon: 'success',
                    title: 'OTP hợp lệ',
                    text: 'Bạn có thể đổi mật khẩu!',
                }).then(() => {
                    navigate('/reset-password'); // Chuyển hướng đến trang đặt lại mật khẩu
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'OTP không hợp lệ',
                text: error.response?.data || 'Có lỗi xảy ra, vui lòng thử lại!',
            });
        }
    };

    return (
        <div className="otp-modal-custom">
            <div className="otp-box-custom">
                <h2>Xác thực mã OTP</h2>
                <form onSubmit={handleSubmit}>
                    <div className="otp-inputs-custom">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-input-${index}`}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onFocus={(e) => e.target.select()} // Chọn văn bản khi có được tiêu điểm
                                onPaste={handlePaste} // Xử lý sự kiện dán
                                className="otp-input-custom"
                            />
                        ))}
                    </div>
                    <button type="submit" className="otp-submit-button">Xác nhận OTP</button>
                </form>
            </div>
        </div>
    );
};

export default XacThucOTP;
