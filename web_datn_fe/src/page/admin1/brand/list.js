import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Header from "../../../component/chart/Header";
import { apiClient } from "../../../config/apiClient";
import { tokens } from "../../../theme";
import BrandForm from "./form";
import { Edit, Delete } from '@mui/icons-material';

const BrandLists = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortValue, setSortValue] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await apiClient.get("/api/brands");
            const formattedData = response.data.map((item) => ({
                id: item.brandId,
                name: item.name,
                place: item.place,
                img: item.img,
            })).sort((a, b) => b.id - a.id);
            setRows(formattedData);
        } catch (error) {
            console.error("Lỗi khi nạp dữ liệu:", error);
            Swal.fire({
                title: "Lỗi",
                text: "Đã xảy ra lỗi trong khi tải dữ liệu lên.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const handleOpenForm = (brand = null) => {
        setEditData(brand);
        setIsFormOpen(true);
    };

    const handleCloseForm = (reloadData = false) => {
        setIsFormOpen(false);
        setEditData(null);
        if (reloadData) {
            fetchBrands();
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa thương hiệu này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Vâng, Xóa nó đi!",
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
            try {
                await apiClient.delete(`/api/brands/${id}`);
                fetchBrands();
                Swal.fire({
                    title: "Xóa!",
                    text: "Thương hiệu đã được xóa thành công.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            } catch (error) {
                console.error("Error deleting brand:", error);
                Swal.fire({
                    title: "Lỗi!",
                    text: "Đã xảy ra lỗi trong khi xóa thương hiệu. Vui lòng kiểm tra lại sản phẩm có chứa thượng hiệu không?",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        }
    };

    const handleSortChange = (event) => {
        const value = event.target.value;
        setSortValue(value);
        const sortedData = [...rows].sort((a, b) => {
            if (value === "asc") {
                return a.name.localeCompare(b.name);
            } else if (value === "desc") {
                return b.name.localeCompare(a.name);
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

    const filteredRows = rows.filter((row) =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <Header subtitle="Danh sách thương hiệu" />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <TextField
                    variant="outlined"
                    placeholder="Tìm kiếm"
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

                <div style={{ display: "flex", gap: "10px" }}>
                    {/* Sort Dropdown */}
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

                    {/* Rows per page */}
                    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                        <InputLabel id="rowsPerPage-label">Hiển thị</InputLabel>
                        <Select
                            labelId="rowsPerPage-label"
                            value={rowsPerPage}
                            onChange={handleRowsPerPageOptionChange}
                            label="Số hàng"
                        >
                            <MenuItem value={10}>10/trang</MenuItem>
                            <MenuItem value={15}>15/trang</MenuItem>
                            <MenuItem value={20}>20/trang</MenuItem>
                            <MenuItem value={25}>25/trang</MenuItem>
                            <MenuItem value={30}>30/trang</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Add button */}
                    <Button variant="contained" onClick={() => handleOpenForm()}>
                        Thêm Mới
                    </Button>
                </div>
            </div>

            {/* Brand table */}
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: "100px" }}>ID</TableCell>
                            <TableCell style={{ width: "300px" }}>Tên Thương Hiệu</TableCell>
                            <TableCell style={{ width: "300px" }}>Xuất Xứ</TableCell>
                            <TableCell style={{ width: "300px" }}>Hình Ảnh</TableCell>
                            <TableCell style={{ width: "150px" }}>Hành Động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.place}</TableCell>
                                <TableCell>
                                    <img
                                        src={`http://localhost:8080/assets/img/${row.img}`}
                                        alt={row.name}
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            objectFit: "cover",
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenForm(row)}>
                                        <Edit color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(row.id)}>
                                        <Delete color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                rowsPerPageOptions={[10, 15, 20, 25, 30]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                }}
            />

            {/* Form Dialog */}
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
                <DialogContent>
                    <BrandForm
                        initialValues={editData || { name: "", place: "", img: "" }}
                        onClose={handleCloseForm}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default BrandLists;
