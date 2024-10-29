import React from "react";
import KhuyenMai from "../component/page/KhuyenMai";
import LoaiSP from "../component/page/LoaiSP";
import LoaiSPBanChay from "../component/page/LoaiSPBanChay";
import ThuongHieu from "../component/page/ThuongHieu";
const TrangChu = () => {
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
              {/* <section className="container-fluid service py-0">
                <TimKiem />
              </section> */}
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
                      className="img-fluid w-100"
                      alt="First slide"
                    />
                  </div>
                  <div className="carousel-item rounded">
                    <img
                      src={require("../assets/img/banerhasaki.jpg")}
                      className="img-fluid w-100"
                      alt="Second slide"
                    />
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
      <section className="container-fluid service py-0">
        <LoaiSP />
      </section>
      <br></br>
      <section className="container-fluid fruite py-5">
        <KhuyenMai />
      </section>

      {/* <section className="container-fluid vesitable py-5">
                <LoaiSPBanChay />
            </section> */}

      <section className="container-fluid py-5">
        <ThuongHieu />
      </section>

      <section className="container-fluid py-5">
        <LoaiSPBanChay />
      </section>
    </div>
  );
};

export default TrangChu;
