import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import "../../../assets/css/admin/formCategory.css";

const FormCategory = ({ onClose, editData }) => {
    const [formData, setFormData] = useState({ categoryId: '', name: '', img: null });
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (editData) {
            const fetchCategoryData = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/categories/${editData.categoryId}`);
                    const categoryData = response.data;

                    setFormData({
                        categoryId: categoryData.categoryId,
                        name: categoryData.name,
                        img: categoryData.img,
                    });
                    setIsUpdating(true);
                    console.log('Hình ảnh được truyền từ ID:', categoryData.img);
                } catch (error) {
                    console.error('Lỗi khi lấy dữ liệu danh mục:', error);
                }
            };

            fetchCategoryData();
        } else {
            setFormData({ categoryId: '', name: '', img: null });
            setIsUpdating(false);
        }
    }, [editData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setFormData({ ...formData, img: file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name) {
            setError('Tên loại sản phẩm là bắt buộc!');
            return;
        }

        try {
            const dataToSend = new FormData();
            dataToSend.append('name', formData.name);
            if (formData.img) {
                dataToSend.append('img', formData.img);
            }

            if (isUpdating) {
                await axios.put(`http://localhost:8080/api/categories/${formData.categoryId}`, dataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                Swal.fire({
                    title: "Thành công!",
                    text: "Cập nhật loại sản phẩm thành công.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            } else {
                await axios.post('http://localhost:8080/api/categories', dataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                Swal.fire({
                    title: "Thành công!",
                    text: "Thêm loại sản phẩm thành công.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            }

            setFormData({ categoryId: '', name: '', img: null });
            setIsUpdating(false);
            onClose(true);
        } catch (error) {
            console.error('Lỗi khi thêm/cập nhật loại sản phẩm:', error);
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
                <label htmlFor="name" className="col-sm-4 col-form-label">Tên Loại sản phẩm: </label>
                <div className="col-sm-8">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tên loại sản phẩm..."
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </div>

            <div className="row mb-4 d-flex">
                <label htmlFor="img" className="col-sm-4 col-form-label">Hình ảnh: </label>
                <div className="col-sm-8">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => document.getElementById('imgUpload').click()}
                    >
                        Thêm ảnh
                    </button>
                    <input
                        type="file"
                        className="form-control d-none"
                        id="imgUpload"
                        accept="image/*"
                        onChange={handleImageChange}
                    />

                    <div className="image-preview-container">
                        {selectedFile ? (
                            <img
                                src={URL.createObjectURL(selectedFile)}
                                alt="Preview"   
                                className="image-preview"
                            />
                        ) : isUpdating && formData.img ? (
                            <img
                                src={`http://localhost:8080/assets/img/${formData.img}`}
                                alt="Category"
                                className="image-preview"
                            />
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-sm-12">
                    <button type="submit" className="btn btn-primary custom-button">
                        {isUpdating ? 'Cập nhật ' : 'Thêm Mới'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default FormCategory;
