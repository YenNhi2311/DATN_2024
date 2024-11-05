import React, { useEffect, useState } from "react";
import logo from "../../../assets/img/logo-removebg-preview.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { getUserData } from "../../../services/authService";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const checkLoginStatus = async () => {
    const token = Cookies.get("access_token");
    const encryptedUserData = localStorage.getItem("userData");

    if (encryptedUserData) {
      try {
        const decryptedUserData = CryptoJS.AES.decrypt(
          encryptedUserData,
          "secret-key"
        ).toString(CryptoJS.enc.Utf8);
        const parsedData = JSON.parse(decryptedUserData);
        const userId = parsedData.user_id;

        if (userId) {
          const data = await getUserData(userId, token);
          setUserData(data);
          setIsLoggedIn(true);
        } else {
          console.error("User ID is missing from the decrypted data");
          setIsLoggedIn(false);
          setUserData(null);
          navigate("/login");
        }
      } catch (error) {
        console.error(
          "Error during decryption or fetching user data:",
          error.message
        );
        setIsLoggedIn(false);
        setErrorMessage(
          "Failed to decrypt user data or fetch user information."
        );
      }
    } else {
      console.error("No userData found in localStorage");
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus(); // Kiểm tra trạng thái đăng nhập
  }, []);

  const handleLogout = () => {
    Cookies.remove("access_token");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUserData(null);
    navigate("/");
    window.location.reload();
  };

  const isAdmin = userData?.authorities?.some(
    (auth) => auth.authority === "admin"
  );

  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      <div className="d-flex align-items-center justify-content-between">
        <a href="index.html" className="logo d-flex align-items-center">
          <img src={logo} alt="Logo" style={{ width: "40%", height: "60%" }} />
          <span className="d-none d-lg-block"></span>
        </a>
      </div>

      {/* <div className="search-bar">
        <form className="search-form d-flex align-items-center" method="POST" action="#">
          <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
          <button type="submit" title="Search"><i className="bi bi-search" /></button>
        </form>
      </div> */}

      <nav
        className="header-nav ms-auto"
        style={{ display: "flex", alignItems: "center" }}
      >
        <p style={{ marginBottom: "0px" }}>{userData?.fullname}</p>
        <div className="nav-item dropdown my-auto me-0">
          <Link to="#" className="nav-link" data-bs-toggle="dropdown">
            {isLoggedIn && userData ? (
              <div className="user-profile">
                <img
                  src={
                    userData.img
                      ? `http://localhost:8080/assets/img/${userData.img}`
                      : "link-to-default-avatar.png"
                  } // Thêm ảnh mặc định nếu không có ảnh người dùng
                  alt="User Profile"
                  className="user-avatar"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ccc",
                  }}
                />
              </div>
            ) : (
              <i className="fas fa-user text-blue fa-2x"></i>
            )}
          </Link>
          <div className="dropdown-menu m-0 rounded-0">
            <>
              <Link to="/" className="dropdown-item">
                Giao diện người dùng
              </Link>
              <Link to="/social" className="dropdown-item">
                Mạng xã hội
              </Link>
              <Link to="/profile" className="dropdown-item">
                Thông Tin
              </Link>
              <Link to="/change-password" className="dropdown-item">
                Đổi Mật Khẩu
              </Link>
              <a className="dropdown-item" onClick={handleLogout}>
                Đăng Xuất
              </a>
            </>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
