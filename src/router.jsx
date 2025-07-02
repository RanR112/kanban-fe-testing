import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./views/Auth/Login";
import ReqKanban from "./views/Kanban/ReqKanban";
import ProtectedRoute, { AdminRoute } from "./components/ProtectedRoute";
import ReqForm from "./views/Kanban/ReqForm";
import Users from "./views/Users/Users";
import AddUser from "./views/Users/AddUser";
import EditUser from "./views/Users/EditUser";
import Layout from "./components/Layout";
import Home from "./views/Home";
import DetailReqKanban from "./views/Kanban/DetailReqKanban";
import ApprovalReqKanban from "./views/ApprovalReqKanban";
import Report from "./views/Report";
import SignUp from "./views/Auth/Signup";
import ForgotPassword from "./views/Auth/ForgotPassword";
import Profile from "./views/Users/Profile";
import VerifyRegistrationEmail from "./views/Auth/VerifyRegistrationEmail";
import AuditLog from "./views/AuditLog";
import Registration from "./views/Registration";
import AuditLogDetail from "./views/AuditLogDetail";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <SignUp />,
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />,
    },
    {
        path: "/verify-registration-email",
        element: <VerifyRegistrationEmail />,
    },
    {
        path: "/user",
        element: (
            <ProtectedRoute>
                <Layout layoutType="user" />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "home-user",
                element: <Home />,
            },
            {
                path: "request-kanban",
                element: (
                    <ReqKanban
                        userType="user"
                        dataSource="mine"
                        title="MY KANBAN REQUESTS"
                        showCreateButton={true}
                    />
                ),
            },
            {
                path: "request-form",
                element: <ReqForm />,
            },
            {
                path: "detail-request/:id",
                element: <DetailReqKanban />,
            },
            {
                path: "profile",
                element: <Profile />,
            },
        ],
    },
    {
        path: "/user-lead",
        element: (
            <ProtectedRoute>
                <Layout layoutType="userLead" />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "home-user-lead",
                element: <Home />,
            },
            {
                path: "reqkanban-user-lead",
                element: (
                    <ReqKanban
                        userType="user-lead"
                        dataSource="pending"
                        title="PENDING APPROVAL REQUESTS"
                        showApproveReject={true}
                    />
                ),
            },
            {
                path: "approve-user-lead",
                element: (
                    <ApprovalReqKanban
                        navigationPath="/user-lead/detailreq-user-lead"
                        dataSource="approved"
                        title="APPROVED REQUESTS"
                    />
                ),
            },
            {
                path: "detailreq-user-lead/:id",
                element: <DetailReqKanban />,
            },
            {
                path: "profile",
                element: <Profile />,
            },
        ],
    },
    {
        path: "/admin",
        element: (
            <ProtectedRoute>
                <Layout layoutType="admin" />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "home-admin",
                element: <Home />,
            },
            {
                path: "kanbanreq-admin",
                element: (
                    <ReqKanban
                        userType="admin"
                        dataSource="all"
                        title="ALL KANBAN REQUESTS"
                        showApproveReject={false}
                    />
                ),
            },
            {
                path: "detail-kanbanreq/:id",
                element: <DetailReqKanban />,
            },
            {
                path: "users",
                element: (
                    <AdminRoute>
                        <Users />
                    </AdminRoute>
                ),
            },
            {
                path: "add-users",
                element: (
                    <AdminRoute>
                        <AddUser />
                    </AdminRoute>
                ),
            },
            {
                path: "edit-users/:id", // Added ID parameter for edit
                element: (
                    <AdminRoute>
                        <EditUser />
                    </AdminRoute>
                ),
            },
            {
                path: "audit-log",
                element: (
                    <AdminRoute>
                        <AuditLog />
                    </AdminRoute>
                ),
            },
            {
                path: "audit-log-detail/:id",
                element: (
                    <AdminRoute>
                        <AuditLogDetail />
                    </AdminRoute>
                ),
            },
            {
                path: "registration",
                element: <Registration />,
            },
            {
                path: "report-admin",
                element: <Report />,
            },
            {
                path: "profile",
                element: <Profile />,
            },
        ],
    },
    {
        path: "/pc-lead",
        element: (
            <ProtectedRoute>
                <Layout layoutType="pcLead" />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "home-pc-lead",
                element: <Home />,
            },
            {
                path: "kanbanreq-pc-lead",
                element: (
                    <ReqKanban
                        userType="pc-lead"
                        dataSource="incoming"
                        title="INCOMING PC REQUESTS"
                        showApproveReject={true}
                    />
                ),
            },
            {
                path: "detailreq-pc-lead/:id",
                element: <DetailReqKanban />,
            },
            {
                path: "approve-pc-lead",
                element: (
                    <ApprovalReqKanban
                        navigationPath="/pc-lead/detailreq-pc-lead"
                        dataSource="done"
                        title="PC APPROVED REQUESTS"
                    />
                ),
            },
            {
                path: "report-pc-lead",
                element: <Report />,
            },
            {
                path: "profile",
                element: <Profile />,
            },
        ],
    },
    // Catch-all route for 404
    {
        path: "*",
        element: <Navigate to="/login" replace />,
    },
]);

export default router;
