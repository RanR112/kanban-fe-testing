import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UserForm } from "../../components/UserForm";
import { useUserForm } from "../../hooks/useUserForm";
import API from "../../services/api";
import { DEPARTMENT_MAP } from "../../utils/constants";

export default function EditUsers() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showConfirmUpdate } = useOutletContext();
    const [initialLoading, setInitialLoading] = useState(true);

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

    // Check if user is admin
    useEffect(() => {
        if (user && user.role !== "ADMIN") {
            navigate("/unauthorized");
            return;
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchUser = async () => {
            if (!id || user?.role !== "ADMIN") return;

            try {
                setInitialLoading(true);
                const response = await API.get(`/user/${id}`);
                const userData = response.data.data;

                // Find department key from ID
                const departmentKey =
                    Object.keys(DEPARTMENT_MAP).find(
                        (key) =>
                            userData.department?.name?.includes(key) ||
                            userData.department?.name === DEPARTMENT_MAP[key]
                    ) || "";

                setFormData((prev) => ({
                    ...prev,
                    name: userData.name || "",
                    no_hp: userData.no_hp || "",
                    id_department: departmentKey,
                    role: userData.role || "",
                    email: userData.email || "",
                    password: "", // Always empty for security
                    confirmPassword: "", // Always empty for security
                }));
            } catch (error) {
                console.error("Error fetching user:", error);
                navigate("/admin/users");
            } finally {
                setInitialLoading(false);
            }
        };

        fetchUser();
    }, [id, setFormData, navigate, user]);

    const handleUpdate = async () => {
        if (!validateForm(true)) return;

        try {
            setLoading(true);
            const filteredData = prepareDataForSubmit(true);

            // Remove confirmPassword before sending
            const { confirmPassword, ...submitData } = filteredData;

            // Only send password if it's provided
            if (!submitData.password || submitData.password.trim() === "") {
                delete submitData.password;
            }

            const response = await API.put(`/user/${id}`, submitData);

            if (response.data.success) {
                navigate("/admin/users");
            } else {
                throw new Error(
                    response.data.message || "Failed to update user"
                );
            }
        } catch (error) {
            console.error("Error updating user:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Failed to update user!";
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        showConfirmUpdate(() => handleUpdate());
    };

    if (user?.role !== "ADMIN") {
        return null;
    }

    if (initialLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading user data...</p>
            </div>
        );
    }

    return (
        <UserForm
            title="EDIT USER"
            formData={formData}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onBack={() => navigate("/admin/users")}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onTogglePassword={togglePasswordVisibility}
            submitButtonText="Update User"
            isEdit={true}
            loading={loading}
        />
    );
}
