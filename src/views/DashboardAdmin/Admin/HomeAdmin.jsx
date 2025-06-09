import React, { useEffect, useState } from "react";
import "../../../sass/Admin/Admin/HomeAdmin/HomeAdmin.css";
import API from "../../../service/api";
import { DEPARTMENT_MAP } from "../../../global/constants";

export default function HomeAdmin() {
  const [user, setUser] = useState({
    name: "",
    role: "",
    department: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userStorage = JSON.parse(localStorage.getItem("user"));
        const userId = userStorage.id_users;
        await API.get(`user/me/${userId}`).then((res) =>
          setUser({
            name: res.data.data.name || "User",
            role: res.data.data.role || "User",
            department: `${
              DEPARTMENT_MAP[res.data.data.department.name] ||
              res.data.data.department.name ||
              ""
            } Department`,
          })
        );
      } catch (err) {
        setError("Gagal mengambil data user. Silakan login ulang.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div className="welcome-container-user">Loading...</div>;

  if (error)
    return (
      <div className="welcome-container-user">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );

  return (
    <div className="home-wrapper-admin">
      <div className="home-container-admin">
        <h1 className="company-name-admin">
          PT AUTOMOTIVE FASTENERS AOYAMA INDONESIA
        </h1>
        <h2 className="welcome-text-admin">
          WELCOME BACK{" "}
          <span className="highlight-name-admin">
            {user.name.toUpperCase()}
          </span>
          ,{" "}
          <span className="highlight-role-admin">
            {user.role.toUpperCase()}
          </span>{" "}
          OF{" "}
        </h2>
        <h2 className="welcome-text-admin">
          <span className="highlight-dept-admin">
            {user.department.toUpperCase()}
          </span>
        </h2>
        <h3 className="request-text-admin">TO REQUEST KANBAN</h3>
      </div>
    </div>
  );
}
