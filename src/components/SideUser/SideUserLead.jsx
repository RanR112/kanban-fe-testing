import React, { useEffect, useState } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import "../../sass/components/SideBar/SideBar.css"; // pastikan ini SCSS, bukan CSS
import logo from "../../assets/images/logo.svg";
import Builder from "../../assets/images/builder1.svg";
import Home from "../../assets/icons/home.svg";
import Clipboard from "../../assets/icons/clipboard.svg";
import FileApprv from "../../assets/icons/approve.svg";
import Logout from "../../assets/icons/logout-icon.svg";
import closeIcon from "../../assets/icons/xmark-solid.svg";
import API from "../../service/api";
import { DEPARTMENT_MAP } from "../../global/constants";

const SideUserLead = ({ isSidebarOpen, toggleSidebar }) => {
  const [time, setTime] = useState(new Date());
  const [id_department, setIdDepartment] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isRequestActive1 =
    location.pathname.startsWith("/user-lead/reqkanban-user-lead") ||
    location.pathname.startsWith("/user-lead/detailreq-user-lead");

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      toggleSidebar(false); // tutup sidebar saat awal jika mobile
    }
  }, []);

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
      <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <img src={logo} alt="Logo" className="logo" />
        {/* Tombol Tutup Sidebar */}
        <div className="close-sidebar-button" onClick={toggleSidebar}>
          <img src={closeIcon} alt="Close Sidebar" />
        </div>

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
            to="/user-lead/home-user-lead"
            className={({ isActive }) =>
              `nav-button primary${isActive ? " active" : ""}`
            }
          >
            <img src={Home} alt="" className="img-nav" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/user-lead/reqkanban-user-lead"
            className={`nav-button secondary${
              isRequestActive1 ? " active" : ""
            }`}
          >
            <img src={Clipboard} alt="" className="img-nav" />
            <span>Request Kanban</span>
          </NavLink>

          <NavLink
            to="/user-lead/approve-user-lead"
            className={({ isActive }) =>
              `nav-button primary${isActive ? " active" : ""}`
            }
          >
            <img src={FileApprv} alt="" className="img-nav" />
            <span>Approval</span>
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

export default SideUserLead;
