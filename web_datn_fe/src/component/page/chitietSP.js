import React from 'react';
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/brand.css";
import "../../assets/css/card.css";
import "../../assets/css/category.css";
import "../../assets/css/shop.css";
import "../../assets/css/style.css";

const ChiTietSP = () => {
    
    return (
        <div>
        <div class="container-fluid page-header py-5 text-center">
        <h1 class="text-center text-white display-6">Shop Detail</h1>
        <ol class="breadcrumb justify-content-center mb-0">
            <li class="breadcrumb-item"><a href="#">Home</a></li>
            <li class="breadcrumb-item"><a href="#">Pages</a></li>
            <li class="breadcrumb-item active text-white">Shop Detail</li>
        </ol>
   </div>
    
        <div className="container-fluid py-3 mt-3">
            <div className="container py-5">
                <div className="row">
                    <div className="col-lg-8 col-xl-12">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="border-rounded">
                                    <a href="#">
                                    <img src={require('../../assets/img/hasaki.png')} alt="Product Image" />
                                    </a>
                                </div>
                                <div className="img-select">
                                    <div className="img-item">
                                        <a href="#">
                                        <img src={require('../../assets/img/fruite-item-1.jpg')} alt="Product Image 1" />
                                        </a>
                                    </div>
                                    <div className="img-item">
                                        <a href="#">
                                        <img src={require('../../assets/img/fruite-item-1.jpg')} alt="Product Image 2" />
                                        </a>
                                    </div>
                                    <div className="img-item">
                                        <a href="#">
                                        <img src={require('../../assets/img/fruite-item-1.jpg')} alt="Product Image 3" />
                                        </a>
                                    </div>
                                    <div className="img-item">
                                        <a href="#">
                                        <img src={require('../../assets/img/fruite-item-1.jpg')} alt="Product Image 4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <h4 className="fw-bold mb-3">Broccoli</h4>
                                <p className="mb-3">Loại sản phẩm: Vegetables</p>
                                <div className="d-flex mb-4">
                                    <i className="fa fa-star text-secondary"></i>
                                    <i className="fa fa-star text-secondary"></i>
                                    <i className="fa fa-star text-secondary"></i>
                                    <i className="fa fa-star text-secondary"></i>
                                    <i className="fa fa-star"></i>
                                </div>
                                <span className="txt_price" id="product-final_price">
                                    212.000 ₫
                                </span>
                                <p className="mb-4">Xuất xứ: ..... </p>
                                <p className="mb-4">Công dụng: ..... </p>
                                <div className="input-group quantity mb-5" style={{ width: '100px' }}>
                                    <div className="input-group-btn">
                                        <button className="btn btn-sm btn-minus rounded-circle bg-light border">
                                            <i className="fa fa-minus"></i>
                                        </button>
                                    </div>
                                    <input type="text" className="form-control form-control-sm text-center border-0" value="1" readOnly />
                                    <div className="input-group-btn">
                                        <button className="btn btn-sm btn-plus rounded-circle bg-light border">
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </div>
                                    <div className="capacity-selection">
                                        <h6>Dung Tích: <span style={{ marginLeft: '10px' }}>30ml</span></h6>
                                        <div className="capacity-options">
                                            <button className="capacity-btn selected">20ml</button>
                                            <button className="capacity-btn">30ml</button>
                                            <button className="capacity-btn">50ml</button>
                                            <button className="capacity-btn">100ml</button>
                                        </div>
                                    </div>
                                </div>
                                <a href="#" className="btn btn-primary border border-secondary rounded-pill px-4 py-2 mb-4 text-white">
                                    <i className="fa fa-shopping-bag me-2 text-white"></i>
                                    Add to cart
                                </a>
                                <a href="#" className="btn btn-danger border border-secondary rounded-pill px-4 py-2 mb-4 text-white">
                                    <i className="fa fa-shopping-bag me-2 text-white"></i>
                                    Mua Ngay
                                </a>
                            </div>
                        </div>
                        <div class="col-lg-12">
                    <nav>
                        <div class="nav nav-tabs mb-3">
                            
                            <button class="nav-link active border-white border-bottom-0" type="button" role="tab" id="nav-about-tab" data-bs-toggle="tab" data-bs-target="#nav-about" aria-controls="nav-about" aria-selected="true">Thành phần</button>

                          
                            <button class="nav-link border-white border-bottom-0" type="button" role="tab" id="nav-about-tab1" data-bs-toggle="tab" data-bs-target="#nav-cung-dung" aria-controls="nav-cung-dung" aria-selected="false">Công dụng</button>

                           
                            <button class="nav-link border-white border-bottom-0" type="button" role="tab" id="nav-about-tab2" data-bs-toggle="tab" data-bs-target="#nav-loai-da" aria-controls="nav-loai-da" aria-selected="false">Loại da</button>

                           
                            <button class="nav-link border-white border-bottom-0" type="button" role="tab" id="nav-mission-tab" data-bs-toggle="tab" data-bs-target="#nav-danh-gia" aria-controls="nav-danh-gia" aria-selected="false">Đánh giá</button>
                        </div>
                    </nav>
                </div>

                <div class="tab-content mb-5">
                    <div class="tab-pane active" id="nav-about" role="tabpanel" aria-labelledby="nav-about-tab">
                        <p>The generated Lorem Ipsum is therefore always free from repetition injected humour, or non-characteristic words etc. Susp endisse ultricies nisi vel quam suscipit </p>
                        <p>Sabertooth peacock flounder; chain pickerel hatchetfish, pencilfish snailfish filefish Antarctic icefish goldeye aholehole trumpetfish pilot fish airbreathing catfish, electric ray sweeper.
                        </p>
                        <div class="px-2">
                            <div class="row g-4">
                                <div class="col-6">
                                    <div class="row bg-light align-items-center text-center justify-content-center py-2">
                                        <div class="col-6">
                                            <p class="mb-0">Weight</p>
                                        </div>
                                        <div class="col-6">
                                            <p class="mb-0">1 kg
                                            </p>
                                        </div>
                                    </div>
                                    <div class="row text-center align-items-center justify-content-center py-2">
                                        <div class="col-6">
                                            <p class="mb-0">Country of Origin
                                            </p>
                                        </div>
                                        <div class="col-6">
                                            <p class="mb-0">Agro Farm
                                            </p>
                                        </div>
                                    </div>
                                    <div class="row bg-light text-center align-items-center justify-content-center py-2">
                                        <div class="col-6">
                                            <p class="mb-0">Quality</p>
                                        </div>
                                        <div class="col-6">
                                            <p class="mb-0">Organic</p>
                                        </div>
                                    </div>
                                    <div class="row text-center align-items-center justify-content-center py-2">
                                        <div class="col-6">
                                            <p class="mb-0">Сheck</p>
                                        </div>
                                        <div class="col-6">
                                            <p class="mb-0">Healthy</p>
                                        </div>
                                    </div>
                                    <div class="row bg-light text-center align-items-center justify-content-center py-2">
                                        <div class="col-6">
                                            <p class="mb-0">Min Weight
                                            </p>
                                        </div>
                                        <div class="col-6">
                                            <p class="mb-0">250 Kg
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="m-3 rounded">
                <h1 class="mb-0 text-dark">SẢN PHẨM LIÊN QUAN</h1>
        <div className="row g-4 justify-content-center">
          {Array(4).fill().map((_, index) => (
            <div key={index} className="col-md-6 col-lg-4 col-xl-3 col-sm-6 col-6">
              <div className="pro-container">
                <div className="pro">
                  <span className="sale">30%</span>
                  <img src={require('../../assets/img/fruite-item-2.jpg')} alt="Product Name" />
                  <div className="icon-container">
                    <a className="btn" >
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
                    </div> 
                </div>
            </div>
        </div>
        </div>
        
    );
};

export default ChiTietSP;
