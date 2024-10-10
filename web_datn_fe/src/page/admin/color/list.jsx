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
import ColorForm from "./form";

const ColorLists = () => {
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
      const response = await apiClient.get("/api/colors");
      const formattedData = response.data.map((item) => ({
        id: item.colorId,
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
    try {
      await apiClient.delete(`/api/colors/${id}`);
      fetchBrands(); // Reload lại danh sách sau khi xóa
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  return (
    <Box m="20px">
      <Header title="MÀU SẮC" subtitle="Quản lý màu sắc sản phẩm" />

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
          Thêm màu sắc
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
              <TableCell>Màu sắc</TableCell>
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
          {editData ? "Chỉnh sửa màu sắc" : "Thêm màu sắc"}
        </DialogTitle>
        <DialogContent>
          <ColorForm
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

export default ColorLists;
