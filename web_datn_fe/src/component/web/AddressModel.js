import axios from "axios";
import CryptoJS from "crypto-js";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "../../assets/css/addressmodal.css"; // CSS của modal

const AddressModal = ({ show, handleClose, onSubmit, editAddress }) => {
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

  useEffect(() => {
    if (editAddress) {
      // Khi có editAddress, cập nhật formData
      setFormData({
        phone: editAddress.phone,
        fullName: editAddress.name,
        city: editAddress.province,
        district: editAddress.district,
        ward: editAddress.wardCommune,
        address: editAddress.specificAddress,
        addressType: "home", // Cập nhật nếu cần
        setDefault: editAddress.status,
      });
    }
  }, [editAddress]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      // Lấy userId từ localStorage
      const userId = JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem("userData"), "secret-key").toString(CryptoJS.enc.Utf8)).user_id;

      // Gửi yêu cầu POST hoặc PUT tới API dựa trên việc chỉnh sửa hay thêm mới
      const response = editAddress
        ? await axios.put(`http://localhost:8080/api/addresses/${editAddress.addressId}`, {
            specificAddress: formData.address,
            wardCommune: formData.ward,
            district: formData.district,
            province: formData.city,
            name: formData.fullName,
            phone: formData.phone,
            status: formData.setDefault, // Đặt trạng thái địa chỉ
          })
        : await axios.post(`http://localhost:8080/api/addresses/${userId}`, {
            specificAddress: formData.address,
            wardCommune: formData.ward,
            district: formData.district,
            province: formData.city,
            name: formData.fullName,
            phone: formData.phone,
            status: formData.setDefault, // Đặt trạng thái địa chỉ
          });

      onSubmit(response.data); // Gửi dữ liệu địa chỉ khi thành công
      handleClose(); // Đóng modal sau khi xử lý
    } catch (error) {
      console.error("Error saving address:", error);
      // Xử lý lỗi nếu cần
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editAddress ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
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
          <Form.Group controlId="city">
            <Form.Control
              as="select"
              name="city"
              value={formData.city}
              onChange={handleChange}
            >
              <option>Chọn Tỉnh/ TP</option>
              <option>Cần Thơ</option>
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
              <option>Cái Răng</option>
              <option>Ninh Kiều</option>
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
              <option>Lê Bình</option>
              <option>Phú Thứ</option>
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
            Vui lòng chọn Tỉnh/TP, Quận/ Huyện và Phường/ xã trước khi nhập Số nhà + Tên Đường
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
          {editAddress ? "Cập nhật địa chỉ" : "Lưu địa chỉ"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddressModal;
