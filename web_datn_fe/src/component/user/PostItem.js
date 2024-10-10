import React, { useState, useEffect } from "react";
import { Dropdown, Modal, Button, Form } from "react-bootstrap";
import Avatar from "../../assets/img/avatar1.jpg";
import CommentSection from "../../component/user/CommentSession";
import LikeButton from "../../component/user/LikeButton";
import { formatPostTime } from "../../config/formatPostTime";
import { apiClient } from "../../config/apiClient";
import Swal from "sweetalert2"; // Import SweetAlert2
import CryptoJS from "crypto-js";

const PostItem = ({ post, userId }) => {
  const [showActions, setShowActions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [editContent, setEditContent] = useState(post.content);
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postResponse = await apiClient.get(`/api/post/${post.postId}`);
        setIsLiked(postResponse.data.isLikedByCurrentUser);
        setTotalLikes(postResponse.data.totalLikes); // Assuming you get totalLikes from the API
      } catch (error) {
        console.error("Error fetching post data: ", error);
      }
    };

    fetchPostData();
  }, [post.postId]);

  useEffect(() => {
    fetchComments();
  }, [post.postId]);

  const fetchComments = () => {
    apiClient
      .get(`/api/comments/post/${post.postId}`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLikeUpdate = (liked) => {
    setIsLiked(liked);
    setTotalLikes((prevLikes) => prevLikes + (liked ? 1 : -1));
  };

  const updateComments = () => {
    fetchComments(); // Refresh comments
  };

  // Hàm xóa bài viết
  const handleDeletePost = async () => {
    try {
      await apiClient.delete(`/api/post/${post.postId}`);
      Swal.fire("Deleted!", "Bạn đã xóa bài viết thành công.", "success");
      // Xóa bài viết khỏi giao diện (tùy vào logic của bạn)
      window.location.reload();
    } catch (error) {
      Swal.fire("Error", "There was a problem deleting the post.", "error");
      console.error("Error deleting post:", error);
    }
  };

  // Hiển thị modal xác nhận xóa
  const confirmDeletePost = () => {
    Swal.fire({
      title: "Bạn chắc chắn chứ?",
      text: "Bạn sẽ không thể khôi phục lại nó!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ok!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeletePost(); // Xóa bài viết nếu người dùng xác nhận
      }
    });
  };

  // Hàm mở modal chỉnh sửa
  const handleShowEditModal = () => {
    setEditContent(post.content); // Đặt nội dung bài viết hiện tại vào state
    setShowEditModal(true);
  };

  // Hàm lưu chỉnh sửa
  const handleSaveEdit = async () => {
    try {
      await apiClient.put(`/api/post/${post.postId}`, { content: editContent });
      Swal.fire("Success!", "Bài viết đã được cập nhật.", "success");
      setShowEditModal(false);
      // Cập nhật nội dung bài viết trên giao diện
      post.content = editContent;
    } catch (error) {
      Swal.fire("Error", "Có lỗi xảy ra khi cập nhật bài viết.", "error");
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="post-item">
      <div className="post-header-post">
        <img
          src={post.user.img ? post.user.img : Avatar}
          alt={post.user.fullname}
          className="post-avatar-post"
        />
        <div className="post-user-info">
          <span className="post-username">{post.user?.fullname}</span>
          <div className="post-meta">
            <span className="post-date">
              Đã đăng: {formatPostTime(post.createAt)}
            </span>
          </div>
        </div>
        <Dropdown className="post-settings">
          <Dropdown.Toggle variant="link" id="dropdown-custom-components">
            <i className="fa fa-cog"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {post.user.userId === userId && (
              <Dropdown.Item onClick={handleShowEditModal}>
                Edit Post
              </Dropdown.Item>
            )}
            <Dropdown.Item onClick={confirmDeletePost}>
              Delete Post
            </Dropdown.Item>
            <Dropdown.Item href="#">Hide Post</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div
        className="post-content"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <p className="post-caption">{post.content}</p>
        <div
          className={`post-images post-images-${post.imgposts?.length || 0}`}
        >
          {post.imgposts?.slice(0, 3).map((imgpost, index) => (
            <div
              key={index}
              className="post-image-wrapper"
              onClick={() => handleImageClick(index)}
            >
              <img
                src={imgpost.url}
                alt={`Post Image ${index + 1}`}
                className="post-image"
              />
            </div>
          ))}
          {post.imgposts?.length > 3 && (
            <div className="post-image-wrapper post-more-images-wrapper">
              <span className="post-more-images-text">
                +{post.imgposts.length - 3}
              </span>
            </div>
          )}
        </div>
        <hr />
        <div className={`post-actions ${showActions ? "show" : ""}`}>
          <LikeButton
            postId={post.postId}
            userId={userId}
            isLiked={isLiked}
            totalLikes={totalLikes}
            handleLikeUpdate={handleLikeUpdate}
          />
          <i className="fa fa-share" title="Share"></i>
        </div>
      </div>
      <hr />

      {/* CommentSection */}
      <CommentSection
        postId={post.postId}
        userId={userId}
        updateComments={updateComments} // Truyền hàm callback
      />

      {/* Edit Post Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPostContent">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PostItem;
