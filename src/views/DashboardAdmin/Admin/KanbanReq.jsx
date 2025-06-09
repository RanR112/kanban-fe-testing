import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../sass/Admin/Admin/KanbanReq/KanbanReq.css";
import Detail from "../../../assets/icons/list.svg";
import Search from "../../../assets/icons/search.svg";
import API from "../../../service/api";
import { DEPARTMENT_MAP } from "../../../global/constants";

export default function KanbanReq() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const typingTimeout = useRef(null);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    loadData(currentPage, search);
  }, [currentPage]);

  const loadData = (page, keyword = "") => {
    API.get(`/kanban/all`, {
      params: {
        page,
        limit: itemsPerPage,
        search: keyword,
      },
    }).then((res) => {
      setData(res.data.requests);
      setTotalPages(res.data.pagination.totalPages);
    });
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

  const handleView = (id_kanban) => {
    localStorage.setItem("id_kanban", id_kanban);
    navigate(`/admin/detail-kanbanreq`);
  };

  return (
    <div className="req-kanban-admin">
      <div className="header-admin">
        <h2>
          <strong>KANBAN REQUEST</strong>
        </h2>
      </div>

      <div className="search-box-admin">
        <img src={Search} alt="" className="img-search-admin" />
        <input
          type="text"
          placeholder="Search by Parts Number or Requester Name"
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="table-container-admin">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Production Date</th>
              <th>Parts Number</th>
              <th>Process</th>
              <th>Requesting Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="empty-row-admin">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-row-admin">
                  No data available.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id_kanban}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>
                    {new Date(item.tgl_produksi).toLocaleDateString("en-CA")}
                  </td>
                  <td>{item.parts_number}</td>
                  <td>{DEPARTMENT_MAP[item.department?.name]}</td>
                  <td>{item.nama_requester}</td>
                  <td>
                    <span
                      className={`status-admin ${item.status.toLowerCase()}`}
                    >
                      {item.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="actions-admin">
                    <button
                      className="view-btn-admin"
                      onClick={() => handleView(item.id_kanban)}
                      title="View Detail Request"
                    >
                      <img src={Detail} alt="" className="img-action-admin" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-admin">
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
