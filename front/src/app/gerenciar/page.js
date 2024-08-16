"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TableTicket from "../components/tableTicket";
import Header from "../components/header/header";
import useIsAdmin from "../components/checkAdmin";  

export default function GerenciarChamados() {
    const { isAdmin, loading } = useIsAdmin();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push("/");
        }
    }, [isAdmin, loading, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <main>
            <Header pageName="Editar Chamados" />
            <TableTicket viewMode="edit" />
        </main>
    );
}
