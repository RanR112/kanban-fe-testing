import React, { useState } from "react";
import Sidebar from "./Sidebar";
import BarUp from "./BarUp";
import BaseAlert from "./BaseAlert";
import { Outlet } from "react-router-dom";
import { useAlert } from "../hooks/useAlert";
import { getButtonsForAlert } from "../config/alertButton";
import "../sass/components/Layouts/Layout.css";
import LAYOUT_CONFIGS from "../config/layout";

const Layout = ({ layoutType }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const config = LAYOUT_CONFIGS[layoutType];

    if (!config) {
        throw new Error(`Layout type "${layoutType}" not found`);
    }

    const { alerts, showAlert, closeAlert } = useAlert(config.redirectPath);
    const handlers = config.handlers(showAlert, closeAlert, alerts);

    const toggleSidebar = (value) => {
        setIsSidebarOpen((prev) =>
            typeof value === "boolean" ? value : !prev
        );
    };

    const closeSidebar = () => {
        if (isSidebarOpen === true) {
            setIsSidebarOpen(false);
        }
    };

    // Update getContentForAlert function di Layout.jsx
    const getContentForAlert = (alertType, alertConfig) => {
        if (layoutType === "admin") {
            switch (alertType) {
                case "confirmDelete":
                    return (
                        <p>
                            Are you sure you want to delete user
                            <span>
                                {" "}
                                {alerts.confirmDelete?.user?.name}
                            </span>? <br />
                            This action cannot be undone.
                        </p>
                    );
                case "confirmRegistrationApprove":
                    return (
                        <p>
                            Are you sure you want to approve registration for
                            <span>
                                {" "}
                                {
                                    alerts.confirmRegistrationApprove
                                        ?.registration?.name
                                }
                            </span>
                            <br />(
                            {
                                alerts.confirmRegistrationApprove?.registration
                                    ?.email
                            }
                            )? <br />
                            This will create a new user account.
                        </p>
                    );
                case "confirmRegistrationReject":
                    return (
                        <p>
                            Are you sure you want to reject registration for
                            <span>
                                {" "}
                                {
                                    alerts.confirmRegistrationReject
                                        ?.registration?.name
                                }
                            </span>
                            <br />(
                            {
                                alerts.confirmRegistrationReject?.registration
                                    ?.email
                            }
                            )? <br />
                            This action cannot be undone.
                        </p>
                    );
                case "confirmRegistrationDelete":
                    return (
                        <p>
                            Are you sure you want to permanently delete
                            registration for
                            <span>
                                {" "}
                                {
                                    alerts.confirmRegistrationDelete
                                        ?.registration?.name
                                }
                            </span>
                            <br />(
                            {
                                alerts.confirmRegistrationDelete?.registration
                                    ?.email
                            }
                            )? <br />
                            This action cannot be undone.
                        </p>
                    );
                default:
                    return alertConfig.content;
            }
        }
        return alertConfig.content;
    };

    return (
        <div className="layout-container">
            {/* Sidebar */}
            <Sidebar
                type={config.sidebarType}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            {/* Main Content */}
            <div className="main-content">
                <BarUp
                    departmentPC="PRODUCTION CONTROL DEPARTMENT"
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                />
                <div className="page-container" onClick={closeSidebar}>
                    <Outlet context={handlers} />
                </div>
            </div>

            {/* Dynamic Alerts */}
            {Object.entries(config.alerts).map(([alertType, alertConfig]) => (
                <BaseAlert
                    key={alertType}
                    isVisible={alerts[alertType]?.visible}
                    fadeOut={alerts[alertType]?.fadeOut}
                    icon={alertConfig.icon}
                    title={alertConfig.title}
                    content={getContentForAlert(alertType, alertConfig)}
                    buttons={getButtonsForAlert(
                        layoutType,
                        alertType,
                        handlers,
                        closeAlert
                    )}
                    className={alertConfig.className}
                />
            ))}
        </div>
    );
};

export default Layout;
