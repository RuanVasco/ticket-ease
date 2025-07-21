import React from 'react';
import { StatusEnum, StatusLabels } from "../../enums/StatusEnum";
import "../../assets/styles/components/_form.scss";

interface SelectStatusProps {
    status: StatusEnum | null;
    onStatusChange: (status: string | null) => void;
    className?: string;
}

const SelectStatus: React.FC<SelectStatusProps> = ({ status, onStatusChange, className }) => (
    <select
        value={status || ""}
        onChange={(e) => onStatusChange(e.target.value || null)}
        className={className}
    >
        <option value="">Selecione um status</option>
        {Object.values(StatusEnum).map((statusKey) => (
            <option key={statusKey} value={statusKey}>
                {StatusLabels[statusKey]}
            </option>
        ))}
    </select>
);

export default SelectStatus;
