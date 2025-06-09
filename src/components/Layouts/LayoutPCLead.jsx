import React, { useState } from "react";
import BarUp from "../BarUp";
import { Outlet, useNavigate } from "react-router-dom";
import "../../sass/components/Layouts/Layout.css";
import "../../sass/components/Alert/AlertPCLead/AlertFormApprove/AlertFormApprove.css";
import "../../sass/components/Alert/AlertPCLead/AlertFormReject/AlertFormReject.css";
import SidePCLead from "../SideAdmin/SidePCLead";
import successIcon from "../../assets/icons/success-icon.svg";
import confirmIcon from "../../assets/icons/confirm-icon.svg";

export default function LayoutPCLead() {
  const [alertPCLeadApprove, setAlertPCLeadApprove] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [alertConfirmRejectPCLead, setAlertConfirmRejectPCLead] =
    useState(false);
  const [alertPCLeadRejectSuccess, setAlertPCLeadRejectSuccess] =
    useState(false);
  const [onConfirmRejectPCLead, setOnConfirmRejectPCLead] = useState(
    () => () => {}
  );
  const [fadeOutConfirmPCLead, setFadeOutConfirmPCLead] = useState(false);
  const [fadeOutSuccessPCLead, setFadeOutSuccessPCLead] = useState(false);
  const navigate = useNavigate();

  //  handle alert Approve
  const handleShowAlertPCLeadApprove = () => {
    setFadeOut(false);
    setAlertPCLeadApprove(true);
  };

  const handleCloseAlertPCLeadApprove = () => {
    setFadeOut(true);
    setTimeout(() => {
      setAlertPCLeadApprove(false);
      setFadeOut(false);
    }, 300);
    navigate("/pc-lead/approve-pc-lead");
  };

  // handle alert reject
  const showConfirmRejectPCLead = (onConfirm) => {
    setOnConfirmRejectPCLead(() => onConfirm);
    setAlertConfirmRejectPCLead(true);
    setFadeOutConfirmPCLead(false);
  };

  const handleConfirmPCLead = () => {
    setFadeOutConfirmPCLead(true);
    setTimeout(() => {
      setAlertConfirmRejectPCLead(false);
      setAlertPCLeadRejectSuccess(true);
      setFadeOutSuccessPCLead(false);
      onConfirmRejectPCLead();
    }, 300); // Sesuai durasi animasi fade-out
  };

  const handleCancelPCLead = () => {
    setFadeOutConfirmPCLead(true);
    setTimeout(() => {
      setAlertConfirmRejectPCLead(false);
    }, 300);
  };

  const handleCloseSuccessPCLead = () => {
    setFadeOutSuccessPCLead(true);
    setTimeout(() => {
      setAlertPCLeadRejectSuccess(false);
      setFadeOutSuccessPCLead(false);
    }, 300);
    navigate("/pc-lead/approve-pc-lead");
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <SidePCLead />

      {/* Main Content */}
      <div className="main-content">
        <BarUp departmentPC="PRODUCTION CONTROL DEPARTMENT" />
        <div className="page-container ">
          <Outlet
            context={{
              handleShowAlertPCLeadApprove,
              showConfirmRejectPCLead,
            }}
          />
        </div>
      </div>

      {/* Alert Approve Request */}
      {alertPCLeadApprove && (
        <div className="overlay-pclead-approve">
          <div
            className={`alert-box-pclead-approve ${
              fadeOut ? "fade-out" : "fade-in"
            }`}
          >
            <div className="alert-icon-pclead-approve">
              <div className="icon-circle-pclead-approve">
                <img src={successIcon} alt="" />
              </div>
            </div>
            <div className="alert-content-pclead-approve">
              <h3>Request Kanban Successfully Approved.</h3>
              <p>
                Request kanban successfully approved. Please check your
                department email
              </p>
              <p>You can see the request approval in the approval details.</p>
            </div>
            <div className="alert-buttons-pclead-approve">
              <button
                className="btn-pclead-approve cancel-pclead-approve"
                onClick={handleCloseAlertPCLeadApprove}
              >
                Cancel
              </button>
              <button
                className="btn-pclead-approve confirm-pclead-approve"
                onClick={handleCloseAlertPCLeadApprove}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Reject Request */}
      {alertConfirmRejectPCLead && (
        <div className="overlay-pclead-confirmreject">
          <div
            className={`alert-box-pclead-confirmreject ${
              fadeOutConfirmPCLead ? "fade-out" : "fade-in"
            }`}
          >
            <div className="alert-icon-pclead-confirmreject">
              <div className="icon-circle-pclead-confirmreject">
                <img src={confirmIcon} alt="" />
              </div>
            </div>
            <div className="alert-content-pclead-confirmreject">
              <h3>Reject Request Kanban</h3>
              <p>
                Are you sure you want to reject request kanban This action
                cannot be undone.
              </p>
            </div>
            <div className="alert-buttons-pclead-confirmreject">
              <button
                className="btn-pclead-confirmreject cancel-pclead-confirmreject"
                onClick={handleCancelPCLead}
              >
                Cancel
              </button>
              <button
                className="btn-pclead-confirmreject confirm-pclead-confirmreject"
                onClick={handleConfirmPCLead}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {alertPCLeadRejectSuccess && (
        <div className="overlay-pclead-successreject">
          <div
            className={`alert-box-pclead-successreject ${
              fadeOutSuccessPCLead ? "fade-out" : "fade-in"
            }`}
          >
            <div className="alert-icon-pclead-successreject">
              <div className="icon-circle-pclead-successreject">
                <img src={successIcon} alt="" />
              </div>
            </div>
            <div className="alert-content-pclead-successreject">
              <h3>Request Kanban Successfully Rejected.</h3>
              <p>
                Request kanban successfully Rejected. Please check your
                department email
              </p>
              <p>You can see the request approval in the approval details.</p>
            </div>
            <div className="alert-buttons-pclead-successreject">
              <button
                className="btn-pclead-successreject cancel-pclead-successreject"
                onClick={handleCloseSuccessPCLead}
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
