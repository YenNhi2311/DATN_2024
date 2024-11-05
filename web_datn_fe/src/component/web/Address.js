import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import AddressModal from "../../component/web/AddressModel";
import { apiClient } from "../../config/apiClient";
import { getUserDataById } from "../../services/authService";

const Address = ({ isOpen, onClose }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userData = getUserDataById();
  const userId = userData ? userData.user_id : null;
  const [selectedAddressIds, setSelectedAddressIds] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchAddresses();
    } else {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo!",
        text: "Không tìm thấy thông tin người dùng.",
      });
    }
  }, [userId]);

  const fetchAddresses = async () => {
    try {
      const response = await apiClient.get("/api/ghn/addresses", {
        headers: {
          user_id: userId,
          "Content-Type": "application/json",
        },
      });
      setAddresses(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể tải danh sách địa chỉ.",
      });
    }
  };

  const openModal = (address) => {
    setSelectedAddress(address);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAddress(null);
  };

  const handleAddAddress = async (newAddress) => {
    await handleAddressRequest('post', '/api/ghn/addresses', newAddress);
  };

  const handleUpdateAddress = async (updatedAddress) => {
    if (selectedAddress) {
      await handleAddressRequest('put', `/api/ghn/addresses/${selectedAddress.id}`, updatedAddress);
      closeModal();
    }
  };

  const handleAddressRequest = async (method, url, addressData) => {
    try {
      const response = await apiClient[method](url, {
        ...addressData,
        userId: userId,
      }, {
        headers: {
          user_id: userId,
          "Content-Type": "application/json",
        },
      });

      if (method === 'post') {
        setAddresses((prevAddresses) => [...prevAddresses, response.data]);
        Swal.fire("Thành công", "Địa chỉ mới đã được thêm.", "success");
      } else if (method === 'put') {
        setAddresses((prevAddresses) =>
          prevAddresses.map((address) =>
            address.id === selectedAddress.id ? { ...address, ...addressData } : address
          )
        );
        Swal.fire("Thành công", "Địa chỉ đã được cập nhật.", "success");
      }
    } catch (error) {
      console.error(`Lỗi khi ${method === 'post' ? 'thêm' : 'cập nhật'} địa chỉ:`, error);
      Swal.fire("Lỗi", `Không thể ${method === 'post' ? 'thêm' : 'cập nhật'} địa chỉ mới.`, "error");
    }
  };

  const handleDeleteSelectedAddresses = async () => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa?',
      text: "Bạn có chắc chắn muốn xóa các địa chỉ đã chọn?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có',
      cancelButtonText: 'Không',
    });

    if (result.isConfirmed) {
      try {
        await Promise.all(selectedAddressIds.map(id =>
          apiClient.delete(`/api/ghn/addresses`, {
            data: { id },
            headers: {
              user_id: userId,
              "Content-Type": "application/json",
            },
          })
        ));
        setAddresses((prevAddresses) =>
          prevAddresses.filter((address) => !selectedAddressIds.includes(address.id))
        );
        setSelectedAddressIds([]);
        Swal.fire("Thành công", "Các địa chỉ đã được xóa.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa địa chỉ:", error);
        Swal.fire("Lỗi", "Không thể xóa các địa chỉ.", "error");
      }
    }
  };

  const handleRadioChange = (address) => {
    setSelectedAddress(address);
    const isSelected = selectedAddressIds.includes(address.id);
    if (isSelected) {
      setSelectedAddressIds(selectedAddressIds.filter(id => id !== address.id));
    } else {
      setSelectedAddressIds([...selectedAddressIds, address.id]);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
          <Modal.Title>Địa chỉ nhận hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div key={address.id} className="address-info">
                <Form.Check
                  type="radio"
                  checked={selectedAddress?.id === address.id}
                  onChange={() => handleRadioChange(address)}
                  
                />
                <label>
                  {address.name} - {address.phone}
                  <p className="address-detail">
                    {address.specificAddress}, {address.wardName}, {address.districtName}, {address.provinceName}
                  </p>
                  {address.status && (
                    <div className="address-tags">
                      <span className="default-tag">Địa chỉ mặc định</span>
                    </div>
                  )}
                </label>
              </div>
            ))
          ) : (
            <p>Chưa có địa chỉ nào.</p>
          )}
      </Modal.Body>
      <Modal.Footer>
        <Link className="add-address-btn" onClick={() => openModal(null)}>
          Thêm địa chỉ mới
        </Link>
        <Link className="add-address-btn" onClick={() =>  { /* Handle continue action */ }}>
          Lưu Thay Đổi
        </Link>
        <Link className="add-address-btn" onClick={() => openModal(selectedAddress)}>
          Cập nhật
        </Link>
        <Link className="add-address-btn" onClick={handleDeleteSelectedAddresses}>
          Xóa địa chỉ đã chọn
        </Link>
      </Modal.Footer>

      <AddressModal
        show={isModalOpen}
        handleClose={closeModal}
        onSubmit={selectedAddress ? handleUpdateAddress : handleAddAddress}
        initialData={selectedAddress ? {
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          specificAddress: selectedAddress.specificAddress,
          provinceId: selectedAddress.province,
          districtId: selectedAddress.district,
          wardId: selectedAddress.ward,
        } : {}}
      />
    </Modal>
  );
};

export default Address;
