import React from "react";
import "../../assets/css/social.css"; // Import CSS cho social
import ProfileSocial from "../../page/social/ProfileSocial";
import PostSocial from "./PostSocial";
import PostDetail from "./PostDetail";

const Timeline = () => {
  return (
    <div className="timeline-container">
      <div className="timeline-grid">
        <div className="timeline-left-column">
          <ProfileSocial />
        </div>
        <div className="timeline-right-column">
          <PostSocial />
          <PostDetail />
          <PostDetail />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
