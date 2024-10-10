import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import "./Admin.css";
import Topbar from "./page/admin/global/Topbar";
import SidebarComponent from "./page/admin/global/Sidebar";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";

function Admin() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
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
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app admin-container">
          <SidebarComponent isSidebar={isSidebar} />
          <main className="admin-content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Outlet />
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default Admin;
