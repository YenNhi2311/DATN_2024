import React from "react";
import "../assets/css/bootstrap.min.css";
import "../assets/css/brand.css";
import "../assets/css/card.css";
import "../assets/css/category.css";
import "../assets/css/shop.css";
import "../assets/css/style.css";

const DanhGia = () => {
  return (
    <div>
      {/* Single Page Header start */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Testimonial</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">
            <a href="#">Home</a>
          </li>
          <li className="breadcrumb-item">
            <a href="#">Pages</a>
          </li>
          <li className="breadcrumb-item active text-white">Testimonial</li>
        </ol>
      </div>
      {/* Single Page Header End */}

      {/* Testimonial Start */}
      <div className="container-fluid testimonial py-5">
        <div className="container py-5">
          <div className="testimonial-header text-center">
            <h1 className="display-5 mb-5 text-dark">Đánh giá</h1>
          </div>
          <div className="owl-carousel testimonial-carousel">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="testimonial-item img-border-radius bg-light rounded p-4"
              >
                <div className="position-relative">
                  <i
                    className="fa fa-quote-right fa-2x text-secondary position-absolute"
                    style={{ bottom: "30px", right: "0" }}
                  ></i>
                  <div className="mb-4 pb-4 border-bottom border-secondary">
                    <p className="mb-0">
                      Lorem Ipsum is simply dummy text of the printing Ipsum has
                      been the industry's standard dummy text ever since the
                      1500s,
                    </p>
                  </div>
                  <div className="d-flex align-items-center flex-nowrap">
                    <div className="bg-secondary rounded">
                      <img
                        src="img/testimonial-1.jpg"
                        className="img-fluid rounded"
                        style={{ width: "100px", height: "100px" }}
                        alt="Testimonial"
                      />
                    </div>
                    <div className="ms-4 d-block">
                      <h4 className="text-dark">Client Name</h4>
                      <p className="m-0 pb-3">Profession</p>
                      <div className="d-flex pe-5">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star ${
                              i < 4 ? "text-primary" : ""
                            }`}
                          ></i>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Testimonial End */}
    </div>
  );
};

export default DanhGia;
