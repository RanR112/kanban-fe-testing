import React, { createContext, useContext, useState, useEffect } from "react";
import cookieStorage from "../services/cookieStorage";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(null);

    // Initialize cookies and load existing token
    useEffect(() => {
        const initAuth = () => {
            // Check for existing token in cookies
            const token = cookieStorage.getAccessToken();
            if (token) {
                setAccessToken(token);
            }
        };

        initAuth();
    }, []);

    // Get storage info
    const getStorageInfo = () => {
        return cookieStorage.getStorageInfo();
    };

    // Get cookie info for debugging
    const getCookieInfo = () => {
        return cookieStorage.getCookieInfo();
    };

    // Helper function untuk API calls
    const apiCall = async (endpoint, options = {}) => {
        const url = `${import.meta.env.VITE_API_URL}${endpoint}`;
        const config = {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            credentials: "include",
            ...options,
        };

        // Add Authorization header jika ada client-side token
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            return data;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    };

    // Login function (EXISTING - NOT CHANGED)
    const login = async (email, password) => {
        try {
            const response = await apiCall("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            if (response.success) {
                setUser(response.user);

                // Jika backend mengirim tokens di response (fallback)
                if (response.accessToken) {
                    setAccessToken(response.accessToken);
                    cookieStorage.storeAccessToken(response.accessToken);
                }

                if (response.refreshToken) {
                    cookieStorage.storeRefreshToken(response.refreshToken);
                }

                // Untuk HTTP-only cookies, tokens sudah di-set oleh server
                // Kita hanya perlu update state

                return { success: true, user: response.user };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // OLD Signup function (DEPRECATED - kept for backward compatibility)
    const signup = async (userData) => {
        try {
            const response = await apiCall("/auth/signup", {
                method: "POST",
                body: JSON.stringify(userData),
            });

            return { success: true, data: response };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // NEW Employee Registration function
    const registerEmployee = async (registrationData) => {
        try {
            const response = await apiCall("/registration/register", {
                method: "POST",
                body: JSON.stringify(registrationData),
            });

            return { success: true, data: response };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Verify registration email function
    const verifyRegistrationEmail = async (email, otp) => {
        try {
            const response = await apiCall("/registration/verify-email", {
                method: "POST",
                body: JSON.stringify({ email, otp }),
            });

            return { success: true, data: response };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Resend registration verification
    const resendRegistrationVerification = async (email) => {
        try {
            const response = await apiCall(
                "/registration/resend-verification",
                {
                    method: "POST",
                    body: JSON.stringify({ email }),
                }
            );

            return { success: true, data: response };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Get registration status
    const getRegistrationStatus = async (email) => {
        try {
            const response = await apiCall(
                `/registration/status/${encodeURIComponent(email)}`
            );
            return { success: true, data: response };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // OLD Verify email function (for auth flow - kept for backward compatibility)
    const verifyEmail = async (email, otp) => {
        try {
            const response = await apiCall("/auth/verify-email", {
                method: "POST",
                body: JSON.stringify({ email, otp }),
            });

            return { success: true, data: response };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Forgot password function (EXISTING - NOT CHANGED)
    const forgotPassword = async (email) => {
        try {
            const response = await apiCall("/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email }),
            });

            return { success: true, data: response };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Verify OTP function (EXISTING - NOT CHANGED)
    const verifyOTP = async (email, otp) => {
        try {
            const response = await apiCall("/auth/verify-otp", {
                method: "POST",
                body: JSON.stringify({ email, otp }),
            });

            return { success: true, data: response };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Reset password function (EXISTING - NOT CHANGED)
    const resetPassword = async (resetToken, newPassword, confirmPassword) => {
        try {
            const response = await apiCall("/auth/reset-password", {
                method: "POST",
                body: JSON.stringify({
                    resetToken,
                    newPassword,
                    confirmPassword,
                }),
            });

            return { success: true, data: response };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Change password function (EXISTING - NOT CHANGED)
    const changePassword = async (
        currentPassword,
        newPassword,
        confirmPassword
    ) => {
        try {
            const response = await apiCall("/auth/change-password", {
                method: "POST",
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    confirmPassword,
                }),
            });

            return { success: true, data: response };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Get current user function (EXISTING - NOT CHANGED)
    const getCurrentUser = async () => {
        try {
            const response = await apiCall("/auth/me");
            setUser(response.user);
            return { success: true, user: response.user };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Get user sessions (EXISTING - NOT CHANGED)
    const getUserSessions = async () => {
        try {
            const response = await apiCall("/auth/sessions");
            return { success: true, sessions: response.sessions };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Revoke session (EXISTING - NOT CHANGED)
    const revokeSession = async (sessionId) => {
        try {
            const response = await apiCall(`/auth/sessions/${sessionId}`, {
                method: "DELETE",
            });
            return { success: true, data: response };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Logout function (EXISTING - NOT CHANGED)
    const logout = async (id_users) => {
        try {
            // Call logout endpoint (akan clear HTTP-only cookies di server)
            await apiCall("/auth/logout", {
                method: "POST",
                body: JSON.stringify({ id_users }),
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setAccessToken(null);
            setUser(null);
            // Clear client-side cookies
            cookieStorage.clearTokens();
        }
    };

    // Get available departments (EXISTING - NOT CHANGED)
    const getDepartments = async () => {
        try {
            const response = await apiCall("/auth/departments");
            return { success: true, departments: response.data };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Check registration eligibility (EXISTING - NOT CHANGED)
    const checkRegistrationEligibility = async (email, employee_id) => {
        try {
            const response = await apiCall("/auth/check-eligibility", {
                method: "POST",
                body: JSON.stringify({ email, employee_id }),
            });
            return { success: true, data: response };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Check if user is authenticated on component mount (EXISTING - NOT CHANGED)
    useEffect(() => {
        const checkAuth = async () => {
            // Try to get token from cookies
            const token = cookieStorage.getAccessToken();
            if (token) {
                setAccessToken(token);
            }

            // Always try to get current user (handles both HTTP-only dan client-side cookies)
            const result = await getCurrentUser();
            if (!result.success && token) {
                // Token is invalid, clear it
                setAccessToken(null);
                cookieStorage.clearTokens();
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    const value = {
        user,
        accessToken,
        loading,
        // Auth functions (existing)
        login,
        logout,
        verifyEmail, // OLD auth verify email
        forgotPassword,
        verifyOTP,
        resetPassword,
        changePassword,
        getCurrentUser,
        getUserSessions,
        revokeSession,
        getDepartments,
        checkRegistrationEligibility,
        // Registration functions (NEW)
        registerEmployee,
        verifyRegistrationEmail,
        resendRegistrationVerification,
        getRegistrationStatus,
        // Deprecated but kept for compatibility
        signup,
        // Utility functions
        getStorageInfo,
        getCookieInfo,
        apiCall,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
