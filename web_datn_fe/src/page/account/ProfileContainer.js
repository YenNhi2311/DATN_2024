import React, { useState } from "react";
import UpdateProfileForm from "./UpdateProfileForm";
import ChangePasswordPage from "./ChangePassword";
import "../../assets/css/profileContainer.css";

// Danh sách màu sắc
const colors = [
    "rgba(255, 0, 0, 0.8)", // Đỏ đậm
    "rgba(0, 255, 0, 0.8)", // Xanh lá đậm
    "rgba(0, 0, 255, 0.8)", // Xanh dương đậm
    "rgba(255, 255, 0, 0.8)", // Vàng đậm
    "rgba(255, 165, 0, 0.8)", // Cam đậm
    "rgba(75, 0, 130, 0.8)", // Tím đậm
    "rgba(238, 130, 238, 0.8)", // Hồng đậm
];


const ProfileContainer = () => {
    const [activeTab, setActiveTab] = useState("profile");

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="container-fluid profile-container-active">
            <div className="profile-left">
                <button
                    className={activeTab === "profile" ? "active" : ""}
                    onClick={() => handleTabChange("profile")}
                >
                    <span className="ms-4">Cập Nhật Thông Tin</span>
                </button>
                <button
                    className={activeTab === "changepass" ? "active" : ""}
                    onClick={() => handleTabChange("changepass")}
                    style={{ marginTop: '10px' }}
                >
                    <span className="ms-4">Thay Đổi Mật Khẩu</span>
                </button>
            </div>

            <div className="profile-right">
                <div className="background-animation">
                    {/* Tạo nhiều hình hơn */}
                    {Array.from({ length: 20 }).map((_, index) => (
                        <div
                            key={index}
                            className="shape"
                            style={{
                                width: `${Math.random() * 40 + 20}px`,
                                height: `${Math.random() * 40 + 20}px`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`, // Thay đổi độ trễ của từng hình
                                backgroundColor: colors[Math.floor(Math.random() * colors.length)], // Màu sắc ngẫu nhiên từ danh sách
                            }}
                        />
                    ))}
                </div>
                <div className="profile-content" style={{ position: 'relative', zIndex: 2 }}>
                    {activeTab === "profile" && <UpdateProfileForm />}
                    {activeTab === "changepass" && <ChangePasswordPage />}
                </div>
            </div>
        </div>
    );
};

export default ProfileContainer;
