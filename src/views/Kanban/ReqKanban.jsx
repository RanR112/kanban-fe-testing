import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import Detail from "../../assets/icons/list.svg";
import Search from "../../assets/icons/search.svg";
import Check from "../../assets/icons/check.svg";
import Cross from "../../assets/icons/xmark-white.svg";
import Plus from "../../assets/icons/plus.svg";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { DEPARTMENT_MAP } from "../../utils/constants";
import { LoaderTable } from "../../components/LoaderTable";
import "../../sass/Kanban/ReqKanban/ReqKanban.css";
import { useKanban } from "../../contexts/KanbanContext";

export default function ReqKanban({
    userType = "",
    showCreateButton = false,
    dataSource = "all", // 'all', 'mine', 'pending', 'approved', 'incoming', 'done'
    title = "",
    showApproveReject = false,
}) {
    // State
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Refs
    const typingTimeout = useRef(null);

    // Navigation
    const navigate = useNavigate();

    // Contexts
    const context = useOutletContext() || {};
    const {
        handleShowAlertPCLeadApprove,
        showConfirmRejectPCLead,
        handleShowAlertUserLeadApprove,
        showConfirmReject,
    } = context;

    const {
        requests,
        myRequests,
        pendingApprovals,
        approvedRequests,
        incomingPC,
        pcApproved,
        pagination,
        loading,
        error,
        fetchAllRequests,
        fetchMyRequests,
        fetchPendingApprovals,
        fetchApprovedRequests,
        fetchIncomingForPC,
        fetchPCApprovedRequests,
        approveRequest,
        rejectRequest,
        formatDisplayDate,
        getStatusText,
    } = useKanban();

    // Fallback function jika getStatusText tidak tersedia
    const safeGetStatusText = (status) => {
        if (getStatusText && typeof getStatusText === "function") {
            return getStatusText(status);
        }
        // Fallback implementation
        const texts = {
            PENDING_APPROVAL: "Menunggu Persetujuan",
            APPROVED_BY_DEPARTMENT: "Disetujui Department",
            PENDING_PC: "Menunggu PC",
            APPROVED_BY_PC: "Disetujui PC",
            REJECTED_BY_DEPARTMENT: "Ditolak Department",
            REJECTED_BY_PC: "Ditolak PC",
        };
        return texts[status] || status.replace(/_/g, " ");
    };

    // Get data and pagination based on dataSource
    const getData = () => {
        switch (dataSource) {
            case "mine":
                return { data: myRequests, paginationData: pagination.mine };
            case "pending":
                return {
                    data: pendingApprovals,
                    paginationData: pagination.pending,
                };
            case "approved":
                return {
                    data: approvedRequests,
                    paginationData: pagination.approved,
                };
            case "incoming":
                return {
                    data: pendingApprovals,
                    paginationData: pagination.pending,
                };
            case "done":
                return { data: pcApproved, paginationData: pagination.done };
            case "all":
            default:
                return { data: requests, paginationData: pagination.all };
        }
    };

    const { data, paginationData } = getData();

    // Debouncing effect for search
    useEffect(() => {
        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }

        typingTimeout.current = setTimeout(() => {
            console.log("Search debounced:", search);
            setDebouncedSearch(search);
            setCurrentPage(1); // Reset to first page when searching
        }, 500); // 500ms debounce

        return () => {
            if (typingTimeout.current) {
                clearTimeout(typingTimeout.current);
            }
        };
    }, [search]);

    // Get appropriate fetch function with memoization
    const fetchFunction = useCallback(() => {
        const params = {
            page: currentPage,
            limit: 10,
            search: debouncedSearch.trim(),
            sortBy: "id_kanban",
            sortOrder: "desc",
        };

        console.log(`Fetching ${dataSource} data with params:`, params);

        switch (dataSource) {
            case "mine":
                return fetchMyRequests(params);
            case "pending":
                return fetchPendingApprovals(params);
            case "approved":
                return fetchApprovedRequests(params);
            case "incoming":
                return fetchPendingApprovals(params);
            case "done":
                return fetchPCApprovedRequests(params);
            case "all":
            default:
                return fetchAllRequests(params);
        }
    }, [
        dataSource,
        currentPage,
        debouncedSearch, // Use debounced search instead of search
        fetchAllRequests,
        fetchMyRequests,
        fetchPendingApprovals,
        fetchApprovedRequests,
        fetchPCApprovedRequests,
    ]);

    // Load data when dependencies change
    useEffect(() => {
        fetchFunction();
    }, [fetchFunction]);

    // Search input handler (immediate UI update)
    const handleSearch = (e) => {
        const keyword = e.target.value;
        console.log("Search input changed:", keyword);
        setSearch(keyword); // Update UI immediately
        // debouncedSearch will be updated by the useEffect above
    };

    // Extract data safely for rendering
    const extractItemData = (item) => {
        // Handle nested structure like ApprovalReqKanban
        const requestData = item.request_data || item;
        const approvalData = item.approval_data;
        const requesterData = item.requester;

        return {
            id_kanban: item.id_kanban,
            tgl_produksi: requestData.tgl_produksi || item.tgl_produksi,
            parts_number: requestData.parts_number || item.parts_number || "-",
            nama_requester:
                requestData.nama_requester ||
                item.nama_requester ||
                item.requester_name ||
                requesterData?.name ||
                "-",
            status: requestData.status || item.status || "PENDING",
            process:
                item.process ||
                requestData.process ||
                item.klasifikasi ||
                requestData.klasifikasi,
            department: item.department,
        };
    };

    // Event Handlers
    const handleView = (id_kanban) => {
        const routes = {
            admin: `/admin/detail-kanbanreq/${id_kanban}`,
            "pc-lead": `/pc-lead/detailreq-pc-lead/${id_kanban}`,
            user: `/user/detail-request/${id_kanban}`,
            "user-lead": `/user-lead/detailreq-user-lead/${id_kanban}`,
        };
        navigate(routes[userType]);
    };

    const handleApprove = async (id_kanban) => {
        try {
            const result = await approveRequest(id_kanban);

            if (result.success) {
                // Refresh data after approval
                fetchFunction();

                if (userType === "pc-lead" && handleShowAlertPCLeadApprove) {
                    handleShowAlertPCLeadApprove(true);
                } else if (
                    userType === "user-lead" &&
                    handleShowAlertUserLeadApprove
                ) {
                    handleShowAlertUserLeadApprove(true);
                }
            } else {
                console.log("Gagal approve: " + result.message);
            }
        } catch (err) {
            console.log("Gagal approve: " + err.message);
        }
    };

    const handleReject = async (id_kanban) => {
        try {
            const result = await rejectRequest(id_kanban, "Rejected");

            if (result.success) {
                // Refresh data after rejection
                fetchFunction();

                if (userType === "pc-lead" && showConfirmRejectPCLead) {
                    showConfirmRejectPCLead(true);
                } else if (userType === "user-lead" && showConfirmReject) {
                    showConfirmReject(true);
                }
            } else {
                console.log("Gagal reject: " + result.message);
            }
        } catch (err) {
            console.log("Gagal reject: " + err.message);
        }
    };

    // Helper functions
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return dataSource === "pending"
            ? new Date(dateString).toLocaleDateString("id-ID")
            : new Date(dateString).toLocaleDateString("en-CA");
    };

    const getProcessName = (itemData) => {
        if (dataSource === "pending") {
            return itemData.process || itemData.klasifikasi || "-";
        }
        return (
            DEPARTMENT_MAP[itemData.department?.name] ||
            itemData.process ||
            itemData.klasifikasi ||
            "-"
        );
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeout.current) {
                clearTimeout(typingTimeout.current);
            }
        };
    }, []);

    // Debug logging
    useEffect(() => {
        console.log("ReqKanban data update:", {
            dataSource,
            dataLength: data.length,
            currentPage,
            search,
            debouncedSearch,
            loading,
            error,
            pagination: paginationData,
        });
    }, [
        data,
        dataSource,
        currentPage,
        search,
        debouncedSearch,
        loading,
        error,
        paginationData,
    ]);

    return (
        <div className="kanban-request-table">
            <div className="table-header">
                <h2>
                    <strong>{title}</strong>
                </h2>
                {showCreateButton && (
                    <Link to="/user/request-form" className="create-button">
                        <img src={Plus} alt="Plus Icon" />
                        Form Request
                    </Link>
                )}
            </div>

            <div className="search-container">
                <img src={Search} alt="Search" className="search-icon" />
                <input
                    type="text"
                    placeholder="Search by Parts Number or Requester Name"
                    value={search}
                    onChange={handleSearch}
                    className="search-input"
                />
                {search !== debouncedSearch && (
                    <span className="search-indicator">Searching...</span>
                )}
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Production Date</th>
                            <th>Parts Number</th>
                            <th>
                                {dataSource === "pending"
                                    ? "Classification"
                                    : "Process"}
                            </th>
                            <th>
                                {userType === "user-lead"
                                    ? "Requester Name"
                                    : "Requesting Name"}
                            </th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="empty-row"
                                    style={{ height: "100px" }}
                                >
                                    <LoaderTable />
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="7" className="empty-row">
                                    Error: {error}
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="empty-row">
                                    {debouncedSearch
                                        ? `No results found for "${debouncedSearch}"`
                                        : "No data available."}
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => {
                                const itemData = extractItemData(item);

                                return (
                                    <tr key={`${itemData.id_kanban}-${index}`}>
                                        <td>
                                            {(currentPage - 1) * 10 + index + 1}
                                        </td>
                                        <td>
                                            {formatDate(itemData.tgl_produksi)}
                                        </td>
                                        <td>{itemData.parts_number}</td>
                                        <td>{getProcessName(itemData)}</td>
                                        <td>{itemData.nama_requester}</td>
                                        <td>
                                            <span
                                                className={`status ${itemData.status?.toLowerCase()}`}
                                            >
                                                {safeGetStatusText(
                                                    itemData.status
                                                )}
                                            </span>
                                        </td>
                                        <td className="actions">
                                            <button
                                                className="action-button view-button"
                                                onClick={() =>
                                                    handleView(
                                                        itemData.id_kanban
                                                    )
                                                }
                                                title="View Detail Request"
                                            >
                                                <img
                                                    src={Detail}
                                                    alt="View"
                                                    className="action-icon"
                                                />
                                            </button>
                                            {showApproveReject && (
                                                <>
                                                    <button
                                                        className="action-button approve-button"
                                                        onClick={() =>
                                                            handleApprove(
                                                                itemData.id_kanban
                                                            )
                                                        }
                                                        title="Approve Request"
                                                    >
                                                        <img
                                                            src={Check}
                                                            alt="Approve"
                                                            className="action-icon"
                                                        />
                                                    </button>
                                                    <button
                                                        className="action-button reject-button"
                                                        onClick={() =>
                                                            handleReject(
                                                                itemData.id_kanban
                                                            )
                                                        }
                                                        title="Reject Request"
                                                    >
                                                        <img
                                                            src={Cross}
                                                            alt="Reject"
                                                            className="action-icon"
                                                        />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    disabled={currentPage === 1 || loading}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="pagination-button previous"
                >
                    <FaArrowLeft size={12} className="previous-icon" /> Previous
                </button>
                {[...Array(paginationData.totalPages || 1)].map((_, idx) => (
                    <button
                        key={idx + 1}
                        className={`pagination-button ${
                            currentPage === idx + 1 ? "active" : ""
                        }`}
                        onClick={() => setCurrentPage(idx + 1)}
                        disabled={loading}
                    >
                        {idx + 1}
                    </button>
                ))}
                <button
                    disabled={
                        currentPage >= (paginationData.totalPages || 1) ||
                        loading
                    }
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="pagination-button next"
                >
                    Next <FaArrowRight size={12} className="next-icon" />
                </button>
            </div>
        </div>
    );
}
