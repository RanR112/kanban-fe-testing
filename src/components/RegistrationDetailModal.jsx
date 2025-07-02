import React from "react";
import "../sass/Components/RegistrationDetailModal/RegistrationDetailModal.css";
import { DEPARTMENT_MAP } from "../utils/constants";

const RegistrationDetailModal = ({ isOpen, registration, onClose }) => {
    if (!isOpen || !registration) return null;

    const formatDate = (isoString) => {
        if (!isoString) return "-";
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return "-";
        return date.toLocaleString();
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            PENDING: "pending",
            APPROVED: "approved",
            REJECTED: "rejected",
        };
        return (
            <span
                className={`detail-modal__status detail-modal__status--${
                    statusClasses[status] || "pending"
                }`}
            >
                {status}
            </span>
        );
    };

    return (
        <div className="detail-modal__overlay">
            <div className="detail-modal">
                <div className="detail-modal__header">
                    <h3>Registration Details</h3>
                    <button onClick={onClose} className="detail-modal__close">
                        ×
                    </button>
                </div>

                <div className="detail-modal__body">
                    <div className="detail-modal__section">
                        <h4>Personal Information</h4>
                        <div className="detail-modal__grid">
                            <div className="detail-modal__field">
                                <label>Employee ID:</label>
                                <span>{registration.employee_id}</span>
                            </div>
                            <div className="detail-modal__field">
                                <label>Full Name:</label>
                                <span>{registration.name}</span>
                            </div>
                            <div className="detail-modal__field">
                                <label>Email:</label>
                                <span>{registration.email}</span>
                            </div>
                            <div className="detail-modal__field">
                                <label>Phone Number:</label>
                                <span>{registration.no_hp}</span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-modal__section">
                        <h4>Work Information</h4>
                        <div className="detail-modal__grid">
                            <div className="detail-modal__field">
                                <label>Position:</label>
                                <span>{registration.position}</span>
                            </div>
                            <div className="detail-modal__field">
                                <label>Department:</label>
                                <span>
                                    {registration.department?.name || "-"}
                                </span>
                            </div>
                            <div className="detail-modal__field">
                                <label>Division:</label>
                                <span>{registration.division || "-"}</span>
                            </div>
                            <div className="detail-modal__field">
                                <label>Work Location:</label>
                                <span>{registration.work_location || "-"}</span>
                            </div>
                            <div className="detail-modal__field">
                                <label>Hire Date:</label>
                                <span>
                                    {registration.hire_date
                                        ? formatDate(registration.hire_date)
                                        : "-"}
                                </span>
                            </div>
                            <div className="detail-modal__field">
                                <label>Role:</label>
                                <span>{registration.role}</span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-modal__section">
                        <h4>Registration Status</h4>
                        <div className="detail-modal__grid">
                            <div className="detail-modal__field">
                                <label>Status:</label>
                                <span>
                                    {getStatusBadge(registration.status)}
                                </span>
                            </div>
                            <div className="detail-modal__field">
                                <label>Email Verified:</label>
                                <span
                                    className={`detail-modal__verified ${
                                        registration.email_verified
                                            ? "verified"
                                            : "unverified"
                                    }`}
                                >
                                    {registration.email_verified ? "Yes" : "No"}
                                </span>
                            </div>
                            <div className="detail-modal__field">
                                <label>Created At:</label>
                                <span>
                                    {formatDate(registration.created_at)}
                                </span>
                            </div>
                            <div className="detail-modal__field">
                                <label>Updated At:</label>
                                <span>
                                    {formatDate(registration.updated_at)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {registration.status !== "PENDING" && (
                        <div className="detail-modal__section">
                            <h4>Verification Information</h4>
                            <div className="detail-modal__grid">
                                <div className="detail-modal__field">
                                    <label>Verified At:</label>
                                    <span>
                                        {formatDate(registration.verified_at)}
                                    </span>
                                </div>
                                <div className="detail-modal__field">
                                    <label>Verified By:</label>
                                    <span>
                                        {registration.verifier?.name || "-"}
                                    </span>
                                </div>
                                {registration.rejection_reason && (
                                    <div className="detail-modal__field detail-modal__field--full">
                                        <label>Rejection Reason:</label>
                                        <div className="detail-modal__rejection-reason">
                                            {registration.rejection_reason}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="detail-modal__footer">
                    <button onClick={onClose} className="detail-modal__button">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationDetailModal;
