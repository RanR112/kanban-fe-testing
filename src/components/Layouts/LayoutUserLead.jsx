import React, { useState } from "react";
import SideUserLead from "../SideUser/SideUserLead";
import BarUp from "../BarUp";
import { Outlet, useNavigate } from "react-router-dom";
import "../../sass/components/Layouts/Layout.css";
import "../../sass/components/Alert/AlertUserLead/AlertFormApprove/AlertFormApprove.css";
import "../../sass/components/Alert/AlertUserLead/AlertFormReject/AlertFormReject.css";
import successIcon from "../../assets/icons/success-icon.svg";
import confirmIcon from "../../assets/icons/confirm-icon.svg";

export default function LayoutUserLead() {
  const [alertUserLeadApprove, setAlertUserLeadApprove] = useState(false);
  const [alertConfirmReject, setAlertConfirmReject] = useState(false);
  const [alertUserLeadRejectSuccess, setAlertUserLeadRejectSuccess] =
    useState(false);
  const [onConfirmReject, setOnConfirmReject] = useState(() => () => {});
  const [fadeOut, setFadeOut] = useState(false);
  const [fadeOutConfirm, setFadeOutConfirm] = useState(false);
  const [fadeOutSuccess, setFadeOutSuccess] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = (value) => {
    setIsSidebarOpen((prev) => (typeof value === "boolean" ? value : !prev));
  };

  //  handle alert Approve
  const handleShowAlertUserLeadApprove = () => {
    setFadeOut(false);
    setAlertUserLeadApprove(true);
  };

  const handleCloseAlertUserLeadApprove = () => {
    setFadeOut(true);
    setTimeout(() => {
      setAlertUserLeadApprove(false);
      setFadeOut(false);
    }, 300);
    navigate("/user-lead/approve-user-lead");
  };

  // handle alert reject
  const showConfirmReject = (onConfirm) => {
    setOnConfirmReject(() => onConfirm);
    setAlertConfirmReject(true);
    setFadeOutConfirm(false);
  };

  const handleConfirm = () => {
    setFadeOutConfirm(true);
    setTimeout(() => {
      setAlertConfirmReject(false);
      setAlertUserLeadRejectSuccess(true);
      setFadeOutSuccess(false);
      onConfirmReject();
    }, 300); // Sesuai durasi animasi fade-out
  };

  const handleCancel = () => {
    setFadeOutConfirm(true);
    setTimeout(() => {
      setAlertConfirmReject(false);
    }, 300);
  };

  const handleCloseSuccess = () => {
    setFadeOutSuccess(true);
    setTimeout(() => {
      setAlertUserLeadRejectSuccess(false);
      setFadeOutSuccess(false);
    }, 300);
    navigate("/user-lead/approve-user-lead");
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <SideUserLead
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
          <Outlet
            context={{
              handleShowAlertUserLeadApprove,
              showConfirmReject,
            }}
          />
        </div>
      </div>

      {/* Alert Approve Request */}
      {alertUserLeadApprove && (
        <div className="overlay-userlead-approve">
          <div
            className={`alert-box-userlead-approve ${
              fadeOut ? "fade-out" : "fade-in"
            }`}
          >
            <div className="alert-icon-userlead-approve">
              <div className="icon-circle-userlead-approve">
                <img src={successIcon} alt="" />
              </div>
            </div>
            <div className="alert-content-userlead-approve">
              <h3>Request Kanban Successfully Approved.</h3>
              <p>
                Request kanban successfully approved. Please check your
                department email
              </p>
              <p>You can see the request approval in the approval details.</p>
            </div>
            <div className="alert-buttons-userlead-approve">
              <button
                className="btn-userlead-approve cancel-userlead-approve"
                onClick={handleCloseAlertUserLeadApprove}
              >
                Cancel
              </button>
              <button
                className="btn-userlead-approve confirm-userlead-approve"
                onClick={handleCloseAlertUserLeadApprove}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Reject Request */}
      {alertConfirmReject && (
        <div className="overlay-userlead-confirmreject">
          <div
            className={`alert-box-userlead-confirmreject ${
              fadeOutConfirm ? "fade-out" : "fade-in"
            }`}
          >
            <div className="alert-icon-userlead-confirmreject">
              <div className="icon-circle-userlead-confirmreject">
                <img src={confirmIcon} alt="" />
              </div>
            </div>
            <div className="alert-content-userlead-confirmreject">
              <h3>Reject Request Kanban</h3>
              <p>
                Are you sure you want to reject request kanban This action
                cannot be undone.
              </p>
            </div>
            <div className="alert-buttons-userlead-confirmreject">
              <button
                className="btn-userlead-confirmreject cancel-userlead-confirmreject"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="btn-userlead-confirmreject confirm-userlead-confirmreject"
                onClick={handleConfirm}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {alertUserLeadRejectSuccess && (
        <div className="overlay-userlead-successreject">
          <div
            className={`alert-box-userlead-successreject ${
              fadeOutSuccess ? "fade-out" : "fade-in"
            }`}
          >
            <div className="alert-icon-userlead-successreject">
              <div className="icon-circle-userlead-successreject">
                <img src={successIcon} alt="" />
              </div>
            </div>
            <div className="alert-content-userlead-successreject">
              <h3>Request Kanban Successfully Rejected.</h3>
              <p>
                Request kanban successfully Rejected. Please check your
                department email
              </p>
              <p>You can see the request approval in the approval details.</p>
            </div>
            <div className="alert-buttons-userlead-successreject">
              <button
                className="btn-userlead-successreject cancel-userlead-successreject"
                onClick={handleCloseSuccess}
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
