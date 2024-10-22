import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from '../../component/page/CartContext';
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
                const decryptedUserData = CryptoJS.AES.decrypt(encryptedUserData, "secret-key").toString(CryptoJS.enc.Utf8);
                const parsedData = JSON.parse(decryptedUserData);
                const userId = parsedData.user_id;

                if (userId) {
                    const data = await getUserData(userId, token);
                    setUserData(data);
                    fetchCartItems(userId); // Lấy cart items sau khi có userId
                    setIsLoggedIn(true);
                } else {
                    console.error("User ID is missing from the decrypted data");
                    setIsLoggedIn(false);
                    setUserData(null);
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error during decryption or fetching user data:", error.message);
                setIsLoggedIn(false);
                setErrorMessage("Failed to decrypt user data or fetch user information.");
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
        if (userData) {
            console.log("Current user data:", userData);
        }

        if (cartItems.length > 0) {
            console.log("Current cart items:", cartItems);
        }
    }, [userData, cartItems]);

    const handleLogout = () => {
        Cookies.remove("access_token");
        localStorage.removeItem("userData");
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/login");
        window.location.reload();
    };

    const handleCartClick = () => {
        if (isLoggedIn && userData && userData.user_id) {
            navigate(`/cart/${userData.user_id}`);
        } else {
            navigate("/login");
        }
    };

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
                        <img src={require("../../assets/img/logo-removebg-preview.png")} alt="logo" />
                    </Link>
                    <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                        <span className="fa fa-bars text-blue"></span>
                    </button>
                    <div className="collapse navbar-collapse bg-white" id="navbarCollapse">
                        <div className="navbar-nav mx-auto">
                            <Link to="/" className="nav-item nav-link">Trang chủ</Link>
                            <Link to="/shop" className="nav-item nav-link">Cửa hàng</Link>
                            <Link to="/social" className="nav-item nav-link">Mạng Xã Hội</Link>
                            <Link to="/DanhGia" className="nav-item nav-link">Đánh Giá</Link>
                            <Link to="/LienHe" className="nav-item nav-link">Liên Hệ</Link>
                        </div>

                        <div className="d-flex m-3 me-0">
                            <div className="position-relative me-4 text-blue my-auto" onClick={handleCartClick} style={{ cursor: "pointer" }}>
                                <i className="fa fa-shopping-bag fa-2x"></i>
                                {isLoggedIn && cartItems.length > 0 && (
                                    <span className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white px-1"
                                        style={{ top: "-5px", left: "15px", height: "20px", minWidth: "20px" }}>
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
                                            src={userData.img ? `http://localhost:8080/assets/img/${userData.img}` : "link-to-default-avatar.png"} // Thêm ảnh mặc định nếu không có ảnh người dùng
                                            alt="User Profile"
                                            className="user-avatar"
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: '2px solid #ccc'
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
                                        <Link to="/profile" className="dropdown-item">Quản Lý Thông Tin</Link>
                                        <Link to="/change-password" className="dropdown-item">Đổi Mật Khẩu</Link>
                                        <a className="dropdown-item" onClick={handleLogout}>Đăng Xuất</a>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="dropdown-item">Đăng nhập</Link>
                                        <Link to="/signup" className="dropdown-item">Đăng kí</Link>
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
