import { Link } from "react-router-dom";

const Address = ({ isOpen, onClose, onAddAddress }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Địa chỉ nhận hàng</h3>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="address-info">
            <p className="address-name">Vinh - 0834196375</p>
            <p className="address-detail">
              Ấp Nhà Máy B, Xã Tân Phú, Huyện Thới Bình, Cà Mau
            </p>
            <div className="address-tags">
              <span className="default-tag">Địa chỉ mặc định</span>
            </div>
          </div>
          <hr />
          <div className="modal-footer">
            <Link className="add-address-btn" onClick={onAddAddress}>
              Thêm địa chỉ mới
            </Link>
            <Link className="cancel-btn" onClick={onClose}>
              Hủy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;
