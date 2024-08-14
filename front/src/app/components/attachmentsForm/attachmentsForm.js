import { useState } from 'react';
import { FaCircleXmark } from "react-icons/fa6";

const AttachmentsForm = ({ onFilesChange }) => {
    const [fileInputs, setFileInputs] = useState([0]);
    const [files, setFiles] = useState([]);

    const handleFileChange = (index) => (event) => {
        const newFiles = [...files];
        newFiles[index] = event.target.files[0]; // Add or replace the file at the correct index

        if (event.target.files.length > 0) {
            setFileInputs([fileInputs.length, ...fileInputs]);
        }

        setFiles(newFiles);
        onFilesChange(newFiles); // Pass the updated files array to the parent component
    };

    const cleanInput = (index) => {
        const inputElement = document.querySelector(`input[name='attachments${index}']`);

        if (inputElement) {
            if (inputElement.value == '') {
                return;
            }
            
            inputElement.value = '';

            const newFiles = [...files];
            newFiles.splice(index, 1); 

            if (fileInputs.length > 1) {
                setFileInputs(fileInputs.filter((_, i) => i !== index));
            }

            setFiles(newFiles);
            onFilesChange(newFiles); 
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
