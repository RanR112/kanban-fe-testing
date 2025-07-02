import React, { useState, useEffect } from "react";
import "../../sass/Login/Login.css";
import Logo from "../../assets/images/logo.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LoaderButton } from "../../components/LoaderButton";

export default function VerifyRegistrationEmail() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [alert, setAlert] = useState(null);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [registrationStatus, setRegistrationStatus] = useState(null);
    const {
        verifyRegistrationEmail,
        resendRegistrationVerification,
        getRegistrationStatus,
    } = useAuth();
    const navigate = useNavigate();

    // Initialize email from localStorage or redirect if not found
    useEffect(() => {
        const pendingEmail = localStorage.getItem("pendingVerificationEmail");
        if (pendingEmail) {
            setEmail(pendingEmail);
            // Check registration status
            checkRegistrationStatus(pendingEmail);
        } else {
            // No pending email, redirect to signup
            navigate("/signup");
        }
    }, [navigate]);

    // Countdown timer for resend
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    // Check registration status
    const checkRegistrationStatus = async (emailToCheck) => {
        try {
            const result = await getRegistrationStatus(emailToCheck);
            if (result.success) {
                setRegistrationStatus(result.data.data);

                // If already verified, show appropriate message
                if (
                    result.data.data.email_verified &&
                    result.data.data.status === "PENDING"
                ) {
                    setAlert({
                        type: "info",
                        message:
                            "Email already verified. Waiting for admin approval.",
                    });
                } else if (result.data.data.status === "APPROVED") {
                    setAlert({
                        type: "success",
                        message: "Registration approved! You can now login.",
                    });
                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);
                } else if (result.data.data.status === "REJECTED") {
                    setAlert({
                        type: "error",
                        message: `Registration rejected: ${
                            result.data.data.rejection_reason ||
                            "Please contact admin for details."
                        }`,
                    });
                }
            }
        } catch (error) {
            console.error("Failed to check registration status:", error);
        }
    };

    // Handle OTP input changes
    const handleOtpChange = (e, index) => {
        const value = e.target.value.replace(/\D/g, ""); // Only allow digits

        if (value.length <= 1) {
            const newOtp = otp.split("");
            newOtp[index] = value;
            setOtp(newOtp.join(""));

            // Auto focus next input
            if (value && index < 5) {
                const nextInput = e.target.parentNode.children[index + 1];
                if (nextInput) {
                    nextInput.focus();
                }
            }
        }
    };

    // Handle OTP input key events
    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                // Focus previous input on backspace if current is empty
                const prevInput = e.target.parentNode.children[index - 1];
                if (prevInput) {
                    prevInput.focus();
                }
            } else {
                // Clear current input
                const newOtp = otp.split("");
                newOtp[index] = "";
                setOtp(newOtp.join(""));
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            const prevInput = e.target.parentNode.children[index - 1];
            if (prevInput) {
                prevInput.focus();
            }
        } else if (e.key === "ArrowRight" && index < 5) {
            const nextInput = e.target.parentNode.children[index + 1];
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    // Handle OTP paste
    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);
        setOtp(pasteData);

        // Focus the next empty input or last input
        const focusIndex = Math.min(pasteData.length, 5);
        const inputs = e.target.parentNode.children;
        if (inputs[focusIndex]) {
            inputs[focusIndex].focus();
        }
    };

    // Handle email change
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        // Clear stored email if user changes it
        if (
            e.target.value !== localStorage.getItem("pendingVerificationEmail")
        ) {
            localStorage.removeItem("pendingVerificationEmail");
        }
    };

    // Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setAlert({ type: "error", message: "Email is required" });
            return;
        }

        if (!otp.trim()) {
            setAlert({ type: "error", message: "OTP is required" });
            return;
        }

        if (otp.length !== 6) {
            setAlert({ type: "error", message: "OTP must be 6 digits" });
            return;
        }

        setIsLoading(true);

        try {
            const result = await verifyRegistrationEmail(email, otp);

            if (result.success) {
                setAlert({
                    type: "success",
                    message:
                        "Email verified successfully! Your registration is now pending admin approval.",
                });

                // Clear stored email
                localStorage.removeItem("pendingVerificationEmail");

                // Redirect to login after delay
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else {
                setAlert({
                    type: "error",
                    message: result.message || "Verification failed",
                });
            }
        } catch (error) {
            setAlert({
                type: "error",
                message:
                    error.message || "Verification failed. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Resend verification code
    const handleResendVerification = async () => {
        if (countdown > 0) return;

        if (!email.trim()) {
            setAlert({ type: "error", message: "Email is required" });
            return;
        }

        setIsLoading(true);

        try {
            const result = await resendRegistrationVerification(email);

            if (result.success) {
                setAlert({
                    type: "success",
                    message: "Verification code has been sent to your email.",
                });
                setCountdown(60); // 60 second countdown
                setOtp(""); // Clear current OTP
            } else {
                setAlert({
                    type: "error",
                    message:
                        result.message || "Failed to resend verification code",
                });
            }
        } catch (error) {
            setAlert({
                type: "error",
                message: error.message || "Failed to resend verification code",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-hide alerts
    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 5000);

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
            <form className="login-card" onSubmit={handleVerifyOTP}>
                <img src={Logo} alt="Logo" className="logo" />
                <h2>
                    PRODUCTION CONTROL
                    <span className="highlight"> DEPARTMENT</span>
                </h2>
                <h3>VERIFY EMAIL</h3>
                <p className="sub-text">
                    Enter the 6-digit verification code sent to your email
                </p>

                <div className="section-input">
                    {/* Email field */}
                    <div>
                        <label className="label-input" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Your Email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>

                    {/* Registration Status Info */}
                    {registrationStatus && (
                        <div
                            style={{
                                marginBottom: "15px",
                                padding: "10px",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "5px",
                                fontSize: "14px",
                            }}
                        >
                            <strong>Registration Status:</strong>{" "}
                            {registrationStatus.status}
                            <br />
                            <strong>Department:</strong>{" "}
                            {registrationStatus.department}
                            <br />
                            <strong>Email Verified:</strong>{" "}
                            {registrationStatus.email_verified ? "Yes" : "No"}
                            {registrationStatus.rejection_reason && (
                                <>
                                    <br />
                                    <strong>Rejection Reason:</strong>{" "}
                                    {registrationStatus.rejection_reason}
                                </>
                            )}
                        </div>
                    )}

                    {/* OTP Input */}
                    <div>
                        <label className="label-input" htmlFor="otp">
                            Verification Code
                        </label>
                        <div
                            className="otp-inputs"
                            style={{
                                display: "flex",
                                gap: "8px",
                                justifyContent: "center",
                                marginTop: "10px",
                            }}
                        >
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    value={otp[index] || ""}
                                    onChange={(e) => handleOtpChange(e, index)}
                                    onKeyDown={(e) =>
                                        handleOtpKeyDown(e, index)
                                    }
                                    onPaste={(e) => handleOtpPaste(e)}
                                    style={{
                                        width: "45px",
                                        height: "45px",
                                        textAlign: "center",
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                        border: "2px solid #2ea1d8",
                                        borderRadius: "8px",
                                        backgroundColor: "white",
                                        color: "#333",
                                    }}
                                    className="otp-input"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={
                        isLoading ||
                        (registrationStatus?.email_verified &&
                            registrationStatus?.status === "PENDING")
                    }
                >
                    {isLoading ? (
                        <LoaderButton />
                    ) : registrationStatus?.email_verified ? (
                        "Already Verified"
                    ) : (
                        "Verify Email"
                    )}
                </button>

                {/* Resend link */}
                <div style={{ textAlign: "center", marginTop: "15px" }}>
                    <span style={{ fontSize: "13px", color: "#666" }}>
                        Didn't receive the code?{" "}
                        {countdown > 0 ? (
                            <span style={{ color: "#999" }}>
                                Resend in {countdown}s
                            </span>
                        ) : (
                            <span
                                onClick={handleResendVerification}
                                style={{
                                    color: "#0165b9",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                }}
                            >
                                Resend Code
                            </span>
                        )}
                    </span>
                </div>

                {/* Navigation links */}
                <p className="auth-text">
                    Want to use a different email?{" "}
                    <NavLink to="/signup">
                        <span>Register Again</span>
                    </NavLink>
                </p>

                <p className="auth-text">
                    Already verified?{" "}
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
