import { Comment, NotificationsActive, ThumbUp } from "@mui/icons-material"; // Import biểu tượng MUI
import CryptoJS from "crypto-js";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/notification.css"; // Import file CSS
import { formatNotificationTime } from "../../config/formatPostTime";
import { apiClient } from "../../config/apiClient";
import { Client } from "@stomp/stompjs"; // Import STOMP client
import SockJS from "sockjs-client"; // Import SockJS

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

    // Kết nối STOMP với SockJS
    const client = new Client({
      webSocketFactory: () => {
        return new SockJS("http://localhost:8080/ws"); // Sử dụng SockJS
      },
      onConnect: () => {
        console.log("Connected to WebSocket");
        setIsConnected(true);

        // Subscribe to notifications topic
        client.subscribe(`/queue/notifications`, (message) => {
          const newNotificationData = JSON.parse(message.body);
          const newNotification = {
            id: newNotificationData.id || notifications.length + 1, // Sử dụng ID từ server nếu có
            user: newNotificationData.user || "", // Thêm thông tin người dùng (nếu cần)
            message: newNotificationData.message,
            type: newNotificationData.type, // Thêm thuộc tính type để xác định loại thông báo
            postId: newNotificationData.postId, // Thêm postId để điều hướng
            createdAt: new Date(), // Sử dụng thời gian hiện tại
          };

          // Cập nhật thông báo mới vào đầu danh sách
          setNotifications((prevNotifications) => [
            newNotification,
            ...prevNotifications,
          ]);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    client.activate(); // Kích hoạt client STOMP

    // Clean up
    return () => {
      client.deactivate(); // Ngắt kết nối khi component unmount
    };
  }, [encryptedUserData]); // Chạy lại khi encryptedUserData thay đổi

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
      </div>

      {/* Trạng thái kết nối WebSocket
      <div className="connection-status">
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
