import React from "react";
import { Outlet } from "react-router-dom";
import "./assets/css/social.css"; // Import CSS cho social
import Avatar from "./assets/img/avatar1.jpg";
import FriendSidebar from "./component/user/FriendSidebar";
import Header from "./layout/user/Header";

const SocialLayout = () => {
  const user = {
    name: "Lucy Carbel",
    date: "19 September",
    avatar: Avatar,
  };
  return (
    <div className="social-container">
      <Header />

      <div className="social-content">
        <Outlet />
      </div>
      {/* <FriendSidebar /> */}
    </div>
  );
};

export default SocialLayout;
