import { useState } from "react";
import { Form } from "../types/Form";
import SelectInput from "./Fields/SelectInput";
import NumberInput from "./Fields/NumberInput";

interface Props {
    form: Form;
    preview?: boolean;
}

export const DynamicForm: React.FC<Props> = ({ form, preview = false }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});

    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Dados enviados:', formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {form.fields.map((field, index) => (
                <div key={index} className="mb-3">
                    {field.type === "TEXT" && (
                        <>
                            <label className="form-label">
                                {field.label} {field.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData[field.label] || ""}
                                disabled={preview}
                                onChange={e => handleChange(field.label, e.target.value)}
                            />
                        </>
                    )}

                    {field.type === "TEXTAREA" && (
                        <>
                            <label className="form-label">
                                {field.label} {field.required && <span className="text-danger">*</span>}
                            </label>
                            <textarea
                                className="form-control"
                                disabled={preview}
                                onChange={e => handleChange(field.label, e.target.value)}
                            />
                        </>
                    )}

                    {field.type === "NUMBER" && (
                        <NumberInput
                            value={formData[field.label] || ""}
                            label={field.label}
                            required={field.required}
                            disabled={preview}
                            onChange={(value) => handleChange(field.label, value)}
                        />
                    )}

                    {field.type === "SELECT" && (
                        <SelectInput
                            value={formData[field.label] || ""}
                            label={field.label}
                            required={field.required}
                            options={field.options || []}
                            disabled={false}
                            onChange={(value) => handleChange(field.label, value)}
                        />
                    )}

                    {field.type === "CHECKBOX" && (
                        <div>
                            {field.options?.map((opt, i) => (
                                <div key={i} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        disabled={preview}
                                        onChange={e => handleChange(field.label, e.target.value)}
                                    />
                                    <label className="form-check-label">{opt}</label>
                                </div>
                            ))}
                        </div>
                    )}

                    {field.type === "RADIO" && (
                        <div>
                            {field.options?.map((opt, i) => (
                                <div key={i} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        disabled={preview}
                                        onChange={e => handleChange(field.label, e.target.value)}
                                    />
                                    <label className="form-check-label">{opt}</label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            <button type="submit" className="btn btn-primary" disabled={preview}>Enviar</button>
        </form>
    );
};
