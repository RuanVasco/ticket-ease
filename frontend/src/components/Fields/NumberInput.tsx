interface NumberInputProps {
    label: string;
    required?: boolean;
    disabled?: boolean;
    value: number;
    onChange: (value: string) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({ value, label, required = false, disabled = false, onChange }) => {
    return (
        <div>
            <label className="form-label">
                {label} {required && <span className="text-danger">*</span>}
            </label>
            <input
                type="number"
                id="number_input"
                className="form-control"
                required={required}
                value={value}
                min={0}
                max={100}
                step={1}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default NumberInput;
