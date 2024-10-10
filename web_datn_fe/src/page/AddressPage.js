import React, { useState } from "react";
import "../../assets/css/addresspage.css"; // Đảm bảo rằng bạn có file CSS
import { Link } from "react-router-dom";

const AddressPage = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Nguyen Van A",
      phone: "0901234567",
      address: "123 Nguyen Trai, Thanh Xuan, Ha Noi",
      status: true,
    },
    {
      id: 2,
      name: "Tran Thi B",
      phone: "0909876543",
      address: "456 Le Loi, District 1, HCM",
      status: false,
    },
  ]);
  const [newAddress, setNewAddress] = useState({
    phone: "",
    name: "",
    city: "",
    district: "",
    ward: "",
    street: "",
    isDefault: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = addresses.length + 1;
    const updatedAddresses = [
      ...addresses,
      {
        id: newId,
        ...newAddress,
        address: `${newAddress.street}, ${newAddress.ward}, ${newAddress.district}, ${newAddress.city}`,
      },
    ];
    setAddresses(updatedAddresses);
    setNewAddress({
      phone: "",
      name: "",
      city: "",
      district: "",
      ward: "",
      street: "",
      isDefault: false,
    });
  };

  return (
    <div className="address-container">
      {/* Danh sách địa chỉ bên trái */}
      <div className="address-list">
        <h2>Danh sách địa chỉ</h2>
        {addresses.map((address) => (
          <div key={address.id} className="address-item">
            <h4>{address.name}</h4>
            <p>{address.phone}</p>
            <p>{address.address}</p>

            {address.status === true && (
              <span className="address-status">Mặc định</span>
            )}
          </div>
        ))}
      </div>

      {/* Form nhập địa chỉ bên phải */}
      <div className="address-form">
        <h2>Thêm địa chỉ mới</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={newAddress.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={newAddress.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="Chọn Tỉnh/ TP"
            value={newAddress.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="district"
            placeholder="Chọn Quận/ Huyện"
            value={newAddress.district}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="ward"
            placeholder="Chọn Phường/ Xã"
            value={newAddress.ward}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="street"
            placeholder="Số nhà + Tên đường"
            value={newAddress.street}
            onChange={handleChange}
            required
          />
          <div className="default-address">
            <input
              type="checkbox"
              name="isDefault"
              checked={newAddress.isDefault}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  isDefault: e.target.checked,
                })
              }
            />{" "}
            <label>Đặt làm địa chỉ mặc định</label>
          </div>
          <button type="submit" className="submit-btn">
            Tiếp tục
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressPage;
