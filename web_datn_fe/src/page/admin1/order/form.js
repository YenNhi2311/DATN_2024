import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import { apiClient } from "../../../config/apiClient";

const FormOrder = ({ handleCloseForm, editData }) => {
    const [formData, setFormData] = useState({
        orderId: '',
        customerName: '',
        totalAmount: '',
        status: '',
        shippingFee: '',
        specificAddress: '',
        wardCommune: '',
        district: '',
        province: ''
    });
    const [orderDetails, setOrderDetails] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editData) {
            // Lấy dữ liệu người dùng từ editData
            const userId = editData.user?.userId;
    
            // Gọi API để lấy địa chỉ dựa trên userId
            if (userId) {
                apiClient.get(`http://localhost:8080/api/addresses?userId=${userId}`)
                    .then(response => {
                        const addressData = response.data;
                        if (addressData.length > 0) {
                            // Chọn địa chỉ đầu tiên từ danh sách (hoặc logic phù hợp)
                            const address = addressData[0];
                            setFormData({
                                ...formData,
                                specificAddress: address.specificAddress || '',
                                wardCommune: address.wardCommune || '',
                                district: address.district || '',
                                province: address.province || '',
                                phone: editData.user?.phone || ''
                            });
                        }
                    })
                    .catch(error => {
                        console.error("Lỗi khi lấy địa chỉ:", error);
                    });
            }
    
            // Set thông tin đơn hàng
            setFormData({
                orderId: editData.orderId || '',
                customerName: editData.user?.fullname || '',
                totalAmount: editData.total || '',
                status: editData.status || '',
                shippingFee: editData.shippingFee || '',
                phone: editData.user?.phone || ''
            });
            setOrderDetails(editData.orderDetails || []);
        }
    }, [editData]);
    

    const handleStatusChange = (e) => {
        setFormData({ ...formData, status: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const dataToSend = { status: formData.status };
            await apiClient.put(`http://localhost:8080/api/orders/${formData.orderId}/status`, dataToSend);

            Swal.fire({
                title: "Thành công!",
                text: "Cập nhật trạng thái đơn hàng thành công.",
                icon: "success",
                confirmButtonText: "OK",
            });

            handleCloseForm(true); // Đóng form và tải lại dữ liệu
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
            Swal.fire({
                title: "Lỗi!",
                text: "Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row mb-4">
                <label htmlFor="orderId" className="col-sm-4 col-form-label">ID Đơn Hàng: </label>
                <div className="col-sm-8">
                    <input
                        type="text"
                        className="form-control"
                        id="orderId"
                        name="orderId"
                        value={formData.orderId}
                        readOnly
                    />
                </div>
            </div>
            
            <div className="row mb-4">
                <label htmlFor="customerName" className="col-sm-4 col-form-label">Tên Khách Hàng: </label>
                <div className="col-sm-8">
                    <input
                        type="text"
                        className="form-control"
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        readOnly
                    />
                </div>
            </div>
            
            <div className="row mb-4">
                <label htmlFor="totalAmount" className="col-sm-4 col-form-label">Tổng Tiền: </label>
                <div className="col-sm-8">
                    <input
                        type="text"
                        className="form-control"
                        id="totalAmount"
                        name="totalAmount"
                        value={formData.totalAmount}
                        readOnly
                    />
                </div>
            </div>

            <div className="row mb-4">
                <label htmlFor="address" className="col-sm-4 col-form-label">Địa chỉ: </label>
                <div className="col-sm-8">
                    <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        // value={formData.address}
                        value={`${formData.specificAddress}, ${formData.wardCommune}, ${formData.district}, ${formData.province}`}
                        readOnly
                    />
                </div>
            </div>

            <div className="row mb-4">
                <label htmlFor="phone" className="col-sm-4 col-form-label">Số Điện Thoại: </label>
                <div className="col-sm-8">
                    <input
                        type="text"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        readOnly
                    />
                </div>
            </div>

            <div className="row mb-4">
                <label htmlFor="status" className="col-sm-4 col-form-label">Trạng Thái: </label>
                <div className="col-sm-8">
                    <select
                        className="form-control"
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleStatusChange}
                    >
                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                        <option value="Đã xác nhận">Đã xác nhận</option>
                        <option value="Chờ vận chuyển">Chờ vận chuyển</option>
                        <option value="Đã giao">Đã giao</option>
                    </select>
                </div>
            </div>

            {error && <div style={{ color: 'red' }}>{error}</div>}
            
            <div className="row mb-3">
                <div className="col-sm-12">
                    <button type="submit" className="btn btn-primary custom-button">
                        Cập nhật trạng thái
                    </button>
                </div>
            </div>
        </form>
    );
};

export default FormOrder;