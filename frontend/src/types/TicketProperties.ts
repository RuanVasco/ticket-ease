import { User } from "./User";

export class TicketProperties {
	observers: User[];
	urgency: string;
	receiveEmail: boolean;
	status: string;
	createdAt: Date;
	updatedAt: Date;
	closedAt: Date | null;
	user: User;

	constructor(
		observers: User[],
		urgency: string,
		receiveEmail: boolean,
		status: string,
		createdAt: Date,
		updatedAt: Date,
		closedAt: Date | null,
		user: User
	) {
		this.observers = observers;
		this.urgency = urgency;
		this.receiveEmail = receiveEmail;
		this.status = status;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.closedAt = closedAt;
		this.user = user;
	}
}
