import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

// Đăng ký các phần tử cần thiết
Chart.register(...registerables);

const RevenueAreaChart = ({ revenueData }) => {
  const data = {
    labels: revenueData.map((item) => item.province), // Tên khu vực
    datasets: [
      {
        label: "Doanh Thu (VND)",
        data: revenueData.map((item) => item.revenue), // Doanh thu
        fill: true, // Bật chế độ lấp đầy dưới đường biểu diễn
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  return <Line data={data} />;
};

export default RevenueAreaChart;
