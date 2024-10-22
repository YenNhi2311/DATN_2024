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
    InputAdornment,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogContent,
    DialogTitle,
    useTheme,
    IconButton
} from "@mui/material";
import { tokens } from "../../../theme";
import Header from "../../../component/chart/Header";
import { useEffect, useState } from "react";
import { apiClient } from "../../../config/apiClient";
import FormSkinType from "./form"; // Đảm bảo đây là form quản lý dung tích
import SearchIcon from '@mui/icons-material/Search';
import Swal from "sweetalert2";
import "../../../assets/css/admin/formCapacity.css";
import CloseIcon from '@mui/icons-material/Close';
import { Edit, Delete } from '@mui/icons-material';

const TableSCapacity = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(24);
    const [sortValue, setSortValue] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValue, setFilterValue] = useState("");

    useEffect(() => {
        fetchCapacity();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleSortChange = (event) => {
        const value = event.target.value;
        setSortValue(value);
        const sortedData = [...rows].sort((a, b) => {
            if (value === "asc") {
                return a.id - b.id;
            } else if (value === "desc") {
                return b.id - a.id;
            }
            return 0;
        });
        setRows(sortedData);
    };

    const handleRowsPerPageOptionChange = (event) => {
        const value = event.target.value;
        setRowsPerPage(value);
        setPage(0);
    };

    const fetchCapacity = async () => {
        try {
            const response = await apiClient.get("/api/capacities");
            const formattedData = response.data.map((item) => ({
                id: item.capacityId,
                name: item.value,
            })).sort((a, b) => b.id - a.id);

            setRows(formattedData);
        } catch (error) {
            console.error("Error fetching data:", error);
            Swal.fire({
                title: "Lỗi",
                text: "Có lỗi xảy ra khi tải dữ liệu dung tích.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const handleOpenForm = (capacity = null) => {
        if (capacity) {
            setEditData({ capacityId: capacity.id, name: capacity.name }); // Đảm bảo tên thuộc tính là 'name'
        } else {
            setEditData(null);
        }
        setIsFormOpen(true);
    };

    const handleCloseForm = (reloadData = false) => {
        setIsFormOpen(false);
        setEditData(null);
        if (reloadData) {
            fetchCapacity();
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa dung tích này không?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Có, xóa!",
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
            try {
                await apiClient.delete(`/api/capacities/${id}`);
                fetchCapacity();
                Swal.fire({
                    title: "Thành công!",
                    text: "Dung tích đã được xóa thành công.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            } catch (error) {
                console.error("Error deleting skin type:", error);
                Swal.fire({
                    title: "Lỗi!",
                    text: "Có lỗi xảy ra khi xóa dung tích. Vui lòng thử lại.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        }
    };

    const filteredRows = rows.filter((row) => {
        const matchesSearch = String(row.name).toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <Box>
            <Header subtitle="Danh Sách dung tích" />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                {/* Thanh tìm kiếm */}
                <TextField
                    variant="outlined"
                    placeholder="Tìm kiếm dung tích"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: "300px" }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Nhóm bộ lọc và nút thêm */}
                <div style={{ display: "flex", gap: "10px" }}>
                    {/* Bộ lọc */}
                    <div style={{ display: "flex", gap: "10px" }}>
                        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                            <InputLabel id="sort-label">Sắp xếp</InputLabel>
                            <Select
                                labelId="sort-label"
                                value={sortValue}
                                onChange={handleSortChange}
                                label="Sắp xếp"
                            >
                                <MenuItem value="asc">Từ A-Z</MenuItem>
                                <MenuItem value="desc">Từ Z-A</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Pagination */}
                        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                            <InputLabel id="rowsPerPage-label">Hiển thị</InputLabel>
                            <Select
                                labelId="rowsPerPage-label"
                                value={rowsPerPage}
                                onChange={handleRowsPerPageOptionChange}
                                label="Số hàng"
                            >
                                <MenuItem value={24}>24/trang</MenuItem>
                                <MenuItem value={36}>36/trang</MenuItem>
                                <MenuItem value={48}>48/trang</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Nút thêm */}
                    <Button variant="contained" onClick={() => handleOpenForm()}>
                        Thêm mới
                    </Button>
                </div>
            </div>

            {/* Bảng dung tích */}
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: "100px" }}>ID</TableCell>
                            <TableCell style={{ width: "300px" }}>Dung tích</TableCell>
                            <TableCell style={{ width: "150px" }}>Hành Động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            variant="contained"
                                            onClick={() => handleOpenForm(row)} // Mở form với dữ liệu của dung tích đang chọn
                                            sx={{ marginRight: "10px" }}
                                        >
                                            <Edit color="primary"/>
                                        </IconButton>
                                        <IconButton
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDelete(row.id)} // Gọi hàm xóa dung tích
                                        >
                                            <Delete color="secondary"/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Phần phân trang cố định */}
            <div style={{ marginTop: '16px', alignSelf: 'center' }}>
                <TablePagination
                    rowsPerPageOptions={[24, 36, 48]}
                    component="div"
                    count={filteredRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleRowsPerPageOptionChange}
                />
            </div>

            {/* Dialog cho form thêm/cập nhật dung tích */}
            <Dialog
                open={isFormOpen}
                onClose={() => handleCloseForm(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle style={{ fontWeight: 'bolder', fontSize: '1.5em' }}>
                    {editData ? "Cập Nhật" : "Thêm Mới"}
                    <IconButton
                        edge="end"
                        style={{ float: 'right', right: 2, color: 'red', fontWeight: 'bolder' }}
                        onClick={() => handleCloseForm(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent className="mt-3">
                    <FormSkinType
                        editData={editData} // Truyền dữ liệu cho form
                        onClose={handleCloseForm} // Hàm đóng form
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default TableSCapacity;
