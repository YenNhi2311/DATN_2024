import React, { useEffect, useState } from "react";
import { apiClient } from "../../config/apiClient";
import { CardBody, CardHeader } from "./CardRevenue";

const RevenueProduct = () => {
  const [totalProductsSold, setTotalProductsSold] = useState(0);

  useEffect(() => {
    // Gọi API để lấy tổng số sản phẩm đã bán ra
    const fetchTotalProductsSold = async () => {
      try {
        const response = await apiClient.get(
          "/api/revenues/total-products-sold"
        );
        setTotalProductsSold(response.data);
      } catch (error) {
        console.error("Error fetching total products sold:", error);
      }
    };

    fetchTotalProductsSold();
  }, []);

  return (
    <div className="col-xxl-4 col-md-4">
      <div className="card info-card sales-card">
        <CardHeader title="Tổng sản phẩm bán ra (tháng)" hidden={false} />
        <CardBody
          icon="bi bi-box2"
          value={totalProductsSold}
          // percentage="12%" // Bạn có thể tính toán thay đổi phần trăm
          //   text="sản phẩm"
        />
      </div>
    </div>
  );
};

export default RevenueProduct;
