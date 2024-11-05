import React, { useEffect, useRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { apiClient } from "../../config/apiClient";
import { getUserDataById } from "../../services/authService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ShareProductModal = ({ show, handleClose, product }) => {
  const [caption, setCaption] = useState("");
  const navigate = useNavigate();

  const handleShare = async () => {
    const postData = {
      content: `${product?.name}: ${caption}`,
      imgposts: [{ img: product.img }],
      user: { id: getUserDataById().user_id },
    };

    try {
      const response = await apiClient.post("/api/post/create", postData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Chia sẻ thành công!",
          text: "Bài viết đã được chia sẻ.",
        }).then(() => {
          handleClose();
          navigate("/social");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Có lỗi xảy ra khi chia sẻ bài viết.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi chia sẻ bài viết.",
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Chia sẻ sản phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img
          src={`http://localhost:8080/assets/img/${product.productDetails.img}`}
          alt={product.name}
          style={{ width: "100%" }}
        />
        <h5>{product.name}</h5>
        <textarea
          placeholder="Nhập caption của bạn"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={{ width: "100%", height: "100px" }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleShare}>
          Chia sẻ
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareProductModal;
