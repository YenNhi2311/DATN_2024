import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import "../../../assets/css/admin/formSkinType.css";

const FormSkinType = ({ handleCloseForm, editData }) => {
    // Khởi tạo state formData để lưu trữ thông tin form (skintypeId và name)
    const [formData, setFormData] = useState({ skintypeId: '', name: '' });
    // Khởi tạo state để xác định xem đang trong chế độ cập nhật hay thêm mới
    const [isUpdating, setIsUpdating] = useState(false);
    // Khởi tạo state để lưu trữ thông báo lỗi
    const [error, setError] = useState('');

    // Sử dụng useEffect để cập nhật form khi có dữ liệu editData (chuyển sang chế độ cập nhật)
    useEffect(() => {
        if (editData) {
            // Khi editData có giá trị, form sẽ chuyển sang chế độ cập nhật
            setFormData({ skintypeId: editData.skintypeId, name: editData.name });
            setIsUpdating(true);
        } else {
            // Nếu không có editData (chế độ thêm mới), form được reset lại
            setFormData({ skintypeId: '', name: '' });
            setIsUpdating(false); // Đặt chế độ là thêm mới
        }
    }, [editData]);  // useEffect sẽ chạy lại khi editData thay đổi


    // Hàm xử lý thay đổi giá trị của form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    

    // Hàm xử lý khi form được submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn không cho trang reload
        setError(''); // Reset lại thông báo lỗi

        // Kiểm tra dữ liệu nhập vào: Nếu name bị thiếu, hiển thị lỗi
        if (!formData.name) {
            setError('Tên loại da là bắt buộc!');
            return;
        }

        // Nếu đang ở chế độ cập nhật, kiểm tra ID hợp lệ
        if (isUpdating && (!formData.skintypeId || isNaN(formData.skintypeId))) {
            setError('ID loại da không hợp lệ!');
            return;
        }

        try {
            const dataToSend = { name: formData.name }; // Chuẩn bị dữ liệu để gửi đi
            if (isUpdating) {
                // Gọi API PUT để cập nhật loại da nếu đang trong chế độ cập nhật
                await axios.put(`http://localhost:8080/api/skintypes/${formData.skintypeId}`, dataToSend);
                Swal.fire({
                    title: "Thành công!",
                    text: "Cập nhật loại da thành công.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            } else {
                await axios.post('http://localhost:8080/api/skintypes', dataToSend);
                Swal.fire({
                    title: "Thành công!",
                    text: "Thêm loại da thành công.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            }

            // Reset form về trạng thái ban đầu sau khi thêm/cập nhật thành công
            setFormData({ skintypeId: '', name: '' });
            setIsUpdating(false); // Đặt lại chế độ thêm mới
            handleCloseForm(true) // Đóng form và báo hiệu reload dữ liệu cho bảng bên ngoài
        } catch (error) {
            console.error('Lỗi khi thêm/cập nhật loại da:', error);
            Swal.fire({
                title: "Lỗi!",
                text: "Có lỗi xảy ra khi xử lý. Vui lòng thử lại.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row mb-4">
                <label htmlFor="name" className="col-sm-4 col-form-label">Tên Loại Da: </label>
                <div className="col-sm-8">
                    <input
                        type="text"
                        className="form-control"
                         placeholder="Nhập tên loại da.."
                        id="name"
                        name="name"
                        value={formData.name} // Giá trị được liên kết với formData
                        onChange={handleInputChange} // Xử lý khi người dùng thay đổi input
                        required
                    />
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </div>
            {/* Hiển thị thông báo lỗi nếu có */} 
            <div className="row mb-3">
                <div className="col-sm-12" >
                    <button type="submit" className="btn btn-primary custom-button">
                        {/* Đổi nhãn nút bấm tùy theo chế độ */}
                        {isUpdating ? 'Cập nhật ' : 'Thêm '}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default FormSkinType;
