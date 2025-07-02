import React, { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

const KanbanContext = createContext();

export const useKanban = () => {
    const context = useContext(KanbanContext);
    if (!context) {
        throw new Error("useKanban must be used within a KanbanProvider");
    }
    return context;
};

export const KanbanProvider = ({ children }) => {
    // State management
    const [requests, setRequests] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [approvedRequests, setApprovedRequests] = useState([]);
    const [incomingPC, setIncomingPC] = useState([]);
    const [pcApproved, setPcApproved] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination states
    const [pagination, setPagination] = useState({
        all: { page: 1, totalPages: 1, total: 0 },
        mine: { page: 1, totalPages: 1, total: 0 },
        pending: { page: 1, totalPages: 1, total: 0 },
        approved: { page: 1, totalPages: 1, total: 0 },
        incoming: { page: 1, totalPages: 1, total: 0 },
        done: { page: 1, totalPages: 1, total: 0 },
    });

    const { apiCall } = useAuth();

    // Helper function untuk clean params
    const cleanParams = useCallback((params) => {
        const cleaned = {};
        Object.entries(params).forEach(([key, value]) => {
            // ✅ Include semua params kecuali null dan undefined
            if (value !== null && value !== undefined) {
                cleaned[key] = value;
            }
        });
        return cleaned;
    }, []);

    // Helper function untuk API calls dengan auth
    const kanbanApiCall = useCallback(
        async (endpoint, options = {}) => {
            try {
                return await apiCall(endpoint, options);
            } catch (error) {
                setError(error.message);
                throw error;
            }
        },
        [apiCall]
    );

    // Create new kanban request
    const createRequest = useCallback(
        async (requestData) => {
            setLoading(true);
            setError(null);
            try {
                // Simple validation
                if (!requestData.tgl_produksi) {
                    throw new Error("Tanggal produksi harus diisi");
                }
                if (
                    !requestData.nama_requester ||
                    requestData.nama_requester.trim().length < 2
                ) {
                    throw new Error("Nama requester minimal 2 karakter");
                }
                if (
                    !requestData.parts_number ||
                    requestData.parts_number.trim().length < 3
                ) {
                    throw new Error("Parts number minimal 3 karakter");
                }

                const response = await kanbanApiCall("/kanban/request", {
                    method: "POST",
                    body: JSON.stringify(requestData),
                });

                return { success: true, data: response };
            } catch (error) {
                setError(error.message);
                return { success: false, message: error.message };
            } finally {
                setLoading(false);
            }
        },
        [kanbanApiCall]
    );

    // Get all kanban requests
    const fetchAllRequests = useCallback(
        async (params = {}) => {
            setLoading(true);
            setError(null);
            try {
                const cleanedParams = cleanParams(params);
                const queryString = new URLSearchParams(
                    cleanedParams
                ).toString();

                console.log(
                    "Fetching all requests with params:",
                    cleanedParams
                );

                const response = await kanbanApiCall(
                    `/kanban/all${queryString ? `?${queryString}` : ""}`
                );

                console.log("All requests response:", response);

                // Handle different response structures
                let processedData = [];
                if (response.data) {
                    processedData = response.data;
                } else if (response.requests) {
                    processedData = response.requests;
                } else if (Array.isArray(response)) {
                    processedData = response;
                }

                setRequests(processedData);
                setPagination((prev) => ({
                    ...prev,
                    all: {
                        page: response.pagination?.page || params.page || 1,
                        totalPages: response.pagination?.totalPages || 1,
                        total: response.pagination?.total || 0,
                    },
                }));

                return { success: true, data: response };
            } catch (error) {
                console.error("Fetch all requests error:", error);
                setError(error.message);
                return { success: false, message: error.message };
            } finally {
                setLoading(false);
            }
        },
        [kanbanApiCall, cleanParams]
    );

    // Get user's own requests
    const fetchMyRequests = useCallback(
        async (params = {}) => {
            setLoading(true);
            setError(null);
            try {
                console.log("🔍 fetchMyRequests - Original params:", params);

                const cleanedParams = cleanParams(params);
                console.log(
                    "🔍 fetchMyRequests - Cleaned params:",
                    cleanedParams
                );

                const queryString = new URLSearchParams(
                    cleanedParams
                ).toString();
                console.log("🔍 fetchMyRequests - Query string:", queryString);

                const url = `/kanban/mine${
                    queryString ? `?${queryString}` : ""
                }`;
                console.log("🔍 fetchMyRequests - Final URL:", url);

                // ✅ TAMBAHAN: Log raw response sebelum processing
                const rawResponse = await fetch(
                    `${import.meta.env.VITE_API_URL}${url}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

                const rawData = await rawResponse.json();
                console.log(
                    "🔍 fetchMyRequests - Raw server response:",
                    rawData
                );

                // Lanjutkan dengan kanbanApiCall seperti biasa
                const response = await kanbanApiCall(url);
                console.log(
                    "🔍 fetchMyRequests - Processed response:",
                    response
                );

                let processedData = [];
                if (response.data) {
                    processedData = response.data;
                } else if (response.requests) {
                    processedData = response.requests;
                } else if (Array.isArray(response)) {
                    processedData = response;
                }

                console.log(
                    "🔍 fetchMyRequests - Final processed data:",
                    processedData
                );

                setMyRequests(processedData);
                setPagination((prev) => ({
                    ...prev,
                    mine: {
                        page: response.pagination?.page || params.page || 1,
                        totalPages: response.pagination?.totalPages || 1,
                        total: response.pagination?.total || 0,
                    },
                }));

                return { success: true, data: response };
            } catch (error) {
                console.error("❌ Fetch my requests error:", error);
                setError(error.message);
                return { success: false, message: error.message };
            } finally {
                setLoading(false);
            }
        },
        [kanbanApiCall, cleanParams]
    );

    // Get pending approvals
    const fetchPendingApprovals = useCallback(
        async (params = {}) => {
            setLoading(true);
            setError(null);
            try {
                const cleanedParams = cleanParams(params);
                const queryString = new URLSearchParams(
                    cleanedParams
                ).toString();
                const response = await kanbanApiCall(
                    `/kanban/pending${queryString ? `?${queryString}` : ""}`
                );

                // Handle different response structures
                let processedData = response.data || response.requests || [];
                if (response.data && Array.isArray(response.data)) {
                    processedData = response.data.map((item) => ({
                        id_kanban: item.id_kanban,
                        tgl_produksi:
                            item.requestKanban?.tgl_produksi ||
                            item.tgl_produksi,
                        parts_number:
                            item.requestKanban?.parts_number ||
                            item.parts_number,
                        process:
                            item.requestKanban?.klasifikasi ||
                            item.klasifikasi ||
                            item.process,
                        nama_requester:
                            item.requestKanban?.nama_requester ||
                            item.nama_requester,
                        status: item.requestKanban?.status || item.status,
                    }));
                }

                setPendingApprovals(processedData);
                setPagination((prev) => ({
                    ...prev,
                    pending: {
                        page: response.pagination?.page || 1,
                        totalPages: response.pagination?.totalPages || 1,
                        total: response.pagination?.total || 0,
                    },
                }));

                return { success: true, data: response };
            } catch (error) {
                setError(error.message);
                return { success: false, message: error.message };
            } finally {
                setLoading(false);
            }
        },
        [kanbanApiCall, cleanParams]
    );

    // Get approved requests
    const fetchApprovedRequests = useCallback(
        async (params = {}) => {
            setLoading(true);
            setError(null);
            try {
                const cleanedParams = cleanParams(params);
                const queryString = new URLSearchParams(
                    cleanedParams
                ).toString();
                const response = await kanbanApiCall(
                    `/kanban/approved${queryString ? `?${queryString}` : ""}`
                );

                console.log("Approved requests response:", response);

                // Handle nested response structure
                let processedData = [];
                if (response.approved?.data) {
                    processedData = response.approved.data;
                } else if (response.data) {
                    processedData = response.data;
                } else if (Array.isArray(response)) {
                    processedData = response;
                }

                console.log("Processed approved data:", processedData);

                setApprovedRequests(processedData);

                // Handle pagination from nested structure
                const paginationInfo =
                    response.approved || response.pagination || {};
                setPagination((prev) => ({
                    ...prev,
                    approved: {
                        page: paginationInfo.page || response.page || 1,
                        totalPages:
                            paginationInfo.totalPages ||
                            response.totalPages ||
                            1,
                        total: paginationInfo.total || response.total || 0,
                    },
                }));

                return { success: true, data: response };
            } catch (error) {
                console.error("Fetch approved requests error:", error);
                setError(error.message);
                return { success: false, message: error.message };
            } finally {
                setLoading(false);
            }
        },
        [kanbanApiCall, cleanParams]
    );

    // Get incoming requests for PC
    const fetchIncomingForPC = useCallback(
        async (params = {}) => {
            setLoading(true);
            setError(null);
            try {
                const cleanedParams = cleanParams(params);
                const queryString = new URLSearchParams(
                    cleanedParams
                ).toString();
                const response = await kanbanApiCall(
                    `/kanban/incoming-pc${queryString ? `?${queryString}` : ""}`
                );

                setIncomingPC(response.data || response.requests || []);
                setPagination((prev) => ({
                    ...prev,
                    incoming: {
                        page: response.pagination?.page || 1,
                        totalPages: response.pagination?.totalPages || 1,
                        total: response.pagination?.total || 0,
                    },
                }));

                return { success: true, data: response };
            } catch (error) {
                setError(error.message);
                return { success: false, message: error.message };
            } finally {
                setLoading(false);
            }
        },
        [kanbanApiCall, cleanParams]
    );

    // Get PC approved requests
    const fetchPCApprovedRequests = useCallback(
        async (params = {}) => {
            setLoading(true);
            setError(null);
            try {
                const cleanedParams = cleanParams(params);
                const queryString = new URLSearchParams(
                    cleanedParams
                ).toString();
                const response = await kanbanApiCall(
                    `/kanban/done${queryString ? `?${queryString}` : ""}`
                );

                console.log("PC approved requests response:", response);

                // Handle nested response structure
                let processedData = [];
                if (response.done?.data) {
                    processedData = response.done.data;
                } else if (response.data) {
                    processedData = response.data;
                } else if (Array.isArray(response)) {
                    processedData = response;
                }

                console.log("Processed PC approved data:", processedData);

                setPcApproved(processedData);

                // Handle pagination from nested structure
                const paginationInfo =
                    response.done || response.pagination || {};
                setPagination((prev) => ({
                    ...prev,
                    done: {
                        page: paginationInfo.page || response.page || 1,
                        totalPages:
                            paginationInfo.totalPages ||
                            response.totalPages ||
                            1,
                        total: paginationInfo.total || response.total || 0,
                    },
                }));

                return { success: true, data: response };
            } catch (error) {
                console.error("Fetch PC approved requests error:", error);
                setError(error.message);
                return { success: false, message: error.message };
            } finally {
                setLoading(false);
            }
        },
        [kanbanApiCall, cleanParams]
    );

    // Approve kanban request
    const approveRequest = useCallback(
        async (id_kanban) => {
            setLoading(true);
            setError(null);
            try {
                const response = await kanbanApiCall("/kanban/approve", {
                    method: "POST",
                    body: JSON.stringify({ id_kanban }),
                });

                return { success: true, data: response };
            } catch (error) {
                setError(error.message);
                return { success: false, message: error.message };
            } finally {
                setLoading(false);
            }
        },
        [kanbanApiCall]
    );

    // Reject kanban request
    const rejectRequest = useCallback(
        async (id_kanban, alasan) => {
            setLoading(true);
            setError(null);
            try {
                const response = await kanbanApiCall("/kanban/reject", {
                    method: "POST",
                    body: JSON.stringify({ id_kanban, alasan }),
                });

                return { success: true, data: response };
            } catch (error) {
                setError(error.message);
                return { success: false, message: error.message };
            } finally {
                setLoading(false);
            }
        },
        [kanbanApiCall]
    );

    // Get single kanban request by ID
    const fetchRequestById = useCallback(
        async (id_kanban) => {
            setLoading(true);
            setError(null);
            try {
                const response = await kanbanApiCall(
                    `/kanban/get/${id_kanban}`
                );
                return { success: true, data: response };
            } catch (error) {
                setError(error.message);
                return { success: false, message: error.message };
            } finally {
                setLoading(false);
            }
        },
        [kanbanApiCall]
    );

    // Update kanban request
    const updateRequest = useCallback(
        async (id_kanban, updateData) => {
            setLoading(true);
            setError(null);
            try {
                const response = await kanbanApiCall(`/kanban/${id_kanban}`, {
                    method: "PUT",
                    body: JSON.stringify(updateData),
                });

                return { success: true, data: response };
            } catch (error) {
                setError(error.message);
                return { success: false, message: error.message };
            } finally {
                setLoading(false);
            }
        },
        [kanbanApiCall]
    );

    // Get dashboard stats
    const fetchDashboardStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await kanbanApiCall("/kanban/dashboard-stats");
            setDashboardStats(response.data || {});
            return { success: true, data: response };
        } catch (error) {
            setError(error.message);
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    }, [kanbanApiCall]);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Utility functions
    const formatDate = useCallback((date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toISOString().split("T")[0];
    }, []);

    const formatDateTime = useCallback((dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }, []);

    const formatDisplayDate = useCallback((dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }, []);

    const getStatusBadgeColor = useCallback((status) => {
        const colors = {
            PENDING_APPROVAL: "#ffc107",
            APPROVED_BY_DEPARTMENT: "#17a2b8",
            PENDING_PC: "#6c757d",
            APPROVED_BY_PC: "#28a745",
            REJECTED_BY_DEPARTMENT: "#dc3545",
            REJECTED_BY_PC: "#dc3545",
        };
        return colors[status] || "#6c757d";
    }, []);

    const getStatusText = useCallback((status) => {
        const texts = {
            PENDING_APPROVAL: "PENDING APPROVAL",
            APPROVED_BY_DEPARTMENT: "APPROVED BY DEPARTMENT",
            PENDING_PC: "PENDING PC",
            APPROVED_BY_PC: "APPROVED BY PC",
            REJECTED_BY_DEPARTMENT: "REJECTED BY DEPARTMENT",
            REJECTED_BY_PC: "REJECTED BY PC",
        };
        return texts[status] || status;
    }, []);

    const getRoleText = useCallback((role) => {
        const texts = {
            LEADER: "Leader",
            SUPERVISOR: "Supervisor",
            MANAGER: "Manager",
            STAFF: "Staff",
            ADMIN: "Admin",
        };
        return texts[role] || role;
    }, []);

    const validateRequestData = useCallback((data) => {
        const errors = [];

        if (!data.tgl_produksi) {
            errors.push("Tanggal produksi harus diisi");
        } else {
            const prodDate = new Date(data.tgl_produksi);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (prodDate < today) {
                errors.push("Tanggal produksi tidak boleh di masa lalu");
            }
        }

        if (!data.nama_requester || data.nama_requester.trim().length < 2) {
            errors.push("Nama requester minimal 2 karakter");
        }

        if (!data.parts_number || data.parts_number.trim().length < 3) {
            errors.push("Parts number minimal 3 karakter");
        }

        if (!data.lokasi || data.lokasi.trim().length < 2) {
            errors.push("Lokasi minimal 2 karakter");
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }, []);

    const value = {
        // State
        requests,
        myRequests,
        pendingApprovals,
        approvedRequests,
        incomingPC,
        pcApproved,
        dashboardStats,
        pagination,
        loading,
        error,

        // Actions
        createRequest,
        fetchAllRequests,
        fetchMyRequests,
        fetchPendingApprovals,
        approveRequest,
        rejectRequest,
        fetchApprovedRequests,
        fetchRequestById,
        updateRequest,
        fetchDashboardStats,
        fetchIncomingForPC,
        fetchPCApprovedRequests,
        clearError,

        // Utilities
        formatDate,
        formatDateTime,
        formatDisplayDate,
        getStatusBadgeColor,
        getStatusText,
        getRoleText,
        validateRequestData,
    };

    return (
        <KanbanContext.Provider value={value}>
            {children}
        </KanbanContext.Provider>
    );
};
