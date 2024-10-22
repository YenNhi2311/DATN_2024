import React, { useState } from "react";
import "../../assets/css/friends.css"; // Import CSS tùy chỉnh
import FriendCard from "../../component/user/FriendCard"; // Component con để hiển thị từng mục bạn bè


const friendsList = [
  {
    id: 1,
    name: "Adam James",
    location: "California, USA",
    followers: 120,
    friends: 223,
    videos: 240,
    photos: 144,
    posts: 250,
    since: "December, 2014",
  },
  {
    id: 2,
    name: "Andrew",
    location: "Toronto, Canada",
    avatar: "path_to_avatar_image_2.jpg",
    background: "path_to_background_image_2.jpg",
    followers: 450,
    friends: 223,
    videos: 240,
    photos: 144,
    posts: 250,
    since: "December, 2014",
  },
  {
    id: 3,
    name: "Arnold",
    location: "Istanbul, Turkey",
    avatar: "path_to_avatar_image_3.jpg",
    background: "path_to_background_image_3.jpg",
    followers: 50,
    friends: 223,
    videos: 240,
    photos: 144,
    posts: 250,
    since: "December, 2014",
  },
  {
    id: 4,
    name: "Ella John",
    location: "Mexico city, USA",
    avatar: "path_to_avatar_image_4.jpg",
    background: "path_to_background_image_4.jpg",
    followers: 410,
    friends: 223,
    videos: 240,
    photos: 144,
    posts: 250,
    since: "December, 2014",
  },
];

const Friends = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const friendsPerPage = 8;

  // Tính toán chỉ số đầu và cuối của bạn bè trên trang hiện tại
  const indexOfLastFriend = currentPage * friendsPerPage;
  const indexOfFirstFriend = indexOfLastFriend - friendsPerPage;
  const currentFriends = friendsList.slice(
    indexOfFirstFriend,
    indexOfLastFriend
  );

  // Xử lý chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(friendsList.length / friendsPerPage);

  return (
    <div className="friends-followers-container">
      <div className="header">
        <h2>
          Friends / Followers{" "}
          <span className="badge">{friendsList.length}</span>
        </h2>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search Friend"
            className="search-input"
          />
          <select className="sort-select">
            <option value="name">Sort by</option>
            <option value="name">Name</option>
            <option value="followers">Followers</option>
          </select>
        </div>
      </div>
      <div className="friends-list">
        {currentFriends.map((friend) => (
          <FriendCard key={friend.id} friend={friend} />
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`page-link ${currentPage === index + 1 ? "active" : ""}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Friends;
