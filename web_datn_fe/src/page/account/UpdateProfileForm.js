import { useState, useEffect } from "react";
import { apiClient } from "../../config/apiClient";
import { getUserDataById } from "../../services/authService";
import Swal from "sweetalert2"; // Thêm import SweetAlert2
import "../../assets/css/profile.css";

const UpdateProfileForm = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    phone: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const userData = getUserDataById();
  const userId = userData ? userData.user_id : null;

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    if (userId) {
      try {
        const response = await apiClient.get(`/user/profile`, {
          headers: {
            user_id: userId,
          },
        });
        setFormData({
          fullname: response.data.fullname,
          username: response.data.username,
          email: response.data.email,
          phone: response.data.phone,
        });
        setProfileImage(
          response.data.img
            ? `http://localhost:8080/assets/img/${response.data.img}`
            : "https://via.placeholder.com/150"
        );
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Lỗi khi tải dữ liệu người dùng",
        }).then(() => {
          window.location.reload(); // Reload the page after error notification
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo!",
        text: "Không tìm thấy thông tin người dùng",
      }).then(() => {
        window.location.reload(); // Reload the page after warning notification
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfileImage(URL.createObjectURL(file));
      setProfileImageFile(file);
    } else {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Vui lòng chọn file hình ảnh hợp lệ.",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không tìm thấy ID người dùng.",
      });
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append user details to formData
      formDataToSend.append("user", JSON.stringify({
        userId: userId, // Thêm userId vào object gửi lên
        fullname: formData.fullname,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
      }));

      // Append the image if it exists
      if (profileImageFile) {
        formDataToSend.append("img", profileImageFile);
      }

      await apiClient.put(`/user/profile`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          user_id: userId, // Kiểm tra xem userId có được truyền đúng ở headers
        },
      });

      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Cập nhật thông tin thành công!",
      }).then(() => {
        window.location.reload(); // Reload the page after success notification
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Lỗi khi cập nhật thông tin: " + (error.response?.data?.message || error.message),
      }).then(() => {
        window.location.reload(); // Reload the page after error notification
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
        <form className="profile-form" onSubmit={handleSubmit}>
            <h2>Cập Nhật Thông Tin</h2>
            <div className="profile-image-section">
                <label htmlFor="profileImage">
                    <img src={profileImage} alt="Profile" className="profile-image" />
                </label>
                <input
                    type="file"
                    id="profileImage"
                    onChange={handleImageChange}
                    accept="image/*"
                    hidden
                />
            </div>

            <div className="form-group">
                <input
                    type="text"
                    name="fullname"
                    placeholder="Họ và tên"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
            </button>
        </form>
    </div>
);
};

export default UpdateProfileForm;
