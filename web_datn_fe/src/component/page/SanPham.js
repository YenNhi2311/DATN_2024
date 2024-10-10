import React, { Component } from 'react';

export default class SanPham extends Component {
  handleAddToCart = (event) => {
    event.preventDefault();
    // Thực hiện hành động thêm vào giỏ hàng ở đây
  };

  render() {
    return (
      <div className="m-3 rounded">
      <h1 className="m-3 rounded">Sản phẩm bán chạy trong tháng</h1>
        <hr />
        <div className="m-3 rounded">
          {Array(4).fill().map((_, index) => (
            <div key={index} className="col-md-6 col-lg-4 col-xl-3 col-sm-6 col-6">
              <div className="pro-container">
                <div className="pro">
                  <span className="sale">30%</span>
                  <img src={require('../../assets/img/fruite-item-2.jpg')} alt="Product Name" />
                  <div className="icon-container">
                    <a className="btn" onClick={this.handleAddToCart}>
                      <i className="fas fa-shopping-cart"></i>
                    </a>
                    <a href="/product/1">
                      <i className="fas fa-eye"></i>
                    </a>
                  </div>
                  <div className="des">
                    <span>Product Brand</span>
                    <h6>Product Name</h6>
                    <div className="star">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="far fa-star"></i>
                    </div>
                    <div className="price">
                      <h4 className="sale-price">300,000 đ</h4>
                      <h4>
                        <s>400,000 đ</s>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
