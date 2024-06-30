import React from 'react';
import formStyle from './formStyle.css';

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

const FormSchemaBased = ({ data, hiddenInputs }) => {
    if (data.length < 1) {
        return (<></>);
    }

    return (
        <form className="w-50 mx-auto text-center">
            <table className='form_table w-100'>
                <tbody>
                    {data.map(field => {
                        let { label, type } = parseFieldString(field);
                        let input;

                        if ((hiddenInputs && hiddenInputs.includes(label)) || label == 'id') {
                            return null; 
                        }

                        if (label === "descricao" && type === "String") {
                            input = <div className="form-floating">
                                        <textarea className="form-control" placeholder="Descrição" name={label} id={label}></textarea>
                                        <label htmlFor={label}>Descrição</label>
                                    </div>
                        } else if (type === "String") {
                            input = <input type="text" className="form-control" name={label} id={label}></input>
                        } else if (type === "Long") {
                            input = <input type="text" className="form-control" name={label} id={label}></input>
                        }

                        return (
                            <tr key={generateRandomKey()}>
                                <td>
                                    <label htmlFor={label}>{label.charAt(0).toUpperCase() + label.slice(1) + ":"}</label>
                                </td>
                                <td>
                                    { input }
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className='text-end pe-3'>
                <button type="submit" className="btn btn-primary mt-3">Enviar</button>
            </div>

        </form>
    );
};

export default FormSchemaBased;
