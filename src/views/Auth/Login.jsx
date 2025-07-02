import React, { useState, useEffect } from "react";
import "../../sass/Login/Login.css";
import Logo from "../../assets/images/logo.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { LoaderButton } from "../../components/LoaderButton";
import { useAuth } from "../../contexts/AuthContext";
import { LoaderTable } from "../../components/LoaderTable";

export default function Login() {
    const { login, user, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [alert, setAlert] = useState(null);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (user && !authLoading) {
            console.log("User already logged in, redirecting...");
            redirectUserBasedOnRole(user);
        }
    }, [user, authLoading]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const redirectUserBasedOnRole = (userData) => {
        const role = userData.role?.toLowerCase();
        const departmentId = userData.department?.id_department;

        console.log("Redirecting user:", { role, departmentId });

        try {
            if (departmentId !== 1) {
                // Non-Production Control Department
                if (role === "user") {
                    navigate("/user", { replace: true });
                } else if (
                    role === "manager" ||
                    role === "leader" ||
                    role === "supervisor"
                ) {
                    navigate("/user-lead", { replace: true });
                } else {
                    throw new Error(
                        "Role tidak dikenali untuk departemen ini."
                    );
                }
            } else {
                // Production Control Department (id = 1)
                if (role === "admin") {
                    navigate("/admin", { replace: true });
                } else if (
                    role === "manager" ||
                    role === "supervisor" ||
                    role === "staff"
                ) {
                    navigate("/pc-lead", { replace: true });
                } else {
                    throw new Error(
                        "Role tidak dikenali untuk Production Control."
                    );
                }
            }
        } catch (error) {
            console.error("Redirect error:", error);
            setAlert({
                type: "error",
                message: error.message,
            });
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setAlert(null); // Clear previous alerts

        try {
            console.log("Attempting login...");

            const result = await login(formData.email, formData.password);

            console.log("Login result:", result);

            if (result.success) {
                console.log("Login successful, user data:", result.user);

                setAlert({
                    type: "success",
                    message: "Login successful! Redirecting...",
                });

                // Use result.user instead of the user from context (which might not be updated yet)
                setTimeout(() => {
                    redirectUserBasedOnRole(result.user);
                }, 1000);
            } else {
                console.error("Login failed:", result.message);
                setAlert({
                    type: "error",
                    message:
                        result.message || "Login failed. Please try again.",
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            setAlert({
                type: "error",
                message:
                    error.message ||
                    "An unexpected error occurred. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Alert auto-hide effect
    useEffect(() => {
        if (alert) {
            const fadeOutTimeout = setTimeout(() => {
                setIsFadingOut(true);
            }, 2000);

            const clearTimeout_id = setTimeout(() => {
                setAlert(null);
                setIsFadingOut(false);
            }, 3000);

            return () => {
                clearTimeout(fadeOutTimeout);
                clearTimeout(clearTimeout_id);
            };
        }
    }, [alert]);

    // Show loading if auth is still initializing
    if (authLoading) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <img src={Logo} alt="Logo" className="logo" />
                    <div style={{ textAlign: "center", padding: "20px" }}>
                        <LoaderTable />
                        <p>Checking authentication...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <form className="login-card" onSubmit={handleLogin}>
                <img src={Logo} alt="Logo" className="logo" />
                <h2>
                    PRODUCTION CONTROL
                    <span className="highlight"> DEPARTMENT</span>
                </h2>
                <h3>REQUEST KANBAN</h3>
                <p className="sub-text">Please sign in to your account</p>
                <div className="section-input">
                    <div>
                        <label className="label-input" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            required
                            placeholder="Enter Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="section-input-password">
                        <label className="label-input" htmlFor="password">
                            Password
                        </label>
                        <div className="input-password">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                placeholder="Enter Your Password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    cursor: isLoading
                                        ? "not-allowed"
                                        : "pointer",
                                }}
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </span>
                        </div>
                        <NavLink to="/forgot-password">
                            <p>Forgot Password?</p>
                        </NavLink>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="login-button"
                >
                    {isLoading ? <LoaderButton /> : "Sign In"}
                </button>

                <p className="auth-text">
                    Don't have account?{" "}
                    <NavLink to="/signup">
                        <span>Sign Up</span>
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