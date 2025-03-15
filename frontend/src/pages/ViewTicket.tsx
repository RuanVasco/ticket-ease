import TableTicket from "../components/TableTicket";
import Header from "../components/Header";

const ViewTickets: React.FC = () => {
    return (
        <main>
            <Header pageName="Visualizar Chamados" />
            <TableTicket viewMode="readonly" />
        </main>
    );
};

export default ViewTickets;
