import React, { useState, useEffect } from "react";
import "../../sass/Login/Login.css";
import Logo from "../../assets/images/logo.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { LoaderButton } from "../../components/LoaderButton";
import {
    DEPARTMENT_MAP,
    ID_DEPARTMENT_MAP,
    ROLES,
} from "../../utils/constants";

export default function SignUp() {
    const [formData, setFormData] = useState({
        employee_id: "",
        name: "",
        email: "",
        no_hp: "",
        password: "",
        confirmPassword: "",
        id_department: "",
        position: "",
        division: "",
        hire_date: "",
        work_location: "",
    });
    const [alert, setAlert] = useState(null);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { registerEmployee } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const errors = [];

        // Required fields validation
        if (!formData.employee_id.trim()) {
            errors.push("Employee ID is required");
        }
        if (!formData.name.trim()) {
            errors.push("Full name is required");
        }
        if (!formData.email.trim()) {
            errors.push("Email is required");
        }
        if (!formData.no_hp.trim()) {
            errors.push("Phone number is required");
        }
        if (!formData.password.trim()) {
            errors.push("Password is required");
        }
        if (!formData.id_department) {
            errors.push("Department is required");
        }
        if (!formData.position.trim()) {
            errors.push("Position is required");
        }

        // Format validation
        if (
            formData.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            errors.push("Invalid email format");
        }

        if (
            formData.employee_id &&
            !/^[A-Z0-9-_]+$/i.test(formData.employee_id)
        ) {
            errors.push(
                "Employee ID can only contain letters, numbers, hyphens, and underscores"
            );
        }

        if (formData.password.length < 6) {
            errors.push("Password must be at least 6 characters");
        }

        if (formData.password !== formData.confirmPassword) {
            errors.push("Passwords do not match");
        }

        if (formData.no_hp && !/^[\d+\-\s()]+$/.test(formData.no_hp)) {
            errors.push("Invalid phone number format");
        }

        if (formData.hire_date && isNaN(Date.parse(formData.hire_date))) {
            errors.push("Invalid hire date format");
        }

        if (errors.length > 0) {
            setAlert({ type: "error", message: errors[0] }); // Show first error
            return false;
        }

        return true;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Prepare registration data
            const registrationData = {
                employee_id: formData.employee_id.toUpperCase().trim(),
                name: formData.name.trim(),
                email: formData.email.toLowerCase().trim(),
                no_hp: formData.no_hp.trim(),
                password: formData.password,
                id_department: parseInt(formData.id_department),
                position: formData.position.trim(),
                division: formData.division.trim() || undefined,
                hire_date: formData.hire_date
                    ? new Date(formData.hire_date).toISOString()
                    : undefined,
                work_location: formData.work_location.trim() || undefined,
                role: formData.role,
            };

            const result = await registerEmployee(registrationData);

            if (result.success) {
                setAlert({
                    type: "success",
                    message:
                        "Registration submitted successfully! Please check your email for verification.",
                });

                // Store email for verification page
                localStorage.setItem(
                    "pendingVerificationEmail",
                    formData.email.toLowerCase().trim()
                );

                // Redirect to email verification page after 2 seconds
                setTimeout(() => {
                    navigate("/verify-registration-email");
                }, 2000);
            } else {
                setAlert({
                    type: "error",
                    message: result.message || "Registration failed",
                });
            }
        } catch (error) {
            setAlert({
                type: "error",
                message:
                    error.message || "Registration failed. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 5000); // Show alert longer for registration

            const fadeOutTimeout = setTimeout(() => {
                setIsFadingOut(true);
            }, 4000);

            return () => {
                clearTimeout(timer);
                clearTimeout(fadeOutTimeout);
                setIsFadingOut(false);
            };
        }
    }, [alert]);

    return (
        <div className="login-container">
            <form
                className="login-card"
                onSubmit={handleSignUp}
                style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
                <img src={Logo} alt="Logo" className="logo" />
                <h2>
                    PRODUCTION CONTROL
                    <span className="highlight"> DEPARTMENT</span>
                </h2>
                <h3>EMPLOYEE REGISTRATION</h3>
                <p className="sub-text">
                    Please fill in all required information
                </p>

                <div className="section-input">
                    {/* Employee ID */}
                    <div>
                        <label className="label-input" htmlFor="employee_id">
                            Employee ID <span style={{ color: "#ED1010" }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="employee_id"
                            placeholder="Enter Employee ID"
                            value={formData.employee_id}
                            onChange={handleInputChange}
                            required
                            style={{ textTransform: "uppercase" }}
                        />
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="label-input" htmlFor="name">
                            Full Name <span style={{ color: "#ED1010" }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Your Full Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="label-input" htmlFor="email">
                            Email <span style={{ color: "#ED1010" }}>*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Your Company Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="label-input" htmlFor="no_hp">
                            Phone Number <span style={{ color: "#ED1010" }}>*</span>
                        </label>
                        <input
                            type="tel"
                            name="no_hp"
                            placeholder="Enter Your Phone Number"
                            value={formData.no_hp}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Department */}
                    <div style={{ marginBottom: "15px" }}>
                        <label className="label-input" htmlFor="id_department">
                            Department <span style={{ color: "#ED1010" }}>*</span>
                        </label>
                        <select
                            name="id_department"
                            value={formData.id_department}
                            onChange={handleInputChange}
                            required
                            className="input"
                        >
                            <option value="">Select Department</option>
                            {Object.entries(DEPARTMENT_MAP)
                                .slice(1)
                                .map(([key, value]) => (
                                    <option
                                        key={key}
                                        value={ID_DEPARTMENT_MAP[key]}
                                    >
                                        {key} - {value}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Position */}
                    <div>
                        <label className="label-input" htmlFor="position">
                            Position <span style={{ color: "#ED1010" }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="position"
                            placeholder="Enter Your Position"
                            value={formData.position}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Division (Optional) */}
                    <div>
                        <label className="label-input" htmlFor="division">
                            Division
                        </label>
                        <input
                            type="text"
                            name="division"
                            placeholder="Enter Your Division"
                            value={formData.division}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Hire Date (Optional) */}
                    <div>
                        <label className="label-input" htmlFor="hire_date">
                            Hire Date
                        </label>
                        <input
                            type="date"
                            name="hire_date"
                            value={formData.hire_date}
                            onChange={handleInputChange}
                            className="input"
                        />
                    </div>

                    {/* Work Location (Optional) */}
                    <div>
                        <label className="label-input" htmlFor="work_location">
                            Work Location
                        </label>
                        <input
                            type="text"
                            name="work_location"
                            placeholder="Enter Work Location"
                            value={formData.work_location}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Password */}
                    <div className="section-input-password">
                        <label className="label-input" htmlFor="password">
                            Password <span style={{ color: "#ED1010" }}>*</span>
                        </label>
                        <div className="input-password">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter Your Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="section-input-password">
                        <label
                            className="label-input"
                            htmlFor="confirmPassword"
                        >
                            Confirm Password <span style={{ color: "#ED1010" }}>*</span>
                        </label>
                        <div className="input-password">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Your Password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                            <span
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="login-button"
                >
                    {isLoading ? <LoaderButton /> : "Submit Registration"}
                </button>

                <p className="auth-text">
                    Already have an account?{" "}
                    <NavLink to="/login">
                        <span>Sign In</span>
                    </NavLink>
                </p>

                {alert && (
                    <div className="alert-overlay">
                        <div
                            className={`alert ${alert.type} ${
                                isFadingOut ? "fade-out" : "fade-in"
                            }`}
                        >
                            <span>{alert.message}</span>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
