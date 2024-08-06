import { useState } from 'react';
import { FaCircleXmark } from "react-icons/fa6";

const AttachmentsForm = ({ onFilesChange }) => {
    const [fileInputs, setFileInputs] = useState([0]);

    const handleFileChange = (index) => (event) => {
        const files = event.target.files;

        if (files.length > 0) {
            setFileInputs([...fileInputs, fileInputs.length]);
            onFilesChange(files);
        }
    };

    const cleanInput = (index) => {
        const inputElement = document.querySelector(`input[name='attachments${index}']`);

        if (inputElement) {
            if (fileInputs.length === 1 && inputElement.files.length > 0) {
                inputElement.value = ''; 
            } else {
                if (fileInputs.length > 1) {
                    setFileInputs(fileInputs.filter((_, i) => i !== index));
                }
            }
        }
    };

    return (
        <div id="attachmentsForm" className="attachmentsForm">
            {fileInputs.map((input, index) => (
                <div key={index}>
                    <div className="input-group mb-2">
                        <input
                            type="file"
                            name={`attachments${index}`}
                            className="attachments form-control"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange(index)}
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => cleanInput(index)}
                        >
                            <FaCircleXmark />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AttachmentsForm;
