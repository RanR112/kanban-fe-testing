export const alertButton = {
    user: {
        formReq: [
            {
                label: "Cancel",
                variant: "cancel-formreq",
                action: "handleCloseAlertFormReq",
            },
            {
                label: "Confirm",
                variant: "confirm-formreq",
                action: "handleCloseAlertFormReq",
            },
        ],
        confirmUpdate: [
            {
                label: "Cancel",
                variant: "cancel-confirm-update",
                action: "closeAlert",
                params: ["confirmUpdate"],
            },
            {
                label: "Save updates",
                variant: "confirm-confirm-update",
                action: "handleConfirmUpdate",
            },
        ],
        updateSuccess: [
            {
                label: "Ok",
                variant: "cancel-success-update",
                action: "closeAlert",
                params: ["updateSuccess"],
            },
        ],
    },

    userLead: {
        approve: [
            {
                label: "Cancel",
                variant: "cancel-userlead-approve",
                action: "closeAlert",
                params: ["approve"],
            },
            {
                label: "Confirm",
                variant: "confirm-userlead-approve",
                action: "closeAlert",
                params: ["approve"],
            },
        ],
        confirmReject: [
            {
                label: "Cancel",
                variant: "cancel-userlead-confirmreject",
                action: "handleCancel",
            },
            {
                label: "Reject",
                variant: "confirm-userlead-confirmreject",
                action: "handleConfirm",
            },
        ],
        rejectSuccess: [
            {
                label: "Confirm",
                variant: "cancel-userlead-successreject",
                action: "handleCloseSuccess",
            },
        ],
        confirmUpdate: [
            {
                label: "Cancel",
                variant: "cancel-confirm-update",
                action: "closeAlert",
                params: ["confirmUpdate"],
            },
            {
                label: "Save updates",
                variant: "confirm-confirm-update",
                action: "handleConfirmUpdate",
            },
        ],
        updateSuccess: [
            {
                label: "Ok",
                variant: "cancel-success-update",
                action: "closeAlert",
                params: ["updateSuccess"],
            },
        ],
    },

    admin: {
        add: [
            {
                label: "Cancel",
                variant: "cancel-btn-add",
                action: "closeAlert",
                params: ["add"],
            },
            {
                label: "Confirm",
                variant: "confirm-btn-add",
                action: "closeAlert",
                params: ["add"],
            },
        ],
        confirmUpdate: [
            {
                label: "Cancel",
                variant: "cancel-confirm-update",
                action: "closeAlert",
                params: ["confirmUpdate"],
            },
            {
                label: "Save updates",
                variant: "confirm-confirm-update",
                action: "handleConfirmUpdate",
            },
        ],
        updateSuccess: [
            {
                label: "Ok",
                variant: "cancel-success-update",
                action: "closeAlert",
                params: ["updateSuccess"],
            },
        ],
        confirmDelete: [
            {
                label: "Cancel",
                variant: "cancel-confirm-delete",
                action: "closeAlert",
                params: ["confirmDelete"],
            },
            {
                label: "Delete",
                variant: "confirm-confirm-delete",
                action: "handleConfirmDelete",
            },
        ],
        deleteSuccess: [
            {
                label: "Ok",
                variant: "cancel-success-delete",
                action: "closeAlert",
                params: ["deleteSuccess"],
            },
        ],
        // TAMBAHAN: Registration alerts
        confirmRegistrationApprove: [
            {
                label: "Cancel",
                variant: "cancel-confirm-registration-approve",
                action: "closeAlert",
                params: ["confirmRegistrationApprove"],
            },
            {
                label: "Approve",
                variant: "confirm-confirm-registration-approve",
                action: "handleConfirmRegistrationApprove",
            },
        ],
        registrationApprove: [
            {
                label: "Ok",
                variant: "cancel-registration-approve",
                action: "closeAlert",
                params: ["registrationApprove"],
            },
        ],
        confirmRegistrationReject: [
            {
                label: "Cancel",
                variant: "cancel-confirm-registration-reject",
                action: "closeAlert",
                params: ["confirmRegistrationReject"],
            },
            {
                label: "Reject",
                variant: "confirm-confirm-registration-reject",
                action: "handleConfirmRegistrationReject",
            },
        ],
        registrationReject: [
            {
                label: "Ok",
                variant: "cancel-registration-reject",
                action: "closeAlert",
                params: ["registrationReject"],
            },
        ],
        confirmRegistrationDelete: [
            {
                label: "Cancel",
                variant: "cancel-confirm-registration-delete",
                action: "closeAlert",
                params: ["confirmRegistrationDelete"],
            },
            {
                label: "Delete",
                variant: "confirm-confirm-registration-delete",
                action: "handleConfirmRegistrationDelete",
            },
        ],
        registrationDelete: [
            {
                label: "Ok",
                variant: "cancel-registration-delete",
                action: "closeAlert",
                params: ["registrationDelete"],
            },
        ],
    },

    pcLead: {
        approve: [
            {
                label: "Cancel",
                variant: "cancel-pclead-approve",
                action: "closeAlert",
                params: ["approve"],
            },
            {
                label: "Confirm",
                variant: "confirm-pclead-approve",
                action: "closeAlert",
                params: ["approve"],
            },
        ],
        confirmReject: [
            {
                label: "Cancel",
                variant: "cancel-pclead-confirmreject",
                action: "closeAlert",
                params: ["confirmReject"],
            },
            {
                label: "Reject",
                variant: "confirm-pclead-confirmreject",
                action: "handleConfirmPCLead",
            },
        ],
        rejectSuccess: [
            {
                label: "Confirm",
                variant: "cancel-pclead-successreject",
                action: "closeAlert",
                params: ["rejectSuccess"],
            },
        ],
        confirmUpdate: [
            {
                label: "Cancel",
                variant: "cancel-confirm-update",
                action: "closeAlert",
                params: ["confirmUpdate"],
            },
            {
                label: "Save updates",
                variant: "confirm-confirm-update",
                action: "handleConfirmUpdate",
            },
        ],
        updateSuccess: [
            {
                label: "Ok",
                variant: "cancel-success-update",
                action: "closeAlert",
                params: ["updateSuccess"],
            },
        ],
    },
};

// Utility function untuk membuat onClick handler
const createOnClickHandler = (action, params, handlers, closeAlert) => {
    switch (action) {
        case "closeAlert":
            return () => closeAlert(...params);
        case "handleCloseAlertFormReq":
            return handlers.handleCloseAlertFormReq;
        case "handleCancel":
            return handlers.handleCancel;
        case "handleConfirm":
            return handlers.handleConfirm;
        case "handleCloseSuccess":
            return handlers.handleCloseSuccess;
        case "handleConfirmUpdate":
            return handlers.handleConfirmUpdate;
        case "handleConfirmDelete":
            return handlers.handleConfirmDelete;
        case "handleConfirmPCLead":
            return handlers.handleConfirmPCLead;
        // TAMBAHAN: Registration handlers
        case "handleConfirmRegistrationApprove":
            return handlers.handleConfirmRegistrationApprove;
        case "handleConfirmRegistrationReject":
            return handlers.handleConfirmRegistrationReject;
        case "handleConfirmRegistrationDelete":
            return handlers.handleConfirmRegistrationDelete;
        default:
            return () => {};
    }
};

export const getButtonsForAlert = (
    layoutType,
    alertType,
    handlers,
    closeAlert
) => {
    const config = alertButton[layoutType]?.[alertType];

    if (!config) {
        return [];
    }

    return config.map((buttonConfig) => ({
        label: buttonConfig.label,
        variant: buttonConfig.variant,
        onClick: createOnClickHandler(
            buttonConfig.action,
            buttonConfig.params || [],
            handlers,
            closeAlert
        ),
    }));
};
