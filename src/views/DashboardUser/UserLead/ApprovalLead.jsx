import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../sass/User/UserLead/ApprovalLead/ApprovalLead.css";
import Detail from "../../../assets/icons/list.svg";
import Search from "../../../assets/icons/search.svg";
import API from "../../../service/api";

export default function ApprovalLead() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    const formatDate = (isoString) => {
        if (!isoString || isoString === "-") return "-";

        const date = new Date(isoString);
        if (isNaN(date.getTime())) return "-";

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${year}/${month}/${day} - ${hours}:${minutes}:${seconds}`;
    };

    const userStorage = JSON.parse(localStorage.getItem("user"));
    const userRole = userStorage.role;
    const userId = userStorage.id_users;
    const userDepartment = userStorage.id_department;

    const fetchData = async (page = 1, role = "", search = "") => {
        try {
            const params = {
                page,
                limit: itemsPerPage,
                role,
                userId,
                departmentId: userDepartment,
            };
            
            if (search.trim()) {
                params.search = search.trim();
            }

            const res = await API.get("/kanban/approved", { params });
            const result = res.data.approved;

            const formattedData = result.data.map((item) => ({
                ...item,
                approvedAt: item.approvedAt ? formatDate(item.approvedAt) : "-",
            }));

            setData(formattedData);
            setTotalPages(result.totalPages);
            setCurrentPage(result.page);
            setTotalItems(result.total);
        } catch (err) {
            console.error("Error fetching data:", err);
            alert("Gagal memuat data approved!");
        }
    };

    useEffect(() => {
        if (search) {
            setCurrentPage(1);
        }
    }, [search]);

    useEffect(() => {
        fetchData(currentPage, userRole, search);
    }, [currentPage, userRole, search]);

    const handleSearch = (e) => {
        const keyword = e.target.value;
        setSearch(keyword);
    };

    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

    const handleView = (id_kanban) => {
        localStorage.setItem("id_kanban", id_kanban);
        navigate(`/pc-lead/detailreq-pc-lead?id=${id_kanban}`);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="approve-pclead">
            <div className="header-pclead">
                <h2>
                    <strong>APPROVAL REQUEST</strong>
                </h2>
            </div>

            <div className="search-box-pclead">
                <img src={Search} alt="" className="img-search-pclead" />
                <input
                    type="text"
                    placeholder="Search by Parts Number or Requester Name"
                    value={search}
                    onChange={handleSearch}
                />
            </div>

            <div className="table-container-pclead">
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Approved At</th>
                            <th>Parts Number</th>
                            <th>Requester Name</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="empty-row-pclead">
                                    No data available.
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <tr key={`${item.id_kanban}-${item.approvedAt}-${index}`}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td>{item.approvedAt}</td>
                                    <td>{item.parts_number}</td>
                                    <td>{item.requester_name}</td>
                                    <td>
                                        <span
                                            className={`status-pclead ${item.status.toLowerCase()}`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="actions-pclead">
                                        <button
                                            className="view-btn-pclead"
                                            onClick={() => handleView(item.id_kanban)}
                                            title="View Detail Request"
                                        >
                                            <img
                                                src={Detail}
                                                alt=""
                                                className="img-action-pclead"
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination-pclead">
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="previous"
                >
                    ← Previous
                </button>
                {[...Array(totalPages)].map((_, idx) => {
                    const page = idx + 1;
                    return (
                        <button
                            key={page}
                            className={page === currentPage ? "active" : ""}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    );
                })}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="next"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}