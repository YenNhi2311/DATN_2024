import React, { useEffect, useState } from "react";
import "../assets/css/address.css";
import "../assets/css/addressmodal.css";
import "../assets/css/bootstrap.min.css";
import "../assets/css/brand.css";
import "../assets/css/card.css";
import "../assets/css/category.css";
import "../assets/css/checkout.css";
import "../assets/css/shop.css";
import "../assets/css/style.css";
import Address from "../component/web/Address";
import AddressModal from "../component/web/AddressModel";
import {
  addAddress,
  fetchAddresses as fetchAddressesFromService,
} from "../services/authService"; // Nhập các hàm cần thiết từ authService

const ThanhToan = ({ isOpen, onClose, onAddAddress, onAddressSelect }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const shippingFee = 20000;
  const userId = localStorage.getItem("userId");
  const [selectedCartItems, setSelectedCartItems] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const storedItems = localStorage.getItem("selectedCartItems");
    if (storedItems) {
      setSelectedCartItems(JSON.parse(storedItems));
    }
    fetchAddresses(); // Gọi hàm fetchAddresses để lấy địa chỉ
  }, []);

  const fetchAddresses = async () => {
    try {
      const addressData = await fetchAddressesFromService(); // Sử dụng hàm fetchAddresses từ authService
      const address = addressData.find((addr) => addr.status); // Tìm địa chỉ mặc định
      setAddresses(addressData);
      setDefaultAddress(address);
      setSelectedAddress(address);
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ:", error);
    }
  };

  const handleAddressSubmit = async (formData) => {
    try {
      const response = await addAddress(formData); // Sử dụng hàm addAddress từ authService
      setAddresses((prevAddresses) => [...prevAddresses, response]);
      setSelectedAddress(response);
      setIsAddressModalOpen(false);
      fetchAddresses();
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ:", error);
    }
  };

  const handleOpenModal = (event) => {
    event.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenAddressModal = (event) => {
    event.preventDefault();
    setIsAddressModalOpen(true);
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  const calculateTotalPrice = () => {
    return selectedCartItems.reduce(
      (acc, item) => acc + item.discountedPrice * item.quantity,
      0
    );
  };

  const calculateTotal = () => {
    return calculateTotalPrice() + shippingFee;
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    console.log("Địa chỉ được chọn:", address);
  };

  return (
    <>
      <div className="container-fluid page-header2 py-5">
        <div className="container-fluid py-5">
          <div className="container py-5">
            <form>
              <div className="row g-5">
                <div className="col-md-12 col-lg-6 col-xl-8">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Sản phẩm</th>
                          <th scope="col"></th>
                          <th scope="col">Giá</th>
                          <th scope="col">Số lượng</th>
                          <th scope="col">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCartItems.map((item) => (
                          <tr key={item.cartItemId}>
                            <th scope="row">
                              <img
                                src={require(`../assets/img/${item.productDetail?.img}`)}
                                className="img-fluid"
                                alt={
                                  item.productDetail?.name || "Product Image"
                                }
                                style={{ width: "80px", height: "80px" }}
                              />
                            </th>
                            <td className="py-3">
                              {item.productDetail?.product?.name}
                            </td>
                            <td className="py-3">
                              {item.discountedPrice.toLocaleString()}đ
                            </td>
                            <td className="py-3">{item.quantity}</td>
                            <td className="py-3">
                              {(
                                item.discountedPrice * item.quantity
                              ).toLocaleString()}
                              đ
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <th scope="row"></th>
                          <td className="py-3"></td>
                          <td className="py-3"></td>
                          <td className="py-3">
                            <p className="mb-0 text-dark py-2">
                              Tổng giá sản phẩm
                            </p>
                          </td>
                          <td className="py-3">
                            <div className="py-2 border-bottom border-top">
                              <p className="mb-0 text-dark">
                                {calculateTotalPrice().toLocaleString()}đ
                              </p>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row"></th>
                          <td className="py-3"></td>
                          <td className="py-3"></td>
                          <td className="py-3">
                            <p className="mb-0 text-dark py-2">
                              Phí vận chuyển
                            </p>
                          </td>
                          <td className="py-3">
                            <div className="py-2 border-bottom border-top">
                              <p className="mb-0 text-dark">
                                {shippingFee.toLocaleString()}đ
                              </p>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row"></th>
                          <td className="py-3"></td>
                          <td className="py-3"></td>
                          <td className="py-3">
                            <p className="mb-0 text-dark py-2">Tổng tiền</p>
                          </td>
                          <td className="py-3">
                            <div className="py-2 border-bottom border-top">
                              <p className="mb-0 text-dark">
                                {calculateTotal().toLocaleString()}đ
                              </p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="col-md-12 col-lg-6 col-xl-4 justify-content-center">
                  <div className="checkout-right">
                    <div className="address-section">
                      <h3>Địa chỉ nhận hàng</h3>
                      <div className="address-details">
                        {selectedAddress ? (
                          <div className="address-info">
                            <p>
                              <ul>
                                {selectedAddress.name} - {selectedAddress.phone}
                              </ul>
                              <ul>{selectedAddress.specificAddress}</ul>
                              <ul>
                                Phường {selectedAddress.wardCommune}, Quận{" "}
                                {selectedAddress.district}, Tỉnh{" "}
                                {selectedAddress.province}
                              </ul>
                            </p>
                            <button
                              className="change-btn"
                              onClick={handleOpenModal}
                            >
                              Thay đổi
                            </button>
                          </div>
                        ) : (
                          <div>
                            <p>Chưa có địa chỉ nào.</p>
                            <button
                              className="add-address-btn"
                              onClick={handleOpenAddressModal}
                            >
                              Thêm địa chỉ
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="payment-section">
                      <h3>Hình thức thanh toán</h3>
                      <div className="payment-method">
                        <div style={{ marginBottom: "15px" }}>
                          <input
                            type="radio"
                            id="vnpay"
                            name="payment-method"
                            value="vnpay"
                          />
                          <label htmlFor="vnpay">Thanh toán VNPay</label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="cod"
                            name="payment-method"
                            value="cod"
                            defaultChecked
                          />
                          <label htmlFor="cod">
                            Thanh toán khi nhận hàng (COD)
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="checkout-summary">
                      <button className="order-btn">Đặt hàng</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <Address
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddAddress={handleOpenAddressModal}
        onAddressSelect={handleAddressSelect}
      />
      <AddressModal
        show={isAddressModalOpen}
        handleClose={handleCloseAddressModal}
        onSubmit={handleAddressSubmit}
      />
    </>
  );
};

export default ThanhToan;
