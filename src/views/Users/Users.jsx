// Users.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link, useOutletContext } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../sass/Users/Users/Users.css";
import Plus from "../../assets/icons/plus.svg";
import Trash from "../../assets/icons/trash.svg";
import Edit from "../../assets/icons/edit.svg";
import Search from "../../assets/icons/search.svg";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import API from "../../services/api";
import { DEPARTMENT_MAP } from "../../utils/constants";
import { timeAgo, formatDateTime } from "../../utils/timeAgo"; // ✅ Import utility
import { LoaderTable } from "../../components/LoaderTable";

export default function Users() {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        departmentId: "",
        role: "",
    });
    const { showConfirmDelete } = useOutletContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const itemsPerPage = 10;
    const navigate = useNavigate();

    // Check if user is admin
    useEffect(() => {
        if (user && user.role !== "ADMIN") {
            navigate("/unauthorized");
            return;
        }
    }, [user, navigate]);

    const loadData = async (
        page = 1,
        keyword = "",
        currentFilters = filters
    ) => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page,
                limit: itemsPerPage,
                search: keyword,
                sortBy: "created_at",
                sortOrder: "desc",
            };

            // Add filters if they exist
            if (currentFilters.departmentId)
                params.departmentId = currentFilters.departmentId;
            if (currentFilters.role) params.role = currentFilters.role;
            if (currentFilters.emailVerified !== "")
                params.emailVerified = currentFilters.emailVerified;

            const response = await API.get("/user", { params });

            const res = response.data;
            setData(res.data);
            setTotalPages(res.totalPages);
        } catch (error) {
            console.error("Error loading users:", error);
            setError("Failed to load users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === "ADMIN") {
            loadData(currentPage, search, filters);
        }
    }, [currentPage, search, filters, user]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (filterName, value) => {
        const newFilters = { ...filters, [filterName]: value };
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            departmentId: "",
            role: "",
            emailVerified: "",
        });
        setCurrentPage(1);
    };

    const handleEdit = (id_users) => {
        navigate(`/admin/edit-users/${id_users}`);
    };

    const handleDelete = async (id_users) => {
        try {
            setData((prev) =>
                prev.filter((item) => item.id_users !== id_users)
            );
            await API.delete(`/user/${id_users}`);
        } catch (error) {
            console.error("Error deleting user:", error);
            loadData(currentPage, search, filters);
        }
    };

    const handleClickDelete = (user) => {
        showConfirmDelete(user, () => handleDelete(user.id_users));
    };

    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

    if (user?.role !== "ADMIN") {
        return null;
    }

    return (
        <div className="users-admin">
            <div className="header-admin">
                <h2>
                    <strong>USER MANAGEMENT</strong>
                </h2>
                <Link to="/admin/add-users" className="add-users-btn-admin">
                    <img src={Plus} alt="Add Icon" />
                    Add User
                </Link>
            </div>

            {/* Filters Section */}
            <div className="filters-section-admin">
                <div className="search-box-admin">
                    <img
                        src={Search}
                        alt="Search Icon"
                        className="img-search-admin"
                    />
                    <input
                        type="text"
                        placeholder="Search by Name or Email"
                        value={search}
                        onChange={handleSearch}
                    />
                </div>

                <div className="filters-row-admin">
                    <select
                        value={filters.departmentId}
                        onChange={(e) =>
                            handleFilterChange("departmentId", e.target.value)
                        }
                        className="filter-select-admin"
                    >
                        <option value="">All Departments</option>
                        <option value="1">PC</option>
                        <option value="2">QC</option>
                        <option value="3">HD</option>
                        <option value="4">RL</option>
                        <option value="5">OQ</option>
                        <option value="6">BZ</option>
                    </select>

                    <select
                        value={filters.role}
                        onChange={(e) =>
                            handleFilterChange("role", e.target.value)
                        }
                        className="filter-select-admin"
                    >
                        <option value="">All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="MANAGER">Manager</option>
                        <option value="SUPERVISOR">Supervisor</option>
                        <option value="LEADER">Leader</option>
                        <option value="STAFF">Staff</option>
                        <option value="USER">User</option>
                    </select>

                    <button
                        onClick={clearFilters}
                        className="clear-filters-btn-admin"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {error && <div className="error-message-admin">{error}</div>}

            <div className="table-container-admin">
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Last Login</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="9"
                                    className="empty-row"
                                    style={{ height: "100px" }}
                                >
                                    <LoaderTable />
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="empty-row-admin">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            data.map((user, index) => (
                                <tr key={user.id_users}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>
                                        {DEPARTMENT_MAP[
                                            user.department?.name
                                        ] || "N/A"}
                                    </td>
                                    <td>
                                        <span
                                            className={`role-badge-admin role-${user.role.toLowerCase()}`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.no_hp || "N/A"}</td>
                                    <td>
                                        {/* ✅ Menggunakan time ago dengan tooltip */}
                                        <span
                                            className="last-login-admin"
                                            title={formatDateTime(
                                                user.last_login
                                            )} // Tooltip dengan tanggal lengkap
                                        >
                                            {timeAgo(user.last_login)}
                                        </span>
                                    </td>
                                    <td className="actions-admin">
                                        <button
                                            className="edit-btn-admin"
                                            onClick={() =>
                                                handleEdit(user.id_users)
                                            }
                                            title="Edit"
                                        >
                                            <img
                                                src={Edit}
                                                alt="Edit Icon"
                                                className="img-action-admin"
                                            />
                                        </button>
                                        <button
                                            className="delete-btn-admin"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleClickDelete(user);
                                            }}
                                            title="Delete"
                                            disabled={
                                                user.role === "ADMIN" &&
                                                user.id_users === user.id_users
                                            }
                                        >
                                            <img
                                                src={Trash}
                                                alt="Delete Icon"
                                                className="img-action-admin"
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination-admin">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="pagination-button-admin previous"
                >
                    <FaArrowLeft size={12} className="previous-icon" /> Previous
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                    <button
                        key={idx + 1}
                        className={`pagination-button-admin ${
                            currentPage === idx + 1 ? "active" : ""
                        }`}
                        onClick={() => setCurrentPage(idx + 1)}
                    >
                        {idx + 1}
                    </button>
                ))}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="pagination-button-admin next"
                >
                    Next <FaArrowRight size={12} className="next-icon" />
                </button>
            </div>
        </div>
    );
}
