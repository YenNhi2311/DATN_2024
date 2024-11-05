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
    useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Header from "../../../component/chart/Header";
import { apiClient } from "../../../config/apiClient";
import { tokens } from "../../../theme";
import BrandForm from "./form"; // Your form component
import { Edit, Delete } from '@mui/icons-material';

const BrandLists = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
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
            }));
            setRows(formattedData);
        } catch (error) {
            console.error("Error fetching brands:", error);
            Swal.fire({
                title: "Error",
                text: "An error occurred while fetching brand data.",
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
            title: "Confirm Deletion",
            text: "Are you sure you want to delete this brand?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                await apiClient.delete(`/api/brands/${id}`);
                fetchBrands();
                Swal.fire({
                    title: "Deleted!",
                    text: "Brand has been deleted successfully.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            } catch (error) {
                console.error("Error deleting brand:", error);
                Swal.fire({
                    title: "Error!",
                    text: "An error occurred while deleting the brand. Please try again.",
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
            <Header subtitle="Brand List" />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <TextField
                    variant="outlined"
                    placeholder="Search"
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
                <Button variant="contained" onClick={() => handleOpenForm()}>
                    Thêm Mới
                </Button>
            </div>

            {/* Bảng thương hiệu */}
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
                                        src={row.img}
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

            {/* Phân trang */}
            <TablePagination
                rowsPerPageOptions={[15, 30, 50]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                sx={{
                    "& .MuiTablePagination-displayedRows": {
                      marginBottom: "0px",
                    },
                    "& .MuiTablePagination-selectLabel": {
                      marginBottom: "0px",
                    },
                  }}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                }}
            />

            {/* Dialog cho form thêm/cập nhật thương hiệu */}
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
                        onSubmit={() => {
                            handleCloseForm(true);
                        }}
                        handleClose={handleCloseForm}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default BrandLists;
