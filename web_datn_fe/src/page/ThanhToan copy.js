import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../assets/css/address.css";
import "../assets/css/bootstrap.min.css";
import "../assets/css/brand.css";
import "../assets/css/card.css";
import "../assets/css/category.css";
import "../assets/css/checkout.css";
import "../assets/css/shop.css";
import "../assets/css/style.css";
import Address from "../component/web/Address";
import AddressModal from "../component/web/AddressModel";

const ThanhToan = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const shippingFee = 200000; // Giả sử phí vận chuyển là 20.000
  const { userId } = useParams();

  useEffect(() => {
    const fetchCartItems = async () => {
      console.log("Fetching cart items for user ID:", userId);
      try {
        const response = await axios.get(`http://localhost:8080/api/cart/items/${userId}`);
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
  
    fetchCartItems();
  }, [userId]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenAddressModal = () => {
    setIsAddressModalOpen(true);
    setIsModalOpen(false); // Ẩn modal địa chỉ
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  const handleAddressSubmit = (formData) => {
    console.log("Address Data Submitted:", formData);
    setIsAddressModalOpen(false);
    // Xử lý dữ liệu form khi người dùng bấm "Tiếp tục"
  };

  const calculateTotal = () => {
    const total = cartItems.reduce((acc, item) => acc + (item.discountedPrice * item.quantity), 0);
    return total + shippingFee; 
  };

  return (
    <>
      <div className="container-fluid page-header py-5">
        {/* Header Content if any */}
      </div>

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
                      {cartItems.map((item) => (
                        <tr key={item.cartItemId}>
                          <th scope="row">
                            <img
                              src={require(`../assets/img/${item.productDetail?.img}`)}
                              className="img-fluid"
                              alt={item.productDetail?.name || "Product Image"}
                              style={{ width: "80px", height: "80px" }}
                            />
                          </th>
                          <td className="py-3">{item.productDetail?.product?.name}</td>
                          <td className="py-3">{item.discountedPrice.toLocaleString()}đ</td>
                          <td className="py-3">{item.quantity}</td>
                          <td className="py-3">{(item.discountedPrice * item.quantity).toLocaleString()}đ</td>
                        </tr>
                      ))}
                      {/* Tổng kết */}
                      <tr>
                        <th scope="row"></th>
                        <td className="py-3"></td>
                        <td className="py-3"></td>
                        <td className="py-3">
                          <p className="mb-0 text-dark py-2">Tổng giá sản phẩm</p>
                        </td>
                        <td className="py-3">
                          <div className="py-2 border-bottom border-top">
                            <p className="mb-0 text-dark">{(calculateTotal() - shippingFee).toLocaleString()}đ</p>
                          </div>
                        </td>
                      </tr>
                      {/* Phí vận chuyển */}
                      <tr>
                        <th scope="row"></th>
                        <td className="py-3"></td>
                        <td className="py-3"></td>
                        <td className="py-3">
                          <p className="mb-0 text-dark py-2">Phí vận chuyển</p>
                        </td>
                        <td className="py-3">
                          <div className="py-2 border-bottom border-top">
                            <p className="mb-0 text-dark">{shippingFee.toLocaleString()}đ</p>
                          </div>
                        </td>
                      </tr>
                      {/* Tổng tiền */}
                      <tr>
                        <th scope="row"></th>
                        <td className="py-3"></td>
                        <td className="py-3"></td>
                        <td className="py-3">
                          <p className="mb-0 text-dark py-2">Tổng tiền</p>
                        </td>
                        <td className="py-3">
                          <div className="py-2 border-bottom border-top">
                            <p className="mb-0 text-dark">{calculateTotal().toLocaleString()}đ</p>
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
                      <span className="address-type">Nhà riêng</span>
                      <div className="address-info">
                        <p>Vinh - 0834196375</p>
                        <p>Ấp Nhà Máy B, Xã Tân Phú, Huyện Thới Bình, Cà Mau</p>
                      </div>
                      {/* Thay đổi địa chỉ */}
                      <button className="change-btn" onClick={handleOpenModal}>
                        Thay đổi
                      </button>
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
                        <label htmlFor="vnpay">
                          <img src="vnpay-icon.png" alt="VNPay" /> Thanh toán VNPay
                        </label>
                      </div>
                      <input
                        type="radio"
                        id="cod"
                        name="payment-method"
                        value="cod"
                        defaultChecked
                      />
                      <label htmlFor="cod">
                        <img src="cod-icon.png" alt="COD" /> Thanh toán khi nhận hàng (COD)
                      </label>
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

      {/* Address Modal */}
      <Address
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddAddress={handleOpenAddressModal}
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
