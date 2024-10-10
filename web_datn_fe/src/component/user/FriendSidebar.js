import React, { useState } from "react";
import { Image } from "react-bootstrap";
import "../../assets/css/friendsidebar.css";
import Avatar1 from "../../assets/img/avatar1.jpg";
import ChatBox from "./ChatBox";

const FriendSidebar = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatBoxVisible, setIsChatBoxVisible] = useState(false);
  const [activeFriend, setActiveFriend] = useState(null);

  const friends = [
    { id: 1, name: "Alice", avatar: Avatar1, status: "online" },
    { id: 2, name: "Bob", avatar: Avatar1, status: "online" },
    // Thêm bạn bè khác
  ];

  const handleFriendClick = (friend) => {
    setActiveFriend(friend);
    setIsChatBoxVisible(true);
  };

  const handleChatBoxClose = () => {
    setIsChatBoxVisible(false);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`friend-sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
        {isSidebarCollapsed ? ">" : "<"}
      </button>
      {!isSidebarCollapsed && (
        <ul className="friend-list">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="friend-item"
              onClick={() => handleFriendClick(friend)}
            >
              <Image
                src={friend.avatar}
                roundedCircle
                className="friend-avatar"
              />
              <span className={`status ${friend.status}`}></span>
            </li>
          ))}
        </ul>
      )}
      {isChatBoxVisible && activeFriend && (
        <ChatBox friend={activeFriend} onClose={handleChatBoxClose} />
      )}
    </div>
  );
};

export default FriendSidebar;
