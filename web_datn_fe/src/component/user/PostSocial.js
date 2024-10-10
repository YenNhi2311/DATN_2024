import React, { useState } from "react";
import { Form } from "react-bootstrap";
import "../../assets/css/postsocial.css";
import Avatar from "../../assets/img/avatar1.jpg";
import { apiClient } from "../../config/apiClient";
import PostDetail from "./PostDetail";

const PostSocial = () => {
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]); // State lưu danh sách bài viết

  // Hàm xử lý thay đổi nội dung bài viết
  const handlePostChange = (e) => {
    setPostContent(e.target.value);
  };

  // Hàm gửi yêu cầu POST lên server
  const handlePostSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      content: postContent,
    };

    try {
      // Gọi API để tạo bài đăng
      const response = await apiClient.post("/api/post/create", postData);

      // Thêm bài viết mới vào danh sách bài viết
      setPosts([response.data, ...posts]);
      setPostContent(""); // Xóa nội dung sau khi gửi
      window.location.reload();
    } catch (error) {
      console.error(
        "Lỗi khi tạo bài viết:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <>
      <div className="post-social">
        <div className="post-header">
          <img src={Avatar} alt="Avatar" className="post-avatar" />
          <div className="post-input">
            <h3>Bạn đang nghĩ gì?</h3>
            <Form onSubmit={handlePostSubmit}>
              <Form.Group controlId="postContent">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={postContent}
                  onChange={handlePostChange}
                  placeholder="Nhập nội dung bài viết..."
                />
              </Form.Group>
              <hr />
              <button type="submit" className="button post-submit">
                <div className="button__content">
                  <span className="button__text">Đăng bài</span>
                  <i className="ri-download-cloud-fill button__icon"></i>
                  <div className="button__reflection-1"></div>
                  <div className="button__reflection-2"></div>
                </div>
                <div className="button__shadow"></div>
              </button>
            </Form>
          </div>
        </div>
      </div>
      {/* Hiển thị danh sách bài viết */}
      <div className="posts-list">
        <PostDetail />
      </div>
    </>
  );
};

export default PostSocial;
