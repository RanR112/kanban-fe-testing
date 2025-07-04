import successIcon from "../assets/icons/success-icon.svg";
import changeIcon from "../assets/icons/change-icon.svg";
import confirmIcon from "../assets/icons/confirm-icon.svg";

const LAYOUT_CONFIGS = {
    user: {
        sidebarType: "user",
        redirectPath: "/user/request-kanban",
        alerts: {
            formReq: {
                icon: successIcon,
                title: "Request Kanban Successfully Sent",
                content: (
                    <>
                        <p>
                            Request kanban successfully sent. Please check your
                            department email
                        </p>
                        <p>
                            You can see the kanban approval in the request
                            details.
                        </p>
                    </>
                ),
                className: "formreq",
            },
            // TAMBAHAN: Alert untuk profile update
            confirmUpdate: {
                icon: changeIcon,
                title: "Update Profile",
                content: "Do you want to save changes to your profile?",
                className: "confirm-update",
            },
            updateSuccess: {
                icon: successIcon,
                title: "Profile Successfully Updated",
                className: "success-update",
            },
        },
        handlers: (showAlert, closeAlert, alerts) => {
            // TAMBAHAN: Handler untuk profile update
            const handleConfirmUpdate = () => {
                const onConfirm = alerts.confirmUpdate?.onConfirm;
                closeAlert("confirmUpdate", 0);
                showAlert("updateSuccess");
                if (onConfirm) onConfirm();
            };

            return {
                handleShowAlertFormReq: () => showAlert("formReq"),
                handleCloseAlertFormReq: () => closeAlert("formReq"),
                // TAMBAHAN: Handler untuk profile update
                showConfirmUpdate: (onConfirm) =>
                    showAlert("confirmUpdate", { onConfirm }),
                handleConfirmUpdate,
                handleCloseUpdateSuccess: () => closeAlert("updateSuccess"),
            };
        },
    },

    userLead: {
        sidebarType: "userLead",
        redirectPath: "/user-lead/approve-user-lead",
        alerts: {
            approve: {
                icon: successIcon,
                title: "Request Kanban Successfully Approved.",
                content: (
                    <>
                        <p>
                            Request kanban successfully approved. Please check
                            your department email
                        </p>
                        <p>
                            You can see the request approval in the approval
                            details.
                        </p>
                    </>
                ),
                className: "userlead-approve",
            },
            confirmReject: {
                icon: confirmIcon,
                title: "Reject Request Kanban",
                content:
                    "Are you sure you want to reject request kanban This action cannot be undone.",
                className: "userlead-confirmreject",
            },
            rejectSuccess: {
                icon: successIcon,
                title: "Request Kanban Successfully Rejected.",
                content: (
                    <>
                        <p>
                            Request kanban successfully Rejected. Please check
                            your department email
                        </p>
                        <p>
                            You can see the request approval in the approval
                            details.
                        </p>
                    </>
                ),
                className: "userlead-successreject",
            },
            // TAMBAHAN: Alert untuk profile update di userLead
            confirmUpdate: {
                icon: changeIcon,
                title: "Update Profile",
                content: "Do you want to save changes to your profile?",
                className: "confirm-update",
            },
            updateSuccess: {
                icon: successIcon,
                title: "Profile Successfully Updated",
                content: "Your profile has been updated successfully.",
                className: "success-update",
            },
        },
        handlers: (showAlert, closeAlert, alerts) => {
            const handleConfirm = () => {
                const onConfirm = alerts.confirmReject?.onConfirm;
                closeAlert("confirmReject", 0);
                showAlert("rejectSuccess");
                if (onConfirm) onConfirm();
            };

            // TAMBAHAN: Handler untuk profile update
            const handleConfirmUpdate = () => {
                const onConfirm = alerts.confirmUpdate?.onConfirm;
                closeAlert("confirmUpdate", 0);
                showAlert("updateSuccess");
                if (onConfirm) onConfirm();
            };

            return {
                handleShowAlertUserLeadApprove: () => showAlert("approve"),
                showConfirmReject: (onConfirm) =>
                    showAlert("confirmReject", { onConfirm }),
                handleConfirm,
                handleCancel: () => closeAlert("confirmReject"),
                handleCloseSuccess: () => closeAlert("rejectSuccess"),
                // TAMBAHAN: Handler untuk profile update
                showConfirmUpdate: (onConfirm) =>
                    showAlert("confirmUpdate", { onConfirm }),
                handleConfirmUpdate,
                handleCloseUpdateSuccess: () => closeAlert("updateSuccess"),
            };
        },
    },

    admin: {
        sidebarType: "admin",
        redirectPath: "/admin/users",
        alerts: {
            add: {
                icon: successIcon,
                title: "Successfully Added Users",
                className: "add",
            },
            confirmUpdate: {
                icon: changeIcon,
                title: "Unsaved Updates",
                content: "Do you want to save or cancel updates?",
                className: "confirm-update",
            },
            updateSuccess: {
                icon: successIcon,
                title: "Successfully Updates User",
                className: "success-update",
            },
            confirmDelete: {
                icon: confirmIcon,
                title: "Delete User?",
                className: "confirm-delete",
            },
            deleteSuccess: {
                icon: successIcon,
                title: "Successfully Delete User",
                className: "success-delete",
            },
            // TAMBAHAN: Registration alerts
            confirmRegistrationApprove: {
                icon: confirmIcon,
                title: "Approve Registration",
                className: "confirm-registration-approve",
            },
            registrationApprove: {
                icon: successIcon,
                title: "Registration Approved Successfully",
                content:
                    "The registration has been approved and user account has been created.",
                className: "registration-approve",
            },
            confirmRegistrationReject: {
                icon: confirmIcon,
                title: "Reject Registration",
                className: "confirm-registration-reject",
            },
            registrationReject: {
                icon: successIcon,
                title: "Registration Rejected Successfully",
                content:
                    "The registration has been rejected and the applicant has been notified.",
                className: "registration-reject",
            },
            confirmRegistrationDelete: {
                icon: confirmIcon,
                title: "Delete Registration",
                className: "confirm-registration-delete",
            },
            registrationDelete: {
                icon: successIcon,
                title: "Registration Deleted Successfully",
                content: "The registration has been permanently deleted.",
                className: "registration-delete",
            },
        },
        handlers: (showAlert, closeAlert, alerts) => {
            const handleConfirmUpdate = () => {
                const onConfirm = alerts.confirmUpdate?.onConfirm;
                closeAlert("confirmUpdate", 0);
                showAlert("updateSuccess");
                if (onConfirm) onConfirm();
            };

            const handleConfirmDelete = () => {
                const onConfirm = alerts.confirmDelete?.onConfirm;
                closeAlert("confirmDelete", 0);
                showAlert("deleteSuccess");
                if (onConfirm) onConfirm();
            };

            // TAMBAHAN: Registration handlers
            const handleConfirmRegistrationApprove = () => {
                const onConfirm = alerts.confirmRegistrationApprove?.onConfirm;
                closeAlert("confirmRegistrationApprove", 0);
                showAlert("registrationApprove");
                if (onConfirm) onConfirm();
            };

            const handleConfirmRegistrationReject = () => {
                const onConfirm = alerts.confirmRegistrationReject?.onConfirm;
                closeAlert("confirmRegistrationReject", 0);
                showAlert("registrationReject");
                if (onConfirm) onConfirm();
            };

            const handleConfirmRegistrationDelete = () => {
                const onConfirm = alerts.confirmRegistrationDelete?.onConfirm;
                closeAlert("confirmRegistrationDelete", 0);
                showAlert("registrationDelete");
                if (onConfirm) onConfirm();
            };

            return {
                handleShowAlertAdd: () => showAlert("add"),
                showConfirmUpdate: (onConfirm) =>
                    showAlert("confirmUpdate", { onConfirm }),
                showConfirmDelete: (user, onConfirm) =>
                    showAlert("confirmDelete", { user, onConfirm }),
                handleConfirmUpdate,
                handleConfirmDelete,
                // TAMBAHAN: Registration methods
                showConfirmRegistrationApprove: (registration, onConfirm) =>
                    showAlert("confirmRegistrationApprove", {
                        registration,
                        onConfirm,
                    }),
                showConfirmRegistrationReject: (registration, onConfirm) =>
                    showAlert("confirmRegistrationReject", {
                        registration,
                        onConfirm,
                    }),
                showConfirmRegistrationDelete: (registration, onConfirm) =>
                    showAlert("confirmRegistrationDelete", {
                        registration,
                        onConfirm,
                    }),
                handleConfirmRegistrationApprove,
                handleConfirmRegistrationReject,
                handleConfirmRegistrationDelete,
                handleShowRegistrationApprove: () =>
                    showAlert("registrationApprove"),
                handleShowRegistrationReject: () =>
                    showAlert("registrationReject"),
                handleShowRegistrationDelete: () =>
                    showAlert("registrationDelete"),
            };
        },
    },

    pcLead: {
        sidebarType: "pcLead",
        redirectPath: "/pc-lead/approve-pc-lead",
        alerts: {
            approve: {
                icon: successIcon,
                title: "Request Kanban Successfully Approved.",
                content: (
                    <>
                        <p>
                            Request kanban successfully approved. Please check
                            your department email
                        </p>
                        <p>
                            You can see the request approval in the approval
                            details.
                        </p>
                    </>
                ),
                className: "pclead-approve",
            },
            confirmReject: {
                icon: confirmIcon,
                title: "Reject Request Kanban",
                content:
                    "Are you sure you want to reject request kanban This action cannot be undone.",
                className: "pclead-confirmreject",
            },
            rejectSuccess: {
                icon: successIcon,
                title: "Request Kanban Successfully Rejected.",
                content: (
                    <>
                        <p>
                            Request kanban successfully Rejected. Please check
                            your department email
                        </p>
                        <p>
                            You can see the request approval in the approval
                            details.
                        </p>
                    </>
                ),
                className: "pclead-successreject",
            },
            // TAMBAHAN: Alert untuk profile update di pcLead
            confirmUpdate: {
                icon: changeIcon,
                title: "Update Profile",
                content: "Do you want to save changes to your profile?",
                className: "confirm-update",
            },
            updateSuccess: {
                icon: successIcon,
                title: "Profile Successfully Updated",
                content: "Your profile has been updated successfully.",
                className: "success-update",
            },
        },
        handlers: (showAlert, closeAlert, alerts) => {
            const handleConfirmPCLead = () => {
                const onConfirm = alerts.confirmReject?.onConfirm;
                closeAlert("confirmReject", 0);
                showAlert("rejectSuccess");
                if (onConfirm) onConfirm();
            };

            // TAMBAHAN: Handler untuk profile update
            const handleConfirmUpdate = () => {
                const onConfirm = alerts.confirmUpdate?.onConfirm;
                closeAlert("confirmUpdate", 0);
                showAlert("updateSuccess");
                if (onConfirm) onConfirm();
            };

            return {
                handleShowAlertPCLeadApprove: () => showAlert("approve"),
                showConfirmRejectPCLead: (onConfirm) =>
                    showAlert("confirmReject", { onConfirm }),
                handleConfirmPCLead,
                // TAMBAHAN: Handler untuk profile update
                showConfirmUpdate: (onConfirm) =>
                    showAlert("confirmUpdate", { onConfirm }),
                handleConfirmUpdate,
                handleCloseUpdateSuccess: () => closeAlert("updateSuccess"),
            };
        },
    },
};

export default LAYOUT_CONFIGS;
