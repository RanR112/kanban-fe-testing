import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useOutletContext } from "react-router-dom";
import { DEPARTMENTS, DEPARTMENT_MAP } from "../utils/constants";
import "../sass/Registration/Registration.scss";
import Search from "../assets/icons/search.svg";
import Detail from "../assets/icons/list.svg";
import Check from "../assets/icons/check.svg";
import Cross from "../assets/icons/xmark-white.svg";
import Delete from "../assets/icons/trash.svg";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { LoaderTable } from "../components/LoaderTable";
import RegistrationDetailModal from "../components/RegistrationDetailModal";
import RejectReasonModal from "../components/RejectReasonModal";

export default function Registration() {
    const { user, apiCall } = useAuth();
    const handlers = useOutletContext();
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const itemsPerPage = 10;

    // Check if user is admin
    useEffect(() => {
        if (!loading && (!user || user.role !== "ADMIN")) {
            window.location.href = "/admin/home-admin";
        }
    }, [user, loading]);

    const formatDate = (isoString) => {
        if (!isoString || isoString === "-") return "-";
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return "-";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}/${month}/${day} - ${hours}:${minutes}`;
    };

    const fetchData = async (
        page = 1,
        searchTerm = "",
        status = "",
        department = ""
    ) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: itemsPerPage.toString(),
                sortBy: "created_at",
                sortOrder: "desc",
            });

            if (searchTerm.trim()) {
                params.append("search", searchTerm.trim());
            }
            if (status) {
                params.append("status", status);
            }
            if (department) {
                params.append("departmentId", department);
            }

            const response = await apiCall(
                `/registration/admin/all?${params}`,
                {
                    method: "GET",
                }
            );

            if (response.success) {
                const formattedData = response.data.map((item) => ({
                    ...item,
                    created_at: formatDate(item.created_at),
                    verified_at: item.verified_at
                        ? formatDate(item.verified_at)
                        : "-",
                    department_name: item.department?.name || "-",
                    verifier_name: item.verifier?.name || "-",
                }));

                setData(formattedData);
                setTotalPages(response.pagination.totalPages);
                setCurrentPage(response.pagination.page);
                setTotalItems(response.pagination.total);
            }
        } catch (error) {
            console.error("Error fetching registrations:", error);
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
        if (statusFilter || departmentFilter) {
            setCurrentPage(1);
        }
    }, [statusFilter, departmentFilter]);

    useEffect(() => {
        fetchData(currentPage, search, statusFilter, departmentFilter);
    }, [currentPage, search, statusFilter, departmentFilter]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleStatusFilter = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleDepartmentFilter = (e) => {
        setDepartmentFilter(e.target.value);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

    const handleViewDetail = async (registration) => {
        try {
            const response = await apiCall(
                `/registration/admin/${registration.id_registration}`
            );
            if (response.success) {
                setSelectedRegistration(response.data);
                setShowDetail(true);
            }
        } catch (error) {
            console.error("Error fetching registration detail:", error);
        }
    };

    const executeApprove = async (registration) => {
        setActionLoading(true);
        try {
            const response = await apiCall(
                `/registration/admin/${registration.id_registration}/approve`,
                {
                    method: "POST",
                    body: JSON.stringify({}),
                }
            );

            if (response.success) {
                fetchData(currentPage, search, statusFilter, departmentFilter);
            } else {
                console.log(response.message || "Failed to approve registration!");
            }
        } catch (error) {
            console.error("Error approving registration:", error);
        } finally {
            setActionLoading(false);
        }
    };

    const executeReject = async (registration, reason) => {
        setActionLoading(true);
        try {
            const response = await apiCall(
                `/registration/admin/${registration.id_registration}/reject`,
                {
                    method: "POST",
                    body: JSON.stringify({ rejection_reason: reason.trim() }),
                }
            );

            if (response.success) {
                fetchData(currentPage, search, statusFilter, departmentFilter);
                setShowRejectModal(false);
                setRejectionReason("");
                setSelectedRegistration(null);
            } else {
                console.log(response.message || "Failed to reject registration!");
            }
        } catch (error) {
            console.error("Error rejecting registration:", error);
        } finally {
            setActionLoading(false);
        }
    };

    const executeDelete = async (registration) => {
        setActionLoading(true);
        try {
            const response = await apiCall(
                `/registration/admin/${registration.id_registration}`,
                {
                    method: "DELETE",
                }
            );

            if (response.success) {
                fetchData(currentPage, search, statusFilter, departmentFilter);
            } else {
                console.log(response.message || "Failed to delete registration!");
            }
        } catch (error) {
            console.error("Error deleting registration:", error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleApprove = (registration) => {
        if (
            window.confirm(
                `Are you sure you want to approve registration for ${registration.name} (${registration.email})?\n\nThis will create a new user account.`
            )
        ) {
            executeApprove(registration);
        }
    };

    const handleReject = (registration) => {
        setSelectedRegistration(registration);
        setRejectionReason("");
        setShowRejectModal(true);
    };

    const handleRejectConfirm = () => {
        if (!rejectionReason.trim()) {
            return;
        }
        executeReject(selectedRegistration, rejectionReason);
    };

    const handleRejectCancel = () => {
        setShowRejectModal(false);
        setRejectionReason("");
        setSelectedRegistration(null);
    };

    const handleDelete = (registration) => {
        if (
            window.confirm(
                `Are you sure you want to permanently delete registration for ${registration.name} (${registration.email})?\n\nThis action cannot be undone.`
            )
        ) {
            executeDelete(registration);
        }
    };

    const getStatusBadge = (status) => {
        if (status === "APPROVED") {
            return (
                <span className="registration-status registration-status-approved">
                    APPROVED
                </span>
            );
        } else if (status === "REJECTED") {
            return (
                <span className="registration-status registration-status-rejected">
                    REJECTED
                </span>
            );
        } else {
            return <span className="registration-status">PENDING</span>;
        }
    };

    const canApprove = (registration) => {
        return registration.status === "PENDING" && registration.email_verified;
    };

    const canReject = (registration) => {
        return registration.status === "PENDING";
    };

    const canDelete = (registration) => {
        return (
            registration.status === "REJECTED" ||
            (registration.status === "PENDING" && !registration.email_verified)
        );
    };

    if (!user || user.role !== "ADMIN") {
        return (
            <div className="registration">
                <div className="registration__header">
                    <h2>Access Denied</h2>
                    <p>Only administrators can access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="registration">
            <div className="registration__header">
                <h2>
                    <strong>REGISTRATION MANAGEMENT</strong>
                </h2>

                {/* Filters Section */}
                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilter}
                        style={{
                            padding: "0.5rem",
                            border: "1px solid rgba(0, 0, 0, 0.35)",
                            borderRadius: "12px",
                            fontSize: "14px",
                            minWidth: "120px",
                        }}
                    >
                        <option value="">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>

                    <select
                        value={departmentFilter}
                        onChange={handleDepartmentFilter}
                        style={{
                            padding: "0.5rem",
                            border: "1px solid rgba(0, 0, 0, 0.35)",
                            borderRadius: "12px",
                            fontSize: "14px",
                            minWidth: "150px",
                        }}
                    >
                        <option value="">All Departments</option>
                        {DEPARTMENTS.slice(1).map((dept) => (
                            <option key={dept.value} value={dept.value}>
                                {DEPARTMENT_MAP[dept.value] || dept.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Search Section */}
            <div className="registration__search">
                <img
                    src={Search}
                    alt=""
                    className="registration__search-icon"
                />
                <input
                    type="text"
                    placeholder="Search by Name, Email, or Employee ID"
                    value={search}
                    onChange={handleSearch}
                    className="registration__search-input"
                />
            </div>

            {/* Stats */}
            <div
                style={{
                    margin: "1rem 0",
                    padding: "1rem",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                }}
            >
                <span style={{ fontWeight: "600", color: "#0066af" }}>
                    Total Registrations: {totalItems}
                </span>
            </div>

            <div className="registration__table-container">
                <table className="registration__table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th>Email Verified</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="10"
                                    className="registration__empty-row"
                                    style={{ height: "100px" }}
                                >
                                    <LoaderTable />
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="10"
                                    className="registration__empty-row"
                                >
                                    No registration data available.
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <tr key={item.id_registration}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{DEPARTMENT_MAP[item.department_name]}</td>
                                    <td>{getStatusBadge(item.status)}</td>
                                    <td>
                                        <span
                                            style={{
                                                color: item.email_verified
                                                    ? "#28a745"
                                                    : "#dc3545",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {item.email_verified ? "Yes" : "No"}
                                        </span>
                                    </td>
                                    <td className="registration__actions">
                                        <button
                                            className="registration__action-button view-button"
                                            onClick={() =>
                                                handleViewDetail(item)
                                            }
                                            title="View Detail"
                                            disabled={actionLoading}
                                        >
                                            <img
                                                src={Detail}
                                                alt="View"
                                                className="registration__action-icon"
                                            />
                                        </button>

                                        {canApprove(item) && (
                                            <button
                                                className="registration__action-button approve-button"
                                                onClick={() =>
                                                    handleApprove(item)
                                                }
                                                title="Approve Registration"
                                                disabled={actionLoading}
                                            >
                                                <img
                                                    src={Check}
                                                    alt="Approve"
                                                    className="registration__action-icon"
                                                />
                                            </button>
                                        )}

                                        {canReject(item) && (
                                            <button
                                                className="registration__action-button reject-button"
                                                onClick={() =>
                                                    handleReject(item)
                                                }
                                                title="Reject Registration"
                                                disabled={actionLoading}
                                            >
                                                <img
                                                    src={Cross}
                                                    alt="Reject"
                                                    className="registration__action-icon"
                                                />
                                            </button>
                                        )}

                                        {canDelete(item) && (
                                            <button
                                                className="registration__action-button reject-button"
                                                onClick={() =>
                                                    handleDelete(item)
                                                }
                                                title="Delete Registration"
                                                style={{
                                                    backgroundColor: "ed1010",
                                                }}
                                                disabled={actionLoading}
                                            >
                                                <img
                                                    src={Delete}
                                                    alt="Delete"
                                                    className="registration__action-icon"
                                                />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

                <div className="registration__pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="registration__pagination-btn previous-btn"
                    >
                        <FaArrowLeft size={12} className="previous-icon" />{" "}
                        Previous
                    </button>

                    {[...Array(totalPages)].map((_, idx) => {
                        const page = idx + 1;
                        return (
                            <button
                                key={page}
                                className={`registration__pagination-btn ${
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
                        className="registration__pagination-btn next-btn"
                    >
                        Next <FaArrowRight size={12} className="next-icon" />
                    </button>
                </div>

            {/* Detail Modal */}
            {showDetail && selectedRegistration && (
                <RegistrationDetailModal
                    isOpen={showDetail}
                    registration={selectedRegistration}
                    onClose={() => {
                        setShowDetail(false);
                        setSelectedRegistration(null);
                    }}
                />
            )}

            {/* Reject Reason Modal */}
            {showRejectModal && selectedRegistration && (
                <RejectReasonModal
                    isOpen={showRejectModal}
                    registration={selectedRegistration}
                    rejectionReason={rejectionReason}
                    onReasonChange={setRejectionReason}
                    onConfirm={handleRejectConfirm}
                    onCancel={handleRejectCancel}
                    loading={actionLoading}
                />
            )}
        </div>
    );
}
