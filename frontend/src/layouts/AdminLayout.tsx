import { Outlet } from "react-router-dom";
import HeaderAdmin from "../components/HeaderAdmin";

const AdminLayout = () => {
    return (
        <div className="layout">
            <main>
                <HeaderAdmin pageName="Administração" />
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
