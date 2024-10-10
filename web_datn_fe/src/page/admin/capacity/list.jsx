import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
  TextField, // Thêm TextField cho input tìm kiếm
} from "@mui/material";
import { tokens } from "../../../theme";
import Header from "../../../component/chart/Header";
import { useEffect, useState } from "react";
import { apiClient } from "../../../config/apiClient";
import BrandForm from "./form";
import CapacityForm from "./form";
import Swal from "sweetalert2";

const CapacityLists = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({ name: "", place: "" });
  const [isFormOpen, setIsFormOpen] = useState(false); // State để mở/đóng form
  const [editData, setEditData] = useState(null); // State cho dữ liệu chỉnh sửa

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await apiClient.get("/api/capacities");
      const formattedData = response.data.map((item) => ({
        id: item.capacityId,
        value: item.value,
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((row) => row.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
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

  // Mở form thêm/sửa
  const handleOpenForm = (brand = null) => {
    setEditData(brand); // Nếu brand null thì là thêm mới, không thì là chỉnh sửa
    setIsFormOpen(true);
  };

  // Đóng form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditData(null);
  };

  // Hàm xử lý xóa thương hiệu
  const handleDelete = async (id) => {
    // Hiển thị hộp thoại xác nhận trước khi xóa
    const result = await Swal.fire({
      title: "Bạn có chắc chắn không?",
      text: "Bạn sẽ không thể khôi phục lại mục này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Có, xóa!",
      cancelButtonText: "Hủy",
    });

    // Nếu người dùng xác nhận xóa
    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/api/capacities/${id}`);

        // Hiển thị thông báo thành công
        Swal.fire({
          title: "Đã xóa!",
          text: "Dung tích đã được xóa thành công.",
          icon: "success",
          confirmButtonText: "OK",
        });

        fetchBrands(); // Reload lại danh sách sau khi xóa
      } catch (error) {
        console.error("Error deleting brand:", error);

        // Hiển thị thông báo lỗi
        Swal.fire({
          title: "Lỗi!",
          text: "Có lỗi xảy ra khi xóa dung tích. Vui lòng thử lại.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <Box m="20px">
      <Header title="DUNG TÍCH" subtitle="Quản lý dung tích sản phẩm" />

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
          Thêm dung tích
        </Button>
      </div>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {/* <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    selected.length > 0 && selected.length < rows.length
                  }
                  checked={rows.length > 0 && selected.length === rows.length}
                  onChange={handleSelectAllClick}
                  inputProps={{ "aria-label": "select all brands" }}
                />
              </TableCell> */}
              <TableCell>ID</TableCell>
              <TableCell>Dung tích</TableCell>
              <TableCell>Đơn vị</TableCell>
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
                {/* <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={selected.indexOf(row.id) !== -1}
                      onChange={() => handleClick(row.id)}
                      inputProps={{
                        "aria-labelledby": `enhanced-table-checkbox-${row.id}`,
                      }}
                    />
                  </TableCell> */}
                <TableCell>{row.value}</TableCell>
                <TableCell>ML</TableCell>
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
          {editData ? "Chỉnh sửa dung tích" : "Thêm dung tích"}
        </DialogTitle>
        <DialogContent>
          <CapacityForm
            initialValues={editData || { name: "", place: "", img: "" }}
            onSubmit={(values) => {
              // Thực hiện thêm/sửa thương hiệu ở đây
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

export default CapacityLists;
