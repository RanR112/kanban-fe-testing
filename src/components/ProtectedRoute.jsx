import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SessionExpiredModal from "./SessionExpiredModal";
import cookieStorage from "../services/cookieStorage";

// Your existing ProtectedRoute (keep as is)
export default function ProtectedRoute({ children }) {
    const [isExpired, setIsExpired] = useState(false);
    const [alertConfirm, setAlertConfirm] = useState(false);
    const [fadeOutConfirm, setFadeOutConfirm] = useState(false);
    const { user, accessToken, logout, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;

        const checkAuth = () => {
            const hasUser = !!user;
            const hasAccessToken = !!accessToken;
            const hasCookieToken = !!cookieStorage.getAccessToken();

            if (!hasUser && !hasAccessToken && !hasCookieToken) {
                setIsExpired(true);
                setAlertConfirm(true);
                return;
            }

            if ((hasAccessToken || hasCookieToken) && !hasUser) {
                const userCheckTimer = setTimeout(() => {
                    if (!user) {
                        setIsExpired(true);
                        setAlertConfirm(true);
                    }
                }, 2000);

                return () => clearTimeout(userCheckTimer);
            }
        };

        checkAuth();
    }, [user, accessToken, loading]);

    useEffect(() => {
        let tokenTimer;

        if (user && (accessToken || cookieStorage.getAccessToken())) {
            tokenTimer = setTimeout(() => {
                handleLogout();
            }, 8 * 60 * 60 * 1000);
        }

        return () => {
            if (tokenTimer) {
                clearTimeout(tokenTimer);
            }
        };
    }, [user, accessToken]);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsExpired(true);
            setAlertConfirm(true);
        }
    };

    const handleConfirm = async () => {
        setFadeOutConfirm(true);

        try {
            await logout();
        } catch (error) {
            console.error("Error during logout:", error);
        }

        setTimeout(() => {
            setAlertConfirm(false);
            setFadeOutConfirm(false);
            navigate("/login", { replace: true });
        }, 300);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">Loading...</div>
            </div>
        );
    }

    if (isExpired) {
        return (
            <SessionExpiredModal
                onConfirm={handleConfirm}
                alertConfirm={alertConfirm}
                fadeOutConfirm={fadeOutConfirm}
            />
        );
    }

    return children;
}

// ADD THIS NEW COMPONENT for Admin-only routes
export function AdminRoute({ children }) {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (loading) return;

        setChecking(false);

        // If no user, ProtectedRoute will handle redirect to login
        if (!user) return;

        // If user exists but not admin, redirect to unauthorized
        if (user.role !== "ADMIN") {
            navigate("/unauthorized", { replace: true });
            return;
        }
    }, [user, loading, navigate]);

    // Show loading while checking
    if (loading || checking) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">Loading...</div>
            </div>
        );
    }

    // If no user, let ProtectedRoute handle it
    if (!user) {
        return <ProtectedRoute>{children}</ProtectedRoute>;
    }

    // If not admin, show nothing (redirect already handled in useEffect)
    if (user.role !== "ADMIN") {
        return null;
    }

    // If admin, wrap in ProtectedRoute for session management
    return <ProtectedRoute>{children}</ProtectedRoute>;
}

// OPTIONAL: Add RoleRoute for multiple role checking
export function RoleRoute({ children, allowedRoles = [] }) {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (loading) return;

        setChecking(false);

        if (!user) return;

        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            navigate("/unauthorized", { replace: true });
            return;
        }
    }, [user, loading, navigate, allowedRoles]);

    if (loading || checking) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return <ProtectedRoute>{children}</ProtectedRoute>;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return null;
    }

    return <ProtectedRoute>{children}</ProtectedRoute>;
}
