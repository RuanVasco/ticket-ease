import { User } from "./User";

export interface Message {
	id: string;
	text: string;
	sentAt: string;
	user: User;
}
