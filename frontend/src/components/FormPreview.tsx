import { useState } from "react";
import { Form } from "../types/Form";
import NumberInput from "./Fields/NumberInput";
import SelectInput from "./Fields/SelectInput";

interface Props {
    form: Form;
}

const FormPreview: React.FC<Props> = ({ form }) => {
    const [numberValue, setNumberValue] = useState<number>(0);
    const [selectValue, setSelectValue] = useState<string>("");

    return (
        <div className="p-3 border rounded shadow-sm bg-light">
            <h4 className="fw-bold mb-2">Pré-visualização</h4>
            <p className="text-muted">{form.description}</p>

            {form.fields.length === 0 && (
                <p className="text-secondary fst-italic">Nenhum campo adicionado ainda.</p>
            )}

            <form>
                {form.fields.map((field, index) => (
                    <div key={index} className="mb-3">
                        {field.type === "TEXT" && (
                            <>
                                <label className="form-label">
                                    {field.label} {field.required && <span className="text-danger">*</span>}
                                </label>
                                <input type="text" className="form-control" placeholder={field.placeholder || ""} />
                            </>
                        )}

                        {field.type === "TEXTAREA" && (
                            <>
                                <label className="form-label">
                                    {field.label} {field.required && <span className="text-danger">*</span>}
                                </label>
                                <textarea className="form-control" placeholder={field.placeholder || ""} />
                            </>
                        )}

                        {field.type === "NUMBER" && (
                            <NumberInput value={numberValue} setValue={setNumberValue} label={field.label} required={field.required} />
                        )}

                        {field.type === "SELECT" && (
                            <SelectInput value={selectValue} setValue={setSelectValue} label={field.label} required={field.required} options={field.options || []} />
                        )}

                        {field.type === "CHECKBOX" && (
                            <div>
                                {field.options?.map((opt, i) => (
                                    <div key={i} className="form-check">
                                        <input className="form-check-input" type="checkbox" disabled />
                                        <label className="form-check-label">{opt}</label>
                                    </div>
                                ))}
                            </div>
                        )}

                        {field.type === "RADIO" && (
                            <div>
                                {field.options?.map((opt, i) => (
                                    <div key={i} className="form-check">
                                        <input className="form-check-input" type="radio" disabled name={`radio_${index}`} />
                                        <label className="form-check-label">{opt}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </form>
        </div>
    );
};

export default FormPreview;
