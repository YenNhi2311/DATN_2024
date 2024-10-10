import React, { Component } from 'react';

export default class Foodter extends Component {
  render() {
    return (
      <div><div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
      <div className="container py-5">
        <div
          className="pb-4 mb-4"
          style={{ borderBottom: '1px solid rgba(226, 175, 24, 0.5)' }}
        >
          <div className="row g-4 mb-3">
            <div className="col-lg-3">
              <a href="#">
                <h1 className="text-primary mb-0">Nurture</h1>
              </a>
            </div>
            <div className="col-lg-6"></div>
          </div>
          <div className="position-relative mx-auto">
            <h5 className="text-blue">Về cửa hàng chúng tôi</h5>
            <p>
              Website của chúng tôi chuyên cung cấp các sản phẩm chăm sóc da và
              trang điểm từ những thương hiệu nổi tiếng trên thế giới. Với tiêu
              chí mang đến vẻ đẹp tự nhiên và an toàn, tất cả sản phẩm đều được
              chọn lọc kỹ càng, đảm bảo chất lượng và phù hợp với mọi
              loại da. Đội ngũ tư vấn viên nhiệt tình, giàu kinh nghiệm luôn sẵn
              sàng giúp bạn tìm ra sản phẩm phù hợp nhất cho nhu cầu của mình.
              Hãy đến với chúng tôi để trải nghiệm sự chăm sóc toàn diện và nâng
              tầm vẻ đẹp của bạn mỗi ngày!
            </p>
          </div>
        </div>
        <div className="row g-5">
          <div className="col-lg-3 col-md-6">
            <div className="d-flex flex-column text-start footer-item">
              <h4 className="text-light mb-3">Account</h4>
              <a className="btn-link" href="#">My Account</a>
              <a className="btn-link" href="#">Shop details</a>
              <a className="btn-link" href="#">Shopping Cart</a>
              <a className="btn-link" href="#">Wishlist</a>
              <a className="btn-link" href="#">Order History</a>
              <a className="btn-link" href="#">International Orders</a>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="d-flex flex-column text-start footer-item">
              <h4 className="text-light mb-3">Account</h4>
              <a className="btn-link" href="#">My Account</a>
              <a className="btn-link" href="#">Shop details</a>
              <a className="btn-link" href="#">Shopping Cart</a>
              <a className="btn-link" href="#">Wishlist</a>
              <a className="btn-link" href="#">Order History</a>
              <a className="btn-link" href="#">International Orders</a>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="d-flex flex-column text-start footer-item">
              <h4 className="text-light mb-3">Account</h4>
              <a className="btn-link" href="#">My Account</a>
              <a className="btn-link" href="#">Shop details</a>
              <a className="btn-link" href="#">Shopping Cart</a>
              <a className="btn-link" href="#">Wishlist</a>
              <a className="btn-link" href="#">Order History</a>
              <a className="btn-link" href="#">International Orders</a>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="footer-item">
              <h4 className="text-light mb-3">Contact</h4>
              <p>Address: 1429 Netus Rd, NY 48247</p>
              <p>Email: Example@gmail.com</p>
              <p>Phone: +0123 4567 8910</p>
              <p>Payment Accepted</p>
              <img src="img/payment.png" className="img-fluid" alt="Payment Methods" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
      
    );
  }
}
