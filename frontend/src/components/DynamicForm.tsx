import { Form } from "../types/Form";
import SelectInput from "./Fields/SelectInput";
import NumberInput from "./Fields/NumberInput";

interface Props {
    formData: Record<string, any>;
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    form: Form;
    handleSubmit?: (e: React.FormEvent) => void;
    preview?: boolean;
}

export const DynamicForm: React.FC<Props> = ({ form, preview = false, handleSubmit, formData, setFormData }) => {
    const handleChange = (id: string, value: any) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    return (
        <form onSubmit={preview ? (e) => e.preventDefault() : handleSubmit}>
            <h4 className="fw-bold mb-2">{form.title}</h4>
            <p className="text-muted">{form.description}</p>

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
                                value={formData[field.id] || ""}
                                disabled={preview}
                                onChange={e => handleChange(field.id, e.target.value)}
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
                                onChange={e => handleChange(field.id, e.target.value)}
                            />
                        </>
                    )}

                    {field.type === "NUMBER" && (
                        <NumberInput
                            value={formData[field.id] || ""}
                            label={field.label}
                            required={field.required}
                            disabled={preview}
                            onChange={(value) => handleChange(field.id, value)}
                        />
                    )}

                    {field.type === "SELECT" && (
                        <SelectInput
                            value={formData[field.id] || ""}
                            label={field.label}
                            required={field.required}
                            options={field.options || []}
                            disabled={false}
                            onChange={(value) => handleChange(field.id, value)}
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
                                        onChange={e => handleChange(field.id, e.target.value)}
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
                                        onChange={e => handleChange(field.id, e.target.value)}
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
