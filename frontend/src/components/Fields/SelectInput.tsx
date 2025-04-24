interface SelectInputProps {
    label: string;
    required?: boolean;
    disabled?: boolean;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({ value, label, required = false, disabled = false, options, onChange }) => {
    return (
        <div>
            <select
                className={`select_bar_outlined`}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">{label} {required ? " *" : ""}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectInput;
