import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../component/page/CartContext";
import { getUserData } from "../../services/authService";

const Header = () => {
  const { cartItems, fetchCartItems } = useCart();
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
          fetchCartItems(userId);
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

  useEffect(() => {
    const encryptedData = localStorage.getItem("userData");
    if (encryptedData) {
      try {
        const decryptedData = JSON.parse(
          CryptoJS.AES.decrypt(encryptedData, "secret-key").toString(
            CryptoJS.enc.Utf8
          )
        );
        const userId = decryptedData?.user_id;

        if (userId) {
          fetchCartItems(userId); // Gọi hàm fetchCartItems với userId lấy từ localStorage
        }
      } catch (error) {
        console.error("Decryption failed:", error); // Log lỗi giải mã nếu có
      }
    } else {
      console.warn("No userData found in localStorage"); // Log thông báo khi không có userData
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("access_token");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUserData(null);
    navigate("/");
    window.location.reload();
  };

  const handleCartClick = () => {
    const encryptedData = localStorage.getItem("userData");
    if (encryptedData) {
      try {
        const decryptedData = JSON.parse(
          CryptoJS.AES.decrypt(encryptedData, "secret-key").toString(
            CryptoJS.enc.Utf8
          )
        );
        const userId = decryptedData?.user_id;

        if (isLoggedIn && userId) {
          navigate(`/cart`); // Không cần truyền userId qua URL
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Decryption failed:", error); // Log lỗi giải mã nếu có
        navigate("/login");
      }
    } else {
      console.warn("No userData found in localStorage"); // Log khi không tìm thấy userData
      navigate("/login");
    }
  };

  const handleSocialClick = () => {
    const encryptedData = localStorage.getItem("userData");

    if (isLoggedIn && encryptedData) {
      try {
        const decryptedData = JSON.parse(
          CryptoJS.AES.decrypt(encryptedData, "secret-key").toString(
            CryptoJS.enc.Utf8
          )
        );
        const userId = decryptedData?.userId;

        if (userId) {
          navigate("/social/");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Decryption failed:", error); // Log lỗi nếu giải mã thất bại
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  const getUserIdFromHeader = async () => {
    const response = await fetch("/api/getUserId", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("access_token")}`,
      },
    });
    if (response.ok) {
      const userId = response.headers.get("userId"); // Lấy userId từ header
      return userId;
    } else {
      console.error("Failed to fetch user ID from header");
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserIdFromHeader();
      if (userId) {
        fetchCartItems(userId); // Gọi hàm fetchCartItems với userId lấy từ header
      }
    };

    fetchUserId();
  }, []);

  // Xác định item menu dựa trên đường dẫn
  const renderMenuItems = () => {
    if (location.pathname.startsWith("/social")) {
      return (
        <>
          <Link
            to="/"
            className={`nav-item nav-link ${
              location.pathname === "/" ? "active" : ""
            }`}
            style={{
              color: location.pathname === "/" ? "#2575fc" : "#000",
              fontWeight: location.pathname === "/" ? "bold" : "normal",
              borderBottom:
                location.pathname === "/" ? "2px solid #2575fc" : "none",
            }}
          >
            Trang chủ
          </Link>
          <Link
            className={`nav-item nav-link ${
              location.pathname === "/social" ? "active" : ""
            }`}
            style={{
              color: location.pathname === "/social" ? "#2575fc" : "#000",
              fontWeight: location.pathname === "/social" ? "bold" : "normal",
              borderBottom:
                location.pathname === "/social" ? "2px solid #2575fc" : "none",
            }}
            onClick={handleSocialClick}
          >
            Mạng Xã Hội
          </Link>
          <Link
            to="/social/notifications"
            className={`nav-item nav-link ${
              location.pathname === "/social/notifications" ? "active" : ""
            }`}
            style={{
              color:
                location.pathname === "/social/notifications"
                  ? "#2575fc"
                  : "#000",
              fontWeight:
                location.pathname === "/social/notifications"
                  ? "bold"
                  : "normal",
              borderBottom:
                location.pathname === "/social/notifications"
                  ? "2px solid #2575fc"
                  : "none",
            }}
          >
            Thông Báo
          </Link>
          <Link
            to="/profile"
            className={`nav-item nav-link ${
              location.pathname === "/profile" ? "active" : ""
            }`}
            style={{
              color: location.pathname === "/profile" ? "#2575fc" : "#000",
              fontWeight: location.pathname === "/profile" ? "bold" : "normal",
              borderBottom:
                location.pathname === "/profile" ? "2px solid #2575fc" : "none",
            }}
          >
            Trang Cá Nhân
          </Link>
        </>
      );
    } else {
      return (
        <div className="navbar-nav mx-auto">
          <Link
            to="/"
            className={`nav-item nav-link ${
              location.pathname === "/" ? "active" : ""
            }`}
            style={{
              color: location.pathname === "/" ? "#2575fc" : "#000",
              fontWeight: location.pathname === "/" ? "bold" : "normal",
              borderBottom:
                location.pathname === "/" ? "2px solid #2575fc" : "none",
            }}
          >
            Trang chủ
          </Link>
          <Link
            to="/shop"
            className={`nav-item nav-link ${
              location.pathname === "/shop" ? "active" : ""
            }`}
            style={{
              color: location.pathname === "/shop" ? "#2575fc" : "#000",
              fontWeight: location.pathname === "/shop" ? "bold" : "normal",
              borderBottom:
                location.pathname === "/shop" ? "2px solid #2575fc" : "none",
            }}
          >
            Cửa hàng
          </Link>
          <Link
            to="/social"
            className={`nav-item nav-link ${
              location.pathname === "/social" ? "active" : ""
            }`}
            style={{
              color: location.pathname === "/social" ? "#2575fc" : "#000",
              fontWeight: location.pathname === "/social" ? "bold" : "normal",
              borderBottom:
                location.pathname === "/social" ? "2px solid #2575fc" : "none",
            }}
          >
            Mạng Xã Hội
          </Link>
          <Link
            to="/DanhGia"
            className={`nav-item nav-link ${
              location.pathname === "/DanhGia" ? "active" : ""
            }`}
            style={{
              color: location.pathname === "/DanhGia" ? "#2575fc" : "#000",
              fontWeight: location.pathname === "/DanhGia" ? "bold" : "normal",
              borderBottom:
                location.pathname === "/DanhGia" ? "2px solid #2575fc" : "none",
            }}
          >
            Đánh Giá
          </Link>
          <Link
            to="/LienHe"
            className={`nav-item nav-link ${
              location.pathname === "/LienHe" ? "active" : ""
            }`}
            style={{
              color: location.pathname === "/LienHe" ? "#2575fc" : "#000",
              fontWeight: location.pathname === "/LienHe" ? "bold" : "normal",
              borderBottom:
                location.pathname === "/LienHe" ? "2px solid #2575fc" : "none",
            }}
          >
            Liên Hệ
          </Link>
        </div>
      );
    }
  };

  const isAdmin = userData?.authorities?.some(
    (auth) => auth.authority === "admin"
  );

  return (
    <div className="container-fluid fixed-top">
      <div className="container topbar bg-blue d-none d-lg-block">
        <div className="d-flex justify-content-between">
          <div className="top-info ps-2">
            <small className="me-3">
              <i className="fas fa-map-marker-alt me-2 text-secondary"></i>
              <Link to="#" className="text-white">
                Trần Chiên, P.Lê Bình, Q.Cái Răng, TP.Cần Thơ
              </Link>
            </small>
            <small className="me-3">
              <i className="fas fa-envelope me-2 text-secondary"></i>
              <Link to="#" className="text-white">
                Nurture@2811.com
              </Link>
            </small>
          </div>
        </div>
      </div>
      <div className="container px-0">
        <nav className="navbar navbar-light bg-white navbar-expand-xl">
          <Link to="/" className="navbar-brand">
            <img
              src={require("../../assets/img/logo-removebg-preview.png")}
              alt="logo"
            />
          </Link>
          <button
            className="navbar-toggler py-2 px-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="fa fa-bars text-blue"></span>
          </button>
          <div
            className="collapse navbar-collapse bg-white"
            id="navbarCollapse"
          >
            <div className="navbar-nav mx-auto">
              {renderMenuItems()} {/* Hiển thị item menu dựa trên đường dẫn */}
            </div>

            <div className="d-flex m-3 me-0">
              <div
                className="position-relative me-4 text-blue my-auto"
                onClick={handleCartClick}
                style={{ cursor: "pointer" }}
              >
                <i className="fa fa-shopping-bag fa-2x"></i>
                {isLoggedIn && cartItems.length > 0 && (
                  <span
                    className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white px-1"
                    style={{
                      top: "-5px",
                      left: "15px",
                      height: "20px",
                      minWidth: "20px",
                    }}
                  >
                    {cartItems.length > 0 && <span>{cartItems.length}</span>}
                  </span>
                )}
              </div>
            </div>

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
                        width: "60px",
                        height: "60px",
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
              <div className="dropdown-menu m-0 bg-secondary rounded-0">
                {isLoggedIn && userData ? (
                  <>
                    {isAdmin ? (
                      <Link to="/admin" className="dropdown-item">
                        Quản lý
                      </Link>
                    ) : null}
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
                ) : (
                  <>
                    <Link to="/login" className="dropdown-item">
                      Đăng nhập
                    </Link>
                    <Link to="/signup" className="dropdown-item">
                      Đăng kí
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
