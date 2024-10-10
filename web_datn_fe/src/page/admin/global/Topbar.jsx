import { Box, IconButton, useTheme, Menu, MenuItem } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { logoutUser } from "../../../services/authService"; // Nhập hàm logout
import { useNavigate } from "react-router-dom"; // Sử dụng để điều hướng
import Cookies from "js-cookie";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  // State để quản lý mở/đóng Menu cho icon Person
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate(); // Khởi tạo useNavigate

  // Mở menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Đóng menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Hàm đăng xuất
  const handleLogout = async () => {
    const token = localStorage.getItem("access_token"); // Lấy token từ localStorage
    try {
      await logoutUser(token); // Gọi hàm logout để hủy token trên server (nếu cần thiết)
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      localStorage.removeItem("userData");
      localStorage.removeItem("access_token"); // Đảm bảo xóa token khỏi localStorage
      Cookies.remove("access_token"); // Xóa token khỏi cookies
      navigate("/login"); // Chuyển hướng về trang đăng nhập
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        {/* <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton> */}
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>

        {/* Icon Person và Dropdown Menu */}
        <IconButton onClick={handleMenuOpen}>
          <PersonOutlinedIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>{" "}
          {/* Gọi hàm đăng xuất */}
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;
