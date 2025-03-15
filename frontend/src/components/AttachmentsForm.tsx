import { useState } from "react";
import { FaCircleXmark } from "react-icons/fa6";

interface AttachmentsFormProps {
    onFilesChange: (files: File[]) => void;
}

const AttachmentsForm: React.FC<AttachmentsFormProps> = ({ onFilesChange }) => {
    const [fileInputs, setFileInputs] = useState<number[]>([0]);
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;

        const newFiles = [...files];
        newFiles[index] = event.target.files[0];

        if (event.target.files.length > 0) {
            setFileInputs((prevInputs) => [prevInputs.length, ...prevInputs]);
        }

        setFiles(newFiles);
        onFilesChange(newFiles);
    };

    const cleanInput = (index: number) => {
        const inputElement = document.querySelector<HTMLInputElement>(
            `input[name='attachments${index}']`
        );

        if (inputElement) {
            if (inputElement.value === "") return;

            inputElement.value = "";

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
            {fileInputs.map((_, index) => (
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
