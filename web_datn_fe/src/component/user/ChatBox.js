import React, { useState } from "react";
import { Image, Form, Button } from "react-bootstrap";
import "../../assets/css/chatbox.css"; // Import CSS cho chatbox

const ChatBox = ({ friend, onClose }) => {
  const [messages, setMessages] = useState([
    {
      text: "Hello!",
      time: "10:00 AM",
      sender: friend.name,
      avatar: friend.avatar,
    },
    {
      text: "Hi there!",
      time: "10:02 AM",
      sender: "You",
      avatar: "path_to_your_avatar.jpg", // Thay thế bằng đường dẫn ảnh đại diện của bạn
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          text: newMessage,
          time: "Just now",
          sender: "You",
          avatar: "path_to_your_avatar.jpg", // Thay thế bằng đường dẫn ảnh đại diện của bạn
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="chatbox">
      <div className="chatbox-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src={friend.avatar}
            roundedCircle
            height="40"
            className="chatbox-avatar"
          />
          <div className="chatbox-info">
            <span className="chatbox-name">{friend.name}</span>
            <span className={`chatbox-status ${friend.status}`}>
              {friend.status}
            </span>
          </div>
        </div>
        <div className="chatbox-actions">
          <i className="fa fa-phone"></i>
          <i className="fa fa-video"></i>
          <i className="fa fa-cog"></i>
          <i
            className="fa fa-times chatbox-close"
            onClick={onClose} // Gọi hàm onClose từ component cha
            role="button"
          ></i>
        </div>
      </div>
      <div className="chatbox-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chatbox-message ${
              message.sender === "You"
                ? "chatbox-message-right"
                : "chatbox-message-left"
            }`}
          >
            <Image
              src={message.avatar}
              roundedCircle
              height="30"
              className="chatbox-message-avatar"
            />
            <div className="chatbox-message-content">
              <span className="chatbox-message-sender">{message.sender}</span>
              <span className="chatbox-message-text">{message.text}</span>
              <span className="chatbox-message-time">{message.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="chatbox-input">
        <Form onSubmit={handleSendMessage}>
          <Form.Group style={{ flex: 1 }}>
            <Form.Control
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            <i className="fa fa-paper-plane"></i>
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ChatBox;
