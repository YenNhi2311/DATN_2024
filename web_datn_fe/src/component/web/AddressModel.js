import React, { useState } from "react";
import {
  Button,
  Form,
  Modal
} from "react-bootstrap";
import "../../assets/css/addressmodal.css"; // CSS của modal

const AddressModal = ({ show, handleClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    phone: "",
    fullName: "",
    city: "",
    district: "",
    ward: "",
    address: "",
    addressType: "home", // 'home' or 'company'
    setDefault: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    onSubmit(formData); // Gửi dữ liệu địa chỉ khi người dùng bấm "Tiếp tục"
    handleClose(); // Đóng modal sau khi xử lý
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thêm địa chỉ mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="phone">
            <Form.Control
              type="text"
              placeholder="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="fullName">
            <Form.Control
              type="text"
              placeholder="Họ và tên"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="city">
            <Form.Control
              as="select"
              name="city"
              value={formData.city}
              onChange={handleChange}
            >
              <option>Chọn Tỉnh/ TP</option>
              <option>Hà Nội</option>
              <option>TP. Hồ Chí Minh</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="district">
            <Form.Control
              as="select"
              name="district"
              value={formData.district}
              onChange={handleChange}
            >
              <option>Chọn Quận/ Huyện</option>
              <option>Hà Nội</option>
              <option>TP. Hồ Chí Minh</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="ward">
            <Form.Control
              as="select"
              name="ward"
              value={formData.ward}
              onChange={handleChange}
            >
              <option>Chọn Phường/ Xã</option>
              <option>Ba Đình</option>
              <option>Quận 1</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="address">
            <Form.Control
              type="text"
              placeholder="Số nhà + Tên đường"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <p className="text-danger">
            Vui lòng chọn Tỉnh/TP, Quận/ Huyện và Phường/ xã trước khi nhập Số
            nhà + Tên Đường
          </p>

          <Form.Group controlId="setDefault">
            <Form.Check
              type="switch"
              label="Đặt làm địa chỉ mặc định"
              name="setDefault"
              checked={formData.setDefault}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Hủy
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          Tiếp tục
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddressModal;
