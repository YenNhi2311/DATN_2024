import React, { useEffect, useState } from "react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import Swal from "sweetalert2"; // Import SweetAlert2
import Avatar from "../../assets/img/avatar1.jpg";
import CommentSection from "../../component/user/CommentSession";
import LikeButton from "../../component/user/LikeButton";
import { apiClient } from "../../config/apiClient";
import { formatPostTime } from "../../config/formatPostTime";

const PostItem = ({ post, userId }) => {
  const [showActions, setShowActions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [editContent, setEditContent] = useState(post.content);

  // Fetch dữ liệu bài viết
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postResponse = await apiClient.get(`/api/post/${post.postId}`);
        setIsLiked(postResponse.data.isLikedByCurrentUser);
        setTotalLikes(postResponse.data.totalLikes);
      } catch (error) {
        console.error("Error fetching post data: ", error);
      }
    };

    fetchPostData();
  }, [post.postId]);

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

  // Hàm xóa bài viết
  const handleDeletePost = async () => {
    try {
      await apiClient.delete(`/api/post/${post.postId}`);
      Swal.fire("Deleted!", "Bạn đã xóa bài viết thành công.", "success");
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
        handleDeletePost();
      }
    });
  };

  // Hàm mở modal chỉnh sửa
  const handleShowEditModal = () => {
    setEditContent(post.content);
    setShowEditModal(true);
  };

  // Hàm lưu chỉnh sửa
  const handleSaveEdit = async () => {
    try {
      await apiClient.put(`/api/post/${post.postId}`, { content: editContent });
      Swal.fire("Success!", "Bài viết đã được cập nhật.", "success");
      setShowEditModal(false);
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
          src={
            post.user.img
              ? `http://localhost:8080/assets/img/${post?.user?.img}`
              : ""
          }
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
              <>
                <Dropdown.Item onClick={handleShowEditModal}>
                  Edit Post
                </Dropdown.Item>
                <Dropdown.Item onClick={confirmDeletePost}>
                  Delete Post
                </Dropdown.Item>
              </>
            )}
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
        <div className={`post-images post-images-${post?.imgposts?.length}`}>
          {post.imgposts?.slice(0, 7).map((imgpost, index) => (
            <div
              key={index}
              className="post-image-wrapper"
              onClick={() => handleImageClick(index)}
            >
              <img
                src={`http://localhost:8080/assets/img/${imgpost.img}`}
                alt={`Post Image ${index + 1}`}
                className="post-image"
              />
            </div>
          ))}
          {post.imgposts?.length > 7 && (
            <div className="post-image-wrapper post-more-images-wrapper">
              <span className="post-more-images-text">
                +{post.imgposts.length - 7}
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
      <CommentSection postId={post.postId} userId={userId} />

      {/* Edit Post Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPostContent">
              <Form.Label>Nội dung</Form.Label>
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
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Image Modal */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        style={{ marginLeft: "150px" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Hình ảnh bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={`http://localhost:8080/assets/img/${post.imgposts[currentImageIndex]?.img}`}
            alt={`Post Image ${currentImageIndex + 1}`}
            className="img-fluid"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PostItem;
