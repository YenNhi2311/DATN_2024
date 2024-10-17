// src/components/LeftColumn.js
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import {
  FaHeart,
  FaMailBulk,
  FaMapMarkedAlt
} from "react-icons/fa";
import "../../assets/css/profilesocial.css"; // Import CSS
import { apiClient } from "../../config/apiClient";
import { getUserData } from "../../services/authService";

const ProfileSocial = () => {
  const [profileData, setProfileData] = useState(null);
  const [userId, setUserId] = useState("");
  const [stats, setStats] = useState({ totalPosts: 0, totalLikes: 0 });

  useEffect(() => {
    const token = Cookies.get("access_token");
    const encryptedUserData = localStorage.getItem("userData");

    if (encryptedUserData) {
      try {
        const decryptedUserId = CryptoJS.AES.decrypt(
          encryptedUserData,
          "secret-key"
        ).toString(CryptoJS.enc.Utf8);
        const userId = JSON.parse(decryptedUserId).user_id;
        setUserId(userId);
        getUserData(userId, token)
          .then((data) => {
            setProfileData(data);
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
        apiClient
          .get(`/api/post/${userId}/stats`)
          .then((response) => {
            setStats(response.data);
            console.log(response);
          })
          .catch((error) => {
            console.error("Error fetching stats data:", error);
          });
      } catch (error) {
        console.error("Lỗi giải mã userId:", error);
      }
    }
  }, [userId]);

  // if (!profileData) {
  //   return <div>Loading...</div>; // Hiển thị thông báo khi đang tải dữ liệu
  // }

  return (
    <div className="social-left-container">
      <div className="left-column">
        <h2>Tài khoản</h2>
        <hr />
        <div className="profile-info">
          <Image
            src={profileData?.img} // Sử dụng Logo nếu profileData.img không tồn tại
            roundedCircle
            height="80"
            className="profile-avatar"
          />
          <div className="profile-details">
            <h6>{profileData?.fullname || "Chưa có tên"}</h6>
            <p>
              <FaMailBulk /> {profileData?.email || "Chưa có thông tin"}{" "}
            </p>
            {profileData?.addresses?.length > 0 ? (
              // Tìm địa chỉ với status = 1
              profileData.addresses.find(
                (address) => address.status === true
              ) ? (
                <>
                  <p>
                    <FaMapMarkedAlt />{" "}
                    {profileData.addresses.find(
                      (address) => address.status === true
                    )?.district || "Chưa có địa chỉ"}
                    ,{" "}
                    {profileData.addresses.find((address) => address.status === true
                    )?.province || "Chưa có địa chỉ"}
                  </p>
                </>
              ) : (
                <p>Chưa có địa chỉ hợp lệ</p>
              )
            ) : (
              <p>Chưa có địa chỉ</p>
            )}
          </div>
        </div>
        <hr />
        <div className="icon-buttons">
          <div className="icon-button">
            <i className="fa fa-user"></i>
            <span>Hồ sơ</span>
          </div>
          <div className="icon-button">
            <i className="fa fa-user-plus"></i>
            <span>Kết Bạn</span>
          </div>
          <div className="icon-button">
            <i className="fa fa-comments"></i>
            <span>Chat</span>
          </div>
        </div>
      </div>
      <div className="left-column">
        <h2>Thống kê</h2>
        <hr />
        <div className="stats-box">
          <h6>Tổng Bài Đăng Trong Tháng:</h6>
          <p>{stats.totalPosts} Bài Đăng</p>
          <h6>Tổng Số Lượt Like:</h6>
          <p>{stats.totalLikes} Like</p>

          {/* Các icon like bay lên */}
          {Array.from({ length: stats.totalLikes }).map((_, index) => (
            <div key={index} className="icon-like">
              <FaHeart />
            </div>
          ))}
        </div>
      </div>
      <div className="left-column">
        <h2>Về bản thân</h2>
        <hr />
        <div className="about-box">
          <p>{profileData?.about || "Chưa có thông tin"}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSocial;