import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../sass/ApprovalReqKanban/ApprovalReqKanban.css";
import Detail from "../assets/icons/list.svg";
import Search from "../assets/icons/search.svg";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { LoaderTable } from "../components/LoaderTable";
import { useKanban } from "../contexts/KanbanContext";
import { useAuth } from "../contexts/AuthContext";

export default function ApprovalReqKanban({
    navigationPath = "/user-lead/detailreq-user-lead",
    dataSource = "approved",
    title = "APPROVAL REQUEST",
}) {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const { user } = useAuth();
    const {
        approvedRequests,
        pcApproved,
        pagination,
        loading,
        error,
        fetchApprovedRequests,
        fetchPCApprovedRequests,
        formatDateTime,
        getStatusText,
    } = useKanban();

    // Get appropriate data and pagination based on dataSource
    const getData = () => {
        switch (dataSource) {
            case "done":
                return {
                    data: pcApproved,
                    paginationData: pagination.done,
                    fetchFunction: fetchPCApprovedRequests,
                };
            case "approved":
            default:
                return {
                    data: approvedRequests,
                    paginationData: pagination.approved,
                    fetchFunction: fetchApprovedRequests,
                };
        }
    };

    const extractItemData = (item) => {
        console.log("Extracting data from item:", item);

        // Handle nested structure
        const requestData = item.request_data || item;
        const approvalData = item.approval_data;
        const requesterData = item.requester;

        return {
            id_kanban: item.id_kanban,
            parts_number: requestData.parts_number || item.parts_number || "-",
            nama_requester:
                requestData.nama_requester ||
                item.nama_requester ||
                item.requester_name ||
                requesterData?.name ||
                "-",
            status: approvalData.note || item.status || "-",
            approvedAt: approvalData?.approvedAt || item.approvedAt || null,
        };
    };

    const { data, paginationData, fetchFunction } = getData();

    // Fetch data function with proper parameters
    const fetchData = useCallback(
        async (page = 1, searchKeyword = "") => {
            console.log("ApprovalReqKanban: Fetching data", {
                page,
                searchKeyword,
                dataSource,
            });

            const params = {
                page,
                limit: 10,
                search: searchKeyword.trim(),
            };

            // Add user-specific parameters if needed
            if (user) {
                params.userId = user.id_users;
                params.departmentId = user.department?.id_department;
                params.role = user.role;
            }

            console.log("ApprovalReqKanban: Fetch params", params);

            const result = await fetchFunction(params);
            console.log("ApprovalReqKanban: Fetch result", result);

            return result;
        },
        [fetchFunction, user, dataSource]
    );

    useEffect(() => {
        console.log("ApprovalReqKanban: Data update", {
            dataSource,
            dataLength: data.length,
            sampleData: data[0],
            pagination: paginationData,
            loading,
            error,
        });
    }, [data, dataSource, paginationData, loading, error]);

    // Search effect
    useEffect(() => {
        if (search) {
            setCurrentPage(1);
        }
    }, [search]);

    // Data fetching effect
    useEffect(() => {
        fetchData(currentPage, search);
    }, [currentPage, search, fetchData]);

    const handleSearch = (e) => {
        const keyword = e.target.value;
        setSearch(keyword);
    };

    const indexOfFirstItem = (currentPage - 1) * 10;

    const handleView = (id_kanban) => {
        navigate(`${navigationPath}/${id_kanban}`);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= paginationData.totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Format date for display
    const formatApprovedDate = (isoString) => {
        if (!isoString || isoString === "-") return "-";
        return formatDateTime(isoString);
    };

    return (
        <div className="approval-request">
            <div className="approval-request__header">
                <h2>
                    <strong>{title}</strong>
                </h2>
            </div>

            <div className="approval-request__search">
                <img
                    src={Search}
                    alt=""
                    className="approval-request__search-icon"
                />
                <input
                    type="text"
                    placeholder="Search by Parts Number or Requester Name"
                    value={search}
                    onChange={handleSearch}
                    className="approval-request__search-input"
                />
            </div>

            <div className="approval-request__table-container">
                <table className="approval-request__table">
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
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="approval-request__empty-row"
                                    style={{ height: "100px" }}
                                >
                                    <LoaderTable />
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="approval-request__empty-row"
                                >
                                    Error: {error}
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="approval-request__empty-row"
                                >
                                    No data available.
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => {
                                const itemData = extractItemData(item);

                                return (
                                    <tr key={`${itemData.id_kanban}-${index}`}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td>
                                            {formatApprovedDate(
                                                itemData.approvedAt
                                            )}
                                        </td>
                                        <td>{itemData.parts_number}</td>
                                        <td>{itemData.nama_requester}</td>
                                        <td>
                                            <span
                                                className={`approval-request__status approval-request__status--${itemData.status?.toLowerCase()}`}
                                            >
                                                {getStatusText(itemData.status)}
                                            </span>
                                        </td>
                                        <td className="approval-request__actions">
                                            <button
                                                className="approval-request__view-btn"
                                                onClick={() =>
                                                    handleView(
                                                        itemData.id_kanban
                                                    )
                                                }
                                                title="View Detail Request"
                                            >
                                                <img
                                                    src={Detail}
                                                    alt=""
                                                    className="approval-request__action-icon"
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="approval-request__pagination">
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="approval-request__pagination-btn previous-btn"
                >
                    <FaArrowLeft size={12} className="previous-icon" /> Previous
                </button>
                {[...Array(paginationData.totalPages)].map((_, idx) => {
                    const page = idx + 1;
                    return (
                        <button
                            key={page}
                            className={`approval-request__pagination-btn ${
                                page === currentPage
                                    ? "active-btn"
                                    : ""
                            }`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    );
                })}
                <button
                    disabled={currentPage === paginationData.totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="approval-request__pagination-btn next-btn"
                >
                    Next <FaArrowRight size={12} className="next-icon" />
                </button>
            </div>
        </div>
    );
}
