import { useState } from 'react';

const AttachmentsForm = () => {
    const [fileInputs, setFileInputs] = useState([0]);

    const handleFileChange = (index) => (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            setFileInputs([...fileInputs, fileInputs.length]);
        }
    };

    return (
        <div id="attachmentsForm" className="attachmentsForm">
            {fileInputs.map((input, index) => (
                <div key={index}>
                    <input 
                        type="file" 
                        name={`attachments${index}`} 
                        className="attachments mt-2 form-control" 
                        multiple 
                        accept="image/*"
                        onChange={handleFileChange(index)}
                    />
                </div>
            ))}
        </div>
    );
};

export default AttachmentsForm;
