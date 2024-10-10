import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Image,
  Dropdown,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/header.css";
import { FaBars, FaBell, FaUserAlt, FaUserPlus } from "react-icons/fa"; // Import FaBars
import {
  Login as LoginIcon,
  HowToReg as HowToRegIcon,
  Lock as LockIcon,
  History as HistoryIcon,
  AccountCircle as AccountCircleIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { getUserData } from "../../services/authService";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import Logo from "../../assets/img/logoYNB.webp";
import SidebarLeft from "../../component/user/MenuSidebar"; // Import sidebar component

const Header = () => {
  const [activeNav, setActiveNav] = useState("");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [navbarBackground, setNavbarBackground] = useState("transparent");
  const [navbarTextColor, setNavbarTextColor] = useState("black");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Thêm state cho sidebar
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

    if (location.pathname === "/social") {
      setNavbarBackground("#fff");
      setNavbarTextColor("#1e90ff");
    } else {
      setNavbarBackground("#fff");
      setNavbarTextColor("black");
    }
  }, [location.pathname, navigate]);

  const handleNavClick = (id) => {
    setActiveNav(id);
    if (id === "social") {
      setIsMenuVisible(true);
    } else {
      setIsMenuVisible(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("access_token");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUserData(null);
    window.location.href = "/login";
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle trạng thái mở/đóng sidebar
  };

  if (
    location.pathname === "/login" ||
    location.pathname === "/forgot" ||
    location.pathname === "/change" ||
    location.pathname === "/update-profile"
  ) {
    return null;
  }

  return (
    <>
      <Navbar
        expand="lg"
        className="navbar-custom"
        style={{
          background: navbarBackground,
          color: navbarTextColor,
          fontWeight: 200,
        }}
      >
        {/* Thêm icon FaBars chỉ hiển thị dưới 992px */}
        <FaBars
          onClick={toggleSidebar} // Sử dụng hàm toggleSidebar
          style={{ cursor: "pointer", marginRight: "10px", fontSize: "24px" }}
        />
        <Navbar.Brand as={Link} to="/home">
          <span
            style={{
              fontSize: "22px",
              color: "#1e90ff",
              fontWeight: "600",
            }}
          >
            Nurture
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <InputGroup className="search-bar">
            <FormControl
              placeholder="Tìm kiếm sản phẩm..."
              aria-label="Search"
              aria-describedby="basic-addon2"
            />
          </InputGroup>
          <Nav>
            <Nav.Link
              as={Link}
              to="/"
              className={
                activeNav === "social" ? "nav-link active-nav" : "nav-link"
              }
              style={{ color: navbarTextColor }}
            >
              <HomeIcon />
            </Nav.Link>
            <Nav.Link className="nav-link" style={{ color: navbarTextColor }}>
              <FaBell />
            </Nav.Link>
            <Nav.Link className="nav-link" style={{ color: navbarTextColor }}>
              <FaUserAlt />
            </Nav.Link>
            <Nav.Link className="nav-link" style={{ color: navbarTextColor }}>
              <FaUserPlus />
            </Nav.Link>
          </Nav>

          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              id="user-dropdown"
              className="user-link"
              style={{ textDecoration: "none" }}
            >
              <span style={{ color: navbarTextColor }}>
                {isLoggedIn && userData ? userData.fullname : "Tài khoản"}
              </span>
              <Image
                src={
                  isLoggedIn && userData
                    ? userData.img
                    : "https://via.placeholder.com/150"
                }
                roundedCircle
                height="30"
                className="avatar"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {isLoggedIn ? (
                <>
                  <Dropdown.Item as={Link} to="/update-profile">
                    <AccountCircleIcon /> Thông tin cá nhân
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/history">
                    <HistoryIcon /> Lịch sử mua hàng
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/address">
                    <HomeIcon /> Địa chỉ cá nhân
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/change">
                    <LockIcon /> Đổi mật khẩu
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>
                    <LogoutIcon /> Đăng xuất
                  </Dropdown.Item>
                </>
              ) : (
                <>
                  <Dropdown.Item as={Link} to="/login">
                    <LoginIcon /> Đăng nhập
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/register">
                    <HowToRegIcon /> Đăng ký
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/forgot">
                    <LockIcon /> Quên mật khẩu
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Navbar>
      {/* Gắn sidebar */}
      {isSidebarOpen && location.pathname === "/social" && <SidebarLeft />}{" "}
      {/* Sidebar hiện khi mở */}
    </>
  );
};

export default Header;