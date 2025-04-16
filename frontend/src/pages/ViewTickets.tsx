import TableTicket from "../components/TableTicket";

const ViewTickets: React.FC = () => {
    return (
        <main className="container py-4">
            <TableTicket viewMode="readonly" />
        </main>
    );
};

export default ViewTickets;
