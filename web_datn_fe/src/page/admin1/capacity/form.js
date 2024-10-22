import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import "../../../assets/css/admin/formCapacity.css";

const FormCapacity = ({ onClose, editData }) => {
    const [formData, setFormData] = useState({ capacityId: '', value: '' });
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editData) {
            setFormData({ capacityId: editData.capacityId, value: editData.value }); // Sử dụng 'value' để lấy giá trị
            setIsUpdating(true);
        } else {
            setFormData({ capacityId: '', value: '' });
            setIsUpdating(false);
        }
    }, [editData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target; // Đảm bảo lấy đúng thuộc tính 'name' và 'value'
        setFormData({ ...formData, [name]: value }); // Cập nhật theo 'name'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.value) {
            setError('Giá trị dung tích là bắt buộc!');
            return;
        }

        if (isUpdating && (!formData.capacityId || isNaN(formData.capacityId))) {
            setError('ID dung tích không hợp lệ!');
            return;
        }

        try {
            const dataToSend = { value: Number(formData.value) }; // Chuyển đổi value sang số nguyên

            if (isUpdating) {
                await axios.put(`http://localhost:8080/api/capacities/${formData.capacityId}`, dataToSend);
                Swal.fire({
                    title: "Thành công!",
                    text: "Cập nhật dung tích thành công.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            } else {
                await axios.post('http://localhost:8080/api/capacities', dataToSend);
                Swal.fire({
                    title: "Thành công!",
                    text: "Thêm dung tích thành công.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            }

            setFormData({ capacityId: '', value: '' });
            setIsUpdating(false);
            onClose(true);
        } catch (error) {
            console.error('Lỗi khi thêm/cập nhật dung tích:', error);
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
                <label htmlFor="value" className="col-sm-4 col-form-label">Giá trị dung tích: </label>
                <div className="col-sm-8">
                    <input
                        type="number" // Đổi thành type="number" để người dùng chỉ nhập số
                        className="form-control"
                        placeholder="Nhập dung tích.."
                        id="value"
                        name="value"
                        value={formData.value} // Giá trị được liên kết với formData
                        onChange={handleInputChange} // Xử lý khi người dùng thay đổi input
                        required
                    />
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </div>
            <div className="row mb-3">
                <div className="col-sm-12">
                    <button type="submit" className="btn btn-primary custom-button">
                        {isUpdating ? 'Cập nhật ' : 'Thêm '}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default FormCapacity;
