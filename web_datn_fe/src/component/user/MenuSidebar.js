import React, { useState } from "react";
import { FaHome, FaLink, FaBars, FaShareAlt } from "react-icons/fa"; // Icon từ react-icons
import "../../assets/css/menusidebar.css"; // Import CSS cho sidebar-left
import { Link } from "react-router-dom";

const SidebarLeft = () => {
  const [isOpen, setIsOpen] = useState(false); // Trạng thái sidebar

  // Hàm để mở/tắt sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={`sidebar-left ${isOpen ? "open" : ""}`}>
        <div className="sidebar-icon-container">
          <Link to="/social">
            <div className="icon-item">
              <FaHome />
              <div className="icon-text">Trang chủ</div>
            </div>
          </Link>
          <Link to="/personal">
            <div className="icon-item">
              <FaLink />
              <div className="icon-text">Trang cá nhân</div>
            </div>
          </Link>
          <Link to="/message">
            <div className="icon-item">
              <FaBars />
              <div className="icon-text">Menu</div>
            </div>
          </Link>
          <Link to="/notification">
            <div className="icon-item">
              <FaShareAlt />
              <div className="icon-text">Social</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Nút mở sidebar nằm trên header */}
      <div className="menu-button" onClick={toggleSidebar}>
        <FaBars />
      </div>
    </>
  );
};

export default SidebarLeft;
