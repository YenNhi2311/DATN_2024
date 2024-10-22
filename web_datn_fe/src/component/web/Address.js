import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';

const Address = ({ isOpen, onClose, onAddAddress, onAddressSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchAddresses = async () => {
        try {
          const response = await axios.get("http://localhost:8080/api/addresses");
          console.log("Phản hồi từ API:", response.data);
          if (response.data && response.data.length > 0) {
            setAddresses(response.data);
            const defaultAddress = response.data.find(addr => addr.status);
            setSelectedAddressId(defaultAddress ? defaultAddress.addressId : response.data[0].addressId);
          }
        } catch (error) {
          console.error("Lỗi khi lấy địa chỉ:", error);
        }
      };

      fetchAddresses();
    }
  }, [isOpen]);

  const handleAddressSelect = (id) => {
    setSelectedAddressId(id);
  };

  const handleContinue = async () => {
    console.log("Nút Tiếp tục đã được nhấn.");
    console.log("selectedAddressId:", selectedAddressId);

    if (selectedAddressId) {
      const selectedAddress = addresses.find((addr) => addr.addressId === selectedAddressId);
      if (selectedAddress) {
        onAddressSelect(selectedAddress);

        // Cập nhật địa chỉ mặc định
        try {
          await axios.put(`http://localhost:8080/api/addresses/default`, {
            status: false,
          });

          await axios.put(`http://localhost:8080/api/addresses/${selectedAddressId}`, {
            ...selectedAddress,
            status: true,
          });

          console.log("Cập nhật địa chỉ mặc định thành công");
        } catch (error) {
          console.error("Lỗi khi cập nhật địa chỉ mặc định:", error.response ? error.response.data : error.message);
        }

        onClose(); // Đóng modal sau khi chọn xong
      } else {
        console.error("Không tìm thấy địa chỉ đã chọn.");
      }
    } else {
      console.error("Không có địa chỉ nào được chọn.");
    }
  };

  const handleDeleteAddress = async () => {
    if (!selectedAddressId) {
      toast.error("Vui lòng chọn một địa chỉ để xóa.");
      return;
    }

    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa địa chỉ này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có',
      cancelButtonText: 'Không'
    });

    // Kiểm tra xem người dùng đã xác nhận hay chưa
    if (result.isConfirmed) {
      try {
        // Gửi yêu cầu xóa địa chỉ
        await axios.delete(`http://localhost:8080/api/addresses/${selectedAddressId}`);

        // Cập nhật lại danh sách địa chỉ sau khi xóa
        setAddresses(prevAddresses => prevAddresses.filter(address => address.addressId !== selectedAddressId));
        setSelectedAddressId(null); // Đặt lại selectedAddressId sau khi xóa

        // Hiển thị thông báo thành công
        toast.success("Địa chỉ đã được xóa thành công.");
      } catch (error) {
        console.error("Lỗi khi xóa địa chỉ:", error.response ? error.response.data : error.message);
        toast.error("Đã xảy ra lỗi khi xóa địa chỉ.");
      }
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Địa chỉ nhận hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {addresses.length > 0 ? (
          <div className="address-list">
            {addresses.map((address) => (
              <div key={address.addressId} className="address-info">
                <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                <Form.Check
                  type="radio"
                  id={`address-${address.addressId}`}
                  name="address"
                  label={
                    <div>
                      <p className="address-name">
                        {address.name} - {address.phone}
                      </p>
                      <p className="address-detail">
                        {address.specificAddress}, {address.wardCommune}, {address.district}, {address.province}
                      </p>
                    </div>
                  }
                  checked={selectedAddressId === address.addressId}
                  onChange={() => handleAddressSelect(address.addressId)} // Sử dụng addressId
                />
                {address.status && (
                  <div className="address-tags">
                    <span className="default-tag">Địa chỉ mặc định</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Đang tải địa chỉ...</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onAddAddress}>
          Thêm địa chỉ mới
        </Button>
        <Button variant="danger" onClick={handleDeleteAddress} disabled={!selectedAddressId}>
          Xóa
        </Button>
        <Button variant="secondary" onClick={handleContinue}>
          Lưu Thay Đổi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Address;
