import React, { useState } from "react";
import { Image } from "react-bootstrap";
import "../../assets/css/personalpage.css"; // Import CSS cho ProfileHeader
import { Link } from "react-router-dom";
import Timeline from "../../component/user/Timeline";
import Friends from "../../component/user/Friends";
import About from "../../component/user/About";
import PhotosPage from "../../component/user/PhotosPage";

const UserProfileHeader = () => {
  const [activeTab, setActiveTab] = useState("timeline");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const user = {
    name: "Jack Carter",
    location: "Ontario, CA",
  };

  return (
    <div className="user-profile-header">
      <div className="user-cover-photo">
        <Image src={user.coverPhoto} fluid className="user-cover-photo-img" />
        <div className="user-avatar-container">
          <Image src={user.avatar} roundedCircle className="user-avatar-img" />
        </div>
      </div>
      <div className="user-profile-info">
        <h2>{user.name}</h2>
        <p>{user.location}</p>
      </div>
      <div className="user-profile-nav">
        <ul className="user-nav">
          <li className="user-nav-item">
            <Link
              to="#"
              className={`user-nav-link ${
                activeTab === "timeline" ? "active" : ""
              }`}
              onClick={() => handleTabClick("timeline")}
            >
              Timeline
            </Link>
          </li>
          <li className="user-nav-item">
            <Link
              to="#"
              className={`user-nav-link ${
                activeTab === "about" ? "active" : ""
              }`}
              onClick={() => handleTabClick("about")}
            >
              About
            </Link>
          </li>
          <li className="user-nav-item">
            <Link
              to="#"
              className={`user-nav-link ${
                activeTab === "friends" ? "active" : ""
              }`}
              onClick={() => handleTabClick("friends")}
            >
              Friend
            </Link>
          </li>
          <li className="user-nav-item">
            <Link
              to="#"
              className={`user-nav-link ${
                activeTab === "photos" ? "active" : ""
              }`}
              onClick={() => handleTabClick("photos")}
            >
              Photo
            </Link>
          </li>
        </ul>
        <div className="user-profile-stats">
          <span>
            Posts <strong>101</strong>
          </span>
          <span>
            Followers <strong>1.3K</strong>
          </span>
          <span>
            Following <strong>22</strong>
          </span>
        </div>
      </div>
      {activeTab === "timeline" && (
        <div className="user-timeline-content">
          <Timeline />
        </div>
      )}
      {activeTab === "friends" && (
        <div className="user-timeline-content">
          <Friends />
        </div>
      )}
      {activeTab === "about" && (
        <div className="user-timeline-content">
          <About />
        </div>
      )}
      {activeTab === "photos" && (
        <div className="user-timeline-content">
          <PhotosPage />
        </div>
      )}
    </div>
  );
};

export default UserProfileHeader;
