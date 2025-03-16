import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import CreateTicket from "./pages/CreateTicket";
import ViewTickets from "./pages/ViewTickets";
import TicketDetails from "./pages/TicketDetails";
import ManageTickets from "./pages/ManageTickets";
import MainLayout from "./layouts/MainLayout";

import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/admin/Home";
import UserManagement from "./pages/admin/UserManagement";
import UnitManagement from "./pages/admin/UnitManagement";
import DepartmentManagement from "./pages/admin/DepartmentManagement";
import CargoManagement from "./pages/admin/CargoManagement";
import ProfileManagement from "./pages/admin/ProfileManagement";
import TicketCategoryManagement from "./pages/admin/TicketCategoryManagement";

import { useEffect, useState } from "react";
import { checkPermission } from "./components/CheckPermission";

function App() {
    const [canEditTicket, setCanEditTicket] = useState(false);

    useEffect(() => {
        const checkUserPermission = async () => {
            const hasPermission = checkPermission("EDIT", "TICKET");
            setCanEditTicket(hasPermission);
        };

        checkUserPermission();
    }, []);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/" element={<CreateTicket />} />
                <Route path="/tickets" element={<ViewTickets />} />
                <Route path="/tickets/:id" element={<TicketDetails />} />
                {canEditTicket && <Route path="/gerenciar-tickets" element={<ManageTickets />} />}
            </Route>

            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/admin/" element={<Home />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/units" element={<UnitManagement />} />
                <Route path="/admin/departments" element={<DepartmentManagement />} />
                <Route path="/admin/cargos" element={<CargoManagement />} />
                <Route path="/admin/profiles" element={<ProfileManagement />} />
                <Route path="/admin/ticket-categories" element={<TicketCategoryManagement />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
