import { Outlet } from "react-router-dom";

import HeaderAdmin from "../components/HeaderAdmin";
import { ToastContainer } from "react-toastify";

const AdminLayout = () => {
    return (
        <div className="layout">
            <main>
                <ToastContainer position="bottom-right" autoClose={5000} />
                <HeaderAdmin pageName="Administração" />
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
