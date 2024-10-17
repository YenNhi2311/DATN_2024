import { ImageOutlined } from "@mui/icons-material";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import "../../assets/css/postsocial.css";
import Avatar from "../../assets/img/avatar1.jpg";
import { apiClient } from "../../config/apiClient";
import PostDetail from "./PostDetail";

const PostSocial = () => {
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]); // State lưu danh sách bài viết
  const [selectedImages, setSelectedImages] = useState([]); // State lưu trữ hình ảnh đã chọn

  // Hàm xử lý thay đổi nội dung bài viết
  const handlePostChange = (e) => {
    setPostContent(e.target.value);
  };

  // Hàm xử lý khi chọn ảnh
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 7) {
      alert("Chỉ được chọn tối đa 7 ảnh.");
      return;
    }
    const updatedImages = [...selectedImages, ...files];
    setSelectedImages(updatedImages);
  };

  // Hàm xử lý xóa ảnh đã chọn
  const handleRemoveImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  // Hàm gửi yêu cầu POST lên server
  const handlePostSubmit = async (e) => {
    e.preventDefault();

    const postData = new FormData(); // Dùng FormData để gửi cả text và file
    postData.append("content", postContent);
    selectedImages.forEach((image) => {
      postData.append("images", image); // Append từng ảnh với cùng key 'images'
    });

    try {
      // Gọi API để tạo bài đăng
      const response = await apiClient.post("/api/post/create", postData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Thêm bài viết mới vào danh sách bài viết
      setPosts([response.data, ...posts]);
      setPostContent(""); // Xóa nội dung sau khi gửi
      setSelectedImages([]); // Xóa hình ảnh đã chọn sau khi gửi
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
              {/* Chọn ảnh */}
              <div className="image-upload">
                <label htmlFor="file-input" className="upload-label">
                  <ImageOutlined />
                </label>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="upload-input"
                  style={{ display: "none" }}
                />
                <div className="image-preview">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="image-container">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Selected ${index}`}
                        className="selected-image"
                      />
                      <button
                        type="button"
                        className="remove-image-button"
                        onClick={() => handleRemoveImage(index)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Nút Đăng bài */}
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
