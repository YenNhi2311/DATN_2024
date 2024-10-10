import React, { useState } from "react";
import "../../assets/css/friends.css"; // Import CSS tùy chỉnh
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const FriendCard = ({ friend }) => {
  const [show, setShow] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [imageTitle, setImageTitle] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (src, title) => {
    setImageSrc(src);
    setImageTitle(title);
    setShow(true);
  };

  const handleImageClick = (type) => {
    if (type === "avatar") {
      handleShow(friend.avatar, `${friend.name}'s Avatar`);
    } else if (type === "background") {
      handleShow(friend.background, `${friend.name}'s Cover Photo`);
    }
  };

  return (
    <div className="friend-card">
      <div className="friend-background">
        <img
          src={friend.background}
          alt="Background"
          className="friend-background-img"
          onClick={() => handleImageClick("background")}
        />
        <div className="friend-avatar-container">
          <img
            src={friend.avatar}
            alt="Avatar"
            className="friend-avatar-img"
            onClick={() => handleImageClick("avatar")}
          />
        </div>
        <div className="friend-followers">Followers: {friend.followers}</div>
      </div>
      <div className="friend-info">
        {/* <Link to={`/profile/${friend.id}`}>{friend.name}</Link> */}
        <Link
          to="/personal"
          style={{ fontSize: "18px", color: "black", textDecoration: "none" }}
        >
          {friend.name}
        </Link>
        <p>{friend.location}</p>
        <p>Friends: {friend.friends}</p>
        <p>Videos: {friend.videos}</p>
        <p>Photos: {friend.photos}</p>
        <p>Posts: {friend.posts}</p>
        <p>Since: {friend.since}</p>
      </div>
      <div className="friend-actions">
        <button className="message-btn">Message</button>
        <div className="more-options">
          <i className="fa fa-ellipsis-h"></i>
        </div>
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
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FriendCard;
