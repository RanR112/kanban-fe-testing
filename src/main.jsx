import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { KanbanProvider } from "./contexts/KanbanContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <ErrorBoundary>
        <AuthProvider>
            <ErrorBoundary>
                <KanbanProvider>
                    <ErrorBoundary>
                        <RouterProvider router={router} />
                    </ErrorBoundary>
                </KanbanProvider>
            </ErrorBoundary>
        </AuthProvider>
    </ErrorBoundary>
);
