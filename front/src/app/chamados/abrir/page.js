"use client";

import Header from '../../header';
import FormSchemaBased from '../../forms/schemaBasedForm';
import withAuth from '../../auth/withAuth';
import React, { useState, useEffect } from 'react';
import axios from "axios";

const AbrirChamado = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const [options, setOptions] = useState([]);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleChange = async (e) => {
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
                console.log(res.data);
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
            <div className="container">
                <table className="mx-auto">
                    <tbody>
                        <tr>
                            <td className='px-2'>Para: </td>
                            <td className='px-2'>
                                <select id="selectSectors" className="form-select" value={selectedOption} onChange={handleChange}>
                                    <option default>Escolha uma opção</option>
                                    {options.map(option => (
                                        <option key={option.id} value={option.name}>{option.name}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                        <FormSchemaBased />
                    </tbody>
                </table>                
            </div>            
        </main>
    );
};

export default withAuth(AbrirChamado);
