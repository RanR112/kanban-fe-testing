import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Builder from "../assets/images/builder1.svg";
import { DEPARTMENTS, ROLES } from "../utils/constants";
import "../sass/Users/UserForm/UserForm.css";
import { LoaderButton } from "./LoaderButton";

const FormField = ({ label, children }) => (
    <div className="form-group-user-form-admin">
        <label>{label}</label>
        {children}
    </div>
);

const PasswordField = ({
    name,
    value,
    onChange,
    showPassword,
    onToggleVisibility,
}) => (
    <div className="input-with-icon-user-form-admin">
        <input
            type={showPassword ? "text" : "password"}
            name={name}
            value={value}
            onChange={onChange}
        />
        <span onClick={onToggleVisibility}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
    </div>
);

const SelectField = ({ name, value, onChange, options, onBack }) => (
    <select name={name} value={value} onChange={onChange} required disabled={onBack === null}>
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
}) => {
    return (
        <div className="user-form-admin">
            <h2>
                <strong>{title}</strong>
            </h2>
            <form
                className={`form-container-user-form-admin`}
                onSubmit={onSubmit}
            >
                <div className={`left-section-user-form-admin`}>
                    <img
                        src={Builder}
                        alt="User Default"
                        className="user-image-user-form-admin"
                    />
                </div>

                <div className="right-section-user-form-admin">
                    <FormField label="Full Name" className="user-form-admin">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={onChange}
                            required
                        />
                    </FormField>

                    <FormField label="Phone Number" className="user-form-admin">
                        <input
                            type="text"
                            name="no_hp"
                            value={formData.no_hp}
                            onChange={onChange}
                            required
                        />
                    </FormField>

                    <FormField label="Department" className="user-form-admin">
                        <SelectField
                            name="id_department"
                            value={formData.id_department}
                            onChange={onChange}
                            options={DEPARTMENTS}
                            required
                            onBack={onBack}
                        />
                    </FormField>

                    <FormField
                        label={isEdit ? "Change Password" : "Password"}
                        className="user-form-admin"
                    >
                        <PasswordField
                            name="password"
                            value={formData.password}
                            onChange={onChange}
                            showPassword={showPassword}
                            onToggleVisibility={() =>
                                onTogglePassword("password")
                            }
                            className="user-form-admin"
                            required
                        />
                    </FormField>

                    <FormField label="Role" className="user-form-admin">
                        <SelectField
                            name="role"
                            value={formData.role}
                            onChange={onChange}
                            options={ROLES}
                            required
                            onBack={onBack}
                        />
                    </FormField>

                    <FormField
                        label="Confirm Password"
                        className="user-form-admin"
                    >
                        <PasswordField
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={onChange}
                            showPassword={showConfirmPassword}
                            onToggleVisibility={() =>
                                onTogglePassword("confirmPassword")
                            }
                            className="user-form-admin"
                            required
                        />
                    </FormField>

                    <FormField label="Email" className="user-form-admin">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            required
                        />
                    </FormField>

                    <div className="button-group-user-form-admin">
                        { onBack !== null && <button
                            type="button"
                            className="back-btn-user-form-admin"
                            onClick={onBack}
                        >
                            Back
                        </button>}
                        <button
                            type="submit"
                            className={`${submitButtonText.toLowerCase()}-btn-user-form-admin`}
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
