import { Routes, Route, Navigate } from "react-router-dom";

import { usePermissions } from "./context/PermissionsContext";
import AdminLayout from "./layouts/AdminLayout";
import MainLayout from "./layouts/MainLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import CargoManagement from "./pages/admin/CargoManagement";
import DepartmentManagement from "./pages/admin/DepartmentManagement";
import Home from "./pages/admin/Home";
import ProfileManagement from "./pages/admin/ProfileManagement";
import TicketCategoryManagement from "./pages/admin/TicketCategoryManagement";
import UnitManagement from "./pages/admin/UnitManagement";
import UserManagement from "./pages/admin/UserManagement";
import CreateTicket from "./pages/CreateTicket";
import Login from "./pages/Login";
import ManageTickets from "./pages/ManageTickets";
import TicketDetails from "./pages/TicketDetails";
import ViewTickets from "./pages/ViewTickets";

function App() {
    const { hasPermission, isAdmin, loading } = usePermissions();

    if (loading) {
        return <div>Carregando permissões...</div>;
    }

    const canManageTicket = hasPermission("MANAGE_TICKET") || hasPermission("FULL_ACCESS");

    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedLayout />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<CreateTicket />} />
                    <Route path="/tickets" element={<ViewTickets />} />
                    <Route path="/tickets/:id" element={<TicketDetails />} />
                    {canManageTicket && (
                        <Route path="/gerenciar-tickets" element={<ManageTickets />} />
                    )}
                </Route>
            </Route>

            {isAdmin && (
                <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<Home />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/units" element={<UnitManagement />} />
                    <Route path="/admin/departments" element={<DepartmentManagement />} />
                    <Route path="/admin/cargos" element={<CargoManagement />} />
                    <Route path="/admin/profiles" element={<ProfileManagement />} />
                    <Route path="/admin/ticket_category" element={<TicketCategoryManagement />} />
                </Route>
            )}

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
