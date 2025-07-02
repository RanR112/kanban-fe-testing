import React, { useEffect, useState } from "react";
import "../sass/Home/Home.css";
import { DEPARTMENT_MAP } from "../utils/constants";
import LoaderPrimary from "../components/LoaderPrimary";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
    const { user, getCurrentUser, loading } = useAuth();
    const [displayUser, setDisplayUser] = useState({
        name: "",
        role: "",
        department: "",
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const setupUserData = async () => {
            try {
                // Jika user belum ada di context, coba ambil dari server
                if (!user) {
                    const result = await getCurrentUser();
                    if (!result.success) {
                        throw new Error(
                            result.message || "Failed to get user data"
                        );
                    }
                }

                // Set display user data
                if (user) {
                    setDisplayUser({
                        name: user.name || "User",
                        role: user.role || "User",
                        department: `${
                            DEPARTMENT_MAP[user.department?.name] ||
                            user.department?.name ||
                            ""
                        } Department`,
                    });
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Gagal mengambil data user. Silakan login ulang.");
            }
        };

        // Hanya jalankan jika tidak sedang loading
        if (!loading) {
            setupUserData();
        }
    }, [user, loading, getCurrentUser]);

    // Update display user ketika user context berubah
    useEffect(() => {
        if (user) {
            setDisplayUser({
                name: user.name || "User",
                role: user.role || "User",
                department: `${
                    DEPARTMENT_MAP[user.department?.name] ||
                    user.department?.name ||
                    ""
                } Department`,
            });
        }
    }, [user]);

    if (loading) {
        return (
            <div className="home-wrapper">
                <div className="home-container">
                    <div className="loader">
                        <LoaderPrimary />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="home-wrapper">
                <p style={{ color: "red" }}>{error}</p>
            </div>
        );
    }

    return (
        <div className="home-wrapper">
            <div className="home-container">
                <h1 className="company-name">
                    PT AUTOMOTIVE FASTENERS AOYAMA INDONESIA
                </h1>
                <h2 className="welcome-text">
                    WELCOME BACK{" "}
                    <span className="highlight-name">
                        {displayUser.name.toUpperCase()}
                    </span>
                    ,{" "}
                    <span className="highlight-role">
                        {displayUser.role.toUpperCase()}
                    </span>{" "}
                    OF{" "}
                    <span className="highlight-dept">
                        {displayUser.department.toUpperCase()}
                    </span>
                </h2>
                <h3 className="request-text">TO REQUEST KANBAN SYSTEM</h3>
            </div>
        </div>
    );
}
