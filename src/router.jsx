import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../src/views/Login";
import HomeUser from "../src/views/DashboardUser/User/HomeUser";
import ReqKanban from "../src/views/DashboardUser/User/ReqKanban";
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutUser from "./components/Layouts/LayoutUser";
import DetailReq from "./views/DashboardUser/User/DetailReq";
import ReqForm from "./views/DashboardUser/User/ReqForm";
import LayoutUserLead from "./components/Layouts/LayoutUserLead";
import HomeLead from "./views/DashboardUser/UserLead/HomeLead";
import ReqKanbanLead from "./views/DashboardUser/UserLead/ReqKanbanLead";
import ApprovalLead from "./views/DashboardUser/UserLead/ApprovalLead";
import DetailReqLead from "./views/DashboardUser/UserLead/DetailReqLead";
import LayoutAdmin from "./components/Layouts/LayoutAdmin";
import HomeAdmin from "./views/DashboardAdmin/Admin/HomeAdmin";
import KanbanReq from "./views/DashboardAdmin/Admin/KanbanReq";
import DetailKanbanReq from "./views/DashboardAdmin/Admin/DetailKanbanReq";
import Users from "./views/DashboardAdmin/Admin/Users";
import ReportAdmin from "./views/DashboardAdmin/Admin/ReportAdmin";
import LayoutPCLead from "./components/Layouts/LayoutPCLead";
import HomePC from "./views/DashboardAdmin/PCLead/HomePC";
import KanbanReqPC from "./views/DashboardAdmin/PCLead/KanbanReqPC";
import ApprovalPC from "./views/DashboardAdmin/PCLead/ApprovalPC";
import DetailReqPC from "./views/DashboardAdmin/PCLead/DetailReqPC";
import ReportPC from "./views/DashboardAdmin/PCLead/ReportPC";
import AddUsers from "./views/DashboardAdmin/Admin/AddUsers";
import EditUser from "./views/DashboardAdmin/Admin/EditUsers";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />, // Route untuk login
  },
  {
    path: "/login",
    element: <Login />, // Route untuk login
  },
  {
    path: "/user", // Semua route dengan layout
    element: (
      <ProtectedRoute>
        <LayoutUser />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // Default route saat buka "/"
        element: <HomeUser />,
      },
      {
        path: "home-user",
        element: <HomeUser />,
      },
      {
        path: "request-kanban",
        element: <ReqKanban />,
      },
      {
        path: "request-form",
        element: <ReqForm />,
      },
      {
        path: "detail-request",
        element: <DetailReq />,
      },
    ],
  },
  {
    path: "/user-lead", // Semua route dengan layout
    element: (
      <ProtectedRoute>
        <LayoutUserLead />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // Default route saat buka "/"
        element: <HomeLead />,
      },
      {
        path: "home-user-lead",
        element: <HomeLead />,
      },
      {
        path: "reqkanban-user-lead",
        element: <ReqKanbanLead />,
      },
      {
        path: "approve-user-lead",
        element: <ApprovalLead />,
      },
      {
        path: "detailreq-user-lead",
        element: <DetailReqLead />,
      },
    ],
  },
  {
    path: "/admin", // Semua route dengan layout
    element: (
      <ProtectedRoute>
        <LayoutAdmin />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // Default route saat buka "/"
        element: <HomeAdmin />,
      },
      {
        path: "home-admin",
        element: <HomeAdmin />,
      },
      {
        path: "kanbanreq-admin",
        element: <KanbanReq />,
      },
      {
        path: "detail-kanbanreq",
        element: <DetailKanbanReq />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "add-users",
        element: <AddUsers />,
      },
      {
        path: "edit-users",
        element: <EditUser />,
      },
      {
        path: "report-admin",
        element: <ReportAdmin />,
      },
    ],
  },
  {
    path: "/pc-lead", // Semua route dengan layout
    element: (
      <ProtectedRoute>
        <LayoutPCLead />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // Default route saat buka "/"
        element: <HomePC />,
      },
      {
        path: "home-pc-lead",
        element: <HomePC />,
      },
      {
        path: "kanbanreq-pc-lead",
        element: <KanbanReqPC />,
      },
      {
        path: "detailreq-pc-lead",
        element: <DetailReqPC />,
      },
      {
        path: "approve-pc-lead",
        element: <ApprovalPC />,
      },
      {
        path: "report-pc-lead",
        element: <ReportPC />,
      },
    ],
  },
]);

export default router;
