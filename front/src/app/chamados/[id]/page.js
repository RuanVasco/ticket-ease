"use client"

import TicketDetails from "../../components/ticketDetails/ticketDetails";

const ChamadoDetalhes = ({ params: { id } }) => {

    return (
        <main>
            <TicketDetails id={id} mode="view" />
        </main>
    );
};

export default ChamadoDetalhes;
