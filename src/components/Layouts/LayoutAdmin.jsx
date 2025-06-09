import React, { useState } from "react";
import BarUp from "../BarUp";
import { Outlet, useNavigate } from "react-router-dom";
import "../../sass/components/Layouts/Layout.css";
import "../../sass/components/Alert/AlertAdmin/AlertAddUsers/AlertSuccessAdd.css";
import "../../sass/components/Alert/AlertAdmin/AlertEditUsers/AlertEditUsers.css";
import "../../sass/components/Alert/AlertAdmin/AlertDeleteUsers/AlertDeleteUsers.css";
import SideAdmin from "../SideAdmin/SideAdmin";
import successIcon from "../../assets/icons/success-icon.svg";
import changeIcon from "../../assets/icons/change-icon.svg";
import confirmIcon from "../../assets/icons/confirm-icon.svg";

export default function LayoutAdmin() {
  const [alertVisibleAdd, setAlertVisibleAdd] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [alertConfirmUpdate, setAlertConfirmUpdate] = useState(false);
  const [alertUpdateSuccess, setAlertUpdateSuccess] = useState(false);
  const [onConfirmUpdate, setOnConfirmUpdate] = useState(() => () => {});
  const [fadeOutConfirmUpdate, setFadeOutConfirmUpdate] = useState(false);
  const [fadeOutSuccessUpdate, setFadeOutSuccessUpdate] = useState(false);
  const [alertConfirmDelete, setAlertConfirmDelete] = useState(false);
  const [alertDeleteSuccess, setAlertDeleteSuccess] = useState(false);
  const [onConfirmDelete, setOnConfirmDelete] = useState(() => () => {});
  const [fadeOutConfirmDelete, setFadeOutConfirmDelete] = useState(false);
  const [fadeOutSuccessDelete, setFadeOutSuccessDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  // Handle Alert Add User
  const handleShowAlertAdd = () => {
    setFadeOut(false);
    setAlertVisibleAdd(true);
  };

  const handleCloseAlertAdd = () => {
    setFadeOut(true);
    setTimeout(() => {
      setAlertVisibleAdd(false);
      setFadeOut(false);
    }, 300);
    navigate("/admin/users");
  };

  // Handle Alert Update
  const showConfirmUpdate = (onConfirm) => {
    setOnConfirmUpdate(() => onConfirm);
    setAlertConfirmUpdate(true);
    setFadeOutConfirmUpdate(false);
  };

  const handleConfirmUpdate = () => {
    setFadeOutConfirmUpdate(true);
    setTimeout(() => {
      setAlertConfirmUpdate(false);
      setAlertUpdateSuccess(true);
      setFadeOutSuccessUpdate(false);
      onConfirmUpdate();
    }, 300); // Sesuai durasi animasi fade-out
  };

  const handleCancelUpdate = () => {
    setFadeOutConfirmUpdate(true);
    setTimeout(() => {
      setAlertConfirmUpdate(false);
    }, 300);
  };

  const handleCloseSuccessUpdate = () => {
    setFadeOutSuccessUpdate(true);
    setTimeout(() => {
      setAlertUpdateSuccess(false);
      setFadeOutSuccessUpdate(false);
    }, 300);
    navigate("/admin/users");
  };

  // Handle Alert Delete
  const showConfirmDelete = (user, onConfirm) => {
    setSelectedUser(user);
    setOnConfirmDelete(() => onConfirm);
    setAlertConfirmDelete(true);
    setFadeOutConfirmDelete(false);
  };

  const handleConfirmDelete = () => {
    setFadeOutConfirmDelete(true);
    setTimeout(() => {
      setAlertConfirmDelete(false);
      setAlertDeleteSuccess(true);
      setFadeOutSuccessDelete(false);
      onConfirmDelete();
    }, 300); // Sesuai durasi animasi fade-out
  };

  const handleCancelDelete = () => {
    setFadeOutConfirmDelete(true);
    setTimeout(() => {
      setAlertConfirmDelete(false);
    }, 300);
  };

  const handleCloseSuccessDelete = () => {
    setFadeOutSuccessDelete(true);
    setTimeout(() => {
      setAlertDeleteSuccess(false);
      setFadeOutSuccessDelete(false);
    }, 300);
    navigate("/admin/users");
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <SideAdmin />

      {/* Main Content */}
      <div className="main-content">
        <BarUp departmentPC="PRODUCTION CONTROL DEPARTMENT" />
        <div className="page-container">
          <Outlet
            context={{
              handleShowAlertAdd,
              showConfirmUpdate,
              showConfirmDelete,
            }}
          />
        </div>
      </div>

      {/* Alert Add User */}
      {alertVisibleAdd && (
        <div className="alert-popup-add">
          <div className={`alert-box-add ${fadeOut ? "hide" : "show"}`}>
            <div className="icon-success-add">
              <img src={successIcon} alt="success" />
            </div>
            <p>Successfully Added Users</p>
            <div className="alert-buttons-add">
              <button onClick={handleCloseAlertAdd} className="cancel-btn-add">
                Cancel
              </button>
              <button onClick={handleCloseAlertAdd} className="confirm-btn-add">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Confirm Update */}
      {alertConfirmUpdate && (
        <div className="overlay-confirm-update">
          <div
            className={`alert-box-confirm-update ${
              fadeOutConfirmUpdate ? "fade-out" : "fade-in"
            }`}
          >
            <div className="alert-icon-confirm-update">
              <div className="icon-circle-confirm-update">
                <img src={changeIcon} alt="" />
              </div>
            </div>
            <div className="alert-content-confirm-update">
              <h3>Unsaved Updates</h3>
              <p>Do you want to save or cancel updates?</p>
            </div>
            <div className="alert-buttons-confirm-update">
              <button
                className="btn-confirm-update cancel-confirm-update"
                onClick={handleCancelUpdate}
              >
                Cancel
              </button>
              <button
                className="btn-confirm-update confirm-confirm-update"
                onClick={handleConfirmUpdate}
              >
                Save updates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Success Update */}
      {alertUpdateSuccess && (
        <div className="overlay-success-update">
          <div
            className={`alert-box-success-update ${
              fadeOutSuccessUpdate ? "fade-out" : "fade-in"
            }`}
          >
            <div className="alert-icon-success-update">
              <div className="icon-circle-success-update">
                <img src={successIcon} alt="" />
              </div>
            </div>
            <div className="alert-content-success-update">
              <h3>Successfully Updates User</h3>
            </div>
            <div className="alert-buttons-success-update">
              <button
                className="btn-success-update cancel-success-update"
                onClick={handleCloseSuccessUpdate}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Confirm Delete */}
      {alertConfirmDelete && (
        <div className="overlay-confirm-delete">
          <div
            className={`alert-box-confirm-delete ${
              fadeOutConfirmDelete ? "fade-out" : "fade-in"
            }`}
          >
            <div className="alert-icon-confirm-delete">
              <div className="icon-circle-confirm-delete">
                <img src={confirmIcon} alt="" />
              </div>
            </div>
            <div className="alert-content-confirm-delete">
              <h3>Delete User?</h3>
              <p>
                Are you sure you want to delete user
                <span> {selectedUser?.name}</span>? <br />
                This action cannot be undone.
              </p>
            </div>
            <div className="alert-buttons-confirm-delete">
              <button
                className="btn-confirm-delete cancel-confirm-delete"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="btn-confirm-delete confirm-confirm-delete"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Success Delete */}
      {alertDeleteSuccess && (
        <div className="overlay-success-delete">
          <div
            className={`alert-box-success-delete ${
              fadeOutSuccessDelete ? "fade-out" : "fade-in"
            }`}
          >
            <div className="alert-icon-success-delete">
              <div className="icon-circle-success-delete">
                <img src={successIcon} alt="" />
              </div>
            </div>
            <div className="alert-content-success-delete">
              <h3>Successfully Delete User</h3>
            </div>
            <div className="alert-buttons-success-delete">
              <button
                className="btn-success-delete cancel-success-delete"
                onClick={handleCloseSuccessDelete}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
