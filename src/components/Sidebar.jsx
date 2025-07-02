import React, { useEffect, useState } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import "../sass/components/SideBar/SideBar.css";
import logo from "../assets/images/logo.svg";
import Builder from "../assets/images/builder1.svg";
import Logout from "../assets/icons/logout-icon.svg";
import closeIcon from "../assets/icons/xmark-solid.svg";
import { DEPARTMENT_MAP } from "../utils/constants";
import SIDEBAR_CONFIGS from "../config/sidebar";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = ({ type, isSidebarOpen, toggleSidebar }) => {
    const { user, logout } = useAuth();
    const [time, setTime] = useState(new Date());
    const [id_department, setIdDepartment] = useState("");
    const [departmentName, setDepartmentName] = useState("");
    const [internalSidebarOpen, setInternalSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const config = SIDEBAR_CONFIGS[type];

    // Mobile check (hanya untuk user dan userLead)
    useEffect(() => {
        if (config.hasMobileCheck) {
            const isMobile = window.innerWidth <= 768;
            if (isMobile && toggleSidebar) {
                toggleSidebar(false);
            }
        }
    }, [config.hasMobileCheck, toggleSidebar]);

    // Timer
    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Fetch department from user context
    useEffect(() => {
        if (user && user.department) {
            const fullDeptName =
                DEPARTMENT_MAP[user.department.name] ||
                "Departemen Tidak Diketahui";
            setIdDepartment(user.department.id_department);
            setDepartmentName(fullDeptName);
        }
    }, [user]);

    const formattedTime = time.toLocaleTimeString("en-GB");
    const formattedDate = time.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const handleLogout = async () => {
        console.log("User initiated logout");

        try {
            await logout(user.id_users);
            console.log("Logout successful, navigating to login");
        } catch (error) {
            console.warn("Logout had issues but proceeding:", error);
        }

        // Always navigate to login page
        navigate("/login", { replace: true });
    };

    const handleToggleSidebar = () => {
        setInternalSidebarOpen((prev) => !prev);
    };

    // Menentukan apakah sidebar terbuka
    const isOpen = toggleSidebar ? isSidebarOpen : internalSidebarOpen;

    // Helper untuk cek active nav item
    const isNavItemActive = (item) => {
        if (item.activePaths) {
            return item.activePaths.some((path) =>
                location.pathname.startsWith(path)
            );
        }
        return false;
    };

    // Show loading atau placeholder jika user belum ada
    if (!user) {
        return (
            <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
                <img src={logo} alt="Logo" className="logo" />
                <div className="profile-card">
                    <div className="avatar">
                        <img src={Builder} alt="" className="icon" />
                    </div>
                    <div className="info">
                        <div className="department">Loading ges...</div>
                        <div className="time">{formattedTime}</div>
                        <div className="date">{formattedDate}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`sidebar ${isOpen ? "open" : "closed"}`}
            onToggleSidebar={toggleSidebar ? undefined : handleToggleSidebar}
        >
            <img src={logo} alt="Logo" className="logo" />

            {config.showCloseButton && (
                <div className="close-sidebar-button" onClick={toggleSidebar}>
                    <img src={closeIcon} alt="Close Sidebar" />
                </div>
            )}

            <div className="profile-card">
                <div className="avatar">
                    <img src={Builder} alt="" className="icon" />
                </div>
                <div className="info">
                    <div className={`department dep-${id_department}`}>
                        {departmentName}
                    </div>
                    <div className="time">{formattedTime}</div>
                    <div className="date">{formattedDate}</div>
                </div>
            </div>

            <div className="nav-buttons">
                {config.navItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={
                            item.activePaths
                                ? `nav-button ${item.class}${
                                      isNavItemActive(item) ? " active" : ""
                                  }`
                                : ({ isActive }) =>
                                      `nav-button ${item.class}${
                                          isActive ? " active" : ""
                                      }`
                        }
                        onClick={toggleSidebar}
                    >
                        <img src={item.icon} alt="" className="img-nav" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </div>

            <div className="logout-section">
                <button className="logout-button" onClick={handleLogout}>
                    <img src={Logout} alt="Logout" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

// Komponen wrapper untuk setiap tipe (opsional, untuk backward compatibility)
export const SideUser = ({ isSidebarOpen, toggleSidebar }) => (
    <Sidebar
        type="user"
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
    />
);

export const SideUserLead = ({ isSidebarOpen, toggleSidebar }) => (
    <Sidebar
        type="userLead"
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
    />
);

export const SideAdmin = ({ isSidebarOpen, toggleSidebar }) => (
    <Sidebar
        type="admin"
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
    />
);

export const SidePCLead = ({ isSidebarOpen, toggleSidebar }) => (
    <Sidebar
        type="pcLead"
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
    />
);

export default Sidebar;
