import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">

        {/* Trang Chủ */}
        <li className="nav-item">
          <Link className="nav-link" to="/admin/">
            <i className="bi bi-grid"></i>
            <span>Trang Chủ</span>
          </Link>
        </li>

        {/* Quản Lý Người Dùng */}
        <li className="nav-item">
          <Link className="nav-link" to="/user-list">
            <i className="bi bi-file-person"></i>
            <span>Quản Lý Người Dùng</span>
          </Link>
        </li>

        {/* Quản Lý Thương Hiệu */}
        <li className="nav-item">
          <Link className="nav-link" to="/admin/brand">
            <i className="bi bi-file-plus"></i>
            <span>Quản Lý Thương Hiệu</span>
          </Link>
        </li>

        {/* Quản Lý Sản Phẩm */}
        <li className="nav-item">
          <Link className="nav-link" to="/admin/product">
            <i className="bi bi-file-plus"></i>
            <span>Quản Lý Sản Phẩm & Biến Thể</span>
          </Link>
        </li>

        {/* Quản Lý Loại Sản Phẩm */}
        <li className="nav-item">
          <Link className="nav-link" to="/admin/category">
            <i className="bi bi-file-richtext"></i>
            <span>Quản Lý Loại Sản Phẩm</span>
          </Link>
        </li>

        {/* Quản Lý Loại Da */}
        <li className="nav-item">
          <Link className="nav-link" to="/admin/skintype">
            <i className="bi bi-file-earmark-ruled"></i>
            <span>Quản Lý Loại Da</span>
          </Link>
        </li>

        {/* Quản Lý Màu */}
        <li className="nav-item">
          <Link className="nav-link" to="/admin/color">
            <i className="bi bi-brightness-high"></i>
            <span>Quản Lý Màu</span>
          </Link>
        </li>

        {/* Quản Lý Dung Tích */}
        <li className="nav-item">
          <Link className="nav-link" to="/admin/capacity">
            <i className="bi bi-menu-button-wide"></i>
            <span>Quản Lý Dung Tích</span>
          </Link>
        </li>

        {/* Quản Lý Thành Phần */}
        <li className="nav-item">
          <Link className="nav-link" to="/admin/ingredient">
            <i className="bi bi-layout-text-window-reverse"></i>
            <span>Quản Lý Thành Phần</span>
          </Link>
        </li>

        {/* Quản Lý Công Dụng */}
        <li className="nav-item">
          <Link className="nav-link" to="/admin/benefit">
            <i className="bi bi-layout-text-window-reverse"></i>
            <span>Quản Lý Công Dụng</span>
          </Link>
        </li>

        {/* Quản Lý Hóa Đơn */}
        <li className="nav-item">
          <Link className="nav-link" to="/admin/order">
            <i className="bi bi-layout-text-window-reverse"></i>
            <span>Quản Lý Đơn hàng</span>
          </Link>
        </li>

        {/* Quản Lý Khuyến Mãi */}
        <li className="nav-item">
          <Link className="nav-link" to="/detailed-product-list">
            <i className="bi bi-layout-text-window-reverse"></i>
            <span>Quản Lý Khuyến Mãi</span>
          </Link>
        </li>

        {/* Charts */}
        <li className="nav-item">
          <Link className="nav-link" to="/charts-chartjs">
            <i className="bi bi-bar-chart"></i>
            <span>Charts</span>
          </Link>
        </li>

        {/* Icons */}
        <li className="nav-item">
          <Link className="nav-link" to="/icons-bootstrap">
            <i className="bi bi-gem"></i>
            <span>Icons</span>
          </Link>
        </li>

        <li className="nav-heading">Pages</li>

        {/* Profile */}
        <li className="nav-item">
          <Link className="nav-link" to="/profile">
            <i className="bi bi-person"></i>
            <span>Profile</span>
          </Link>
        </li>

        {/* F.A.Q */}
        <li className="nav-item">
          <Link className="nav-link" to="/faq">
            <i className="bi bi-question-circle"></i>
            <span>F.A.Q</span>
          </Link>
        </li>

        {/* Contact */}
        <li className="nav-item">
          <Link className="nav-link" to="/contact">
            <i className="bi bi-envelope"></i>
            <span>Contact</span>
          </Link>
        </li>

        {/* Blank */}
        <li className="nav-item">
          <Link className="nav-link" to="/blank">
            <i className="bi bi-file-earmark"></i>
            <span>Blank</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
