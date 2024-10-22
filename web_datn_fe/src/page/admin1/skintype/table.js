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
import FormSkinType from "./form";
import SearchIcon from '@mui/icons-material/Search';
import Swal from "sweetalert2";
import "../../../assets/css/admin/formSkinType.css";
import CloseIcon from '@mui/icons-material/Close';
import { Edit, Delete } from '@mui/icons-material';

const TableSkinType = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(24);
    const [sortValue, setSortValue] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchSkinTypes();
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

    const fetchSkinTypes = async () => {
        try {
            const response = await apiClient.get("/api/skintypes");
            const formattedData = response.data.map((item) => ({
                id: item.skintypeId,
                name: item.name,
            })).sort((a, b) => b.id - a.id);

            setRows(formattedData);
        } catch (error) {
            console.error("Error fetching data:", error);
            Swal.fire({
                title: "Lỗi",
                text: "Có lỗi xảy ra khi tải dữ liệu loại da.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const handleOpenForm = (skinType = null) => {
        if (skinType) {
            setEditData({ skintypeId: skinType.id, name: skinType.name });
        } else {
            setEditData(null);
        }
        setIsFormOpen(true);
    };

    const handleCloseForm = (reloadData = false) => {
        setIsFormOpen(false);
        setEditData(null);
        if (reloadData) {
            fetchSkinTypes();
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa loại da này không?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Có, xóa!",
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
            try {
                await apiClient.delete(`/api/skintypes/${id}`);
                fetchSkinTypes();
                Swal.fire({
                    title: "Thành công!",
                    text: "Loại da đã được xóa thành công.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            } catch (error) {
                console.error("Error deleting skin type:", error);
                Swal.fire({
                    title: "Lỗi!",
                    text: "Có lỗi xảy ra khi xóa loại da. Vui lòng thử lại.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        }
    };

    const filteredRows = rows.filter((row) => {
        const matchesSearch = row.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <Box>
            <Header subtitle="Danh Sách Loại Da" />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <TextField
                    variant="outlined"
                    placeholder="Tìm kiếm loại da"
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

                    <Button variant="contained" onClick={() => handleOpenForm()}>
                        Thêm mới
                    </Button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <TableContainer style={{ flex: '1', marginTop: '30px' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: "100px" }}>ID</TableCell>
                                <TableCell style={{ width: "300px" }}>Tên loại da</TableCell>
                                <TableCell style={{ width: "150px" }}>Thao tác</TableCell>
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

            <Dialog
                open={isFormOpen}
                onClose={() => handleCloseForm(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle style={{ fontWeight: 'bolder', fontSize: '1.5em' }}>
                    {editData ? "Chỉnh sửa loại da" : "Thêm mới loại da"}
                    <IconButton
                        edge="end"
                        style={{ float: 'right', right: 2, color: 'red', fontWeight: 'bolder' }}
                        onClick={() => handleCloseForm(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <FormSkinType 
                        editData={editData} 
                        handleCloseForm={handleCloseForm} 
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default TableSkinType;
