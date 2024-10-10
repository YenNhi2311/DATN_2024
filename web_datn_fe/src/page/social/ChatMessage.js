import React, { useState } from "react";
import "../../assets/css/chatmessage.css";
import avatar1 from "../../assets/img/avatar1.jpg";
import avatar2 from "../../logo.svg";

const ChatMessage = () => {
  const friends = [
    {
      name: "Andrew",
      avatar: avatar1,
      status: "Online",
      lastMessage: "you send a video - 2hrs ago",
      about: "I love reading, traveling and discovering new things...",
      phone: "+123976980",
      website: "www.abc.com",
      email: "[email protected]",
      location: "Ontario, Canada",
      media: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
      ],
    },
    {
      name: "Jack Carter",
      avatar: avatar2,
      status: "Online",
      lastMessage: "you send an audio - Tue",
      about: "I love reading, traveling and discovering new things...",
      phone: "+123976980",
      website: "www.abc.com",
      email: "[email protected]",
      location: "Ontario, Canada",
      media: ["https://via.placeholder.com/150"],
    },
  ];

  const [selectedFriend, setSelectedFriend] = useState(friends[0]);

  const messages = [
    { sender: "me", text: "Hi, how are you?", time: "2:32PM" },
    { sender: "friend", text: "I'm good, how about you?", time: "2:35PM" },
    {
      sender: "me",
      text: "I'm doing great, thanks!",
      time: "2:36PM",
      image: "https://via.placeholder.com/150",
    },
    { sender: "friend", text: "That's awesome!", time: "2:38PM" },
  ];

  const handleSelectFriend = (index) => {
    setSelectedFriend(friends[index]);
  };

  return (
    <div className="chat-message-container">
      {/* Phần Sidebar */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h4>Chat Messages</h4>
          <input
            type="text"
            placeholder="Search Friend.."
            className="search-input"
          />
        </div>
        <div className="chat-friend-list">
          {friends.map((f, index) => (
            <div
              key={index}
              className={`chat-friend-item ${
                selectedFriend.name === f.name ? "active-friend" : ""
              }`}
              onClick={() => handleSelectFriend(index)}
            >
              <img src={f.avatar} alt="Avatar" className="friend-avatar" />
              <div className="friend-info">
                <span className="friend-name">{f.name}</span>
                <span className="friend-last-message">{f.lastMessage}</span>
              </div>
              <span className={`status-indicator ${f.status}`}></span>
            </div>
          ))}
        </div>
      </div>

      {/* Phần chính */}
      <div className="chat-main">
        <div className="chat-header">
          <img
            src={selectedFriend.avatar}
            alt="Avatar"
            className="friend-avatar"
          />
          <div className="chat-friend-info">
            <span className="friend-name">{selectedFriend.name}</span>
            <span className="friend-status">{selectedFriend.status}</span>
          </div>
          <div className="chat-actions">
            <i className="fa fa-phone"></i>
            <i className="fa fa-video"></i>
            <i className="fa fa-info-circle"></i>
            <i className="fa fa-cog"></i>
          </div>
        </div>

        <div className="chat-body">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message-item ${
                message.sender === "me" ? "my-message" : "friend-message"
              }`}
            >
              <div className="message-content">
                {message.text}
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attached"
                    className="message-image"
                  />
                )}
                <span className="message-time">{message.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-footer">
          <input type="text" placeholder="Type a message..." />
          <button type="submit">
            <i className="fa fa-paper-plane"></i>
          </button>
        </div>
      </div>

      {/* Phần chi tiết người dùng */}
      <div className="chat-details">
        <img
          src={selectedFriend.avatar}
          alt="Avatar"
          className="friend-avatar-lg"
        />
        <h4 className="friend-name">{selectedFriend.name}</h4>
        <p className="friend-status">{selectedFriend.status}</p>
        <p>
          About: <span>{selectedFriend.about}</span>
        </p>
        <div className="contact-info">
          <p>
            <i className="fa fa-phone"></i>Phone: {selectedFriend.phone}
          </p>
          <p>
            <i className="fa fa-globe"></i>Website: {selectedFriend.website}
          </p>
          <p>
            <i className="fa fa-envelope"></i>Email: {selectedFriend.email}
          </p>
          <p>
            <i className="fa fa-map-marker"></i>Location:{" "}
            {selectedFriend.location}
          </p>
        </div>
        <div className="media-gallery">
          <h4>Media</h4>
          <div className="media-images">
            {selectedFriend.media.map((img, index) => (
              <img key={index} src={img} alt="Media" className="media-image" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
