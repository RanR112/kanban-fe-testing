import React, { useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { UserForm } from "../../components/UserForm";
import { useUserForm } from "../../hooks/useUserForm";
import API from "../../service/api";

export default function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const context = useOutletContext();
    
    // Ambil showConfirmUpdate dari context jika tersedia
    const { showConfirmUpdate } = context || {};

    const {
        formData,
        showPassword,
        showConfirmPassword,
        loading,
        setLoading,
        setFormData,
        handleChange,
        togglePasswordVisibility,
        validateForm,
        prepareDataForSubmit,
    } = useUserForm();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userStorage = JSON.parse(localStorage.getItem("user"));
                const userId = userStorage.id_users;
                const response = await API.get(`/user/me/${userId}`);
                const userData = response.data.data;

                setFormData((prev) => ({
                    ...prev,
                    name: userData.name,
                    no_hp: userData.no_hp,
                    id_department: userData.department.name,
                    role: userData.role,
                    email: userData.email,
                }));
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, [id, setFormData]);

    const handleUpdate = async () => {
        if (!validateForm(true)) return;

        const filteredData = prepareDataForSubmit(true);

        try {
            setLoading(true);
            const userStorage = JSON.parse(localStorage.getItem("user"));
            const userId = userStorage.id_users;
            await API.put(`/user/me/${userId}`, filteredData);
            
            // Redirect berdasarkan role atau gunakan fallback
            const userRole = userStorage.role;
            if (userRole === 'admin') {
                navigate("/admin/users");
            } else if (userRole === 'user-lead') {
                navigate("/user-lead/approve-user-lead");
            } else if (userRole === 'pc-lead') {
                navigate("/pc-lead/approve-pc-lead");
            } else {
                navigate("/user/request-kanban");
            }
            
        } catch (err) {
            setLoading(false);
            alert("Gagal memperbarui profil!");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Cek apakah showConfirmUpdate tersedia dan valid
        if (showConfirmUpdate && typeof showConfirmUpdate === 'function') {
            // Gunakan alert konfirmasi dari layout
            showConfirmUpdate(handleUpdate);
        } else {
            // Fallback: gunakan browser confirm
            if (window.confirm("Apakah Anda yakin ingin mengupdate profil ini?")) {
                handleUpdate();
            }
        }
    };

    return (
        <UserForm
            title="PROFILE"
            formData={formData}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onBack={null}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onTogglePassword={togglePasswordVisibility}
            submitButtonText="Update"
            isEdit={true}
            loading={loading}
        />
    );
}