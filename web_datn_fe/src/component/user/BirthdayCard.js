import React from "react";
import { Image } from "react-bootstrap";
import "../../assets/css/birthdaycard.css"; // Import CSS

const BirthdayCard = ({ user }) => {
  return (
    <div className="birthday-card">
      <div className="birthday-header">
        <Image src={user.avatar} roundedCircle className="birthday-avatar" />
        <div className="birthday-info">
          <span className="birthday-name">{user.name} Birthday</span>
          <span className="birthday-date">{user.date}</span>
        </div>
      </div>
      <div className="birthday-content">
        <Image src="/path_to_cake_image.png" className="birthday-cake" />
        <div className="birthday-message">
          <strong>{user.name}</strong>'s birthday <br />
          leave a message with your best wishes on his profile.
        </div>
      </div>
    </div>
  );
};

export default BirthdayCard;
