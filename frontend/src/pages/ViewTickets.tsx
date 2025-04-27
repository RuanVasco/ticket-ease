import { useState } from "react";
import TableTicket from "../components/TableTicket";
import TicketDetail from "../components/TicketDetails";

const ViewTickets: React.FC = () => {
    const [selectedTicketId, setSelectedTicket] = useState<Number | null>(null);

    return (
        <main className="py-2">
            {selectedTicketId ? (
                <TicketDetail
                    selectedTicketId={selectedTicketId}
                    setSelectedTicket={setSelectedTicket}
                />
            ) : (
                <div className="container">
                    <TableTicket viewMode="readonly" onTicketSelect={setSelectedTicket} />
                </div>
            )}
        </main>
    );
};

export default ViewTickets;
