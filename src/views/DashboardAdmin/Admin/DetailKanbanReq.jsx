import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../sass/Admin/Admin/DetailKanbanReq/DetailKanbanReq.css";
import checkIcon from "../../../assets/icons/check-approve.svg";
import crossIcon from "../../../assets/icons/cross-reject.svg";
import API from "../../../service/api";
import { DEPARTMENT_MAP } from "../../../global/constants";

export default function DetailKanbanReq() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kanban, setKanban] = useState({
    tgl_produksi: "",
    parts_number: "",
    nama_requester: "",
    klasifikasi: "",
    box: "",
    lokasi: "",
    keterangan: "",
    process: "",
    status: "",
    persetujuan: [],
  });

  const [process, setProcess] = useState("");

  const fetchProcess = async () => {
    try {
      const userStorage = JSON.parse(localStorage.getItem("user"));
      const userId = userStorage.id_users;
      await API.get(`user/me/${userId}`).then((res) =>
        setProcess(`${DEPARTMENT_MAP[res.data.data?.department?.name]}`)
      );
    } catch (error) {
      error;
    }
  };

  useEffect(() => {
    fetchProcess();
    const fetchKanban = async () => {
      try {
        const kanbanId = localStorage.getItem("id_kanban");
        await API.get(`/kanban/get/${kanbanId}`).then(
          (res) =>
            setKanban({
              tgl_produksi: res.data.data.tgl_produksi.split("T")[0],
              parts_number: res.data.data.parts_number,
              nama_requester: res.data.data.nama_requester,
              klasifikasi: res.data.data.klasifikasi,
              box: res.data.data.box,
              lokasi: res.data.data.lokasi,
              keterangan: res.data.data.keterangan,
              persetujuan: res.data.data.persetujuan,
              status: res.data.data.status,
            })
          // console.log(res.data)
        );
      } catch (error) {
        error;
      }
    };
    fetchKanban();
  }, [id]);

  if (!kanban) return <p>Loading...</p>;

  const filteredPersetujuan = Object.values(
    kanban.persetujuan.reduce((acc, item) => {
      const deptName = item.department?.name;
      const role = item.role;

      if (!deptName || !role) return acc;

      const key = `${deptName}-${role}`;

      // Jika sudah ada role yang disetujui atau ditolak, skip yang lainnya
      if (acc[key]) return acc;

      const isRejected = item.note?.toLowerCase().includes("reject");
      const isApproved = item.approve === true;

      if (isApproved || isRejected) {
        acc[key] = {
          department: item.department,
          role: item.role,
          approved: item.approve,
          approvedAt: item.approvedAt,
          note: item.note,
        };
      }

      return acc;
    }, {})
  ).reduce((acc, item) => {
    const deptName = item.department.name;
    if (!acc[deptName]) {
      acc[deptName] = {
        department: item.department,
        roles: [],
      };
    }

    acc[deptName].roles.push({
      role: item.role,
      approved: item.approved,
      approvedAt: item.approvedAt,
      note: item.note,
    });

    return acc;
  }, {});

  return (
    <div className="container-detail-admin">
      <h2 className="head-detail-admin">DETAILS REQUEST KANBAN</h2>
      <div className="grid-detail-admin">
        <div className="production-date-detail-admin">
          <label>Production Date</label>
          <input type="date" value={kanban.tgl_produksi} readOnly />
        </div>
        <div className="parts-number-detail-admin">
          <label>Part Number</label>
          <input type="text" value={kanban.parts_number} readOnly />
        </div>
        <div className="request-name-detail-admin">
          <label>Requesting Name</label>
          <input type="text" value={kanban.nama_requester} readOnly />
        </div>
        <div className="classification-detail-admin">
          <label>Classification</label>
          <select value={kanban.klasifikasi} disabled>
            <option>{kanban.klasifikasi}</option>
          </select>
        </div>
        <div className="box-detail-admin">
          <label>Box</label>
          <input type="text" value={kanban.box} readOnly />
        </div>
        <div className="process-detail-admin">
          <label>Process</label>
          <input type="text" value={process} readOnly />
        </div>
        <div className="location-detail-admin">
          <label>Location</label>
          <input type="text" value={kanban.lokasi} readOnly />
        </div>
        <div className="information-detail-admin">
          <label>Information</label>
          <textarea value={kanban.keterangan} readOnly />
        </div>
      </div>

      <div className="statusContainer-detail-admin">
        {Object.values(filteredPersetujuan).map((dept, index) => (
          <div key={index} className="card-detail-admin">
            <div className="cardHeader-detail-admin">
              <span>{`${
                DEPARTMENT_MAP[dept.department.name]
              } Department`}</span>
            </div>

            <div className="row-detail-admin header-detail-admin">
              <span>Approved By</span>
              <span>Date</span>
              <span>Time</span>
            </div>

            {dept.roles.map((role, idx) => (
              <div key={idx} className="row-detail-admin">
                <span
                  className={`role-detail-admin ${
                    role.approved ? "approved" : "rejected"
                  }`}
                >
                  <img
                    src={role.approved ? checkIcon : crossIcon}
                    alt=""
                    className="approval-icon-detail-admin"
                  />
                  {role.role}
                </span>
                <span>
                  {role.approvedAt
                    ? new Date(role.approvedAt).toLocaleDateString()
                    : "-"}
                </span>
                <span>
                  {role.approvedAt
                    ? new Date(role.approvedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </span>
              </div>
            ))}

            {/* Jika ada auto reject */}
            {dept.roles.some((r) => r.approved === false && !r.note) && (
              <div className="row note-row">
                <span className="note-text" colSpan={3}>
                  Auto-rejected: Role tidak memberikan keputusan
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="button-back-detail-admin">
        <button
          onClick={() => navigate(-1)}
          className="backButton-detail-admin"
        >
          Back
        </button>
      </div>
    </div>
  );
}
