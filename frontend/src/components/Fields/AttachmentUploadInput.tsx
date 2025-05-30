import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaMinus, FaPlus } from 'react-icons/fa6';

interface AttachmentUploadInputProps {
    label: string;
    required?: boolean;
    disabled?: boolean;
    multiple?: boolean;
    onChange: (value: File[] | File | null) => void;
    fileType?: {};
}

const AttachmentUploadInput: React.FC<AttachmentUploadInputProps> = ({
    label,
    required = false,
    disabled = false,
    multiple = false,
    onChange,
    fileType = {
        'image/*': [],
        'application/pdf': [],
    },
}) => {
    const [files, setFiles] = useState<File[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple,
        disabled,
        onDrop: (droppedFiles) => {
            const newFiles = multiple ? [...files, ...droppedFiles] : droppedFiles;
            setFiles(newFiles);
            onChange(multiple ? newFiles : droppedFiles[0] || null);
        },
        accept: fileType,
    });

    const removeFile = (indexToRemove: number) => {
        const updatedFiles = files.filter((_, index) => index !== indexToRemove);
        setFiles(updatedFiles);
        onChange(multiple ? updatedFiles : updatedFiles[0] || null);
    };

    return (
        <div>
            <label className="form-label">
                {label} {required && <span className="text-danger">*</span>}
            </label>
            <div
                {...getRootProps()}
            >
                <input {...getInputProps({ refKey: 'ref' })} ref={inputRef} style={{ display: 'none' }} />
                {isDragActive && 'Solte os arquivos aqui...'}

                {files.length > 0 && (
                    <div>
                        {files.map((file, index) => (
                            <div key={file.name + index}
                                className="d-flex align-items-center justify-content-between my-2">
                                <span className="me-2">{file.name}</span>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => removeFile(index)}
                                >
                                    <FaMinus className="me-1" /> Remover
                                </button>
                            </div>
                        ))
                        }
                    </div >
                )}
                <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => inputRef.current?.click()}
                >
                    <FaPlus className="me-1" /> Adicionar
                </button>
            </div >
        </div >
    );
};

export default AttachmentUploadInput;
