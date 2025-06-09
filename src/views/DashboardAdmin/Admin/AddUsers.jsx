import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "../../../sass/Admin/Admin/AddUsers/AddUsers.css";
import Builder from "../../../assets/images/builder1.svg";
import { Eye, EyeOff } from "lucide-react";
import API from "../../../service/api";
import { ID_DEPARTMENT_MAP } from "../../../global/constants";

export default function AddUsers() {
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
  const { handleShowAlertAdd } = useOutletContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok!");
      return;
    }

    const isFormValid = Object.values(formData).every(
      (value) => value.trim() !== ""
    );

    if (!isFormValid) {
      alert("Mohon lengkapi semua kolom sebelum menyimpan.");
      return;
    }

    handleShowAlertAdd(true);

    const departmentId = ID_DEPARTMENT_MAP[formData.id_department];
    if (!departmentId) {
      alert("Departemen tidak valid!");
      return;
    }

    const dataToSend = {
      ...formData,
      id_department: departmentId,
    };

    try {
      const response = await API.post("/user", dataToSend);
      navigate("/admin/users");
    } catch (error) {
      alert("Gagal menambahkan user!");
      console.error(error);
    }
  };

  return (
    <div className="add-users-admin">
      <h2>
        <strong>ADD USERS</strong>
      </h2>
      <form className="form-container-add-admin" onSubmit={handleSubmit}>
        <div className="left-section-add-admin">
          <img
            src={Builder}
            alt="User Default"
            className="user-image-add-admin"
          />
        </div>

        <div className="right-section-add-admin">
          <div className="form-group-add-admin">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group-add-admin">
            <label>Phone Number</label>
            <input
              type="text"
              name="no_hp"
              value={formData.no_hp}
              onChange={handleChange}
            />
          </div>

          <div className="form-group-add-admin">
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

          <div className="form-group-add-admin">
            <label>Password</label>
            <div className="input-with-icon-add-admin">
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

          <div className="form-group-add-admin">
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

          <div className="form-group-add-admin">
            <label>Confirm Password</label>
            <div className="input-with-icon-add-admin">
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

          <div className="form-group-add-admin">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="button-group-add-admin">
            <button
              type="button"
              className="back-btn-add-admin"
              onClick={() => navigate("/admin/users")}
            >
              Back
            </button>
            <button type="submit" className="save-btn-add-admin">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
