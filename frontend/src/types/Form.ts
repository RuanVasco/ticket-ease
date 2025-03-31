import { FormField } from "./FormField";
import { TicketCategory } from "./TicketCategory";
import { User } from "./User";

export class Form {
    id: string;
    ticketCategory: TicketCategory;
    title: string;
    description: string;
    creator: User;
    fields: FormField[];

    constructor(
        id = "",
        ticketCategory = {} as TicketCategory,
        title = "",
        description = "",
        creator = {} as User,
        fields = []
    ) {
        this.id = id;
        this.ticketCategory = ticketCategory;
        this.title = title;
        this.description = description;
        this.creator = creator;
        this.fields = fields;
    }
}
