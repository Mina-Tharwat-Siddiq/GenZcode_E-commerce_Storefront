import React, { useState } from 'react';
import './Table.css'

function DataTable({
    title = "Data",
    data = [],
    renderRow,
    showAddButton =false,
    addButtonText = "Add Product",
    onAddClick,
    showSearch = true,
    // showPagination = true,
    totalItems,
    limit = 10,
    currentPage,
    onPageChange,
}) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter products based on search
    const filteredData = data.filter(item =>
        Object.values(item).some(
            value => value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const totalPages = Math.ceil(totalItems / limit);

    const pageNumbers = [];
    for(let i = 1; i <= totalPages; i++)
    {
        pageNumbers.push(i);
    }
    return (
        <div className="container py-5">
            <div className="card p-4">
                {/*  Header Appears Above Table */}
                <div className="d-flex justify-content-between align-items-center mb-4 table_header">
                    <h5 className="fw-bold mb-0">{title}</h5>
                    <div className="d-flex gap-3">
                        {showAddButton &&(
                            <button className="btn btn-add btn-dark" onClick={onAddClick}>{addButtonText}</button> 
                        )}
                        {showSearch && (
                            <input type="text" className="search-box" placeholder={`Search ${title.toLowerCase()}`} value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
                        )}
                    </div>
                </div>

                <div className="table-responsive">
                    {/* Table */}
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                {renderRow.header()}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length === 0 ?(
                            <tr>
                                <td colSpan={"10"} className='text-center py-4'>
                                    No Data Found
                                </td>
                            </tr>
                            ):(
                                filteredData.map((item, index) => renderRow.body(item,index))
                            )
                        }
                        </tbody>
                    </table>
                </div>
                {/* Make Pagination */}
                <nav>
                    <ul className="pagination justify-content-center mt-4">
                        {/* Previous Button */}
                        <li className={`page-item ${currentPage === 1 ? 'disabled':''}`}>
                            <button className='page-link' 
                            onClick={()=> onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}>
                                ‹
                            </button>
                        </li>

                        {/* Pages */}
                        {pageNumbers.map(num => (
                            <li key={num} className={`page-item ${currentPage === num ? 'active': ''}`}>
                                <button className='page-link' onClick={() => onPageChange(num)}>
                                    {num}
                                </button>
                            </li>
                        ))}
                        {/* Next Button */}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled':''}`}>
                            <button className='page-link' 
                            onClick={()=> onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}>
                                ›
                            </button>
                        </li>
                    </ul>
                </nav>
            
            </div>
        </div>
    );
}

export default DataTable;
