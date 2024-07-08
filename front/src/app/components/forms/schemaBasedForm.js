import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './formStyle.css';

const parseFieldString = (fieldString) => {
    const trimmedString = fieldString.trim();
    const lastParenIndex = trimmedString.lastIndexOf('(');

    if (lastParenIndex !== -1) {
        const label = trimmedString.substring(0, lastParenIndex).trim();
        const type = trimmedString.substring(lastParenIndex + 1, trimmedString.length - 1).trim();
        return { label, type };
    } else {
        return { label: trimmedString, type: undefined };
    }
};

const generateRandomKey = () => {
    return Math.floor(Math.random() * 1000000);
};

const FormSchemaBased = ({ entity, hiddenInputs, mode = "", onSubmit="" }) => {
    const [formData, setFormData] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const readonly = mode === "readonly";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/forms/${entity}`);

                if (!res.data) {
                    setIsEmpty(true);            
                }

                if (res.status === 200) {
                    setFormData(res.data);
                    setIsEmpty(false);
                } else {                    
                    console.error('Error', res.status);
                    setIsEmpty(true);
                }

            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [entity]);

    if (isEmpty || formData.length === 0) {
        return <></>;
    }
    
    return (
        <form className="text-center" id="form-box" onSubmit={onSubmit}>
            <table className='form_table w-100'>
                <tbody>
                    {formData.map(field => {
                        const { label, type } = parseFieldString(field);
                        let input;

                        if ((hiddenInputs && hiddenInputs.includes(label)) || label === 'id' || (label === "password" && readonly)) {
                            return null;
                        }

                        if (label === "descricao" && type === "String") {
                            input = (
                                <div className="form-floating">
                                    <textarea 
                                        className="form-control" 
                                        placeholder="Descrição" 
                                        name={label} 
                                        id={label}
                                        readOnly={readonly}
                                    ></textarea>
                                    <label htmlFor={label}>Descrição</label>
                                </div>
                            );
                        } else if (type === "String" || type === "Long") {
                            if (label === "password") {
                                input = (
                                    <input 
                                        type="password" 
                                        className={`form-control ${readonly ? 'd-none' : ''}`} 
                                        name={label} 
                                        id={label} 
                                    />
                                );
                            } else {
                                input = (
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name={label} 
                                        id={label}
                                        readOnly={readonly}
                                    />
                                );
                            }
                        }

                        return (
                            <tr key={generateRandomKey()}>
                                <td>
                                    <label htmlFor={label}>{label.charAt(0).toUpperCase() + label.slice(1) + ":"}</label>
                                </td>
                                <td>
                                    {input}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {!readonly && (
                <div className='text-end pe-3'>
                    <button type="submit" className="btn btn-custom mt-3">Enviar</button>
                </div>
            )}
        </form>
    );
};

export default FormSchemaBased;
