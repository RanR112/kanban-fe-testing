import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UserForm } from "../../components/UserForm";
import { useUserForm } from "../../hooks/useUserForm";
import { timeAgo, formatDateTime } from "../../utils/timeAgo";
import { DEPARTMENT_MAP } from "../../utils/constants";
import API from "../../services/api";
import LoaderPrimary from "../../components/LoaderPrimary";

export default function Profile() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const context = useOutletContext();
    const [profileStats, setProfileStats] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);

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

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/login");
            return;
        }
    }, [user, authLoading, navigate]);

    // Fetch user profile data
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user?.id_users) return;

            try {
                setInitialLoading(true);

                // Fetch user profile data
                const response = await API.get(`/user/me/${user.id_users}`);
                const userData = response.data.data;

                // Find department key from name
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
                console.error("Error fetching user profile:", error);
                if (error.response?.status === 403) {
                    console.log(
                        "You don't have permission to view this profile"
                    );
                    navigate("/");
                } else {
                    console.log("Failed to load profile data");
                }
            } finally {
                setInitialLoading(false);
            }
        };

        fetchUserProfile();
    }, [user, setFormData, navigate]);

    const handleUpdate = async () => {
        if (!validateForm(true)) return;

        try {
            setLoading(true);
            const filteredData = prepareDataForSubmit(true);

            // Remove confirmPassword before sending
            const { confirmPassword, ...submitData } = filteredData;

            // Only send password if it's provided and not empty
            if (!submitData.password || submitData.password.trim() === "") {
                delete submitData.password;
            }

            const response = await API.put(
                `/user/me/${user.id_users}/profile`,
                submitData
            );

            if (response.data.success) {
                console.log("Profile updated successfully!");
            } else {
                throw new Error(
                    response.data.message || "Failed to update profile"
                );
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Failed to update profile!";
            console.log(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Cek apakah showConfirmUpdate tersedia dan valid
        if (showConfirmUpdate && typeof showConfirmUpdate === "function") {
            showConfirmUpdate(handleUpdate);
        } else {
            // Fallback: gunakan browser confirm
            if (
                window.confirm("Are you sure you want to update your profile?")
            ) {
                handleUpdate();
            }
        }
    };

    // Show loading while fetching initial data
    if (authLoading || initialLoading) {
        return (
            <div className="container-detail">
                <div className="loader">
                    <LoaderPrimary />
                </div>
            </div>
        );
    }

    // Redirect if no user
    if (!user) {
        return null;
    }

    return (
        <div className="profile-container">
            <UserForm
                title="MY PROFILE"
                formData={formData}
                onSubmit={handleSubmit}
                onChange={handleChange}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                onTogglePassword={togglePasswordVisibility}
                submitButtonText="Update"
                isEdit={true}
                loading={loading}
                isProfile={true}
            />
        </div>
    );
}
