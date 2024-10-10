import React, { Component, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserData } from "../../services/authService";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = Cookies.get("access_token");
      const encryptedUserData = localStorage.getItem("userData");

      if (!token) {
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/login");
      } else {
        if (encryptedUserData) {
          setIsLoggedIn(true);
          try {
            //giải mã crypt
            const decryptedUserId = CryptoJS.AES.decrypt(
              encryptedUserData,
              "secret-key"
            ).toString(CryptoJS.enc.Utf8);
            const userId = JSON.parse(decryptedUserId).user_id;
            getUserData(userId, token)
              .then((data) => {
                setUserData(data);
              })
              .catch((error) => {
                console.error("Error fetching user data:", error);
                setIsLoggedIn(false);
              });
          } catch (error) {
            console.error("Lỗi giải mã userId:", error);
            setIsLoggedIn(false);
          }
        }
      }
    };

    checkLoginStatus();
  }, [location.pathname, navigate]);
  return (
    <div className="container-fluid fixed-top">
      <div className="container topbar bg-blue d-none d-lg-block">
        <div className="d-flex justify-content-between">
          <div className="top-info ps-2">
            <small className="me-3">
              <i className="fas fa-map-marker-alt me-2 text-secondary"></i>
              <Link to="#" className="text-white">
                Trần Chiên,P.Lê Bình,Q.Cái Răng,TP.Cần thơ
              </Link>
            </small>
            <small className="me-3">
              <i className="fas fa-envelope me-2 text-secondary"></i>
              <Link to="#" className="text-white">
                Nurture@2811.com
              </Link>
            </small>
          </div>
          {/* <div className="top-link pe-2">
                <Link to="#" className="text-white">
                  <small className="text-white mx-2">Trang chủ</small> /
                </Link>
                <Link to="#" className="text-white">
                  <small className="text-white mx-2">Mạng xã hội</small>
                </Link>
              </div> */}
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
              <Link to="/" className="nav-item nav-link">
                Trang chủ
              </Link>
              <Link to="/social" className="nav-item nav-link">
                Mạng Xã Hội
              </Link>
              <Link to="/shop" className="nav-item nav-link">
                Cửa hàng
              </Link>

              <Link to="/DanhGia" className="nav-item nav-link">
                DanhGia
              </Link>

              <Link to="/LienHe" className="nav-item nav-link">
                LienHe
              </Link>
            </div>

            <div className="d-flex m-3 me-0">
              <Link to="/GioHang" className="position-relative me-4 my-auto">
                <i className="fa fa-shopping-bag fa-2x"></i>
                <span
                  className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
                  style={{
                    top: "-5px",
                    left: "15px",
                    height: "20px",
                    minWidth: "20px",
                  }}
                >
                  3
                </span>
              </Link>

              <div className="nav-item dropdown my-auto me-0">
                <Link to="#" className="nav-link" data-bs-toggle="dropdown">
                  <i className="fas fa-user text-blue fa-2x"></i>
                </Link>
                <div className="dropdown-menu m-0 bg-secondary rounded-0">
                  <Link to="/login" className="dropdown-item">
                    Đăng nhập
                  </Link>
                  <Link to="/signup" className="dropdown-item">
                    Đăng kí
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};
export default Header;
