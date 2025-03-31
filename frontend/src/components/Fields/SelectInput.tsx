interface SelectInputProps {
    label: string;
    required?: boolean;
    value: string;
    setValue: (value: string) => void;
    options: string[];
}

const SelectInput: React.FC<SelectInputProps> = ({ value, setValue, label, required = false, options }) => {
    return (
        <div>
            <label className="form-label">
                {label} {required && <span className="text-danger">*</span>}
            </label>
            <select
                className="form-select"
                value={value}
                onChange={(e) => setValue(e.target.value)}
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
