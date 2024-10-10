import React, { useState } from "react";
import { registerUser, loginUser } from "../../services/authService";
import "../../assets/css/login.css";
import "../../assets/css/customToast.css";
import { notify, ToastContainer } from "../../component/web/CustomToast";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { Link, useNavigate } from "react-router-dom";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

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
      notify("Vui lòng điền đầy đủ tất cả các trường.", "error");
      return false;
    }

    if (phone.length !== 10) {
      notify("Số điện thoại phải có 10 số.", "error");
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
      notify("Đăng ký thành công", "success");
      setIsActive(false);
    } catch (err) {
      notify(
        "Đăng ký không thành công: " +
          (err.response?.data?.message || "Lỗi không xác định"),
        "error"
      );
    }
  };
  const handleLoginClick = async (event) => {
    event.preventDefault();

    if (!formData.username || !formData.password) {
      notify("Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.", "error");
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
        notify("Đăng nhập thành công", "success"); // Thông báo thành công
        navigate(role === "admin" ? "/admin" : "/");
      } else {
        notify("Lỗi: Dữ liệu không đầy đủ từ server.", "error");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Tên đăng nhập hoặc mật khẩu không đúng";
      notify(errorMessage, "error");
    }
  };

  return (
    <div
      className={`login-container ${isActive ? "active" : ""}`}
      id="container"
    >
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
              <i className="fa-brands fa-google"></i>
            </a>
            <a href="/auth/facebook" className="icon">
              <i className="fa-brands fa-facebook-f"></i>
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
              type={showPassword ? "text" : "password"} // Thay đổi kiểu input
              name="password"
              style={{ width: "305px" }}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Mật khẩu"
            />
            <span
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <i className="fa fa-eye"></i>
              ) : (
                <i className="fa fa-eye-slash"></i>
              )}
            </span>
          </div>
          <Link
            href="#"
            style={{
              marginRight: "200px",
              marginBottom: "10px",
              marginTop: "6px",
            }}
          >
            Quên mật khẩu?
          </Link>
          <div className="social-icons">
            <a href="/auth/google" className="icon">
              <i className="fa-brands fa-google"></i>
            </a>
            <a href="/auth/facebook" className="icon">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
          </div>
          <button type="submit">Đăng Nhập</button>
        </form>
        <Link to="/social" className="to-home">
          <ArrowBackIcon /> Về trang chủ
        </Link>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1 style={{ marginRight: "70px" }}>Welcome Back!</h1>
            <button
              className="hidden"
              id="login"
              onClick={() => setIsActive(false)}
              style={{ marginRight: "70px" }}
            >
              Đăng Nhập
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1 style={{ marginLeft: "70px" }}>Hello, Friend!</h1>
            <button
              className="hidden"
              id="register"
              onClick={() => setIsActive(true)}
              style={{ marginLeft: "70px" }}
            >
              Đăng Ký
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginRegister;
