import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import CreateTicket from "./pages/CreateTicket";
import ViewTickets from "./pages/ViewTicket";
import TicketDetails from "./pages/TicketDetails";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <CreateTicket />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/visualizar"
                element={
                    <ProtectedRoute>
                        <ViewTickets />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/chamado/:id"
                element={
                    <ProtectedRoute>
                        <TicketDetails />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
