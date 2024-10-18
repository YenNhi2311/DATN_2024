import { useState, useEffect } from "react";
import { apiClient, getUserData } from "../../services/authService";
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Lấy dữ liệu người dùng từ localStorage
  const userData = getUserData();
  const userId = userData ? userData.user_id : null; // Sử dụng đúng trường user_id

  useEffect(() => {
    fetchUserData(); // Gọi hàm này khi component được mount
  }, [userId]);

  const fetchUserData = async () => {
    if (userId) {
      try {
        const response = await apiClient.get(`/api/user/profile`, {
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
        setProfileImage(response.data.img || "https://via.placeholder.com/150");
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu người dùng: ", error);
        setError("Lỗi khi tải dữ liệu người dùng");
      }
    } else {
      setError("Không tìm thấy thông tin người dùng");
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
      setError("Vui lòng chọn file hình ảnh hợp lệ.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
        setLoading(true);
        const formDataToSend = new FormData();
        formDataToSend.append("user", new Blob([JSON.stringify(formData)], { type: "application/json" }));

        if (profileImageFile) {
            formDataToSend.append("img", profileImageFile);
            console.log("Form Data: ", Array.from(formDataToSend.entries()));
        }

        console.log("User ID: ", userId); // Thêm dòng này để kiểm tra ID
        const response = await apiClient.put(`/api/user/profile`, formDataToSend, {
            headers: {
                "Content-Type": "multipart/form-data",
                user_id: userId,
            },
        });

        setSuccess("Cập nhật thông tin thành công!");
        fetchUserData(); // Gọi hàm này để làm mới dữ liệu người dùng
    } catch (error) {
        setError("Lỗi khi cập nhật thông tin: " + (error.response?.data?.message || error.message));
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="profile-container">
      <form className="profile-form" onSubmit={handleSubmit}>
        <h2>Cập nhật thông tin</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
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
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={formData.username}
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
