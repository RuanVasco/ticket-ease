import { useEffect } from "react";

import { Outlet } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWebSocket } from "../context/WebSocketContext";

import Header from "../components/Header";

const MainLayout = () => {
    const { notifications } = useWebSocket();

    useEffect(() => {
        if (notifications.length === 0) return;
        const latest = notifications[0];
        if (!latest.read) {
            toast.info(latest.message);
        }
    }, [notifications]);

    return (
        <div className="layout">
            <ToastContainer position="bottom-right" autoClose={5000} />
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
