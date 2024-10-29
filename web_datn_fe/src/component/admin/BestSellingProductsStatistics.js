import React, { useState, useEffect } from "react";
import { apiClient } from "../../config/apiClient";
import ReusableTable from "../Reusable";
import { TextField, MenuItem } from "@mui/material";

const BestSellingProductsStatistics = () => {
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchBestSellingProducts();
  }, [month, year]);

  const fetchBestSellingProducts = async () => {
    try {
      const response = await apiClient.get(
        "/api/revenues/bestselling-products",
        {
          params: { month, year },
        }
      );
      setBestSellingProducts(response.data);
    } catch (error) {
      console.error("Error fetching best selling products", error);
    }
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const columns = [
    { id: "productName", label: "Tên Sản Phẩm" },
    { id: "quantitySold", label: "Số Lượng Bán" },
    { id: "revenue", label: "Doanh Thu (VND)" },
  ];

  return (
    <div>
      <h1 style={{ borderBottom: "1px solid blue", display: "inline" }}>
        Thống Kê Sản Phẩm Bán Chạy Nhất
      </h1>

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "16px",
          marginTop: "15px",
        }}
      >
        <TextField
          select
          label="Tháng"
          value={month}
          onChange={handleMonthChange}
          sx={{
            "& .css-15k6ek6-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
              {
                padding: "11.5px 18px",
              },
          }}
        >
          {[...Array(12)].map((_, index) => (
            <MenuItem key={index + 1} value={index + 1}>
              {index + 1}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Năm"
          type="number"
          value={year}
          onChange={handleYearChange}
          inputProps={{ min: 2000, max: new Date().getFullYear() }}
        />
      </div>
      <ReusableTable columns={columns} data={bestSellingProducts} />
    </div>
  );
};

export default BestSellingProductsStatistics;
