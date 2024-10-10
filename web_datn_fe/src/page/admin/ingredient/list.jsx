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
import IngredientForm from "./form";
import Swal from "sweetalert2";

const IngredientLists = () => {
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
      const response = await apiClient.get("/api/ingredients");
      const formattedData = response.data.map((item) => ({
        id: item.ingredientId,
        name: item.name,
      }));
      setRows(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const handleOpenForm = (brand = null) => {
    setEditData(brand);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditData(null);
  };

  // Hàm xử lý xóa thành phần
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa thành phần này?",
      text: "Bạn sẽ không thể phục hồi lại dữ liệu này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Có, xóa nó!",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/api/ingredients/${id}`);
        Swal.fire("Đã xóa!", "Thành phần đã được xóa.", "success");
        fetchBrands(); // Reload lại danh sách sau khi xóa
      } catch (error) {
        console.error("Error deleting ingredient:", error);
        Swal.fire("Có lỗi xảy ra!", "Không thể xóa thành phần.", "error");
      }
    }
  };

  return (
    <Box m="20px">
      <Header title="THÀNH PHẦN" subtitle="Quản lý thành phần sản phẩm" />

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
          Thêm thành phần
        </Button>
      </div>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader sx={{ textAlign: "center" }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên thành phần</TableCell>
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
          {editData ? "Chỉnh sửa thành phần" : "Thêm thành phần"}
        </DialogTitle>
        <DialogContent>
          <IngredientForm
            initialValues={editData || { name: "", place: "", img: "" }}
            onSubmit={(values) => {
              // Thực hiện thêm/sửa thành phần ở đây
              console.log(values);
              handleCloseForm();
              fetchBrands(); // Reload lại danh sách sau khi thêm/sửa
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

export default IngredientLists;
