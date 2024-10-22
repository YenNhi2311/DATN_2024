import React, { useEffect, useState } from "react";
import "../../assets/css/friends.css"; // Import CSS tùy chỉnh
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LocationOn, Person, PostAddOutlined } from "@mui/icons-material";
import Swal from "sweetalert2"; // Import SweetAlert
import { apiClient } from "../../config/apiClient";
import { getUserDataById } from "../../services/authService";

const FriendCard = ({ friend, onFriendRequestSent }) => {
  const [show, setShow] = useState(false); // State để điều khiển Modal
  const [imageSrc, setImageSrc] = useState(""); // State để lưu link ảnh được hiển thị
  const [imageTitle, setImageTitle] = useState(""); // State để lưu tiêu đề ảnh
  const [friendStatus, setFriendStatus] = useState(null); // State để lưu trạng thái bạn bè
  const [loading, setLoading] = useState(false); // State để quản lý trạng thái loading

  const fetchFriendStatus = async () => {
    try {
      const response = await apiClient.get("/api/friends");
      const friendData = response.data.find(
        (item) => item.friend.userId === friend.userId
      );

      // Nếu friendData tồn tại, cập nhật trạng thái bạn bè
      if (friendData) {
        setFriendStatus(friendData.status);
      } else {
        setFriendStatus(null); // Nếu không tìm thấy, đặt lại trạng thái
      }
    } catch (error) {
      console.error("Error fetching friend status:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Có lỗi xảy ra khi tải trạng thái bạn bè.",
        icon: "error",
        confirmButtonText: "Đồng ý",
      });
    }
  };

  useEffect(() => {
    fetchFriendStatus();
  }, [friend.userId]); // Thêm friend.userId vào dependencies

  const activeAddresses = friend.addresses?.filter(
    (address) => address.status === true
  );
  const address =
    activeAddresses && activeAddresses.length > 0
      ? activeAddresses[0].specificAddress
      : "No active address available";

  const handleClose = () => setShow(false);
  const handleShow = (src, title) => {
    setImageSrc(src);
    setImageTitle(title);
    setShow(true);
  };

  const handleImageClick = (type) => {
    handleShow(
      friend.img || "https://via.placeholder.com/40x40",
      `${friend?.fullname}'s Avatar`
    );
  };

  const handleFriendRequest = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const response = await apiClient.post("/api/friends/add", null, {
        params: {
          userId: getUserDataById().user_id,
          friendId: friend.userId,
        },
      });

      if (response.status === 200) {
        setFriendStatus(false); // Cập nhật trạng thái là "đã gửi yêu cầu"

        Swal.fire({
          title: "Lời mời đã được gửi!",
          text: `Bạn đã gửi lời mời kết bạn đến ${friend.fullname}.`,
          icon: "success",
          confirmButtonText: "Đồng ý",
        });
        if (onFriendRequestSent) {
          onFriendRequestSent(friend.userId);
        }
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Có lỗi xảy ra khi gửi lời mời kết bạn.",
        icon: "error",
        confirmButtonText: "Đồng ý",
      });
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleDeleteFriend = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const response = await apiClient.delete(`/api/friends/delete`, {
        params: {
          userId: getUserDataById().user_id,
          friendId: friend.userId,
        },
      });
      setFriendStatus(null); // Cập nhật trạng thái là "không có bạn bè"
      if (onFriendRequestSent) {
        onFriendRequestSent(friend.userId); // Gọi hàm để làm mới danh sách bạn bè
      }
    } catch (error) {
      console.error(
        "Error deleting friend:",
        error.response || error.message || error
      );
      Swal.fire({
        title: "Lỗi",
        text: "Có lỗi xảy ra khi xóa bạn bè.",
        icon: "error",
        confirmButtonText: "Đồng ý",
      });
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <div className="friend-card">
      <div className="friend-background">
        <img
          src={friend.img || "https://via.placeholder.com/40x40"}
          alt="Background"
          className="friend-background-img"
          onClick={() => handleImageClick("background")}
        />
        <div className="friend-avatar-container">
          <img
            src={friend.img || "https://via.placeholder.com/40x40"}
            alt="Avatar"
            className="friend-avatar-img"
            onClick={() => handleImageClick("avatar")}
          />
        </div>
        <div className="friend-followers">Followers: {friend?.followers}</div>
      </div>
      <div className="friend-info">
        <Link
          to={`/personal/${friend?.id}`}
          style={{ fontSize: "18px", color: "black", textDecoration: "none" }}
        >
          {friend?.fullname}
        </Link>
        <p>
          <LocationOn />
          {address}
        </p>
        <p>
          <Person /> {friend?.friends}
        </p>
        <p>
          <PostAddOutlined /> {friend?.posts}
        </p>
      </div>
      <div className="friend-actions">
        {loading ? ( // Hiển thị loading khi đang xử lý yêu cầu
          <button className="message-btn" disabled>
            Đang xử lý...
          </button>
        ) : (
          <>
            {friendStatus === false && (
              <button className="message-btn" onClick={handleDeleteFriend}>
                Hủy gửi lời mời
              </button>
            )}
            {friendStatus !== true && friendStatus !== false && (
              <button className="message-btn" onClick={handleFriendRequest}>
                Kết bạn
              </button>
            )}
            {friendStatus === true && (
              <button className="message-btn">Bạn bè</button>
            )}
          </>
        )}
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{imageTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={imageSrc} alt={imageTitle} className="img-fluid" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FriendCard;
