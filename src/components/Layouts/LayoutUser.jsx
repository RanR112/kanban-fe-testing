import React, { useState } from "react";
import SideUser from "../SideUser/SideUser";
import BarUp from "../BarUp";
import { Outlet, useNavigate } from "react-router-dom";
import "../../sass/components/Layouts/Layout.css";
import "../../sass/components/Alert/AlertUser/AlertReqKanbanSuccess/AlertSuccess.css";
import successIcon from "../../assets/icons/success-icon.svg";

export default function LayoutUser() {
  const [alertFormReq, setAlertFormReq] = useState(false);
  const [fadeOutSuccess, setFadeOutSuccess] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = (value) => {
    setIsSidebarOpen((prev) => (typeof value === "boolean" ? value : !prev));
  };
  const handleShowAlertFormReq = () => {
    setFadeOutSuccess(false);
    setAlertFormReq(true);
  };

  const handleCloseAlertFormReq = () => {
    setFadeOutSuccess(true);
    setTimeout(() => {
      setAlertFormReq(false);
      setFadeOutSuccess(false);
    }, 300);
    navigate("/user/request-kanban");
  };

  // Hapus bagian ini ketika Login sudah siap
  const dummyGetUserById = async (id) => {
    // Simulasi data user dari backend
    return {
      id: id,
      nama: "Dummy User",
      departemen: "DQ", // Sesuai dengan departmentMap
    };
  };

  // Hapus bagian getUserById dan yang didalamnya ketika Login sudah siap
  return (
    <div className="layout-container">
      {/* Sidebar */}
      <SideUser
        getUserById={dummyGetUserById}
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
        <div className="page-container">
          <Outlet context={{ handleShowAlertFormReq }} />
        </div>
      </div>

      {/* Alert Kirim Request */}
      {alertFormReq && (
        <div className="overlay-formreq">
          <div
            className={`alert-box-formreq ${
              fadeOutSuccess ? "fade-out" : "fade-in"
            }`}
          >
            <div className="alert-icon-formreq">
              <div className="icon-circle-formreq">
                <img src={successIcon} alt="" />
              </div>
            </div>
            <div className="alert-content-formreq">
              <h3>Request Kanban Successfully Sent</h3>
              <p>
                Request kanban successfully sent. Please check your department
                email
              </p>
              <p>You can see the kanban approval in the request details.</p>
            </div>
            <div className="alert-buttons-formreq">
              <button
                className="btn-formreq cancel-formreq"
                onClick={handleCloseAlertFormReq}
              >
                Cancel
              </button>
              <button
                className="btn-formreq confirm-formreq"
                onClick={handleCloseAlertFormReq}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
