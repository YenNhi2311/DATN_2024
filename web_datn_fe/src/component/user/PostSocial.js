import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ImageOutlined } from "@mui/icons-material";
import { apiClient } from "../../config/apiClient";
import PostDetail from "./PostDetail";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
import { getUserData } from "../../services/authService";
import DOMPurify from "dompurify";

// CSS trực tiếp trong component
const styles = {
  postSocial: {
    padding: "1rem",
    borderRadius: "8px",
    backgroundColor: "#f5f5f5",
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
  },
  postHeader: {
    display: "flex",
    alignItems: "center",
  },
  postAvatar: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    marginRight: "10px",
  },
  postInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    outline: "none",
    cursor: "pointer",
    fontSize: "16px",
    backgroundColor: "#fff",
  },
  modalHeader: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "blue",
  },
  imageUpload: {
    display: "flex",
    alignItems: "center",
    marginTop: "1rem",
  },
  uploadLabel: {
    cursor: "pointer",
    fontSize: "24px",
    color: "#007bff",
    marginRight: "10px",
  },
  socialImagePreview: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "10px",
  },
  imageContainer: {
    position: "relative",
    width: "80px",
    height: "80px",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "5px",
    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.1)",
  },
  removeImageButton: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    backgroundColor: "#ff5e5e",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    cursor: "pointer",
    fontSize: "12px",
  },
  postSubmit: {
    width: "100%",
    marginTop: "1rem",
    backgroundColor: "#007bff",
    border: "none",
  },
};

const PostSocial = () => {
  const [showModal, setShowModal] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [userData, setUserData] = useState("");

  useEffect(() => {
    const getUser = () => {
      const token = Cookies.get("access_token");
      const encryptedUserData = localStorage.getItem("userData");
      if (encryptedUserData) {
        try {
          const decryptedUserId = CryptoJS.AES.decrypt(
            encryptedUserData,
            "secret-key"
          ).toString(CryptoJS.enc.Utf8);
          const userId = JSON.parse(decryptedUserId).user_id;
          getUserData(userId, token)
            .then((data) => setUserData(data))
            .catch((error) =>
              console.error("Error fetching user data:", error)
            );
        } catch (error) {
          console.error("Lỗi giải mã userId:", error);
        }
      }
    };
    getUser();
  }, []);

  const handlePostChange = (event, editor) => {
    const data = editor.getData();
    setPostContent(data);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 7) {
      alert("Chỉ được chọn tối đa 7 ảnh.");
      return;
    }
    setSelectedImages([...selectedImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const cleanContent = DOMPurify.sanitize(postContent); // Làm sạch nội dung bài viết
    const postData = new FormData();
    postData.append("content", cleanContent);
    selectedImages.forEach((image) => postData.append("images", image));

    try {
      const response = await apiClient.post("/api/post/create", postData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPosts([response.data, ...posts]);
      setPostContent("");
      setSelectedImages([]);
      setShowModal(false);

      Swal.fire({
        title: "Thành công!",
        text: "Bài viết đã được đăng thành công.",
        icon: "success",
        confirmButtonText: "Đồng ý",
      });
    } catch (error) {
      console.error(
        "Lỗi khi tạo bài viết:",
        error.response ? error.response.data : error.message
      );
      Swal.fire({
        title: "Lỗi!",
        text: "Đã xảy ra lỗi khi đăng bài. Vui lòng thử lại.",
        icon: "error",
        confirmButtonText: "Đồng ý",
      });
    }
  };

  const isAdmin = userData?.authorities?.some(
    (auth) => auth.authority === "admin"
  );

  return (
    <>
      {isAdmin && (
        <div style={styles.postSocial} className="mb-3">
          <div style={styles.postHeader}>
            <img
              src={`http://localhost:8080/assets/img/${userData.img}`}
              alt={userData.user_id}
              style={styles.postAvatar}
            />
            <input
              style={styles.postInput}
              placeholder="Viết bài..."
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={styles.modalHeader}>Đăng bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePostSubmit}>
            <Form.Group controlId="postContent">
              <CKEditor
                editor={ClassicEditor}
                data={postContent}
                onChange={handlePostChange}
                config={{
                  toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "link",
                    "bulletedList",
                    "numberedList",
                    "blockQuote",
                    "|",
                    "imageUpload",
                    "undo",
                    "redo",
                  ],
                }}
              />
            </Form.Group>
            <hr />
            <div style={styles.imageUpload}>
              <label htmlFor="file-input" style={styles.uploadLabel}>
                <ImageOutlined />
              </label>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              <div style={styles.socialImagePreview}>
                {selectedImages.map((image, index) => (
                  <div key={index} style={styles.imageContainer}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Selected ${index}`}
                      style={styles.selectedImage}
                    />
                    <button
                      type="button"
                      style={styles.removeImageButton}
                      onClick={() => handleRemoveImage(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit" variant="primary" style={styles.postSubmit}>
              Đăng bài
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <div className="posts-list">
        <PostDetail posts={posts} />
      </div>
    </>
  );
};

export default PostSocial;
