// import React, { useEffect, useMemo, useState } from 'react';
// import { useTable, usePagination } from 'react-table';
// import axios from 'axios';
// import '../../../assets/css/TableProduct.css'; // CSS riêng cho bảng

// const TableProduct = () => {
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [search, setSearch] = useState('');

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8080/api/products'); // Thay đổi URL nếu cần
//                 setData(response.data);
//             } catch (err) {
//                 setError(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     const columns = useMemo(
//         () => [
//             { Header: 'ID', accessor: 'id' },
//             { Header: 'Name', accessor: 'name' },
//             { Header: 'Price', accessor: 'price' },
//             { Header: 'Category', accessor: 'category' },
//             { Header: 'Created Date', accessor: 'createdDate' },
//         ],
//         []
//     );

//     const {
//         getTableProps,
//         getTableBodyProps,
//         headerGroups,
//         page,
//         prepareRow,
//         setPageSize,
//         canPreviousPage,
//         canNextPage,
//         nextPage,
//         previousPage,
//         gotoPage,
//         pageCount,
//         state: { pageIndex, pageSize },
//     } = useTable(
//         {
//             columns,
//             data: data.filter(row =>
//                 Object.values(row).some(value =>
//                     value.toString().toLowerCase().includes(search.toLowerCase())
//                 )
//             ),
//             initialState: { pageIndex: 0 },
//         },
//         usePagination
//     );

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error.message}</div>;

//     return (
//         <>
//             <h1>Product Management</h1>
//             <input
//                 type="text"
//                 placeholder="Search..."
//                 value={search}
//                 onChange={e => setSearch(e.target.value)}
//                 className="search-input"
//             />
//             <table {...getTableProps()} className="table">
//                 <thead>
//                     {headerGroups.map(headerGroup => (
//                         <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
//                             {headerGroup.headers.map(column => (
//                                 <th {...column.getHeaderProps()} key={column.id}>
//                                     {column.render('Header')}
//                                 </th>
//                             ))}
//                         </tr>
//                     ))}
//                 </thead>
//                 <tbody {...getTableBodyProps()}>
//                     {page.map(row => {
//                         prepareRow(row);
//                         return (
//                             <tr {...row.getRowProps()} key={row.id}>
//                                 {row.cells.map(cell => (
//                                     <td {...cell.getCellProps()} key={cell.column.id}>
//                                         {cell.render('Cell')}
//                                     </td>
//                                 ))}
//                             </tr>
//                         );
//                     })}
//                 </tbody>
//             </table>
//             <div className="pagination">
//                 <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
//                     {'<<'}
//                 </button>
//                 <button onClick={previousPage} disabled={!canPreviousPage}>
//                     {'<'}
//                 </button>
//                 <button onClick={nextPage} disabled={!canNextPage}>
//                     {'>'}
//                 </button>
//                 <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
//                     {'>>'}
//                 </button>
//                 <span>
//                     Page <strong>{pageIndex + 1} of {pageCount}</strong>
//                 </span>
//                 <select
//                     value={pageSize}
//                     onChange={e => {
//                         setPageSize(Number(e.target.value));
//                     }}
//                 >
//                     {[5, 10, 20, 30].map(size => (
//                         <option key={size} value={size}>
//                             Show {size}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//         </>
//     );
// };

// export default TableProduct;
