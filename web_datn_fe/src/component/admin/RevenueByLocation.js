import React, { useEffect, useState } from "react";
import { apiClient } from "../../config/apiClient";
import RevenueBarChart from "../chart/RevenueBarChart";

const RevenueByLocation = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchRevenueByLocation();
  }, [year]);

  const fetchRevenueByLocation = async () => {
    try {
      const response = await apiClient.get(
        "/api/revenues/revenue-by-location",
        {
          params: { year },
        }
      );
      setRevenueData(response.data);
    } catch (error) {
      console.error("Error fetching revenue by location", error);
    }
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  return (
    <div>
      <h1 style={{ borderBottom: "1px solid blue", display: "inline" }}>
        Thống Kê Doanh Thu Theo Khu Vực
      </h1>
      <br />
      <label htmlFor="year" style={{ marginTop: "20px", marginRight: "10px" }}>
        Chọn Năm:
      </label>
      <select id="year" value={year} onChange={handleYearChange}>
        {Array.from({ length: 10 }, (_, index) => (
          <option key={index} value={new Date().getFullYear() - index}>
            {new Date().getFullYear() - index}
          </option>
        ))}
      </select>
      <RevenueBarChart revenueData={revenueData} />
    </div>
  );
};

export default RevenueByLocation;
