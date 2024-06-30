"use client";

import Header from '../../header';
import FormSchemaBased from '../../../../forms/schemaBasedForm';
import withAuth from '../../auth/withAuth';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import style from "./style.css";

const AbrirChamado = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const [options, setOptions] = useState([]);
    const [formStructure, setFormStructure] = useState([]);
    const [hiddenInputs, setHiddenInputs] = useState(["user"]);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleChange = async (e) => {
        setFormStructure([]);
        const selectedValue = e.target.value;
        setSelectedOption(selectedValue);
        await getFormStructureData(selectedValue);
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

    const getFormStructureData = async (selectedValue) => {
        try {
            const res = await axios.get(`http://localhost:8080/forms/${selectedValue}`);

            if (res.status === 200) {
                if (res.data != "empty") {
                    setFormStructure(res.data);
                }
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
                                <option default>Escolha um setor</option>
                                {options.map(option => (
                                    <option key={option.id} value={option.name}>{option.name}</option>
                                ))}
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div id="form_" className='mt-5'>
                <FormSchemaBased data={formStructure} hiddenInputs={hiddenInputs} />
            </div>

        </main>
    );
};

export default withAuth(AbrirChamado);
