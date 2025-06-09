import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import "../../../sass/Admin/Admin/EditUsers/EditUsers.css";
import Builder from "../../../assets/images/builder1.svg";
import { Eye, EyeOff } from "lucide-react";
import API from "../../../service/api";
import { ID_DEPARTMENT_MAP } from "../../../global/constants";

export default function EditUsers() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    no_hp: "",
    id_department: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showConfirmUpdate } = useOutletContext();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("id_users");
        await API.get(`/user/${userId}`).then(
          (res) =>
            setFormData((prevFormData) => ({
              ...prevFormData,
              name: res.data.data.name,
              no_hp: res.data.data.no_hp,
              id_department: res.data.data.department.name,
              role: res.data.data.role,
              email: res.data.data.email,
            }))
          // console.log(res.data)
        );
      } catch (error) {
        error;
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok!");
      return;
    }

    const departmentId = ID_DEPARTMENT_MAP[formData.id_department];
    if (formData.id_department && !departmentId) {
      alert("Departemen tidak valid!");
      return;
    }

    const filteredData = Object.entries(formData).reduce(
      (acc, [key, value]) => {
        if (value.trim() !== "" && key !== "confirmPassword") {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    if (filteredData.id_department) {
      filteredData.id_department = departmentId;
    }

    try {
      const userId = localStorage.getItem("id_users");
      await API.put(`/user/${userId}`, filteredData);
      navigate("/admin/users");
    } catch (error) {
      alert("Gagal memperbarui user!");
    }
  };

  const handleClickUpdate = () => {
    showConfirmUpdate(() => handleUpdate());
  };

  return (
    <div className="edit-users-admin">
      <h2>
        <strong>EDIT USERS</strong>
      </h2>
      <form
        className="form-container-edit-admin"
        onSubmit={(e) => {
          e.preventDefault(); // Mencegah reload
          // Default submit action jika diperlukan (bisa kosong atau alert)
        }}
      >
        <div className="left-section-edit-admin">
          <img
            src={Builder}
            alt="User Default"
            className="user-image-edit-admin"
          />
        </div>

        <div className="right-section-edit-admin">
          <div className="form-group-edit-admin">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group-edit-admin">
            <label>Phone Number</label>
            <input
              type="text"
              name="no_hp"
              value={formData.no_hp}
              onChange={handleChange}
            />
          </div>

          <div className="form-group-edit-admin">
            <label>Department</label>
            <select
              name="id_department"
              value={formData.id_department}
              onChange={handleChange}
            >
              <option value="">-- Select Department --</option>
              <option value="PC">PC</option>
              <option value="QC">QC</option>
              <option value="HD">HD</option>
              <option value="RL">RL</option>
              <option value="OQ">OQ</option>
              <option value="BZ">BZ</option>
            </select>
          </div>

          <div className="form-group-edit-admin">
            <label>Change Password</label>
            <div className="input-with-icon-edit-admin">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          <div className="form-group-edit-admin">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="">-- Select Role --</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="LEADER">Leader</option>
              <option value="SUPERVISOR">Supervisor</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>

          <div className="form-group-edit-admin">
            <label>Confirm Password</label>
            <div className="input-with-icon-edit-admin">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          <div className="form-group-edit-admin">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="button-group-edit-admin">
            <button
              type="button"
              className="back-btn-edit-admin"
              onClick={() => navigate("/admin/users")}
            >
              Back
            </button>
            <button
              className="update-btn-edit-admin"
              onClick={(e) => {
                e.preventDefault();
                handleClickUpdate();
              }}
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
