import { TicketProperties } from "./TicketProperties";
import { Form } from "./Form";
import { FormAnswer } from "./FormAnswer";

export class Ticket {
	id: number;
	properties: TicketProperties;
	form: Form;
	responses: FormAnswer[];

	constructor(id: number, properties: TicketProperties, form: Form, responses: FormAnswer[]) {
		this.id = id;
		this.properties = properties;
		this.form = form;
		this.responses = responses;
	}
}
