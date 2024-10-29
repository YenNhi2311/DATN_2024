import React from "react";
import { Bar } from "react-chartjs-2";

const RevenueBarChart = ({ revenueData }) => {
  const data = {
    labels: revenueData.map((item) => item.province), // Danh sách khu vực (tỉnh/thành phố)
    datasets: [
      {
        label: "Doanh Thu (VND)", // Nhãn cho biểu đồ
        data: revenueData.map((item) => item.revenue), // Dữ liệu doanh thu tương ứng
        backgroundColor: "rgba(75,192,192,0.4)", // Màu nền của cột
        borderColor: "rgba(75,192,192,1)", // Màu viền của cột
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true, // Bắt đầu trục y từ 0
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default RevenueBarChart;
