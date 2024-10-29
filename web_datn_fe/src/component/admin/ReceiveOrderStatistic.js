import React, { useEffect, useState } from "react";
import { apiClient } from "../../config/apiClient";
import { CardBody, CardHeader } from "./CardRevenue";

const ReceiveOrderStatistic = () => {
  const [orderCount, setOrderCount] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("today"); // Giá trị mặc định
  const [date, setDate] = useState(new Date());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchOrderCount();
  }, [selectedPeriod, date, month, year]);

  const fetchOrderCount = async () => {
    try {
      let response;
      if (selectedPeriod === "today") {
        response = await apiClient.get("/api/revenues/received-count-today");
      } else if (selectedPeriod === "month") {
        response = await apiClient.get(
          "/api/revenues/received-count-by-month",
          {
            params: { month, year },
          }
        );
      } else if (selectedPeriod === "year") {
        response = await apiClient.get("/api/revenues/received-count-by-year", {
          params: { year },
        });
      }
      setOrderCount(response.data);
    } catch (error) {
      console.error("Error fetching order count", error);
    }
  };

  const handleFilterChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
    if (newPeriod === "today") {
      setDate(new Date());
    } else if (newPeriod === "month") {
      setMonth(new Date().getMonth() + 1); // Tháng hiện tại
    } else if (newPeriod === "year") {
      setYear(new Date().getFullYear()); // Năm hiện tại
    }
  };

  return (
    <div className="col-xxl-4 col-md-4">
      <div className="card info-card sales-card">
        <CardHeader
          title="Đơn hàng đã nhận"
          period={selectedPeriod}
          onFilterChange={handleFilterChange}
          hidden={true}
        />
        <CardBody
          icon="bi-cart"
          value={orderCount}
          // percentage="12%" // Bạn có thể tính toán thay đổi phần trăm
          // text="đơn"
        />
      </div>
    </div>
  );
};

export default ReceiveOrderStatistic;
