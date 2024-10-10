import React from "react";
import "../../assets/css/social.css"; // Import CSS cho social
import ProfileSocial from "../../page/social/ProfileSocial";
import NotificationSocial from "../../page/social/NotificationSocial";
import PostSocial from "../../component/user/PostSocial";
import Avatar from "../../assets/img/avatar1.jpg";
import WeatherWidget from "../../component/user/WeatherWidget";

const HomeSocial = () => {
  const user = {
    name: "Lucy Carbel",
    date: "19 September",
    avatar: Avatar,
  };
  return (
    <div className="social-container">
      <div className="content-grid">
        {/* Nội dung cột bên trái nếu cần */}
        <ProfileSocial />
        <div className="center-column">
          <PostSocial />
        </div>
        <div>
          {/* Nội dung cột bên phải nếu cần */}
          <div className="right-column">
            <NotificationSocial />
          </div>
          <WeatherWidget />
        </div>
      </div>
    </div>
  );
};

export default HomeSocial;
