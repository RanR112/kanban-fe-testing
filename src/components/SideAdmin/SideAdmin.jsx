import React, { useEffect, useState } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import "../../sass/components/SideBar/Sidebar.css"; // pastikan ini SCSS, bukan CSS
import logo from "../../assets/images/logo.svg";
import Builder from "../../assets/images/builder1.svg";
import Home from "../../assets/icons/home.svg";
import Clipboard from "../../assets/icons/clipboard.svg";
import Users from "../../assets/icons/users.svg";
import File from "../../assets/icons/file.svg";
import Logout from "../../assets/icons/logout-icon.svg";
import API from "../../service/api";
import { DEPARTMENT_MAP } from "../../global/constants";

const SideAdmin = () => {
  const [time, setTime] = useState(new Date());
  const [id_department, setIdDepartment] = useState("");
  const [departmentName, setDepartmentName] = useState("Production Control");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isRequestActive1 =
    location.pathname.startsWith("/admin/kanbanreq-admin") ||
    location.pathname.startsWith("/admin/detail-kanbanreq");

  const isRequestActive2 =
    location.pathname.startsWith("/admin/users") ||
    location.pathname.startsWith("/admin/add-users") ||
    location.pathname.startsWith("/admin/edit-users");

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const userStorage = JSON.parse(localStorage.getItem("user"));
        const userId = userStorage.id_users;
        await API.get(`user/me/${userId}`).then((res) => {
          const deptCode = res.data.data.department.name;
          const fullDeptName =
            DEPARTMENT_MAP[deptCode] || "Departemen Tidak Diketahui";
          setIdDepartment(deptCode);
          setDepartmentName(fullDeptName);
        });
      } catch (error) {
        setDepartmentName("Departemen Tidak Diketahui");
      }
    };

    if (!id_department) {
      fetchDepartment();
    }
  }, [id_department]);

  const formattedTime = time.toLocaleTimeString("en-GB");
  const formattedDate = time.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <div
        className={`sidebar ${sidebarOpen ? "open" : "closed"}`}
        onToggleSidebar={handleToggleSidebar}
      >
        <img src={logo} alt="Logo" className="logo" />

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
          <NavLink
            to="/admin/home-admin"
            className={({ isActive }) =>
              `nav-button primary${isActive ? " active" : ""}`
            }
          >
            <img src={Home} alt="" className="img-nav" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/kanbanreq-admin"
            className={`nav-button secondary${
              isRequestActive1 ? " active" : ""
            }`}
          >
            <img src={Clipboard} alt="" className="img-nav" />
            <span>Kanban Request</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={`nav-button secondary${
              isRequestActive2 ? " active" : ""
            }`}
          >
            <img src={Users} alt="" className="img-nav" />
            <span>Users</span>
          </NavLink>

          <NavLink
            to="/admin/report-admin"
            className={({ isActive }) =>
              `nav-button secondary${isActive ? " active" : ""}`
            }
          >
            <img src={File} alt="" className="img-nav" />
            <span>Report</span>
          </NavLink>
        </div>

        <div className="logout-section">
          <button className="logout-button" onClick={handleLogout}>
            <img src={Logout} alt="Logout" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SideAdmin;
