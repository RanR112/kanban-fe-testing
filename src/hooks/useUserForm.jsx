import { useState } from "react";
import { ID_DEPARTMENT_MAP } from "../utils/constants";

export const useUserForm = (initialData = {}) => {
    const [formData, setFormData] = useState({
        name: "",
        no_hp: "",
        id_department: "",
        role: "",
        email: "",
        password: "",
        confirmPassword: "",
        ...initialData,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = (type) => {
        if (type === "password") {
            setShowPassword((prev) => !prev);
        } else {
            setShowConfirmPassword((prev) => !prev);
        }
    };

    const validateForm = (isEdit = false) => {
        // Basic validation
        if (!formData.name?.trim()) {
            alert("Full name is required!");
            return false;
        }

        if (!formData.email?.trim()) {
            alert("Email is required!");
            return false;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert("Please enter a valid email address!");
            return false;
        }

        if (!formData.id_department) {
            alert("Department is required!");
            return false;
        }

        if (!formData.role) {
            alert("Role is required!");
            return false;
        }

        // Password validation
        if (!isEdit && !formData.password) {
            alert("Password is required!");
            return false;
        }

        if (formData.password && formData.password.length < 8) {
            alert("Password must be at least 8 characters long!");
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Password and confirmation password do not match!");
            return false;
        }

        // Department validation
        const departmentId = ID_DEPARTMENT_MAP[formData.id_department];
        if (formData.id_department && !departmentId) {
            alert("Invalid department selected!");
            return false;
        }

        return true;
    };

    const prepareDataForSubmit = (isEdit = false) => {
        const departmentId = ID_DEPARTMENT_MAP[formData.id_department];

        if (isEdit) {
            // For edit, only include fields that have values
            const filteredData = {};

            if (formData.name?.trim()) filteredData.name = formData.name.trim();
            if (formData.email?.trim())
                filteredData.email = formData.email.trim();
            if (formData.no_hp?.trim())
                filteredData.no_hp = formData.no_hp.trim();
            if (formData.id_department)
                filteredData.id_department = departmentId;
            if (formData.role) filteredData.role = formData.role;
            if (formData.password?.trim())
                filteredData.password = formData.password.trim();

            return filteredData;
        }

        // For create, include all required fields
        return {
            name: formData.name.trim(),
            email: formData.email.trim(),
            no_hp: formData.no_hp?.trim() || "",
            id_department: departmentId,
            role: formData.role,
            password: formData.password,
        };
    };

    const resetForm = () => {
        setFormData({
            name: "",
            no_hp: "",
            id_department: "",
            role: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    return {
        formData,
        setFormData,
        showPassword,
        showConfirmPassword,
        loading,
        setLoading,
        handleChange,
        togglePasswordVisibility,
        validateForm,
        prepareDataForSubmit,
        resetForm,
    };
};
