import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../sass/AuditLog/AuditLog.css";
import Detail from "../assets/icons/list.svg";
import Search from "../assets/icons/search.svg";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import API from "../services/api";
import { LoaderTable } from "../components/LoaderTable";

export default function AuditLog({
    navigationPath = "/admin/audit-log-detail",
}) {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
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

    const fetchData = async (page = 1, searchTerm = "") => {
        setLoading(true);
        setError("");
        try {
            const params = {
                page,
                limit: itemsPerPage,
            };

            if (searchTerm.trim()) {
                params.search = searchTerm.trim();
            }

            const res = await API.get("/audit-log", { params });

            if (res.data.success) {
                const result = res.data.data;
                const pagination = res.data.pagination;

                setData(result);
                setTotalPages(pagination.totalPages);
                setCurrentPage(pagination.page);
                setTotalItems(pagination.total);
            } else {
                throw new Error(
                    res.data.message || "Failed to fetch audit logs"
                );
            }
        } catch (err) {
            console.error("Error fetching audit logs:", err);
            setError(
                err.response?.data?.message || "Failed to load audit logs"
            );

            // If unauthorized, redirect to login
            if (err.response?.status === 403) {
                setError(
                    "Access denied. Only administrators can view audit logs."
                );
            } else if (err.response?.status === 401) {
                navigate("/login");
                return;
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (search) {
            setCurrentPage(1);
        }
    }, [search]);

    useEffect(() => {
        fetchData(currentPage, search);
    }, [currentPage, search]);

    const handleSearch = (e) => {
        const keyword = e.target.value;
        setSearch(keyword);
    };

    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

    const handleView = (auditLogId) => {
        navigate(`${navigationPath}/${auditLogId}`);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getActionBadgeColor = (action) => {
        const actionColors = {
            LOGIN: "green",
            LOGOUT: "gray",
            PASSWORD_CHANGED: "yellow",
            PASSWORD_RESET: "orange",
            USER_CREATED: "green",
            USER_UPDATED: "blue",
            USER_DELETED: "red",
            EMAIL_VERIFIED: "blue",
            PROFILE_UPDATED: "blue",
        };

        return actionColors[action] || "gray";
    };

    const formatAction = (action) => {
        return action
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    if (error) {
        return (
            <div className="auditlog">
                <div className="auditlog__header">
                    <h2>
                        <strong>AUDIT LOG</strong>
                    </h2>
                </div>
                <div
                    style={{
                        textAlign: "center",
                        padding: "2rem",
                        color: "#dc3545",
                        fontSize: "18px",
                    }}
                >
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="auditlog">
            <div className="auditlog__header">
                <h2>
                    <strong>AUDIT LOG</strong>
                </h2>
            </div>

            <div className="auditlog__search">
                <img src={Search} alt="" className="auditlog__search-icon" />
                <input
                    type="text"
                    placeholder="Search by Action or User Name"
                    value={search}
                    onChange={handleSearch}
                    className="auditlog__search-input"
                />
            </div>

            <div className="auditlog__table-container">
                <table className="auditlog__table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Action</th>
                            <th>Table</th>
                            <th>User</th>
                            <th>IP Address</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="auditlog__empty-row"
                                    style={{ height: "100px" }}
                                >
                                    <LoaderTable />
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="auditlog__empty-row">
                                    {search
                                        ? "No audit logs found matching your search."
                                        : "No audit logs available."}
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td>
                                        <span
                                            className={`auditlog__status auditlog__status--${getActionBadgeColor(
                                                item.action
                                            )}`}
                                        >
                                            {formatAction(item.action)}
                                        </span>
                                    </td>
                                    <td>{item.table_name || "-"}</td>
                                    <td>
                                        <div>
                                            <div style={{ fontWeight: "600" }}>
                                                {item.user?.name ||
                                                    "System/Deleted User"}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#666",
                                                }}
                                            >
                                                {item.user?.role || "N/A"}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{item.metadata?.ip_address || "-"}</td>
                                    <td>
                                        {item.metadata?.formatted_date ||
                                            formatDate(
                                                item.metadata?.created_at
                                            )}
                                    </td>
                                    <td className="auditlog__actions">
                                        <button
                                            className="auditlog__view-btn"
                                            onClick={() => handleView(item.id)}
                                            title="View Detail"
                                        >
                                            <img
                                                src={Detail}
                                                alt=""
                                                className="auditlog__action-icon"
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {!loading && data.length > 0 && (
                <div className="auditlog__pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="auditlog__pagination-btn previous-btn"
                    >
                        <FaArrowLeft size={12} className="previous-icon" />{" "}
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, idx) => {
                        const page = idx + 1;
                        return (
                            <button
                                key={page}
                                className={`auditlog__pagination-btn ${
                                    page === currentPage ? "active-btn" : ""
                                }`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        );
                    })}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="auditlog__pagination-btn next-btn"
                    >
                        Next <FaArrowRight size={12} className="next-icon" />
                    </button>
                </div>
            )}
        </div>
    );
}
