import { Comment, NotificationsActive, ThumbUp } from "@mui/icons-material"; // Import biểu tượng MUI
import CryptoJS from "crypto-js";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/notification.css"; // Import file CSS
import { formatNotificationTime } from "../../config/formatPostTime";
import { apiClient } from "../../services/authService";

const NotificationFullPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const encryptedUserData = localStorage.getItem("userData");

  useEffect(() => {
    // Lấy userId từ localStorage
    const decryptedUserId = CryptoJS.AES.decrypt(
      encryptedUserData,
      "secret-key"
    ).toString(CryptoJS.enc.Utf8);
    const userId = JSON.parse(decryptedUserId).user_id;

    const fetchNotifications = async () => {
      try {
        if (userId) {
          const response = await apiClient.get(
            `/api/notifications/receiver/${userId}`
          );
          // Sắp xếp thông báo theo thời gian giảm dần
          const sortedNotifications = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setNotifications(sortedNotifications);
        } else {
          console.error("User ID not found in local storage.");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // Kết nối WebSocket
    const socket = new WebSocket("ws://localhost:8080/ws");

    socket.onopen = () => {
      console.log("WebSocket connection established");
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      const newNotificationData = JSON.parse(event.data);
      const newNotification = {
        id: notifications.length + 1,
        user: newNotificationData.user,
        message: newNotificationData.message,
        type: newNotificationData.type, // Thêm thuộc tính type để xác định loại thông báo
        postId: newNotificationData.postId, // Thêm postId để điều hướng
        createdAt: new Date(), // Sử dụng thời gian hiện tại
      };

      setNotifications((prevNotifications) => [
        newNotification,
        ...prevNotifications,
      ]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
    };

    return () => {
      socket.close();
    };
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <ThumbUp style={{ color: "#ff5722" }} />;
      case "comment":
        return <Comment style={{ color: "#00bcd4" }} />;
      default:
        return <NotificationsActive style={{ color: "#ff5722" }} />;
    }
  };

  return (
    <div className="notification-fullpage-container">
      <div className="notifications-header">
        <h2>Tất cả Thông Báo</h2>
        <Link to="#" className="notification-settings">
          Cài đặt Thông Báo
        </Link>
      </div>

      {/* <div className="connection-status">
        {isConnected ? (
          <p className="connected">WebSocket đã kết nối</p>
        ) : (
          <p className="disconnected">WebSocket chưa kết nối</p>
        )}
      </div> */}

      {notifications.map((notif) => (
        <div className="banner-notification" key={notif.id}>
          <Link to={`/posts/${notif.postId}`} className="notification-item">
            {/* Link đến bài viết */}
            <div className="notification-icon">
              {getNotificationIcon(notif.type)}
            </div>
            <div className="notif-details">
              <p>{notif.message}</p>
              <span className="notif-time">
                {formatNotificationTime(notif.createdAt)}
              </span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default NotificationFullPage;
