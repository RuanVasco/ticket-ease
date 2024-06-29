"use client";

import Header from '../../header';
import withAuth from '../../auth/withAuth';

const AbrirChamado = () => {
    return (
        <main>
            <Header pageName="Abrir Chamado" />
            <div className="container">
                <table className="mx-auto">
                    <tbody>
                        <tr>
                            <td className='px-2'>Para: </td>
                            <td className='px-2'>
                                <select className="form-select">
                                    <option selected>Open this select menu</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>                
            </div>            
        </main>
    );
};

export default withAuth(AbrirChamado);