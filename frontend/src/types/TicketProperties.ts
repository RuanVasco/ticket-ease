import { StatusEnum } from "../enums/StatusEnum";
import { User } from "./User";

export class TicketProperties {
	observers: User[];
	urgency: string;
	receiveEmail: boolean;
	status?: StatusEnum;
	createdAt?: Date;
	updatedAt?: Date;
	closedAt?: Date;
	user?: User;

	constructor(init?: Partial<TicketProperties>) {
		this.observers = init?.observers ?? [];
		this.urgency = init?.urgency ?? "BAIXA";
		this.receiveEmail = init?.receiveEmail ?? false;
		this.status = init?.status ?? StatusEnum.NEW;
		this.createdAt = init?.createdAt;
		this.updatedAt = init?.updatedAt;
		this.closedAt = init?.closedAt;
		this.user = init?.user;
	}
}

export const defaultProperties: TicketProperties = {
	observers: [],
	urgency: "BAIXA",
	receiveEmail: false,
};
