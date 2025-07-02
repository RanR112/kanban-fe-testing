class KanbanService {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_URL;
    }

    // Helper method untuk API calls dengan error handling
    async apiCall(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            credentials: "include",
            ...options,
        };

        console.log("Making API call to:", url);
        console.log("Request config:", config);

        try {
            const response = await fetch(url, config);
            console.log("Response status:", response.status);

            const data = await response.json();
            console.log("Response data:", data);

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        `HTTP ${response.status}: ${response.statusText}`
                );
            }

            return data;
        } catch (error) {
            console.error("Kanban API Error:", error);
            throw error;
        }
    }

    // Helper untuk membersihkan query parameters
    cleanParams(params) {
        const cleaned = {};
        Object.entries(params).forEach(([key, value]) => {
            if (value !== "" && value !== null && value !== undefined) {
                cleaned[key] = value;
            }
        });
        return cleaned;
    }

    // Create new kanban request
    async createRequest(requestData) {
        return await this.apiCall("/kanban/request", {
            method: "POST",
            body: JSON.stringify(requestData),
        });
    }

    // Get all kanban requests
    async getAllRequests(params = {}) {
        const cleanedParams = this.cleanParams(params);
        const queryString = new URLSearchParams(cleanedParams).toString();
        return await this.apiCall(
            `/kanban/all${queryString ? `?${queryString}` : ""}`
        );
    }

    // Get user's own requests
    async getMyRequests(params = {}) {
        const cleanedParams = this.cleanParams(params);
        const queryString = new URLSearchParams(cleanedParams).toString();
        return await this.apiCall(
            `/kanban/mine${queryString ? `?${queryString}` : ""}`
        );
    }

    // Get pending approvals
    async getPendingApprovals(params = {}) {
        const cleanedParams = this.cleanParams(params);
        const queryString = new URLSearchParams(cleanedParams).toString();
        return await this.apiCall(
            `/kanban/pending${queryString ? `?${queryString}` : ""}`
        );
    }

    // Approve kanban request
    async approveRequest(id_kanban) {
        return await this.apiCall("/kanban/approve", {
            method: "POST",
            body: JSON.stringify({ id_kanban }),
        });
    }

    // Reject kanban request
    async rejectRequest(id_kanban, alasan) {
        return await this.apiCall("/kanban/reject", {
            method: "POST",
            body: JSON.stringify({ id_kanban, alasan }),
        });
    }

    // Get approved requests
    async getApprovedRequests(params = {}) {
        const cleanedParams = this.cleanParams(params);
        const queryString = new URLSearchParams(cleanedParams).toString();
        return await this.apiCall(
            `/kanban/approved${queryString ? `?${queryString}` : ""}`
        );
    }

    // Get single kanban request by ID
    async getRequestById(id_kanban) {
        return await this.apiCall(`/kanban/get/${id_kanban}`);
    }

    // Update kanban request
    async updateRequest(id_kanban, updateData) {
        return await this.apiCall(`/kanban/${id_kanban}`, {
            method: "PUT",
            body: JSON.stringify(updateData),
        });
    }

    // Get dashboard stats
    async getDashboardStats() {
        return await this.apiCall("/kanban/dashboard-stats");
    }

    // Get incoming requests for PC
    async getIncomingForPC(params = {}) {
        const cleanedParams = this.cleanParams(params);
        const queryString = new URLSearchParams(cleanedParams).toString();
        return await this.apiCall(
            `/kanban/incoming-pc${queryString ? `?${queryString}` : ""}`
        );
    }

    // Get PC approved requests
    async getPCApprovedRequests(params = {}) {
        const cleanedParams = this.cleanParams(params);
        const queryString = new URLSearchParams(cleanedParams).toString();
        return await this.apiCall(
            `/kanban/done${queryString ? `?${queryString}` : ""}`
        );
    }

    // Format date for API
    formatDate(date) {
        if (!date) return "";
        const d = new Date(date);
        return d.toISOString().split("T")[0];
    }

    // Format datetime for display
    formatDateTime(dateString) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    // Format date for display
    formatDisplayDate(dateString) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }

    // Get status badge color
    getStatusBadgeColor(status) {
        const colors = {
            PENDING_APPROVAL: "#ffc107",
            APPROVED_BY_DEPARTMENT: "#17a2b8",
            PENDING_PC: "#6c757d",
            APPROVED_BY_PC: "#28a745",
            REJECTED_BY_DEPARTMENT: "#dc3545",
            REJECTED_BY_PC: "#dc3545",
        };
        return colors[status] || "#6c757d";
    }

    // Get status display text
    getStatusText(status) {
        const texts = {
            PENDING_APPROVAL: "Menunggu Persetujuan",
            APPROVED_BY_DEPARTMENT: "Disetujui Department",
            PENDING_PC: "Menunggu PC",
            APPROVED_BY_PC: "Disetujui PC",
            REJECTED_BY_DEPARTMENT: "Ditolak Department",
            REJECTED_BY_PC: "Ditolak PC",
        };
        return texts[status] || status;
    }

    // Get role display text
    getRoleText(role) {
        const texts = {
            LEADER: "Leader",
            SUPERVISOR: "Supervisor",
            MANAGER: "Manager",
            STAFF: "Staff",
            ADMIN: "Admin",
        };
        return texts[role] || role;
    }

    // Validate request data
    validateRequestData(data) {
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
    }
}

export default new KanbanService();
