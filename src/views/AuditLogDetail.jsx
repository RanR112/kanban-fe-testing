import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaUser,
    FaTable,
    FaClock,
    FaDesktop,
} from "react-icons/fa";
import API from "../services/api";
import LoaderPrimary from "../components/LoaderPrimary";

export default function AuditLogDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [auditLog, setAuditLog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAuditLogDetail = async () => {
            setLoading(true);
            try {
                const res = await API.get(`/audit-log/${id}`);

                if (res.data.success) {
                    setAuditLog(res.data.data);
                } else {
                    throw new Error(
                        res.data.message || "Failed to fetch audit log detail"
                    );
                }
            } catch (err) {
                console.error("Error fetching audit log detail:", err);
                setError(
                    err.response?.data?.message ||
                        "Failed to load audit log detail"
                );

                if (err.response?.status === 401) {
                    navigate("/login");
                    return;
                } else if (err.response?.status === 403) {
                    setError(
                        "Access denied. Only administrators can view audit logs."
                    );
                } else if (err.response?.status === 404) {
                    setError("Audit log not found.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAuditLogDetail();
        }
    }, [id, navigate]);

    const formatAction = (action) => {
        return action
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase());
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

    if (loading) {
        return (
            <div
                className="auditlog"
                style={{
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <LoaderPrimary />
            </div>
        );
    }

    if (error) {
        return (
            <div className="auditlog">
                <div className="auditlog__header">
                    <button
                        onClick={() => navigate("/admin/audit-log")}
                        style={{
                            background: "#0066af",
                            color: "white",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <FaArrowLeft /> Back to Audit Logs
                    </button>
                    <h2>
                        <strong>AUDIT LOG DETAIL</strong>
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

    if (!auditLog) {
        return (
            <div className="auditlog">
                <div className="auditlog__header">
                    <button
                        onClick={() => navigate("/admin/audit-log")}
                        style={{
                            background: "#0066af",
                            color: "white",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <FaArrowLeft /> Back to Audit Logs
                    </button>
                    <h2>
                        <strong>AUDIT LOG DETAIL</strong>
                    </h2>
                </div>
                <div style={{ textAlign: "center", padding: "2rem" }}>
                    Audit log not found.
                </div>
            </div>
        );
    }

    return (
        <div className="auditlog">
            <div className="auditlog__header">
                <button
                    onClick={() => navigate("/admin/audit-log")}
                    style={{
                        background: "#0066af",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "14px",
                    }}
                >
                    <FaArrowLeft /> Back to Audit Logs
                </button>
                <h2>
                    <strong>AUDIT LOG DETAIL</strong>
                </h2>
            </div>

            <div className="auditlog__table-container">
                <div style={{ padding: "30px" }}>
                    {/* Header Info */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "20px",
                            marginBottom: "30px",
                        }}
                    >
                        <div
                            style={{
                                background: "#f8f9fa",
                                padding: "20px",
                                borderRadius: "8px",
                                border: "1px solid #dee2e6",
                            }}
                        >
                            <h3
                                style={{
                                    color: "#0066af",
                                    marginBottom: "15px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <FaTable /> Action Information
                            </h3>
                            <div style={{ marginBottom: "10px" }}>
                                <strong>Action:</strong>
                                <span
                                    className={`auditlog__status auditlog__status--${getActionBadgeColor(
                                        auditLog.action
                                    )}`}
                                    style={{ marginLeft: "10px" }}
                                >
                                    {formatAction(auditLog.action)}
                                </span>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <strong>Table:</strong>{" "}
                                {auditLog.table_name || "N/A"}
                            </div>
                            <div>
                                <strong>Record ID:</strong>{" "}
                                {auditLog.record_id || "N/A"}
                            </div>
                        </div>

                        <div
                            style={{
                                background: "#f8f9fa",
                                padding: "20px",
                                borderRadius: "8px",
                                border: "1px solid #dee2e6",
                            }}
                        >
                            <h3
                                style={{
                                    color: "#0066af",
                                    marginBottom: "15px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <FaUser /> User Information
                            </h3>
                            <div style={{ marginBottom: "10px" }}>
                                <strong>Name:</strong>{" "}
                                {auditLog.user?.name || "System/Deleted User"}
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <strong>Email:</strong>{" "}
                                {auditLog.user?.email || "N/A"}
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <strong>Role:</strong>{" "}
                                {auditLog.user?.role || "N/A"}
                            </div>
                            <div>
                                <strong>Department:</strong>{" "}
                                {auditLog.user?.department || "N/A"}
                            </div>
                        </div>

                        <div
                            style={{
                                background: "#f8f9fa",
                                padding: "20px",
                                borderRadius: "8px",
                                border: "1px solid #dee2e6",
                            }}
                        >
                            <h3
                                style={{
                                    color: "#0066af",
                                    marginBottom: "15px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <FaClock /> Timestamp Information
                            </h3>
                            <div style={{ marginBottom: "10px" }}>
                                <strong>Date:</strong>{" "}
                                {auditLog.metadata?.formatted_date_only ||
                                    "N/A"}
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <strong>Time:</strong>{" "}
                                {auditLog.metadata?.formatted_time || "N/A"}
                            </div>
                            <div>
                                <strong>Full DateTime:</strong>{" "}
                                {auditLog.metadata?.formatted_date || "N/A"}
                            </div>
                        </div>

                        <div
                            style={{
                                background: "#f8f9fa",
                                padding: "20px",
                                borderRadius: "8px",
                                border: "1px solid #dee2e6",
                            }}
                        >
                            <h3
                                style={{
                                    color: "#0066af",
                                    marginBottom: "15px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <FaDesktop /> Technical Information
                            </h3>
                            <div style={{ marginBottom: "10px" }}>
                                <strong>IP Address:</strong>{" "}
                                {auditLog.metadata?.ip_address || "N/A"}
                            </div>
                            <div
                                style={{
                                    wordBreak: "break-all",
                                    fontSize: "14px",
                                }}
                            >
                                <strong>User Agent:</strong>{" "}
                                {auditLog.metadata?.user_agent || "N/A"}
                            </div>
                        </div>
                    </div>

                    {/* Changes Information */}
                    {auditLog.changes?.has_changes && (
                        <div style={{ marginTop: "30px" }}>
                            <h3
                                style={{
                                    color: "#0066af",
                                    marginBottom: "20px",
                                    fontSize: "20px",
                                }}
                            >
                                Data Changes
                            </h3>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(400px, 1fr))",
                                    gap: "20px",
                                }}
                            >
                                {auditLog.changes.old_values && (
                                    <div>
                                        <h4
                                            style={{
                                                color: "#dc3545",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            Old Values:
                                        </h4>
                                        <pre
                                            style={{
                                                background: "#f8d7da",
                                                padding: "15px",
                                                borderRadius: "5px",
                                                border: "1px solid #f5c6cb",
                                                overflow: "auto",
                                                fontSize: "14px",
                                            }}
                                        >
                                            {JSON.stringify(
                                                auditLog.changes.old_values,
                                                null,
                                                2
                                            )}
                                        </pre>
                                    </div>
                                )}

                                {auditLog.changes.new_values && (
                                    <div>
                                        <h4
                                            style={{
                                                color: "#28a745",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            New Values:
                                        </h4>
                                        <pre
                                            style={{
                                                background: "#d4edda",
                                                padding: "15px",
                                                borderRadius: "5px",
                                                border: "1px solid #c3e6cb",
                                                overflow: "auto",
                                                fontSize: "14px",
                                            }}
                                        >
                                            {JSON.stringify(
                                                auditLog.changes.new_values,
                                                null,
                                                2
                                            )}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
