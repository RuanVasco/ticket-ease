import { Navigate, Outlet } from "react-router-dom";
import { CheckAdminAccess } from "../components/CheckAdminAccess";

const AdminLayout = () => {
    const isAdmin = CheckAdminAccess();

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="layout">
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
