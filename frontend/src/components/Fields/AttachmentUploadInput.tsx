import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

interface AttachmentUploadInputProps {
    label: string;
    required?: boolean;
    disabled?: boolean;
    multiple?: boolean;
    onChange: (value: File[] | File | null) => void;
}

const AttachmentUploadInput: React.FC<AttachmentUploadInputProps> = ({
    label,
    required = false,
    disabled = false,
    multiple = false,
    onChange,
}) => {
    const {
        getRootProps,
        getInputProps,
        acceptedFiles,
        isDragActive,
        isDragReject,
    } = useDropzone({
        multiple,
        disabled,
        onDrop: (files) => {
            if (multiple) {
                onChange(files);
            } else {
                onChange(files[0] || null);
            }
        },
    });

    useEffect(() => {
        if (acceptedFiles.length === 0) {
            onChange(multiple ? [] : null);
        }
    }, [acceptedFiles, multiple, onChange]);

    return (
        <div>
            <label className="form-label">
                {label} {required && <span className="text-danger">*</span>}
            </label>

            <div
                {...getRootProps()}
                className={`
                    cursor-pointer border-2 rounded-xl p-4 text-center transition-all duration-200
                    ${isDragActive ? 'border-blue-500 bg-blue-100' : 'border-dashed border-gray-300 bg-white'}
                    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:shadow-md hover:border-blue-400'}
                `}
            >
                <input {...getInputProps()} />
                <p className="text-sm text-gray-600">
                    {isDragReject
                        ? 'Arquivo não suportado'
                        : 'Arraste arquivos aqui ou clique para selecionar'}
                </p>

                {acceptedFiles.length > 0 && (
                    <ul className="mt-2 text-left text-sm text-gray-800">
                        {acceptedFiles.map((file) => (
                            <li key={file.name}>
                                📄 {file.name} <span className="text-gray-500 text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AttachmentUploadInput;
