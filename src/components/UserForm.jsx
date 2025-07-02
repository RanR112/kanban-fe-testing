import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Builder from "../assets/images/builder1.svg";
import { DEPARTMENTS, ROLES } from "../utils/constants";
import "../sass/Users/UserForm/UserForm.css";
import { LoaderButton } from "./LoaderButton";

const FormField = ({ label, children, required = false }) => (
    <div className="form-group-user-form-admin">
        <label>
            {label}
            {required && <span className="required-asterisk">*</span>}
        </label>
        {children}
    </div>
);

const PasswordField = ({
    name,
    value,
    onChange,
    showPassword,
    onToggleVisibility,
    required = false,
    placeholder = "",
}) => (
    <div className="input-with-icon-user-form-admin">
        <input
            type={showPassword ? "text" : "password"}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
        />
        <span onClick={onToggleVisibility}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
    </div>
);

const SelectField = ({
    name,
    value,
    onChange,
    options,
    required = false,
    disabled = false,
}) => (
    <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={disabled ? "disabled-select" : ""}
    >
        {options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
);

export const UserForm = ({
    title,
    formData,
    onSubmit,
    onChange,
    onBack,
    showPassword,
    showConfirmPassword,
    onTogglePassword,
    submitButtonText = "Save",
    isEdit = false,
    loading = false,
    isProfile = false, // ✅ New prop
}) => {
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name?.trim()) {
            newErrors.name = "Full name is required";
        }

        // For profile, email is read-only
        if (!isProfile && !formData.email?.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !isProfile &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = "Invalid email format";
        }

        // For profile, department and role are read-only
        if (!isProfile && !formData.id_department) {
            newErrors.id_department = "Department is required";
        }

        if (!isProfile && !formData.role) {
            newErrors.role = "Role is required";
        }

        if (!isEdit && !formData.password) {
            newErrors.password = "Password is required";
        }

        if (
            formData.password &&
            formData.password !== formData.confirmPassword
        ) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (formData.password && formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(e);
        }
    };

    return (
        <div className="user-form-admin">
            <h2>
                <strong>{title}</strong>
            </h2>
            <form
                className="form-container-user-form-admin"
                onSubmit={handleSubmit}
            >
                <div className="left-section-user-form-admin">
                    <img
                        src={Builder}
                        alt="User Default"
                        className="user-image-user-form-admin"
                    />
                </div>

                <div className="right-section-user-form-admin">
                    <FormField label="Full Name" required>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={onChange}
                            required
                            className={errors.name ? "error" : ""}
                        />
                        {errors.name && (
                            <span className="error-text">{errors.name}</span>
                        )}
                    </FormField>

                    <FormField label="Email" required={!isProfile}>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            required={!isProfile}
                            disabled={isProfile} // ✅ Disable for profile
                            className={`${errors.email ? "error" : ""} ${
                                isProfile ? "disabled-input" : ""
                            }`}
                        />
                        {errors.email && (
                            <span className="error-text">{errors.email}</span>
                        )}

                    </FormField>

                    <FormField label="Phone Number">
                        <input
                            type="text"
                            name="no_hp"
                            value={formData.no_hp}
                            onChange={onChange}
                            placeholder="e.g., +62812345678"
                        />
                    </FormField>

                    <FormField label="Department" required={!isProfile}>
                        <SelectField
                            name="id_department"
                            value={formData.id_department}
                            onChange={onChange}
                            options={DEPARTMENTS}
                            required={!isProfile}
                            disabled={isProfile || loading} // ✅ Disable for profile
                        />
                        {errors.id_department && (
                            <span className="error-text">
                                {errors.id_department}
                            </span>
                        )}
                    </FormField>

                    <FormField label="Role" required={!isProfile}>
                        <SelectField
                            name="role"
                            value={formData.role}
                            onChange={onChange}
                            options={ROLES}
                            required={!isProfile}
                            disabled={isProfile || loading} // ✅ Disable for profile
                        />
                        {errors.role && (
                            <span className="error-text">{errors.role}</span>
                        )}

                    </FormField>

                    <FormField
                        label={
                            isEdit
                                ? "New Password"
                                : "Password"
                        }
                        required={!isEdit}
                    >
                        <PasswordField
                            name="password"
                            value={formData.password}
                            onChange={onChange}
                            showPassword={showPassword}
                            onToggleVisibility={() =>
                                onTogglePassword("password")
                            }
                            required={!isEdit}
                            placeholder={
                                isEdit ? "Enter new password" : "Password"
                            }
                        />
                        {errors.password && (
                            <span className="error-text">
                                {errors.password}
                            </span>
                        )}
                    </FormField>

                    <FormField
                        label="Confirm Password"
                        required={!isEdit || !!formData.password}
                    >
                        <PasswordField
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={onChange}
                            showPassword={showConfirmPassword}
                            onToggleVisibility={() =>
                                onTogglePassword("confirmPassword")
                            }
                            required={!isEdit || !!formData.password}
                            placeholder="Confirm password"
                        />
                        {errors.confirmPassword && (
                            <span className="error-text">
                                {errors.confirmPassword}
                            </span>
                        )}
                    </FormField>

                    <div className="button-group-user-form-admin">
                        {onBack && (
                            <button
                                type="button"
                                className="back-btn-user-form-admin"
                                onClick={onBack}
                                disabled={loading}
                            >
                                Back
                            </button>
                        )}
                        <button
                            type="submit"
                            className={`${submitButtonText
                                .toLowerCase()
                                .replace(/\s+/g, "-")}-btn-user-form-admin`}
                            disabled={loading}
                        >
                            {loading ? <LoaderButton /> : submitButtonText}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
