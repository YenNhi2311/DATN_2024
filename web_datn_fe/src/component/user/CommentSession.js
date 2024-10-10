import React, { useState, useEffect } from "react";
import { Button, Form, Dropdown } from "react-bootstrap";
import Avatar from "../../assets/img/avatar1.jpg";
import { apiClient } from "../../config/apiClient";
import Swal from "sweetalert2"; // Thêm SweetAlert2 cho popup xác nhận

const CommentSection = ({ postId, userId, updateComments }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [visibleComments, setVisibleComments] = useState(5); // Hiển thị 5 bình luận đầu tiên

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Lấy danh sách comment từ API
  const fetchComments = () => {
    apiClient
      .get(`/api/comments/post/${postId}`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  };

  // Xử lý thay đổi nội dung bình luận
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Gửi bình luận mới
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const comment = {
      post: { postId }, // Đảm bảo rằng postId hợp lệ
      user: { userId }, // Đảm bảo rằng userId hợp lệ
      content: newComment, // Đảm bảo rằng content không rỗng
    };

    console.log("Sending comment:", comment); // Log dữ liệu gửi lên API

    apiClient
      .post("/api/comments", comment)
      .then((response) => {
        setNewComment(""); // Clear comment input
        setComments([response.data, ...comments]);
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  };

  // Hàm xử lý khi xóa bình luận với xác nhận
  const handleDeleteComment = (commentId) => {
    Swal.fire({
      title: "Bạn có chắc muốn xóa bình luận này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        apiClient
          .delete(`/api/comments/${commentId}`)
          .then(() => {
            // Xóa bình luận khỏi state
            setComments(
              comments.filter((comment) => comment.commentId !== commentId)
            );
            Swal.fire("Xóa thành công!", "", "success");
          })
          .catch((error) => {
            console.error("Error deleting comment:", error);
          });
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
        {comments.slice(0, visibleComments).map((comment) => (
          <div key={comment.commentId} className="post-comment">
            <img src={Avatar} alt="Avatar" className="comment-avatar" />
            <div className="comment-info">
              <span className="comment-username">{comment.user.username}</span>
              <p className="comment-text">{comment.content}</p>
              <div className="comment-meta">
                <span className="comment-time">
                  {new Date(comment.createAt).toLocaleString()}
                </span>
                <span className="comment-likes">
                  <i className="fa fa-heart"></i> {comment.likes || 0}
                </span>
              </div>
            </div>
            {/* Dropdown menu for comment actions */}
            {comment.user.userId === userId && ( // Chỉ hiển thị nút xóa nếu là người dùng đã tạo comment
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

        {/* Hiển thị nút "Xem thêm" nếu có nhiều hơn số comment đã hiển thị */}
        {comments.length > visibleComments && (
          <Button
            onClick={handleShowMoreComments}
            className="show-more-btn justify-content-center"
          >
            Xem thêm nhiều bình luận
          </Button>
        )}

        {/* Nút "Rút gọn" chỉ hiển thị khi đã xem hết bình luận */}
        {comments.length <= visibleComments && visibleComments > 5 && (
          <Button
            onClick={handleShowLessComments}
            className="show-less-btn justify-content-center"
          >
            Rút gọn
          </Button>
        )}
      </div>

      {/* Hộp nhập bình luận */}
      <div className="post-comment-box">
        <img src={Avatar} alt="Avatar" className="comment-avatar" />
        <Form onSubmit={handleCommentSubmit} className="comment-form">
          <Form.Control
            as="textarea"
            rows={1}
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Viết bình luận của bạn"
          />
          <Button type="submit" variant="link" className="comment-send-btn">
            <i className="fa fa-paper-plane"></i>
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CommentSection;
