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
import { Edit, Delete } from '@mui/icons-material';
import { tokens } from "../../../theme";
import Header from "../../../component/chart/Header";
import { useEffect, useState } from "react";
import { apiClient } from "../../../config/apiClient";
import FormSkinType from "./form";
import SearchIcon from '@mui/icons-material/Search';
import Swal from "sweetalert2";
import "../../../assets/css/admin/formIngredient.css";
import CloseIcon from '@mui/icons-material/Close';

const TableIngredient = () => {
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
        fetchIngredient();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleSortChange = (event) => {
        const value = event.target.value;
        setSortValue(value);
        const sortedData = [...rows].sort((a, b) => {
            if (value === "asc") return a.id - b.id;
            if (value === "desc") return b.id - a.id;
            return 0;
        });
        setRows(sortedData);
    };

    const handleRowsPerPageOptionChange = (event) => {
        const value = event.target.value;
        setRowsPerPage(value);
        setPage(0);
    };

    const fetchIngredient = async () => {
        try {
            const response = await apiClient.get("/api/ingredients");
            const formattedData = response.data
                .map((item) => ({
                    id: item.ingredientId,
                    name: item.name,
                }))
                .sort((a, b) => b.id - a.id);
            setRows(formattedData);
        } catch (error) {
            console.error("Error fetching data:", error);
            Swal.fire({
                title: "Lỗi",
                text: "Có lỗi xảy ra khi tải dữ liệu thành phần.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const handleOpenForm = (ingredient = null) => {
        setEditData(ingredient ? { ingredientId: ingredient.id, name: ingredient.name } : null);
        setIsFormOpen(true);
    };

    const handleCloseForm = (reloadData = false) => {
        setIsFormOpen(false);
        setEditData(null);
        if (reloadData) fetchIngredient();
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa thành phần này không?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Có, xóa!",
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
            try {
                await apiClient.delete(`/api/ingredients/${id}`);
                fetchIngredient();
                Swal.fire({
                    title: "Thành công!",
                    text: "Thành phần đã được xóa thành công.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            } catch (error) {
                console.error("Error deleting skin type:", error);
                Swal.fire({
                    title: "Lỗi!",
                    text: "Có lỗi xảy ra khi xóa thành phần. Vui lòng thử lại.",
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
            <Header subtitle="Danh Sách thành phần" />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <TextField
                    variant="outlined"
                    placeholder="Tìm kiếm thành phần"
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
                                <MenuItem value={10}>10/trang</MenuItem>
                                <MenuItem value={15}>15/trang</MenuItem>
                                <MenuItem value={20}>20/trang</MenuItem>
                                <MenuItem value={25}>25/trang</MenuItem>
                                <MenuItem value={30}>30/trang</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <Button variant="contained" onClick={() => handleOpenForm()}>
                        Thêm mới
                    </Button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <TableContainer style={{ flex: '1', minHeight: '400px' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: "100px" }}>ID</TableCell>
                                <TableCell style={{ width: "300px" }}>Tên thành phần</TableCell>
                                <TableCell style={{ width: "150px" }}>Hành Động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
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
                    <FormSkinType
                        editData={editData}
                        onClose={handleCloseForm}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default TableIngredient;
