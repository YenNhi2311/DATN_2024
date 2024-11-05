// CardHeader.js
import React from "react";
import { Link } from "react-router-dom";

export const CardHeader = ({ title, period, onFilterChange, hidden }) => (
  <>
    <style jsx>{`
      .info-card {
        border: none;
        transition: transform 0.2s;
      }

      .info-card:hover {
        transform: translateY(-5px);
      }

      .card-header {
        background-color: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
      }

      .icon {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
      }
    `}</style>
    <div className="card-header d-flex justify-content-between align-items-center">
      <h5 className="card-title mb-0">{title}</h5>
      {hidden === true && (
        <div className="filter">
          <Link className="icon" href="#" data-bs-toggle="dropdown">
            <i className="bi bi-three-dots"></i>
          </Link>
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <li>
              <Link
                className={`dropdown-item ${
                  period === "today" ? "active" : ""
                }`}
                onClick={() => onFilterChange("today")}
              >
                Hôm nay
              </Link>
            </li>
            <li>
              <Link
                className={`dropdown-item ${
                  period === "month" ? "active" : ""
                }`}
                onClick={() => onFilterChange("month")}
              >
                Tháng
              </Link>
            </li>
            <li>
              <Link
                className={`dropdown-item ${period === "year" ? "active" : ""}`}
                onClick={() => onFilterChange("year")}
              >
                Năm
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  </>
);
export const CardBody = ({ icon, value, percentage, text }) => (
  <>
    <style jsx>{`
      .card-body {
        padding: 20px;
      }
    `}</style>
    <div className="card-body">
      <div className="d-flex align-items-center">
        <div className="icon rounded-circle bg-light text-primary me-3">
          <i className={icon}></i>
        </div>
        <div>
          <h5 className="card-title mb-0">{value}</h5>
          <div className="d-flex align-items-center">
            <span className="small pt-1 fw-bold text-muted">{percentage}</span>
            <span
              className={`text-${
                text === "increase" ? "success" : "danger"
              } small pt-1 fw-bold ms-2`}
            >
              {text}
            </span>
          </div>
        </div>
      </div>
    </div>
  </>
);
