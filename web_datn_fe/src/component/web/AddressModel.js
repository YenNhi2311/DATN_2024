import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import "../../assets/css/addressmodal.css";
import { apiClient } from "../../config/apiClient";
import { getUserDataById } from "../../services/authService";

const GHN_TOKEN = "aa348b98-8f64-11ef-98a2-5ee1cfd5578a";

const AddressModal = ({ show, handleClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    provinceId: "", // Use provinceId instead of province
    districtId: "", // Use districtId instead of district
    wardId: "",     // Use wardId instead of ward
    specificAddress: "",
    setDefault: false,
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);

  const userData = getUserDataById();
  const userId = userData ? userData.user_id : null;

  useEffect(() => {
    fetchProvinces();

    if (initialData) {
      setFormData({
        phone: initialData.phone,
        name: initialData.name,
        provinceId: initialData.provinceId || "",
        districtId: initialData.districtId || "",
        wardId: initialData.wardId || "",
        specificAddress: initialData.specificAddress,
        setDefault: initialData.setDefault || false,
      });
      fetchDistricts(initialData.provinceId);
      fetchWards(initialData.districtId);
    }
  }, [initialData]);

  const fetchProvinces = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", {
        headers: { "Content-Type": "application/json", "Token": GHN_TOKEN },
      });
      if (response.data && response.data.data) {
        setProvinces(response.data.data);
      } else {
        Swal.fire("Error", "Không có dữ liệu tỉnh!", "error");
      }
    } catch (error) {
      console.error("Error fetching provinces", error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchDistricts = async (provinceId) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`, {
        headers: { "Content-Type": "application/json", "Token": GHN_TOKEN },
      });
      if (response.data && response.data.data) {
        setDistricts(response.data.data);
      } else {
        Swal.fire("Error", "Không có dữ liệu quận/huyện!", "error");
      }
    } catch (error) {
      // console.error("Error fetching districts", error);
      console.error("Error fetching districts", error.response ? error.response.data : error.message);  
    } finally {
      setLoading(false);
    }
  };
  
  const fetchWards = async (districtId) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`, {
        headers: { "Content-Type": "application/json", "Token": GHN_TOKEN },
      });
      if (response.data && response.data.data) {
        setWards(response.data.data);
      } else {
        Swal.fire("Error", "Không có dữ liệu phường/xã!", "error");
      }
    } catch (error) {
      // console.error("Error fetching wards", error);
      console.error("Error fetching wards", error.response ? error.response.data : error.message);  
    } finally {
      setLoading(false);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "provinceId") {
      fetchDistricts(value);
      setFormData((prev) => ({ ...prev, districtId: "", wardId: "" })); // Reset district and ward
    }
    if (name === "districtId") {
      fetchWards(value);
      setFormData((prev) => ({ ...prev, wardId: "" })); // Reset ward
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedProvince = provinces.find((p) => p.ProvinceID.toString() === formData.provinceId);
    const selectedDistrict = districts.find((d) => d.DistrictID.toString() === formData.districtId);
    const selectedWard = wards.find((w) => w.WardCode === formData.wardId);

    const addressData = {
      specificAddress: formData.specificAddress,
      province: formData.provinceId,
      provinceName: selectedProvince ? selectedProvince.ProvinceName : "",
      district: formData.districtId,
      districtName: selectedDistrict ? selectedDistrict.DistrictName : "",
      ward: formData.wardId,
      wardName: selectedWard ? selectedWard.WardName : "",
      name: formData.name,
      phone: formData.phone,
      userId: userId,
    };
    console.log("Provinces:", provinces);
    console.log("Districts:", districts);
    console.log("Ward:", wards);
    console.log("Selected Province:", selectedProvince);
    console.log("Selected District:", selectedDistrict);
    console.log("Selected Ward:", selectedWard);
    console.log("Submitting Address Data:", addressData);
    onSubmit(addressData);
};

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Tên người nhận</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPhone">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formProvince">
            <Form.Label>Tỉnh/Thành phố</Form.Label>
            <Form.Control
              as="select"
              name="provinceId" // Giữ ID tỉnh để gửi
              value={formData.provinceId}
              onChange={handleChange}
              required
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {provinces.map((province) => (
                <option key={province.ProvinceID} value={province.ProvinceID}>
                  {province.ProvinceName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formDistrict">
            <Form.Label>Quận/Huyện</Form.Label>
            <Form.Control
              as="select"
              name="districtId" // Giữ ID quận để gửi
              value={formData.districtId}
              onChange={handleChange}
              required
            >
              <option value="">Chọn quận/huyện</option>
              {districts.map((district) => (
                <option key={district.DistrictID} value={district.DistrictID}>
                  {district.DistrictName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formWard">
            <Form.Label>Phường/Xã</Form.Label>
            <Form.Control
              as="select"
              name="wardId" // Giữ ID phường để gửi
              value={formData.wardId}
              onChange={handleChange}
              required
            >
              <option value="">Chọn phường/xã</option>
              {wards.map((ward) => (
                <option key={ward.WardCode} value={ward.WardCode}>
                  {ward.WardName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formSpecificAddress">
            <Form.Label>Địa chỉ cụ thể</Form.Label>
            <Form.Control
              type="text"
              name="specificAddress"
              value={formData.specificAddress}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formSetDefault">
            <Form.Check
              type="checkbox"
              name="setDefault"
              label="Đặt làm địa chỉ mặc định"
              checked={formData.setDefault}
              onChange={(e) => setFormData({ ...formData, setDefault: e.target.checked })}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Đang xử lý..." : "Lưu địa chỉ"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

AddressModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default AddressModal;
