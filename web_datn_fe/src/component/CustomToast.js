import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS mặc định
// import '../assets/css/customToast.css'; // Import CSS tùy chỉnh

const CustomToast = ({ closeToast, message }) => (
  <div className="custom-toast">
    <div className="custom-toast-message">
      <span>{message}</span>
    </div>
    <div className="custom-toast-close">
      <span
        style={{ fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
        onClick={closeToast} // Đóng thông báo khi nhấp vào dấu ×
      >
        ×
      </span>
    </div>
  </div>
);

const notify = (message, type) => toast(<CustomToast message={message} />, {
  autoClose: 3000, // Thay đổi thời gian đóng tự động (3000ms = 3 giây)
  type: type || 'default', // Loại thông báo
  className: `Toastify__toast--${type}`, // Áp dụng lớp CSS tương ứng với loại thông báo
});

export { ToastContainer, notify };

