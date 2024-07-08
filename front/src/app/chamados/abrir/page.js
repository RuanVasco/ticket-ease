"use client";

import Header from '../../components/header/header';
import FormSchemaBased from '../../components/forms/schemaBasedForm';
import withAuth from '../../auth/withAuth';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import style from "./style.css";

const AbrirChamado = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const [options, setOptions] = useState([]);
    const [hiddenInputs, setHiddenInputs] = useState(["user"]);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedOption(selectedValue);
    };

    const fetchDepartments = async () => {
        try {
            const res = await axios.get('http://localhost:8080/departments/receiveRequests?receiveRequests=true');
            if (res.status === 200) {
                setOptions(res.data);
            } else {
                console.error('Erro', res.status);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const res = await axios.post('http://localhost:8080/tickets/', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.status === 200) {
                alert('Chamado aberto com sucesso!');
            } else {
                console.error('Erro', res.status);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <main>
            <Header pageName="Abrir Chamado" />
            <table className='mx-auto form_table'>
                <tbody>
                    <tr>
                        <td>
                            <label>Setor Responsável:</label>
                        </td>
                        <td>
                            <select id="selectSectors" className="form-select" value={selectedOption} onChange={handleChange}>
                                <option defaultValue="">Escolha um setor</option>
                                {options.map(option => (
                                    <option key={option.id} value={option.name + "TicketForm"}>{option.name}</option>
                                ))}
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div id="form_" className='mt-5 w-50 mx-auto'>
                {selectedOption && <FormSchemaBased entity={selectedOption} hiddenInputs={hiddenInputs} onSubmit={handleSubmit} />}
            </div>
        </main>
    );
};

export default withAuth(AbrirChamado);
