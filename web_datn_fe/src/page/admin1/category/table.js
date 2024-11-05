import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    useTheme
} from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../../../assets/css/admin/formCategory.css";
import Header from "../../../component/chart/Header";
import { apiClient } from "../../../config/apiClient";
import { tokens } from "../../../theme";
import FormCategory from "./form"; // Changed to match the form for categories
import { Edit, Delete } from '@mui/icons-material';

const TableCategory = () => {
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
        fetchCategories();
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

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get("http://localhost:8080/api/categories");
            const formattedData = response.data
                .map((item) => ({
                    id: item.categoryId,
                    name: item.name,
                    imageUrl: item.img
                }))
                .sort((a, b) => b.id - a.id);

            setRows(formattedData);
        } catch (error) {
            console.error("Lỗi tìm nạp dữ liệu:", error);
            Swal.fire({
                title: "Error",
                text: "Đã xảy ra lỗi khi tìm nạp dữ liệu loại sản phẩm.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const handleOpenForm = (category = null) => {
        if (category) {
            setEditData({ categoryId: category.id, name: category.name });
        } else {
            setEditData(null);
        }
        setIsFormOpen(true);
    };

    const handleCloseForm = (reloadData = false) => {
        setIsFormOpen(false);
        setEditData(null);
        if (reloadData) {
            fetchCategories();
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa loại sản phẩm này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Vâng, xóa nó đi!",
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
            try {
                await apiClient.delete(`/api/categories/${id}`);
                fetchCategories();
                Swal.fire({
                    title: "Đã xóa!",
                    text: "Loại sản phẩm đã được xóa thành công.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            } catch (error) {
                console.error("Lỗi:", error);
                Swal.fire({
                    title: "Error!",
                    text: "Đã xảy ra lỗi khi xóa Loại sản phẩm. Vui lòng thử lại.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        }
    };

    const filteredRows = rows.filter((row) =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <Header subtitle="Danh sách loại sản phẩm" />
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
                    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                        <InputLabel id="sort-label">Sắp Xếp</InputLabel>
                        <Select
                            labelId="sort-label"
                            value={sortValue}
                            onChange={handleSortChange}
                            label="Sort"
                        >
                            <MenuItem value="asc">A-Z</MenuItem>
                            <MenuItem value="desc">Z-A</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                        <InputLabel id="rowsPerPage-label">Hàng</InputLabel>
                        <Select
                            labelId="rowsPerPage-label"
                            value={rowsPerPage}
                            onChange={handleRowsPerPageOptionChange}
                            label="Rows"
                        >
                            <MenuItem value={10}>10/trang</MenuItem>
                            <MenuItem value={15}>15/trang</MenuItem>
                            <MenuItem value={20}>20/trang</MenuItem>
                            <MenuItem value={25}>25/trang</MenuItem>
                            <MenuItem value={30}>30/trang</MenuItem>
                        </Select>
                    </FormControl>

                    <Button variant="contained" onClick={() => handleOpenForm()}>
                        Thêm mới
                    </Button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <TableContainer style={{ flex: '1', minHeight: '400px', marginTop: '30px' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: "100px" }}>ID</TableCell>
                                <TableCell style={{ width: "300px" }}>Tên loại sản phẩm</TableCell>
                                <TableCell style={{ width: "300px" }}>Hình ảnh</TableCell>
                                <TableCell style={{ width: "150px" }}>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>
                                            <img
                                                className="image"
                                                src={`http://localhost:8080/assets/img/${row.imageUrl}`}
                                                alt="Hình ảnh không hiển thị"
                                                style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                variant="contained"
                                                onClick={() => handleOpenForm(row)}
                                                sx={{ marginRight: "10px" }}
                                            >
                                                <Edit color="primary" />
                                            </IconButton>
                                            <IconButton
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDelete(row.id)}
                                            >
                                                <Delete color="secondary" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{ marginTop: '16px', alignSelf: 'center' }}>
                    <TablePagination
                        rowsPerPageOptions={[10, 15, 20, 25, 30]}
                        component="div"
                        count={filteredRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleRowsPerPageOptionChange}
                    />
                </div>
            </div>

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
                    <FormCategory
                        editData={editData}
                        onClose={handleCloseForm}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};
export default TableCategory;
