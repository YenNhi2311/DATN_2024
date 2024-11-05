import { Outlet, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./assets/css/admin.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/card.css";
import "./assets/css/category.css";
import "./assets/css/style.css";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import Header from "./page/admin1/part/header";
import Sidebar from "./page/admin1/part/sidebar";
import { useEffect, useState } from "react";

const Admin1Layout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading

  const checkAdminAccess = () => {
    const token = Cookies.get("access_token");
    const encryptedUserData = localStorage.getItem("userData");

    if (!token) {
      // Nếu không có token, điều hướng về trang đăng nhập ngay lập tức
      navigate("/login");
      return;
    }

    try {
      const decryptedUserId = CryptoJS.AES.decrypt(
        encryptedUserData,
        "secret-key"
      ).toString(CryptoJS.enc.Utf8);
      const role = JSON.parse(decryptedUserId).role;

      // Nếu không phải là admin, điều hướng về trang đăng nhập ngay lập tức
      if (role !== "admin") {
        navigate("/login");
      }
    } catch (error) {
      // Nếu có lỗi, điều hướng về trang đăng nhập ngay lập tức
      navigate("/login");
    } finally {
      setIsLoading(false); // Dừng loading sau khi kiểm tra hoàn tất
    }
  };

  useEffect(() => {
    checkAdminAccess();
  }, [navigate]);

  // Nếu đang loading hoặc không phải admin, trả về null
  if (isLoading) return null;
  return (
    <div className="admin-layout">
      <Header />
      <div className="main-content">
        <Sidebar />
        <main id="main" className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Admin1Layout;
