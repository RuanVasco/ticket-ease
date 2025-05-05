import React from "react";
import "../../assets/styles/components/_form.scss";

interface Option {
    value: string | number;
    label: string;
}

interface SelectProps {
    id?: string;
    label?: string;
    className?: string;
    value: string | number;
    options: Option[];
    placeholder?: string;
    onChange: (value: string | number) => void;
    disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
    id,
    label,
    className = "select_bar_outlined",
    value,
    options,
    placeholder = "Selecione uma opção",
    onChange,
    disabled = false,
}) => {
    return (
        <div className="form-group">
            {label && (
                <label htmlFor={id} className="label_form">
                    {label}
                </label>
            )}
            <select
                id={id}
                className={className}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
            >
                <option value="" disabled hidden>{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;
