import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Import Bootstrap JS (đảm bảo hỗ trợ cho collapse)
import "bootstrap/dist/js/bootstrap.bundle.min";
import RevenueStatistics from "../../../component/admin/RevenueStatistics";
import BestSellingProductsStatistics from "../../../component/admin/BestSellingProductsStatistics";
import RevenueByLocation from "../../../component/admin/RevenueByLocation";
import CancelOrderStatistic from "../../../component/admin/CancelOrderStatistic";
import ReceiveOrderStatistic from "../../../component/admin/ReceiveOrderStatistic";
import RevenueProduct from "../../../component/admin/RevenueProduct";

const Dashboard2 = () => {
  return (
    <div className="pagetitle">
      <h1>Trang chủ</h1>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/admin">Trang chủ</a>
          </li>
          <li className="breadcrumb-item active">Bảng điều khiển</li>
        </ol>
      </nav>

      <section
        className="section dashboard"
        style={{ flex: "1", display: "flex", flexDirection: "column" }}
      >
        {/* Left side columns */}
        <div className="row">
          {/* Sales Card */}
          <ReceiveOrderStatistic />

          {/* Revenue Card */}
          <CancelOrderStatistic />

          {/* Customers Card */}
          <RevenueProduct />
        </div>

        <div className="row mb-5">
          {/* Reports */}
          <div className="col-8" style={{ flex: "1" }}>
            <div className="card" style={{ height: "100%", padding: "15px" }}>
              <RevenueStatistics apiUrl="http://localhost:8080/api" />
            </div>
          </div>
          <div className="col-4" style={{ flex: "1" }}>
            <div
              className="card"
              style={{ height: "100%", padding: "15px" }}
            ></div>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12">
            <div className="card" style={{ height: "100%", padding: "15px" }}>
              <BestSellingProductsStatistics />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card" style={{ height: "100%", padding: "15px" }}>
              <RevenueByLocation />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Recent Sales Table Component
const RecentSalesTable = () => (
  <table className="table table-borderless datatable">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Customer</th>
        <th scope="col">Product</th>
        <th scope="col">Price</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">
          <a href="#">#2457</a>
        </th>
        <td>Brandon Jacob</td>
        <td>
          <a href="#" className="text-primary">
            At praesentium minu
          </a>
        </td>
        <td>$64</td>
        <td>
          <span className="badge bg-success">Approved</span>
        </td>
      </tr>
      <tr>
        <th scope="row">
          <a href="#">#2147</a>
        </th>
        <td>Bridie Kessler</td>
        <td>
          <a href="#" className="text-primary">
            Blanditiis dolor omnis similique
          </a>
        </td>
        <td>$47</td>
        <td>
          <span className="badge bg-warning">Pending</span>
        </td>
      </tr>
      <tr>
        <th scope="row">
          <a href="#">#2049</a>
        </th>
        <td>Ashleigh Langosh</td>
        <td>
          <a href="#" className="text-primary">
            At recusandae consectetur
          </a>
        </td>
        <td>$147</td>
        <td>
          <span className="badge bg-success">Approved</span>
        </td>
      </tr>
      <tr>
        <th scope="row">
          <a href="#">#2644</a>
        </th>
        <td>Angus Grady</td>
        <td>
          <a href="#" className="text-primary">
            Ut voluptatem id earum et
          </a>
        </td>
        <td>$67</td>
        <td>
          <span className="badge bg-danger">Rejected</span>
        </td>
      </tr>
      <tr>
        <th scope="row">
          <a href="#">#2644</a>
        </th>
        <td>Raheem Lehner</td>
        <td>
          <a href="#" className="text-primary">
            Sunt similique distinctio
          </a>
        </td>
        <td>$165</td>
        <td>
          <span className="badge bg-success">Approved</span>
        </td>
      </tr>
    </tbody>
  </table>
);

export default Dashboard2;
