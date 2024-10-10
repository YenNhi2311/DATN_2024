import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">

        <li className="nav-item">
          <Link className="nav-link" to="/admin/">
            <i className="bi bi-grid"></i>
            <span>Trang Chủ</span>
          </Link>
        </li>

        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#user-management-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-file-person"></i>
            <span>Quản Lý Người Dùng</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="user-management-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <Link to="/user-list">
                <i className="bi bi-circle"></i><span>Danh Sách</span>
              </Link>
            </li>
          </ul>
        </li>

        {/* Quản Lý Sản Phẩm */}
        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#product-management-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-file-plus"></i>
            <span>Quản Lý Sản Phẩm</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="product-management-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <Link to="/admin/tableproduct">
                <i className="bi bi-circle"></i><span>Danh Sách</span>
              </Link>
            </li>
          </ul>
        </li>

        {/* Quản Lý Sản Phẩm Chi Tiết */}
        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#detailed-product-management-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-file-text"></i>
            <span>Quản Lý Sản Phẩm Chi Tiết</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="detailed-product-management-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <Link to="/detailed-product-list">
                <i className="bi bi-circle"></i><span>Danh Sách</span>
              </Link>
            </li>

          </ul>
        </li>

        {/* Quản Lý Loại */}
        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#categories-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-file-richtext"></i>
            <span>Quản Lý Loại Sản Phầm</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="categories-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <Link to="/admin/tablecategory">
                <i className="bi bi-circle"></i><span>Danh Sách</span>
              </Link>
            </li>
          </ul>
        </li>


        {/* Quản Lý Loại da */}
        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#skinTypes-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-file-earmark-ruled"></i>
            <span>Quản Lý Loại Da</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="skinTypes-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <Link to="/admin/table-skin-type">
                <i className="bi bi-circle"></i><span>Danh Sách</span>
              </Link>
            </li>
          </ul>
        </li>
        {/* Quản Lý màu */}
        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#colors-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-brightness-high"></i>
            <span>Quản Lý Màu</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="colors-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <Link to="/admin/tablecolor">
                <i className="bi bi-circle"></i><span>Danh Sách</span>
              </Link>
            </li>
          </ul>
        </li>
        {/* Quản Lý Dung tích */}
        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#capacitys-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-menu-button-wide"></i>
            <span>Quản Lý Dung Tích</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="capacitys-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <Link to="/admin/tablecapacity">
                <i className="bi bi-circle"></i><span>Danh Sách</span>
              </Link>
            </li>
            
          </ul>
        </li>
        {/* Quản Lý thành Phần */}
        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#ingredients-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-layout-text-window-reverse"></i>
            <span>Quản Lý Thành Phần</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="ingredients-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <Link to="/admin/tableingredient">
                <i className="bi bi-circle"></i><span>Danh Sách</span>
              </Link>
            </li>
          </ul>
        </li>

        {/* Quản Lý Công dụng */}
        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#benefits-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-layout-text-window-reverse"></i>
            <span>Quản Lý Công Dụng</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="benefits-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <Link to="/admin/tablebenefit">
                <i className="bi bi-circle"></i><span>Danh Sách Công Dụng</span>
              </Link>
            </li>

          </ul>
        </li>

        {/* Quản Lý hóa đơn */}
        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#order-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-layout-text-window-reverse"></i>
            <span>Quản Lý Hóa Đơn</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="order-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <Link to="/detailed-product-list">
                <i className="bi bi-circle"></i><span>Danh Sách Hóa Đơn</span>
              </Link>
            </li>
            {/* <li>
              <Link to="/detailed-product-data">
                <i className="bi bi-circle"></i><span></span>
              </Link>
            </li> */}
          </ul>
        </li>

        {/* Quản Lý khuyến mãi */}
        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#promotion-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-layout-text-window-reverse"></i>
            <span>Quản Lý Khuyến Mãi</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="promotion-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <Link to="/detailed-product-list">
                <i className="bi bi-circle"></i><span>Danh Sách </span>
              </Link>
            </li>
            <li>
              <Link to="/detailed-product-data">
                <i className="bi bi-circle"></i><span>Dữ Liệu</span>
              </Link>
            </li>
          </ul>
        </li>

        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#charts-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-bar-chart"></i>
            <span>Charts</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="charts-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <Link to="/charts-chartjs">
                <i className="bi bi-circle"></i><span>Chart.js</span>
              </Link>
            </li>
            <li>
              <Link to="/charts-apexcharts">
                <i className="bi bi-circle"></i><span>ApexCharts</span>
              </Link>
            </li>
            <li>
              <Link to="/charts-echarts">
                <i className="bi bi-circle"></i><span>ECharts</span>
              </Link>
            </li>
          </ul>
        </li>

        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#icons-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-gem"></i>
            <span>Icons</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="icons-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <Link to="/icons-bootstrap">
                <i className="bi bi-circle"></i><span>Bootstrap Icons</span>
              </Link>
            </li>
            <li>
              <Link to="/icons-remix">
                <i className="bi bi-circle"></i><span>Remix Icons</span>
              </Link>
            </li>
            <li>
              <Link to="/icons-boxicons">
                <i className="bi bi-circle"></i><span>Boxicons</span>
              </Link>
            </li>
          </ul>
        </li>

        <li className="nav-heading">Pages</li>

        <li className="nav-item">
          <Link className="nav-link collapsed" to="/profile">
            <i className="bi bi-person"></i>
            <span>Profile</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link collapsed" to="/faq">
            <i className="bi bi-question-circle"></i>
            <span>F.A.Q</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link collapsed" to="/contact">
            <i className="bi bi-envelope"></i>
            <span>Contact</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link collapsed" to="/blank">
            <i className="bi bi-file-earmark"></i>
            <span>Blank</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
