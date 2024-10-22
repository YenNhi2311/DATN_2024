import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../theme";
import Header from "../../../component/chart/Header";
import { useEffect, useState } from "react";
import { apiClient } from "../../../config/apiClient";
import BenefitForm from "./form";
import Swal from "sweetalert2";

const BenefitLists = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selected, setSelected] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await apiClient.get("/api/benefits");
      const formattedData = response.data.map((item) => ({
        id: item.benefitId,
        name: item.name,
      }));
      setRows(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Có lỗi xảy ra!", "Vui lòng thử lại sau.", "error");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleOpenForm = (benefit = null) => {
    setEditData(benefit);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditData(null);
  };

  const handleDelete = async (id) => {
    const confirmation = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa không?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (confirmation.isConfirmed) {
      try {
        await apiClient.delete(`/api/benefits/${id}`);
        Swal.fire("Xóa thành công!", "Công dụng đã được xóa.", "success");
        fetchBrands();
      } catch (error) {
        console.error("Error deleting benefit:", error);
        Swal.fire("Có lỗi xảy ra!", "Vui lòng thử lại.", "error");
      }
    }
  };

  return (
    <Box m="20px">
      <Header title="CÔNG DỤNG" subtitle="Quản lý công dụng sản phẩm" />

      <div style={{ justifyContent: "end", display: "flex" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenForm()}
          sx={{
            marginBottom: "20px",
            justifyContent: "end",
            display: "flex",
            textAlign: "right",
          }}
        >
          Thêm công dụng
        </Button>
      </div>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Công dụng</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                selected={selected.indexOf(row.id) !== -1}
                onClick={() => handleClick(row.id)}
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    selected.indexOf(row.id) !== -1
                      ? colors.blueAccent[300]
                      : "inherit",
                }}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleOpenForm(row)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(row.id)}
                    sx={{ ml: 2 }}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[15]}
        component="div"
        rowsPerPage={rowsPerPage}
        count={rows.length}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          "& .MuiTablePagination-displayedRows": {
            marginBottom: "0px",
          },
          backgroundColor: colors.blueAccent[800],
        }}
      />

      {/* Dialog hiển thị form thêm/sửa */}
      <Dialog
        open={isFormOpen}
        onClose={handleCloseForm}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editData ? "Chỉnh sửa công dụng" : "Thêm công dụng"}
        </DialogTitle>
        <DialogContent>
          <BenefitForm
            initialValues={editData || { name: "", place: "", img: "" }}
            onSubmit={async (values) => {
              try {
                if (editData) {
                  await apiClient.put(`/api/benefits/${editData.id}`, values);
                  Swal.fire(
                    "Cập nhật thành công!",
                    "Công dụng đã được cập nhật.",
                    "success"
                  );
                } else {
                  await apiClient.post("/api/benefits", values);
                  Swal.fire(
                    "Thêm thành công!",
                    "Công dụng mới đã được thêm.",
                    "success"
                  );
                }
                handleCloseForm();
                fetchBrands(); // Reload lại danh sách sau khi thêm/sửa
              } catch (error) {
                console.error("Error saving benefit:", error);
                Swal.fire("Có lỗi xảy ra!", "Vui lòng thử lại.", "error");
              }
            }}
            handleClose={handleCloseForm}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="primary">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BenefitLists;
