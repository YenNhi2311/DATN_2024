import React, { useEffect, useState } from "react";
import "../../assets/css/friends.css"; // Import CSS tùy chỉnh
import FriendCard from "../../component/user/FriendCard"; // Component con để hiển thị từng mục bạn bè
import { apiClient } from "../../config/apiClient";
import { getUserDataById } from "../../services/authService";

const Friends = () => {
  // Nhận userId như một props
  const [friendsList, setFriendsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi
  const friendsPerPage = 8;

  // Gọi API để lấy danh sách người dùng
  const fetchFriends = async () => {
    try {
      const response = await apiClient.get("/api/user");
      setFriendsList(response.data); // axios tự động xử lý JSON
      setLoading(false); // Tắt loading sau khi dữ liệu được tải
    } catch (error) {
      console.error("Error fetching friends: ", error);
      setError("Failed to fetch friends.");
      setLoading(false); // Tắt loading khi gặp lỗi
    }
  };

  const refreshFriendList = () => {
    fetchFriends(); // Gọi lại hàm fetchFriends để cập nhật danh sách bạn bè
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // Tính toán chỉ số đầu và cuối của bạn bè trên trang hiện tại
  const indexOfLastFriend = currentPage * friendsPerPage;
  const indexOfFirstFriend = indexOfLastFriend - friendsPerPage;
  const idUser = getUserDataById().user_id;

  // Lọc bạn bè để loại bỏ friend có id bằng với userId
  const filteredFriendsList = friendsList.filter(
    (friend) => friend.userId !== idUser
  );

  const currentFriends = filteredFriendsList.slice(
    indexOfFirstFriend,
    indexOfLastFriend
  );

  // Xử lý chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredFriendsList.length / friendsPerPage);

  // Hiển thị thông báo khi đang load hoặc gặp lỗi
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="friends-followers-container">
      <div className="header">
        <h2>
          Gợi ý kết bạn{" "}
          <span className="badge">{filteredFriendsList.length}</span>
        </h2>
      </div>
      <div className="friends-list">
        {currentFriends.map((friend) => (
          <FriendCard
            key={friend.id}
            friend={friend}
            onFriendRequestSent={refreshFriendList}
          />
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`page-link ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Friends;
