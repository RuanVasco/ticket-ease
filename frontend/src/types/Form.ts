import { ApprovalModeEnum } from "../enums/ApprovalModeEnum";
import { FormField } from "./FormField";
import { TicketCategory } from "./TicketCategory";
import { User } from "./User";

export class Form {
	id: string;
	ticketCategory: TicketCategory;
	title: string;
	approvers: User[];
	approvalMode: ApprovalModeEnum;
	description: string;
	creator: User;
	fields: FormField[];

	constructor(
		id = "",
		ticketCategory = {} as TicketCategory,
		title = "",
		approvers = [] as User[],
		approvalMode = ApprovalModeEnum.AND,
		description = "",
		creator = {} as User,
		fields = []
	) {
		this.id = id;
		this.ticketCategory = ticketCategory;
		this.title = title;
		this.approvers = approvers;
		this.approvalMode = approvalMode;
		this.description = description;
		this.creator = creator;
		this.fields = fields;
	}
}
