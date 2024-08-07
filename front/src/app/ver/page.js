"use client";

import TableTicket from "../components/tableTicket";
import Header from "../components/header/header";

export default function VerChamados() {

    return (
        <main>
            <Header pageName="Visualizar Chamados" />
            <TableTicket viewMode="readonly" />
        </main>
    );
}
