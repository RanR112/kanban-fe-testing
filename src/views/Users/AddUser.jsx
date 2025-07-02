import React, { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UserForm } from "../../components/UserForm";
import { useUserForm } from "../../hooks/useUserForm";
import API from "../../services/api";

export default function AddUsers() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { handleShowAlertAdd } = useOutletContext();

    const {
        formData,
        showPassword,
        showConfirmPassword,
        loading,
        handleChange,
        togglePasswordVisibility,
        validateForm,
        prepareDataForSubmit,
        setLoading,
    } = useUserForm();

    // Check if user is admin
    useEffect(() => {
        if (user && user.role !== "ADMIN") {
            navigate("/unauthorized");
            return;
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);
            handleShowAlertAdd(true);

            const dataToSend = prepareDataForSubmit();

            // ✅ Filter out fields yang tidak boleh dikirim
            const {
                confirmPassword,
                id_users,
                created_at,
                updated_at,
                last_login,
                email_verified,
                ...submitData
            } = dataToSend;

            console.log("Final submit data:", submitData); // ✅ Debug

            const response = await API.post("/user", submitData);

            if (response.data.success) {
                navigate("/admin/users");
            } else {
                throw new Error(
                    response.data.message || "Failed to create user"
                );
            }
        } catch (error) {
            console.error("Error creating user:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Failed to create user!";
        } finally {
            setLoading(false);
        }
    };

    if (user?.role !== "ADMIN") {
        return null; // or loading spinner
    }

    return (
        <UserForm
            title="ADD USER"
            formData={formData}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onBack={() => navigate("/admin/users")}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onTogglePassword={togglePasswordVisibility}
            submitButtonText="Create User"
            loading={loading}
        />
    );
}
