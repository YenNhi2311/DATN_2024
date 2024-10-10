import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { apiClient } from "../../../config/apiClient";
import Swal from "sweetalert2";

const AddPromotion = ({ open, onClose, fetchPromotions, editData }) => {
  const [name, setName] = useState("");
  const [percent, setPercent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setPercent(editData.percent || "");
      setStartDate(editData.startDate || "");
      setEndDate(editData.endDate || "");
    } else {
      setName("");
      setPercent("");
      setStartDate("");
      setEndDate("");
    }
  }, [editData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const promotionData = {
      name,
      percent: parseInt(percent), // Chuyển đổi thành số nguyên
      startDate,
      endDate,
    };

    try {
      if (editData) {
        // Nếu đang chỉnh sửa, gọi API cập nhật
        await apiClient.put(
          `/api/promotions/${editData.promotionId}`,
          promotionData
        );
        Swal.fire(
          "Cập nhật thành công!",
          "Khuyến mãi đã được cập nhật.",
          "success"
        );
      } else {
        // Nếu không có editData, gọi API thêm mới
        await apiClient.post("/api/promotions", promotionData);
        Swal.fire("Thành công!", "Khuyến mãi đã được thêm.", "success");
      }
      fetchPromotions(); // Gọi lại danh sách khuyến mãi
      onClose(); // Đóng form
    } catch (error) {
      console.error("Error adding/updating promotion:", error);
      Swal.fire("Thất bại!", "Có lỗi xảy ra.", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {editData ? "Cập nhật khuyến mãi" : "Thêm khuyến mãi"}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            autoFocus
            margin="normal"
            label="Tên khuyến mãi"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            label="Phần trăm giảm giá"
            fullWidth
            required
            type="number"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
          />
          <TextField
            margin="normal"
            label="Thời gian bắt đầu"
            fullWidth
            required
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true, // Điều chỉnh nhãn không bị đè lên giá trị datetime
            }}
          />

          <TextField
            margin="normal"
            label="Thời gian kết thúc"
            fullWidth
            required
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true, // Điều chỉnh nhãn không bị đè lên giá trị datetime
            }}
          />

          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Hủy
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {editData ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddPromotion;
