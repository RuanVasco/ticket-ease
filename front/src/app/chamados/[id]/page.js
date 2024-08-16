"use client"

import TicketDetails from "../../components/ticketDetails/ticketDetails";

const ChamadoDetalhes = ({ params: { id } }) => {

    return (
        <main>
            <TicketDetails id={id} />
        </main>
    );
};

export default ChamadoDetalhes;
