import React, { useEffect, useState } from "react";
import { Button, Dropdown, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // Thêm SweetAlert2 cho popup xác nhận
import Avatar from "../../assets/img/avatar1.jpg";
import { apiClient } from "../../config/apiClient";

const CommentSection = ({ postId, userId }) => {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleComments, setVisibleComments] = useState(2);
  const [comments, setComments] = useState([]); // State để quản lý danh sách bình luận

  // Fetch bình luận
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true); // Bắt đầu tải
      try {
        const response = await apiClient.get(`/api/comments/post/${postId}`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false); // Kết thúc tải
      }
    };
    fetchComments();
  }, [postId]);

  // Xử lý thay đổi nội dung bình luận
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Gửi bình luận mới
  const handleCommentSubmit = async () => {
    if (newComment.trim() === "") return;

    const comment = {
      post: { postId },
      user: { userId },
      content: newComment,
    };

    try {
      const response = await apiClient.post("/api/comments", comment);
      Swal.fire("Bình luận về bài viết thành công!", "success");
      setComments(async (prevComments) => [response.data, ...prevComments]); // Thêm bình luận mới vào đầu danh sách
      setNewComment(""); // Reset nội dung bình luận
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Hàm xử lý khi xóa bình luận
  const handleDeleteComment = async (commentId) => {
    Swal.fire({
      title: "Bạn có chắc muốn xóa bình luận này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiClient.delete(`/api/comments/${commentId}`);
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.commentId !== commentId)
          );
          Swal.fire("Xóa thành công!", "", "success");
        } catch (error) {
          console.error("Error deleting comment:", error);
        }
      }
    });
  };

  // Hiển thị thêm bình luận (mỗi lần thêm 2 bình luận)
  const handleShowMoreComments = () => {
    setVisibleComments((prevVisible) => prevVisible + 2);
  };

  // Rút gọn bình luận về số lượng mặc định (2 bình luận)
  const handleShowLessComments = () => {
    setVisibleComments(2);
  };

  return (
    <div>
      <div className="post-comments-list">
        {loading && (
          <div className="text-center my-3">
            <Spinner animation="border" />
          </div>
        )}

        {comments.slice(0, visibleComments).map((comment) => (
          <div key={comment.commentId} className="post-comment">
            <img src={Avatar} alt="Avatar" className="comment-avatar" />
            <div className="comment-info">
              <span className="comment-username">{comment.user?.fullname}</span>
              <p className="comment-text">{comment.content}</p>
              <div className="comment-meta">
                <span className="comment-time">
                  {new Date(comment.createAt).toLocaleString()}
                </span>
              </div>
            </div>
            {comment.user.userId === userId && (
              <Dropdown className="comment-settings">
                <Dropdown.Toggle variant="link" id="dropdown-custom-components">
                  <i className="fa fa-ellipsis-h"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => handleDeleteComment(comment.commentId)}
                  >
                    Xóa bình luận
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        ))}

        {comments.length > visibleComments && (
          <Link
            onClick={handleShowMoreComments}
            className="show-more-btn justify-content-center"
          >
            Xem thêm nhiều bình luận
          </Link>
        )}

        {comments.length <= visibleComments && visibleComments > 2 && (
          <Link
            onClick={handleShowLessComments}
            className="show-less-btn justify-content-center"
          >
            Rút gọn
          </Link>
        )}
      </div>

      <div className="post-comment-box">
        <img src={Avatar} alt="Avatar" className="comment-avatar" />
        <Form onSubmit={handleCommentSubmit} className="comment-form">
          <Form.Control
            as="textarea"
            rows={1}
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Viết bình luận của bạn"
            disabled={loading}
          />
          <Button
            type="submit"
            variant="link"
            className="comment-send-btn"
            disabled={loading}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <i className="fa fa-paper-plane"></i>
            )}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CommentSection;
