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
    TextField, // Nhập TextField cho input tìm kiếm
    Select, // Nhập Select cho thanh lọc
    MenuItem, // Nhập MenuItem cho các lựa chọn trong Select
    FormControl, // Nhập FormControl để bọc Select
    InputLabel, // Nhập InputLabel cho Select
    Dialog,
    DialogContent,
    DialogTitle,
    useTheme,
    IconButton
} from "@mui/material"; // Nhập các component từ thư viện MUI để xây dựng UI
import { tokens } from "../../../theme"; // Nhập theme để lấy màu sắc
import Header from "../../../component/chart/Header"; // Nhập header tùy chỉnh
import { useEffect, useState } from "react"; // Nhập hooks từ React
import { apiClient } from "../../../config/apiClient"; // Nhập client API để gọi backend
import FormSkinType from "./form"; // Nhập form quản lý màu sản phẩm
import SearchIcon from '@mui/icons-material/Search';
import Swal from "sweetalert2"; // Nhập thư viện Swal để hiển thị thông báo
import "../../../assets/css/admin/formColor.css";
import CloseIcon from '@mui/icons-material/Close'; // Nhập CloseIcon
import { Edit, Delete } from '@mui/icons-material';

const TableColor = () => {
    const theme = useTheme(); // Lấy theme hiện tại
    const colors = tokens(theme.palette.mode); // Lấy màu sắc tương ứng với chế độ hiện tại (light/dark)

    // Khởi tạo các state cần thiết
    const [rows, setRows] = useState([]); // Lưu trữ dữ liệu màu sản phẩm
    const [page, setPage] = useState(0); // Trạng thái trang hiện tại
    const [rowsPerPage, setRowsPerPage] = useState(24); // Phân trang bắt đầu với 24 hàng
    const [sortValue, setSortValue] = useState(""); // Trạng thái cho sắp xếp
    const [isFormOpen, setIsFormOpen] = useState(false); // Trạng thái form thêm/cập nhật
    const [editData, setEditData] = useState(null); // Dữ liệu để chỉnh sửa màu sản phẩm
    const [searchTerm, setSearchTerm] = useState(""); // State cho input tìm kiếm
    const [filterValue, setFilterValue] = useState(""); // State cho thanh lọc

    useEffect(() => {
        fetchColors(); // Gọi hàm fetchColors khi component được mount
    }, []); // Chỉ chạy 1 lần khi component mount

    // Hàm xử lý thay đổi trang
    const handleChangePage = (event, newPage) => {
        setPage(newPage); // Cập nhật trang hiện tại
    };

    // Hàm thay đổi giá trị sắp xếp từ A-Z hoặc Z-A
    const handleSortChange = (event) => {
        const value = event.target.value;
        setSortValue(value);
        // Sắp xếp dữ liệu
        const sortedData = [...rows].sort((a, b) => {
            if (value === "asc") {
                return a.id - b.id; // Sắp xếp tăng dần theo id
            } else if (value === "desc") {
                return b.id - a.id; // Sắp xếp giảm dần theo id
            }
            return 0; // Không sắp xếp
        });
        setRows(sortedData);
    };

    // Hàm xử lý thay đổi số hàng hiển thị trên mỗi trang dựa trên giá trị của Select
    const handleRowsPerPageOptionChange = (event) => {
        const value = event.target.value;
        setRowsPerPage(value); // Cập nhật số hàng hiển thị
        setPage(0); // Đặt lại trang về 0 sau khi chọn số hàng mới
    };

    // Hàm gọi API để lấy dữ liệu màu sản phẩm và sắp xếp từ lớn đến bé theo id
    const fetchColors = async () => {
        try {
            const response = await apiClient.get("/api/colors"); // Gọi API
            const formattedData = response.data
                .map((item) => ({
                    id: item.colorId, // Lưu ID màu sản phẩm
                    name: item.name, // Lưu tên màu sản phẩm
                }))
                .sort((a, b) => b.id - a.id); // Sắp xếp theo id từ lớn đến bé

            setRows(formattedData); // Cập nhật state rows với dữ liệu đã định dạng
        } catch (error) {
            console.error("Error fetching data:", error); // Log lỗi nếu có
            Swal.fire({ // Hiển thị thông báo lỗi
                title: "Lỗi",
                text: "Có lỗi xảy ra khi tải dữ liệu màu sản phẩm.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    // Hàm mở form để thêm/cập nhật màu sản phẩm
    const handleOpenForm = (color = null) => {
        if (color) {
            // Nếu color có giá trị, thiết lập dữ liệu chỉnh sửa
            setEditData({ colorId: color.id, name: color.name });
        } else {
            // Nếu không, thiết lập editData về null
            setEditData(null);
        }
        setIsFormOpen(true); // Mở form
    };

    // Hàm đóng form và cập nhật dữ liệu nếu cần
    const handleCloseForm = (reloadData = false) => {
        setIsFormOpen(false); // Đóng form
        setEditData(null); // Reset dữ liệu chỉnh sửa
        if (reloadData) {
            fetchColors(); // Cập nhật bảng sau khi thao tác thành công
        }
    };

    // Hàm xử lý xóa màu sản phẩm
    const handleDelete = async (id) => {
        const result = await Swal.fire({ // Hiển thị hộp thoại xác nhận
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa màu sản phẩm này không?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Có, xóa!",
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) { // Nếu xác nhận xóa
            try {
                await apiClient.delete(`/api/colors/${id}`); // Gọi API để xóa
                fetchColors(); // Cập nhật bảng sau khi xóa
                Swal.fire({ // Hiển thị thông báo thành công
                    title: "Thành công!",
                    text: "màu sản phẩm đã được xóa thành công.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            } catch (error) {
                console.error("Error deleting skin type:", error); // Log lỗi nếu có
                Swal.fire({ // Hiển thị thông báo lỗi
                    title: "Lỗi!",
                    text: "Có lỗi xảy ra khi xóa màu sản phẩm. Vui lòng thử lại.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        }
    };

    // Hàm lọc dữ liệu dựa trên searchTerm và filterValue
    const filteredRows = rows.filter((row) => {
        const matchesSearch = row.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch; // Thay đổi điều kiện lọc nếu cần
    });


    return (
        <Box>
        <Header subtitle="Danh Sách màu sản phẩm" />
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            {/* Thanh tìm kiếm */}
            <TextField
                variant="outlined"
                placeholder="Tìm kiếm màu sản phẩm"
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
                            <MenuItem value={10}>10/trang</MenuItem>
                            <MenuItem value={15}>15/trang</MenuItem>
                            <MenuItem value={20}>20/trang</MenuItem>
                            <MenuItem value={25}>25/trang</MenuItem>
                            <MenuItem value={30}>30/trang</MenuItem>
                        </Select>
                    </FormControl>
                </div>
    
                {/* Nút thêm */}
                <Button variant="contained" onClick={() => handleOpenForm()}>
                    Thêm mới
                </Button>
            </div>
        </div>
    
        {/* Bảng màu sản phẩm */}
        <TableContainer style={{ minHeight: '400px', maxHeight: '400px', overflowY: 'auto', marginTop: '30px' }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ width: "100px" }}>ID</TableCell>
                        <TableCell style={{ width: "300px" }}>Tên màu </TableCell>
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
                                        onClick={() => handleOpenForm(row)} // Mở form với dữ liệu của màu sản phẩm đang chọn
                                        sx={{ marginRight: "10px" }}
                                    >
                                        <Edit color="primary"/>
                                    </IconButton>
                                    <IconButton
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDelete(row.id)} // Gọi hàm xóa màu sản phẩm
                                    >
                                        <Delete color="secondary"/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    {/* Khi không đủ dòng, thêm các dòng trống để đẩy phân trang xuống */}
                    {filteredRows.length < rowsPerPage &&
                        Array.from({ length: rowsPerPage - filteredRows.length }).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell colSpan={3} />
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    
        {/* Phần phân trang cố định */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
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
    
        {/* Dialog cho form thêm/cập nhật màu sản phẩm */}
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

export default TableColor; // Xuất component để sử dụng ở nơi khác
