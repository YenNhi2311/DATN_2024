import React, { useState, useEffect } from "react";
import { apiClient } from "../../config/apiClient";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các scale và element cần thiết cho biểu đồ Bar
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueStatistics = ({ apiUrl }) => {
  const [revenues, setRevenues] = useState([]);
  const [periodType, setPeriodType] = useState("month");

  useEffect(() => {
    fetchRevenues();
  }, [periodType]);

  const fetchRevenues = async () => {
    try {
      const response = await apiClient.get(`${apiUrl}/revenues/${periodType}`);
      setRevenues(response.data);
    } catch (error) {
      console.error("Error fetching revenue data", error);
    }
  };

  const handleChange = (e) => {
    setPeriodType(e.target.value);
  };

  const data = {
    labels: revenues.map((r) => r.period),
    datasets: [
      {
        label: "Doanh thu",
        data: revenues.map((r) => r.totalRevenue),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div>
      <h1 style={{ borderBottom: "1px solid blue", display: "inline" }}>
        Thống kê doanh thu
      </h1>
      <br />
      <label
        htmlFor="period"
        style={{ marginRight: "10px", marginTop: "20px" }}
      >
        Chọn khoảng thời gian:{" "}
      </label>
      <select id="period" value={periodType} onChange={handleChange}>
        <option value="day">Theo Ngày</option>
        <option value="month">Theo Tháng</option>
        <option value="year">Theo Năm</option>
      </select>

      <Bar data={data} />
    </div>
  );
};

export default RevenueStatistics;
