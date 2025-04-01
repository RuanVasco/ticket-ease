import { Form } from "./Form";
import { FormAnswer } from "./FormAnswer";
import { User } from "./User";

export class Ticket {
	id?: string;
	status: string;
	createdAt: Date;
	updatedAt: Date;
	closedAt: Date;
	user: User;
	observers: User[];
	form: Form;
	answer: FormAnswer;
	urgency: string;

	constructor(
		id = "",
		status = "",
		createdAt = new Date(),
		updatedAt = new Date(),
		closedAt = new Date(),
		user = {} as User,
		observers = [],
		form = {} as Form,
		answer = {} as FormAnswer,
		urgency = ""
	) {
		this.id = id;
		this.status = status;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.closedAt = closedAt;
		this.user = user;
		this.observers = observers;
		this.form = form;
		this.answer = answer;
		this.urgency = urgency;
	}
}
