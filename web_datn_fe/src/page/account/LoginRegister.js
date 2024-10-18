import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Import SweetAlert2
import "../../assets/css/customToast.css";
import "../../assets/css/login.css";
import { loginUser, registerUser } from "../../services/authService";

const LoginRegister = () => {
  const [isActive, setIsActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullname: "",
    phone: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const { username, password, email, fullname, phone } = formData;

    if (!username || !password || !email || !fullname || !phone) {
      Swal.fire({
        icon: 'error',
        title: 'Vui lòng điền đầy đủ tất cả các trường.',
      });
      return false;
    }

    if (phone.length !== 10) {
      Swal.fire({
        icon: 'error',
        title: 'Số điện thoại phải có 10 số.',
      });
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegisterClick = async () => {
    if (!validateForm()) return;

    try {
      await registerUser(formData);
      Swal.fire({
        icon: 'success',
        title: 'Đăng ký thành công',
      });
      setIsActive(false);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Đăng ký không thành công',
        text: err.response?.data?.message || 'Lỗi không xác định',
      });
    }
  };

  const handleLoginClick = async (event) => {
    event.preventDefault();

    if (!formData.username || !formData.password) {
      Swal.fire({
        icon: 'error',
        title: 'Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.',
      });
      return;
    }

    try {
      const response = await loginUser({
        username: formData.username,
        password: formData.password,
      });

      if (response && response.access_token && response.role) {
        const { access_token, role, user_id } = response;

        // Mã hóa thông tin người dùng
        const encryptedUserData = CryptoJS.AES.encrypt(
          JSON.stringify({ user_id, role, access_token }),
          "secret-key"
        ).toString();
        // Lưu vào localStorage
        localStorage.setItem("userData", encryptedUserData);
        Cookies.set("access_token", access_token, { expires: 7 });
        Swal.fire({
          icon: 'success',
          title: 'Đăng nhập thành công',
        }); // Thông báo thành công
        navigate(role === "admin" ? "/admin" : "/");
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Dữ liệu không đầy đủ từ server.',
        });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Tên đăng nhập hoặc mật khẩu không đúng";
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: errorMessage,
      });
    }
  };

  return (
    <div className={`login-container ${isActive ? "active" : ""}`} id="container " style={{ marginLeft: '400px', marginTop: '60px' }}>
      <div className="form-container sign-up">
        <form>
          <h1>Tạo Tài Khoản</h1>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Tên đăng nhập"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Mật khẩu"
          />
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleInputChange}
            placeholder="Họ và tên"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Số điện thoại"
          />
          <div className="social-icons">
            <a href="/auth/google" className="icon">
              <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google Logo" width="30" />
            </a>
            <a href="/auth/facebook" className="icon">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook Logo" width="30" />
            </a>
          </div>
          <button type="button" onClick={handleRegisterClick}>
            Đăng Ký
          </button>
        </form>
      </div>
      <div className="form-container sign-in">
        <form onSubmit={handleLoginClick}>
          <h1>Đăng Nhập</h1>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Tên đăng nhập"
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              style={{ width: "305px" }}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Mật khẩu"
            />
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? (
                <i className="fa fa-eye"></i>
              ) : (
                <i className="fa fa-eye-slash"></i>
              )}
            </span>
          </div>
          <Link to="/forgot-password" style={{ marginRight: "200px", marginBottom: "10px", marginTop: "6px", fontWeight: 'bold' }}>
            Quên mật khẩu?
          </Link>
          <div className="social-icons">
            <a href="/auth/google" className="icon">
              <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google Logo" width="30" />
            </a>
            <a href="/auth/facebook" className="icon">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook Logo" width="30" />
            </a>
          </div>
          <button type="submit">Đăng Nhập</button>
        </form>
        <Link to="/" className="to-home">
          <ArrowBackIcon /> Về trang chủ
        </Link>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h4 style={{ color: 'white', marginBottom: '10px', textTransform: 'capitalize' }}>Chào mừng quay trở lại!</h4>
            <span style={{ marginRight: "20px", color: 'white', marginBottom: '10px' }}>Đăng nhập vào tài khoản của bạn</span>
            <button className="hidden" id="login" onClick={() => setIsActive(false)} style={{ marginRight: "20px" }}>
              Đăng Nhập
            </button>
          </div>
          <div className="toggle-panel toggle-right">

            <h3 style={{ marginLeft: "20px", color: 'white', marginBottom: '10px', textTransform: 'capitalize' }}>Tạo tài khoản mới</h3>
            <span style={{ marginLeft: "20px", color: 'white', marginBottom: '10px' }}>Đăng ký để khám phá những tiện ích tuyệt vời</span>
            <button className="hidden" id="register" onClick={() => setIsActive(true)} style={{ marginLeft: "20px" }}>
              Đăng Ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
