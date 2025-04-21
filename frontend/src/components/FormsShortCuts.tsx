import { FC } from "react";
import "../assets/styles/components/_formshortcut.scss";
import { Form } from "../types/Form";

type FormsShortCutsProps = {
    icon: FC;
    title: string
    forms: {
        form: Form;
        accessedAt: string;
    }[];
    onFormClick: (form: Form) => void;
};


const FormsShortCuts = ({ icon: Icon, title, forms, onFormClick }: FormsShortCutsProps) => {
    return (
        <div className="forms_shortcut">
            <div className="shortcut_title mb-2">
                <Icon />
                {title}
            </div>
            <div className="row justify-content-between g-4">
                {forms.map((shortcut) => (
                    <div key={shortcut.form.id} className="shortcut_item col-auto" onClick={() => onFormClick(shortcut.form)}>
                        <span>{shortcut.form.title}</span>
                        <span>{shortcut.form.ticketCategory.name}</span>
                        <p>
                            {shortcut.form.description}
                        </p>
                    </div>
                ))}


                {/*<div className="shortcut_item col-auto">
                     <span>formulario 1</span>
                    <p>
                        Descrição longa de teste para verificar quebra de linha
                        e alinhamento dos itens com wrap.
                    </p>
                </div>*/}
            </div>
        </div>
    )
}

export default FormsShortCuts;
