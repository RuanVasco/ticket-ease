"use client";

import TableTicket from "../components/tableTicket";
import Header from "../components/header/header";

export default function GerenciarChamados() {
  return (
    <main>
      <Header pageName="Editar Chamados" />
      <TableTicket viewMode="edit" />
    </main>
  );
}
