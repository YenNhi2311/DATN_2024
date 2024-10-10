import React, { Component } from "react";
import "../assets/css/bootstrap.min.css";
import "../assets/css/brand.css";
import "../assets/css/card.css";
import "../assets/css/category.css";
import "../assets/css/shop.css";
import "../assets/css/style.css";

export default class GioHang extends Component {
  render() {
    return (
      <div>
        {/* Single Page Header Start */}
        <div className="container-fluid page-header py-5">
          <h1 className="text-center text-white display-6">Cart</h1>
          <ol className="breadcrumb justify-content-center mb-0">
            <li className="breadcrumb-item">
              <a href="#">Home</a>
            </li>
            <li className="breadcrumb-item">
              <a href="#">Pages</a>
            </li>
            <li className="breadcrumb-item active text-white">Cart</li>
          </ol>
        </div>
        {/* Single Page Header End */}

        {/* Cart Start */}
        <div className="container-fluid py-5">
          <div className="container py-5">
            <form action="#">
              <div className="row g-5">
                <div className="col-md-12 col-lg-6 col-xl-8">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Sản phẩm</th>
                          <th scope="col">Tên sản phẩm</th>
                          <th scope="col">Giá</th>
                          <th scope="col">Số lượng</th>
                          <th scope="col">Thành tiền</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">
                            <div className="d-flex align-items-center">
                              <img
                                src={require("../assets/img/hasaki.png")}
                                className="img-fluid me-3 "
                                style={{ width: "80px", height: "80px" }}
                                alt="Sản phẩm 1"
                              />
                            </div>
                          </th>
                          <td>
                            <p className="mb-0 mt-4">Big Banana</p>
                          </td>
                          <td>
                            <p className="mb-0 mt-4">2.99 $</p>
                          </td>
                          <td>
                            <div
                              className="input-group quantity mt-4"
                              style={{ width: "100px" }}
                            >
                              <button className="btn btn-sm btn-minus rounded-circle bg-light border">
                                <i className="fa fa-minus"></i>
                              </button>
                              <input
                                type="text"
                                className="form-control form-control-sm text-center border-0"
                                value="1"
                              />
                              <button className="btn btn-sm btn-plus rounded-circle bg-light border">
                                <i className="fa fa-plus"></i>
                              </button>
                            </div>
                          </td>
                          <td>
                            <p className="mb-0 mt-4">2.99 $</p>
                          </td>
                          <td>
                            <button className="btn btn-md rounded-circle bg-light border mt-4">
                              <i className="fa fa-times text-danger"></i>
                            </button>
                          </td>
                        </tr>
                        {/* Add more rows as needed */}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="col-md-12 col-lg-6 col-xl-4 mt-5">
                  <div className="bg-light rounded">
                    <div className="p-4">
                      <h1 className="display-6 mb-4">Tổng hóa đơn</h1>
                      <div className="py-4 mb-4 border-top border-bottom d-flex justify-content-between">
                        <h5 className="mb-0 ps-4">Tổng tiền</h5>
                        <p className="mb-0 pe-4">$99.00</p>
                      </div>
                      <a
                        href="/ThanhToan"
                        className="btn border-secondary rounded-pill px-4 py-3 text-dark text-uppercase"
                      >
                        Thanh Toán
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* Cart End */}
      </div>
    );
  }
}
