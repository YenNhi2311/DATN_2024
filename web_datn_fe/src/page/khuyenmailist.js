import React from "react";
import KhuyenMaiList from "../component/page/KhuyenMaiList";
const KhuyenMailist = () => {
  return (
    <div>
      {/* Hero Start */}
      <div className="container-fluid py-5 mb-5 hero-header">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-md-12 col-lg-6">
              <h4 className="mb-3 text-dark">
                {" "}
                Tinh hoa sắc đẹp – Chăm sóc từ trái tim
              </h4>
              <h1 className="mb-5 display-3 text-blue">
                Làn da đẹp, cuộc sống đẹp
              </h1>
              <div className="position-relative mx-auto">
                <input
                  className="form-control border-2 border-secondary w-75 py-3 px-4 rounded-pill"
                  type="number"
                  placeholder="Search"
                />
                {/* <button
                  type="submit"
                  className="btn btn-primary border-2 border-secondary py-3 px-4 position-absolute rounded-pill text-white h-100"
                  style={{ top: "0", right: "25%" }}
                >
                  Tìm kiếm
                </button> */}
              </div>
            </div>
            <div className="col-md-12 col-lg-6">
              <div
                id="carouselId"
                className="carousel slide position-relative"
                data-bs-ride="carousel"
                data-bs-interval="3000"
              >
                <div className="carousel-inner" role="listbox">
                  <div className="carousel-item active rounded">
                    <img
                      src={require("../assets/img/banerhasaki.jpg")}
                      className="img-fluid w-100 h-100 bg-secondary rounded"
                      alt="First slide"
                    />
                    {/* <a href="#" className="btn px-4 py-2 text-white rounded">
                    Dưỡng ẩm
                </a> */}
                  </div>
                  <div className="carousel-item rounded">
                    <img
                      src={require("../assets/img/banerhasaki.jpg")}
                      className="img-fluid w-100 h-100 rounded"
                      alt="Second slide"
                    />
                    <a href="#" className="btn px-4 py-2 text-white rounded">
                      Tẩy trang
                    </a>
                  </div>
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselId"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselId"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="container-fluid fruite py-0">
        <KhuyenMaiList />
      </section>
    </div>
  );
};

export default KhuyenMailist;
