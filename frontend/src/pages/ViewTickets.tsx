import TableTicket from "../components/TableTicket";

const ViewTickets: React.FC = () => {
    return (
        <main className="container-fluid py-2">
            <TableTicket viewMode="readonly" />
        </main>
    );
};

export default ViewTickets;
