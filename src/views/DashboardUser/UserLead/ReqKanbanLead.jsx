import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "../../../sass/User/UserLead/ReqKanbanLead/ReqKanbanLead.css";
import Check from "../../../assets/icons/check.svg";
import Detail from "../../../assets/icons/list.svg";
import Search from "../../../assets/icons/search.svg";
import Cross from "../../../assets/icons/xmark-white.svg";
import API from "../../../service/api";

export default function ReqKanbanLead() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { handleShowAlertUserLeadApprove } = useOutletContext();
  const { showConfirmReject } = useOutletContext();
  const itemsPerPage = 10;
  const typingTimeout = useRef(null);
  const navigate = useNavigate();

  const loadData = async (page, keyword = "") => {
    try {
      setLoading(true);
      const res = await API.get("/kanban/pending", {
        params: {
          page,
          limit: itemsPerPage,
          search: keyword,
        },
      });
      const kanbanData = res.data.data.map((item) => ({
        id_kanban: item.id_kanban,
        productionDate: new Date(
          item.requestKanban.tgl_produksi
        ).toLocaleDateString("id-ID"),
        partNumber: item.requestKanban.parts_number,
        process: item.requestKanban.klasifikasi,
        requestingName: item.requestKanban.nama_requester,
        status: item.requestKanban.status,
      }));
      setData(kanbanData);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentPage, search);
  }, [currentPage]);

  const handleView = (id_kanban) => {
    localStorage.setItem("id_kanban", id_kanban);
    navigate(`/user-lead/detailreq-user-lead`);
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearch(keyword);
    setCurrentPage(1); // Reset ke halaman pertama saat cari

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      loadData(1, keyword);
    }, 500); // debounce 0.5 detik
  };

  const handleApprove = async (id_kanban) => {
    try {
      await API.post("/kanban/approve", { id_kanban });
      handleShowAlertUserLeadApprove(true);
    } catch (err) {
      alert("Gagal approve", err);
    }
  };

  const handleReject = async (id_kanban) => {
    try {
      await API.post("/kanban/reject", { id_kanban });
      showConfirmReject(true);
    } catch (err) {
      alert("Gagal reject", err);
    }
  };

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  return (
    <div className="req-kanban-userlead">
      <div className="header-userlead">
        <h2>
          <strong>REQUEST KANBAN</strong>
        </h2>
      </div>

      <div className="search-box-userlead">
        <img src={Search} alt="" className="img-search-userlead" />
        <input
          type="text"
          placeholder="Search by Parts Number or Requester Name"
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="table-container-userlead">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Production Date</th>
              <th>Parts Number</th>
              <th>Classification</th>
              <th>Requester Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="empty-row-userlead">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-row-userlead">
                  No data available.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{item.productionDate}</td>
                  <td>{item.partNumber}</td>
                  <td>{item.process}</td>
                  <td>{item.requestingName}</td>
                  <td>
                    <span
                      className={`status-userlead ${item.status.toLowerCase()}`}
                    >
                      {item.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="actions-userlead">
                    <button
                      className="view-btn-userlead"
                      onClick={() => handleView(item.id_kanban)}
                      title="View Detail Request"
                    >
                      <img
                        src={Detail}
                        alt=""
                        className="img-action-reqkanban-userlead"
                      />
                    </button>
                    <button
                      className="approve-btn-userlead"
                      onClick={() => handleApprove(item.id_kanban)}
                      title="Approve Request"
                    >
                      <img
                        src={Check}
                        alt="Approve"
                        className="img-action-userlead"
                      />
                    </button>
                    <button
                      className="reject-btn-userlead"
                      onClick={() => handleReject(item.id_kanban)}
                      title="Reject Request"
                    >
                      <img src={Cross} alt="" className="img-action-userlead" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-userlead">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="previous"
        >
          ← Previous
        </button>
        {[...Array(totalPages)].map((_, idx) => {
          const page = idx + 1;
          return (
            <button
              key={page}
              className={page === currentPage ? "active" : ""}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          );
        })}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="next"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
