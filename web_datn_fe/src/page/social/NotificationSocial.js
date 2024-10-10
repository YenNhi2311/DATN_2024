import React, { useEffect, useState } from "react";
import { FaBell, FaCommentDots, FaUserPlus } from "react-icons/fa";
import "../../assets/css/notification.css"; // Import file CSS
import { Link } from "react-router-dom";

// Danh sách thông báo mặc định
const initialNotifications = [
  {
    id: 1,
    user: "Người Dùng 1",
    message: "Có một thông báo mới từ nhóm.",
    time: "10:00 AM",
    icon: <FaBell color="#ff5722" />,
  },
  {
    id: 2,
    user: "Người Dùng 2",
    message: "Bạn đã nhận được một tin nhắn.",
    time: "11:30 AM",
    icon: <FaCommentDots color="#4caf50" />,
  },
  {
    id: 3,
    user: "Người Dùng 3",
    message: "Yêu cầu kết bạn từ Alice.",
    time: "01:45 PM",
    icon: <FaUserPlus color="#2196f3" />,
  },
];

const NotificationFullPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    // Kết nối WebSocket đến server
    const socket = new WebSocket("ws://localhost:8080/notifications");

    // Khi nhận được thông báo mới từ WebSocket
    socket.onmessage = (event) => {
      const newNotification = {
        id: notifications.length + 1, // Tăng id cho mỗi thông báo mới
        user: "Người Dùng Mới", // Tạm thời gán tên người dùng
        message: event.data, // Dữ liệu thông báo từ server
        time: new Date().toLocaleTimeString(), // Thời gian hiện tại
        icon: <FaBell color="#ff5722" />, // Bạn có thể tùy chỉnh icon
      };

      // Cập nhật danh sách thông báo với thông báo mới
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        newNotification,
      ]);

      console.log("New notification received:", event.data);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // return () => {
    //   socket.close(); // Đóng kết nối khi component unmount
    // };
  }, []); // Chỉ chạy một lần khi component mount

  return (
    <div className="notification-fullpage-container">
      <div className="notifications-header">
        <h2>Tất cả Thông Báo</h2>
        <Link to="#" className="notification-settings">
          Cài đặt Thông Báo
        </Link>
      </div>
      <div className="banner-notification">
        {notifications.map((notif) => (
          <div key={notif.id} className="notification-item">
            <div className="notification-icon">{notif.icon}</div>
            <div className="notif-details">
              <h6>{notif.user}</h6>
              <p>{notif.message}</p>
              <span className="notif-time">{notif.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationFullPage;
