import React, { useState } from "react";
import ChatBox from "./ChatBox"; // Import ChatBox component
import Avatar1 from "../../assets/img/avatar1.jpg"; // Thay thế bằng đường dẫn ảnh đại diện của bạn

const ParentComponent = () => {
  const [isChatBoxVisible, setIsChatBoxVisible] = useState(false);
  const [activeFriend, setActiveFriend] = useState(null);

  const friends = [
    { id: 1, name: "Alice", avatar: Avatar1, status: "online" },
    { id: 2, name: "Bob", avatar: Avatar1, status: "online" },
    // Thêm bạn bè khác
  ];

  const handleFriendClick = (friend) => {
    setActiveFriend(friend); // Đặt người bạn đang chat
    setIsChatBoxVisible(true); // Hiển thị chatbox
  };

  const handleChatBoxClose = () => {
    setIsChatBoxVisible(false); // Ẩn chatbox khi nhấn nút đóng
  };

  return (
    <div>
      <div className="friend-sidebar">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="friend-item"
            onClick={() => handleFriendClick(friend)}
          >
            <img src={friend.avatar} alt={friend.name} />
            <span>{friend.name}</span>
          </div>
        ))}
      </div>

      {isChatBoxVisible && activeFriend && (
        <ChatBox friend={activeFriend} onClose={handleChatBoxClose} />
      )}
    </div>
  );
};

export default ParentComponent;
