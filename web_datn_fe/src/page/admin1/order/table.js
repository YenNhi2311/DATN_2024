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
    IconButton,
    Checkbox
} from "@mui/material";
import { tokens } from "../../../theme";
import FormOrder from "./form";
import Header from "../../../component/chart/Header";
import { useEffect, useState } from "react";
import { apiClient } from "../../../config/apiClient";
import SearchIcon from '@mui/icons-material/Search';
import Swal from "sweetalert2";
import CloseIcon from '@mui/icons-material/Close';
import { Edit, Delete } from '@mui/icons-material';

const TableOrder = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortValue, setSortValue] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [orders, setOrders] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]); // Danh sách đơn hàng được chọn
    const [newStatus, setNewStatus] = useState(""); // Trạng thái mới để cập nhật
    const [orderStatus, setOrderStatus] = useState("");
    const statusOptions = ["chờ xác nhận", "đã xác nhận", "chờ vận chuyển", "đã giao"];

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleSortChange = (event) => {
        const value = event.target.value;
        setSortValue(value);
        const sortedData = [...rows].sort((a, b) => {
            if (value === "asc") {
                return a.orderId - b.orderId;
            } else if (value === "desc") {
                return b.orderId - a.orderId;
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

    const fetchOrders = async () => {
        try {
            const response = await apiClient.get("/api/orders");
            const formattedData = response.data.map((item) => ({
                orderId: item.orderId,
                orderDate: item.orderDate,
                total: item.total,
                status: item.status,
            })).sort((a, b) => b.orderId - a.orderId);

            setRows(formattedData);
        } catch (error) {
            console.error("Error fetching data:", error);
            Swal.fire({
                title: "Lỗi",
                text: "Có lỗi xảy ra khi tải dữ liệu đơn hàng.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const handleOpenForm = (order = null) => {
        if (order) {
            setEditData(order);
        } else {
            setEditData(null);
        }
        setIsFormOpen(true);
    };

    const handleCloseForm = (reloadData = false) => {
        setIsFormOpen(false);
        setEditData(null);
        if (reloadData) {
            fetchOrders();
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa đơn hàng này không?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Có, xóa!",
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
            try {
                await apiClient.delete(`/api/orders/${id}`);
                fetchOrders();
                Swal.fire({
                    title: "Thành công!",
                    text: "Đơn hàng đã được xóa thành công.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            } catch (error) {
                console.error("Error deleting order:", error);
                Swal.fire({
                    title: "Lỗi!",
                    text: "Có lỗi xảy ra khi xóa đơn hàng. Vui lòng thử lại.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        }
    };

    const filteredRows = rows.filter((row) => {
        const matchesSearch = row.orderId.toString().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const [selectedIds, setSelectedIds] = useState([]); // Mảng để lưu trữ ID của đơn hàng đã chọn
    const isChecked = (orderId) => selectedIds.includes(orderId);

    const handleCheckboxChange = (orderId) => {
        setSelectedIds((prevSelectedIds) => {
            if (prevSelectedIds.includes(orderId)) {
                return prevSelectedIds.filter((selectedId) => selectedId !== orderId);
            } else {
                return [...prevSelectedIds, orderId];
            }
        });
    };


    const handleStatusChange = async (event) => {
        const selectedStatus = event.target.value;
        setOrderStatus(selectedStatus);

        // Kiểm tra xem đã chọn ít nhất một đơn hàng và trạng thái mới chưa
        if (selectedIds.length === 0 || !selectedStatus) {
            Swal.fire({
                title: "Chú ý",
                text: "Hãy chọn ít nhất một đơn hàng và trạng thái cần cập nhật.",
                icon: "warning",
                confirmButtonText: "OK",
            });
            return;
        }

        try {
            // Cập nhật trạng thái cho tất cả các đơn hàng đã chọn
            await Promise.all(selectedIds.map(orderId =>
                apiClient.put(`/api/orders/${orderId}/status`, { status: selectedStatus })
            ));

            Swal.fire({
                title: "Thành công",
                text: "Trạng thái đơn hàng đã được cập nhật.",
                icon: "success",
                confirmButtonText: "OK",
            });

            // Đặt lại danh sách đơn hàng đã chọn và trạng thái mới sau khi cập nhật
            setSelectedIds([]);
            setOrderStatus("");
            fetchOrders(); // Làm mới danh sách đơn hàng
        } catch (error) {
            console.error("Error updating status:", error);
            Swal.fire({
                title: "Lỗi",
                text: "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };


    return (
        <Box>
            <Header subtitle="Danh Sách Đơn Hàng" />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <TextField
                    variant="outlined"
                    placeholder="Tìm kiếm Đơn Hàng"
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
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            labelId="status-label"
                            value={orderStatus}
                            onChange={handleStatusChange}
                            displayEmpty
                        >
                            <MenuItem value="Chờ xác nhận">Chờ xác nhận</MenuItem>
                            <MenuItem value="Đã xác nhận">Đã xác nhận</MenuItem>
                            <MenuItem value="Chờ vận chuyển">Chờ vận chuyển</MenuItem>
                            <MenuItem value="Đã giao">Đã giao</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <TableContainer style={{ marginTop: '30px' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Chọn</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Ngày đặt</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <TableRow key={row.orderId}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isChecked(row.orderId)} // Kiểm tra xem đơn hàng đã được chọn chưa
                                            onChange={() => handleCheckboxChange(row.orderId)} // Gọi hàm khi checkbox được thay đổi
                                        />
                                    </TableCell>
                                    <TableCell>{row.orderId}</TableCell>
                                    <TableCell>{row.orderDate}</TableCell>
                                    <TableCell>{row.total}</TableCell>
                                    <TableCell>
                                        {row.status === "Chờ xác nhận"
                                            ? "Chờ xác nhận"
                                            : row.status === "Đã xác nhận"
                                                ? "Đã xác nhận"
                                                : row.status === "Chờ vận chuyển"
                                                    ? "Chờ vận chuyển"
                                                    : "Đã giao"}
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
                                            onClick={() => handleDelete(row.orderId)}
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
                rowsPerPageOptions={[10, 15, 20, 25]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleRowsPerPageOptionChange}
            />

            <Dialog
                open={isFormOpen}
                onClose={() => handleCloseForm(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editData ? "Chỉnh sửa đơn hàng" : "Thêm mới đơn hàng"}
                    <IconButton
                        edge="end"
                        style={{ float: 'right', right: 2, color: 'red' }}
                        onClick={() => handleCloseForm(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <FormOrder 
                        editData={editData}
                        handleCloseForm={handleCloseForm} 
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default TableOrder;
