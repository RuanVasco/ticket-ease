import { FC } from "react";
import "../assets/styles/components/_formshortcut.scss";
import { Form } from "../types/Form";

type FormsShortCutsProps = {
    icon: FC;
    title: string;
    forms: {
        form: Form;
        favorite: boolean;
        accessedAt: string;
    }[];
    onFormClick: (form: Form) => void;
};


const FormsShortCuts = ({ icon: Icon, title, forms, onFormClick }: FormsShortCutsProps) => {
    return (
        <div>
            <div className="shortcut_title mb-2">
                <Icon />
                {title}
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 gx-4 gy-4">
                {forms.map((shortcut) => (
                    <div key={shortcut.form.id} className="col">
                        <article className="shortcut_item" onClick={() => onFormClick(shortcut.form)}>
                            {shortcut.form.title}
                            <p>
                                {shortcut.form.description}
                            </p>
                        </article>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FormsShortCuts;
