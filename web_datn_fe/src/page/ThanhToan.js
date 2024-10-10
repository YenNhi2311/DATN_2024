import React, { useState } from "react";
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
  // Quản lý trạng thái mở/đóng của modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenAddressModal = () => {
    setIsAddressModalOpen(true);
    setIsModalOpen(false); // Ẩn Address Modal và hiện AddressModal
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
  };
  const handleAddressSubmit = (formData) => {
    console.log("Address Data Submitted:", formData);
    setIsAddressModalOpen(false);
    // Xử lý dữ liệu form khi người dùng bấm "Tiếp tục"
  };
  return (
    <>
      {/* Single Page Header start */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Checkout</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">
            <a href="#">Home</a>
          </li>
          <li className="breadcrumb-item">
            <a href="#">Pages</a>
          </li>
          <li className="breadcrumb-item active text-white">Checkout</li>
        </ol>
      </div>
      {/* Single Page Header End */}

      {/* Checkout Page Start */}
      <div className="container-fluid py-5">
        <div className="container py-5">
          <form action="#">
            <div className="row g-5">
              <div className="col-md-12 col-lg-6 col-xl-7">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Sản phẩm</th>
                        <th scope="col">Tên sản phẩm</th>
                        <th scope="col">Giá</th>
                        <th scope="col">Số lượng</th>
                        <th scope="col">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Sản phẩm */}
                      <tr>
                        <th scope="row">
                          <div className="d-flex align-items-center mt-2">
                            <img
                              src="img/vegetable-item-2.jpg"
                              className="img-fluid rounded-circle"
                              style={{ width: "70px", height: "70px" }}
                              alt="Sản phẩm 1"
                            />
                          </div>
                        </th>
                        <td className="py-3">Awesome Brocoli</td>
                        <td className="py-3">$69.00</td>
                        <td className="py-3">2</td>
                        <td className="py-3">$138.00</td>
                      </tr>
                      {/* Tổng kết */}
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
                            <p className="mb-0 text-dark">$414.00</p>
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
                            <p className="mb-0 text-dark">$20.00</p>
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
                            <p className="mb-0 text-dark">$20123.00</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-12 col-lg-6 col-xl-5 justify-content-center">
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
                          <img src="vnpay-icon.png" alt="VNPay" /> Thanh toán
                          VNPay
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
                        <img src="cod-icon.png" alt="COD" /> Thanh toán khi nhận
                        hàng (COD)
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
      {/* Checkout Page End */}
      <Address
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddAddress={handleOpenAddressModal}
      />

      {/* Hiển thị AddressModal khi isAddressModalOpen là true */}
      <AddressModal
        show={isAddressModalOpen}
        handleClose={handleCloseAddressModal}
        onSubmit={handleAddressSubmit}
      />
      {/* Modal nếu có thể */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Thay đổi địa chỉ</h2>
            {/* Form thay đổi địa chỉ */}
            <button onClick={handleCloseModal}>Đóng</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ThanhToan;
