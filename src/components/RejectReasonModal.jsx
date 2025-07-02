import React from "react";
import "../sass/components/RejectReasonModal/RejectReasonModal.css";

export default function RejectReasonModal({
    isOpen,
    registration,
    rejectionReason,
    onReasonChange,
    onConfirm,
    onCancel,
    loading = false,
}) {
    if (!isOpen || !registration) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rejectionReason.trim()) {
            onConfirm();
        } else {
            alert("Please provide a reason for rejection!");
        }
    };

    return (
        <div className="reject-modal__overlay">
            <div className="reject-modal">
                <div className="reject-modal__header">
                    <h3>Reject Registration</h3>
                    <button
                        onClick={onCancel}
                        className="reject-modal__close"
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                <div className="reject-modal__body">
                    <div className="reject-modal__info">
                        <p>
                            <strong>Employee:</strong> {registration.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {registration.email}
                        </p>
                        <p>
                            <strong>Employee ID:</strong>{" "}
                            {registration.employee_id}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="reject-modal__form-group">
                            <label htmlFor="rejection-reason">
                                Reason for Rejection{" "}
                                <span className="reject-modal__required">
                                    *
                                </span>
                            </label>
                            <textarea
                                id="rejection-reason"
                                value={rejectionReason}
                                onChange={(e) => onReasonChange(e.target.value)}
                                placeholder="Please provide a detailed reason for rejecting this registration..."
                                rows={5}
                                className="reject-modal__textarea"
                                disabled={loading}
                                required
                            />
                            <div className="reject-modal__char-count">
                                {rejectionReason.length} characters
                            </div>
                        </div>
                    </form>
                </div>

                <div className="reject-modal__footer">
                    <button
                        onClick={onCancel}
                        className="reject-modal__button cancel-button"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="reject-modal__button reject-button"
                        disabled={loading || !rejectionReason.trim()}
                    >
                        {loading ? "Rejecting..." : "Reject Registration"}
                    </button>
                </div>
            </div>
        </div>
    );
};
