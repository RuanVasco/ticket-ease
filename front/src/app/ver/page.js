"use client";

import TableTicket from "../components/tableTicket";
import Header from "../components/header/header";
import withAuth from "../auth/withAuth";

const VerChamados = () => {

    return (
        <main>
            <Header pageName="Visualizar Chamados" />
            <TableTicket viewMode="readonly" />
        </main>
    );
}

export default withAuth(VerChamados);