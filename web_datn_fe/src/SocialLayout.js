import React from "react";
import { Outlet } from "react-router-dom";
import "./assets/css/social.css";
import Header from "./part/user/Header";
import { CartProvider } from "./component/page/CartContext";

const SocialLayout = () => {
  return (
    <CartProvider>
      <div className="social-container">
        <Header />
        <div className="social-content">
          <Outlet />
        </div>
        {/* <FriendSidebar /> */}
      </div>
    </CartProvider>
  );
};

export default SocialLayout;
