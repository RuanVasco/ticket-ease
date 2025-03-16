import TableTicket from "../components/TableTicket";

const ViewTickets: React.FC = () => {
    return (
        <main>
            <TableTicket viewMode="readonly" />
        </main>
    );
};

export default ViewTickets;
