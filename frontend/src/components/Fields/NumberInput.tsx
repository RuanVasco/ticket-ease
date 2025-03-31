interface NumberInputProps {
    label: string;
    required?: boolean;
    value: number;
    setValue: (value: number) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({ value, setValue, label, required = false }) => {
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
                onChange={(e) => setValue(Number(e.target.value))}
            />
        </div>
    );
};

export default NumberInput;
