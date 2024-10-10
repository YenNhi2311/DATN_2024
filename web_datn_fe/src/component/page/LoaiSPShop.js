import React, { Component } from 'react';

const handleAddToCart = (event) => {
    // Xử lý thêm vào giỏ hàng
};

export default class LoaiSPShop extends Component {
    render() {
        return (
            <div className="container py-5">
                <div className="row g-4">
                    <div className="col-lg-2">
                        <div className="row g-3">

                            <div className="col-lg-12">
                                <div className="mb-3">
                                    <ul className="brand-list">
                                        <h3>Thương hiệu</h3>
                                        <div className="brand-buttons">
                                            <button className="brand-btn">La Roche-Posay</button>
                                            <button className="brand-btn">Vichy</button>
                                            <button className="brand-btn">Anessa</button>
                                        </div>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-lg-12">
                                <div className="mb-3">
                                    <ul className="brand-list">
                                        <h4>Loại da</h4>
                                        <li>La Roche-Posay </li>
                                        <li>L'Oreal </li>
                                        <li>Eucerin </li>
                                        <li>Naris Cosmetics </li>
                                        <li>Cocoon </li>
                                        <li>Bioderma </li>
                                        <li>Hada Labo </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-lg-12">
                                <div className="mb-3">
                                    <div className="filter-category">
                                        <h4>Loại sản phẩm</h4>
                                        <label>
                                            <input type="checkbox" value="cleanser" /> Sữa rửa mặt
                                        </label>
                                        <label>
                                            <input type="checkbox" value="moisturizer" /> Dưỡng ẩm
                                        </label>
                                        <label>
                                            <input type="checkbox" value="sunscreen" /> Chống nắng
                                        </label>
                                        <label>
                                            <input type="checkbox" value="serum" /> Serum
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12"></div>

                            <div className="filter-category">
                                <h4>Khoảng giá</h4>
                                <div className="price-range-inputs">
                                    <input type="number" placeholder="₫ TỪ" min="0" />
                                    <input type="number" placeholder="₫ ĐẾN" min="0" />
                                </div>
                                <button className="apply-button">Áp dụng</button>
                            </div>

                        </div>
                    </div>

                    <div className="col-lg-10">
                        <div className="container">
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="d-flex">
                                        <input type="text" className="form-control" placeholder="Tìm sản phẩm..." id="searchInput" />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="d-flex">
                                        <select className="form-control" id="sortSelect">
                                            <option value="Nổi bật">Nổi bật</option>
                                            <option value="Giảm giá">Giảm giá</option>
                                            <option value="Thấp đến cao">Thấp đến cao</option>
                                            <option value="Cao đến thấp">Cao đến thấp</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                     
                        <div class="col-lg-12">
                            <div class="tab-content">
                                <div id="tab-1"
                                    class="tab-pane fade show p-0 active">
                                    <div class="row g-4">
                                        <div class="col-lg-12">
                                            <div class="product-list row g-4">
                                                <div
                                                    class="col-md-9 col-lg-4 col-xl-3 col-sm-6 col-6">
                                                    <div class="pro-container">
                                                        <div class="pro">
                                                            <span
                                                                class="sale">30%</span>
                                                         
                                                               <img src={require('../../assets/img/fruite-item-1.jpg')}
                                                                alt="Product Name" />
                                                            <div
                                                                class="icon-container">
                                                                <a class="btn"
                                                                    onclick="handleAddToCart(event)">
                                                                    <i
                                                                        class="fas fa-shopping-cart"></i>
                                                                </a>
                                                                <a
                                                                    href="/product/1">
                                                                    <i
                                                                        class="fas fa-eye"></i>
                                                                </a>
                                                            </div>
                                                            <div class="des">
                                                                <div
                                                                    class="price">
                                                                    <h4
                                                                        class="sale-price">300,000
                                                                        đ
                                                                    </h4>
                                                                    <h4><s>400,000
                                                                            đ</s></h4>
                                                                </div>
                                                                <span>Product
                                                                    Brand</span>
                                                                <h6>Product Name
                                                                </h6>
                                                                <div
                                                                    class="star">
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="far fa-star"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    class="col-md-6 col-lg-4 col-xl-3 col-sm-6 col-6">
                                                    <div class="pro-container">
                                                        <div class="pro">
                                                            <span
                                                                class="sale">30%</span>
                                                                  <img src={require('../../assets/img/fruite-item-1.jpg')}
                                                                alt="Product Name" />
                                                            <div
                                                                class="icon-container">
                                                                <a class="btn"
                                                                    onclick="handleAddToCart(event)">
                                                                    <i
                                                                        class="fas fa-shopping-cart"></i>
                                                                </a>
                                                                <a
                                                                    href="/product/1">
                                                                    <i
                                                                        class="fas fa-eye"></i>
                                                                </a>
                                                            </div>
                                                            <div class="des">
                                                                <div
                                                                    class="price">
                                                                    <h4
                                                                        class="sale-price">300,000
                                                                        đ
                                                                    </h4>
                                                                    <h4><s>400,000
                                                                            đ</s></h4>
                                                                </div>
                                                                <span>Product
                                                                    Brand</span>
                                                                <h6>Product Name
                                                                </h6>
                                                                <div
                                                                    class="star">
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="far fa-star"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                      
                                             
                                                <div
                                                    class="col-md-6 col-lg-4 col-xl-3 col-sm-6 col-6">
                                                    <div class="pro-container">
                                                        <div class="pro">
                                                            <span
                                                                class="sale">30%</span>
                                                                 <img src={require('../../assets/img/fruite-item-1.jpg')}
                                                                alt="Product Name" />
                                                            <div
                                                                class="icon-container">
                                                                <a class="btn"
                                                                    onclick="handleAddToCart(event)">
                                                                    <i
                                                                        class="fas fa-shopping-cart"></i>
                                                                </a>
                                                                <a
                                                                    href="/product/1">
                                                                    <i
                                                                        class="fas fa-eye"></i>
                                                                </a>
                                                            </div>
                                                            <div class="des">
                                                                <div
                                                                    class="price">
                                                                    <h4
                                                                        class="sale-price">300,000
                                                                        đ
                                                                    </h4>
                                                                    <h4><s>400,000
                                                                            đ</s></h4>
                                                                </div>
                                                                <span>Product
                                                                    Brand</span>
                                                                <h6>Product Name
                                                                </h6>
                                                                <div
                                                                    class="star">
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="far fa-star"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    class="col-md-6 col-lg-4 col-xl-3 col-sm-6 col-6">
                                                    <div class="pro-container">
                                                        <div class="pro">
                                                            <span
                                                                class="sale">30%</span>
                                                                <img src={require('../../assets/img/fruite-item-1.jpg')}
                                                                alt="Product Name" />
                                                            <div
                                                                class="icon-container">
                                                                <a class="btn"
                                                                    onclick="handleAddToCart(event)">
                                                                    <i
                                                                        class="fas fa-shopping-cart"></i>
                                                                </a>
                                                                <a
                                                                    href="/product/1">
                                                                    <i
                                                                        class="fas fa-eye"></i>
                                                                </a>
                                                            </div>
                                                            <div class="des">
                                                                <div
                                                                    class="price">
                                                                    <h4
                                                                        class="sale-price">300,000
                                                                        đ
                                                                    </h4>
                                                                    <h4><s>400,000
                                                                            đ</s></h4>
                                                                </div>
                                                                <span>Product
                                                                    Brand</span>
                                                                <h6>Product Name
                                                                </h6>
                                                                <div
                                                                    class="star">
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="far fa-star"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                             
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                        <br></br>
                        <div class="col-lg-12">
                            <div class="tab-content">
                                <div id="tab-1"
                                    class="tab-pane fade show p-0 active">
                                    <div class="row g-4">
                                        <div class="col-lg-12">
                                            <div class="product-list row g-4">
                                                <div
                                                    class="col-md-9 col-lg-4 col-xl-3 col-sm-6 col-6">
                                                    <div class="pro-container">
                                                        <div class="pro">
                                                            <span
                                                                class="sale">30%</span>
                                                         
                                                               <img src={require('../../assets/img/fruite-item-1.jpg')}
                                                                alt="Product Name" />
                                                            <div
                                                                class="icon-container">
                                                                <a class="btn"
                                                                    onclick="handleAddToCart(event)">
                                                                    <i
                                                                        class="fas fa-shopping-cart"></i>
                                                                </a>
                                                                <a
                                                                    href="/product/1">
                                                                    <i
                                                                        class="fas fa-eye"></i>
                                                                </a>
                                                            </div>
                                                            <div class="des">
                                                                <div
                                                                    class="price">
                                                                    <h4
                                                                        class="sale-price">300,000
                                                                        đ
                                                                    </h4>
                                                                    <h4><s>400,000
                                                                            đ</s></h4>
                                                                </div>
                                                                <span>Product
                                                                    Brand</span>
                                                                <h6>Product Name
                                                                </h6>
                                                                <div
                                                                    class="star">
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="far fa-star"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    class="col-md-6 col-lg-4 col-xl-3 col-sm-6 col-6">
                                                    <div class="pro-container">
                                                        <div class="pro">
                                                            <span
                                                                class="sale">30%</span>
                                                                  <img src={require('../../assets/img/fruite-item-1.jpg')}
                                                                alt="Product Name" />
                                                            <div
                                                                class="icon-container">
                                                                <a class="btn"
                                                                    onclick="handleAddToCart(event)">
                                                                    <i
                                                                        class="fas fa-shopping-cart"></i>
                                                                </a>
                                                                <a
                                                                    href="/product/1">
                                                                    <i
                                                                        class="fas fa-eye"></i>
                                                                </a>
                                                            </div>
                                                            <div class="des">
                                                                <div
                                                                    class="price">
                                                                    <h4
                                                                        class="sale-price">300,000
                                                                        đ
                                                                    </h4>
                                                                    <h4><s>400,000
                                                                            đ</s></h4>
                                                                </div>
                                                                <span>Product
                                                                    Brand</span>
                                                                <h6>Product Name
                                                                </h6>
                                                                <div
                                                                    class="star">
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="far fa-star"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                      
                                             
                                                <div
                                                    class="col-md-6 col-lg-4 col-xl-3 col-sm-6 col-6">
                                                    <div class="pro-container">
                                                        <div class="pro">
                                                            <span
                                                                class="sale">30%</span>
                                                                 <img src={require('../../assets/img/fruite-item-1.jpg')}
                                                                alt="Product Name" />
                                                            <div
                                                                class="icon-container">
                                                                <a class="btn"
                                                                    onclick="handleAddToCart(event)">
                                                                    <i
                                                                        class="fas fa-shopping-cart"></i>
                                                                </a>
                                                                <a
                                                                    href="/product/1">
                                                                    <i
                                                                        class="fas fa-eye"></i>
                                                                </a>
                                                            </div>
                                                            <div class="des">
                                                                <div
                                                                    class="price">
                                                                    <h4
                                                                        class="sale-price">300,000
                                                                        đ
                                                                    </h4>
                                                                    <h4><s>400,000
                                                                            đ</s></h4>
                                                                </div>
                                                                <span>Product
                                                                    Brand</span>
                                                                <h6>Product Name
                                                                </h6>
                                                                <div
                                                                    class="star">
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="far fa-star"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    class="col-md-6 col-lg-4 col-xl-3 col-sm-6 col-6">
                                                    <div class="pro-container">
                                                        <div class="pro">
                                                            <span
                                                                class="sale">30%</span>
                                                                <img src={require('../../assets/img/fruite-item-1.jpg')}
                                                                alt="Product Name" />
                                                            <div
                                                                class="icon-container">
                                                                <a class="btn"
                                                                    onclick="handleAddToCart(event)">
                                                                    <i
                                                                        class="fas fa-shopping-cart"></i>
                                                                </a>
                                                                <a
                                                                    href="/product/1">
                                                                    <i
                                                                        class="fas fa-eye"></i>
                                                                </a>
                                                            </div>
                                                            <div class="des">
                                                                <div
                                                                    class="price">
                                                                    <h4
                                                                        class="sale-price">300,000
                                                                        đ
                                                                    </h4>
                                                                    <h4><s>400,000
                                                                            đ</s></h4>
                                                                </div>
                                                                <span>Product
                                                                    Brand</span>
                                                                <h6>Product Name
                                                                </h6>
                                                                <div
                                                                    class="star">
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="fas fa-star"></i>
                                                                    <i
                                                                        class="far fa-star"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                             
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="pagination d-flex justify-content-center mt-5">
                                <a href="#" className="rounded">&laquo;</a>
                                <a href="#" className="active rounded">1</a>
                                <a href="#" className="rounded">2</a>
                                <a href="#" className="rounded">3</a>
                                <a href="#" className="rounded">4</a>
                                <a href="#" className="rounded">5</a>
                                <a href="#" className="rounded">6</a>
                                <a href="#" className="rounded">&raquo;</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
