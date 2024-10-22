  import ApexCharts from 'apexcharts';
import React, { useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Bootstrap JS (đảm bảo hỗ trợ cho collapse)
import 'bootstrap/dist/js/bootstrap.bundle.min';


const Dashboard2 = () => {
  useEffect(() => {
    // Initialize ApexCharts
    const chart = new ApexCharts(document.querySelector("#reportsChart"), {
      series: [
        { name: 'Sales', data: [31, 40, 28, 51, 42, 82, 56] },
        { name: 'Revenue', data: [11, 32, 45, 32, 34, 52, 41] },
        { name: 'Customers', data: [15, 11, 32, 18, 9, 24, 11] }
      ],
      chart: {
        height: '100%',  // Set to 100%
        type: 'area',
        toolbar: { show: false },
      },
      markers: { size: 4 },
      colors: ['#4154f1', '#2eca6a', '#ff771d'],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.4,
          stops: [0, 90, 100],
        },
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      xaxis: {
        type: 'datetime',
        categories: [
          "2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z"
        ],
      },
      tooltip: {
        x: { format: 'dd/MM/yy HH:mm' },
      },
    });

    chart.render();

    return () => {
      chart.destroy(); // Clean up chart on component unmount
    };
  }, []);

  return (
    <div className="pagetitle">
      <h1>Dashboard</h1>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="index.html">Home</a></li>
          <li className="breadcrumb-item active">Dashboard</li>
        </ol>
      </nav>

      <section className="section dashboard" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
        <div className="row" style={{ flex: '1' }}>
          {/* Left side columns */}
          <div className="col-lg-8" style={{ flex: '1' }}>
            <div className="row">
              {/* Sales Card */}
              <div className="col-xxl-4 col-md-6">
                <div className="card info-card sales-card">
                  <CardHeader title="Sales" period="Today" />
                  <CardBody icon="bi-cart" value="145" percentage="12%" text="increase" />
                </div>
              </div>

              {/* Revenue Card */}
              <div className="col-xxl-4 col-md-6">
                <div className="card info-card revenue-card">
                  <CardHeader title="Revenue" period="This Month" />
                  <CardBody icon="bi-currency-dollar" value="$3,264" percentage="8%" text="increase" />
                </div>
              </div>

              {/* Customers Card */}
              <div className="col-xxl-4 col-xl-12">
                <div className="card info-card customers-card">
                  <CardHeader title="Customers" period="This Year" />
                  <CardBody icon="bi-people" value="1244" percentage="12%" text="decrease" negative />
                </div>
              </div>
            </div>

            {/* Reports */}
            <div className="col-12" style={{ flex: '1' }}>
              <div className="card" style={{ height: '100%' }}>
                <CardHeader title="Reports" period="Today" />
                <div className="card-body" style={{ height: '100%' }}>
                  <h5 className="card-title">Reports <span>/Today</span></h5>
                  <div id="reportsChart" style={{ height: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Sales */}
          <div className="col-12" style={{ flex: '1' }}>
            <div className="card recent-sales overflow-auto">
              <CardHeader title="Recent Sales" period="Today" />
              <div className="card-body">
                <h5 className="card-title">Recent Sales <span>| Today</span></h5>
                <RecentSalesTable />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Card Header Component
const CardHeader = ({ title, period }) => (
  <div className="filter">
    <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
      <li className="dropdown-header text-start"><h6>Filter</h6></li>
      <li><a className="dropdown-item" href="#">Today</a></li>
      <li><a className="dropdown-item" href="#">This Month</a></li>
      <li><a className="dropdown-item" href="#">This Year</a></li>
    </ul>
  </div>
);

// Card Body Component
const CardBody = ({ icon, value, percentage, text, negative }) => (
  <div className="card-body">
    <h5 className="card-title">{value} <span>| Today</span></h5>
    <div className="d-flex align-items-center">
      <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
        <i className={`bi ${icon}`}></i>
      </div>
      <div className="ps-3">
        <h6>{value}</h6>
        <span className={`small pt-1 fw-bold ${negative ? 'text-danger' : 'text-success'}`}>{percentage}</span> <span className="text-muted small pt-2 ps-1">{text}</span>
      </div>
    </div>
  </div>
);

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
      <tr><th scope="row"><a href="#">#2457</a></th><td>Brandon Jacob</td><td><a href="#" className="text-primary">At praesentium minu</a></td><td>$64</td><td><span className="badge bg-success">Approved</span></td></tr>
      <tr><th scope="row"><a href="#">#2147</a></th><td>Bridie Kessler</td><td><a href="#" className="text-primary">Blanditiis dolor omnis similique</a></td><td>$47</td><td><span className="badge bg-warning">Pending</span></td></tr>
      <tr><th scope="row"><a href="#">#2049</a></th><td>Ashleigh Langosh</td><td><a href="#" className="text-primary">At recusandae consectetur</a></td><td>$147</td><td><span className="badge bg-success">Approved</span></td></tr>
      <tr><th scope="row"><a href="#">#2644</a></th><td>Angus Grady</td><td><a href="#" className="text-primary">Ut voluptatem id earum et</a></td><td>$67</td><td><span className="badge bg-danger">Rejected</span></td></tr>
      <tr><th scope="row"><a href="#">#2644</a></th><td>Raheem Lehner</td><td><a href="#" className="text-primary">Sunt similique distinctio</a></td><td>$165</td><td><span className="badge bg-success">Approved</span></td></tr>
    </tbody>
  </table>
);

export default Dashboard2;
