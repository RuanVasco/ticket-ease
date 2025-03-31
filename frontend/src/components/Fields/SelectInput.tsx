interface SelectInputProps {
    label: string;
    required?: boolean;
    disabled?: boolean;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({ value, label, required = false, disabled = false, options, onChange }) => {
    return (
        <div>
            <label className="form-label">
                {label} {required && <span className="text-danger">*</span>}
            </label>
            <select
                className="form-select"
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">Selecione...</option>
                {options?.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );
};

export default SelectInput;
