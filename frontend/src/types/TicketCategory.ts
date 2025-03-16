import { Department } from "./Department";

export interface TicketCategory {
    id: string;
    name: string;
    receiveTickets: boolean;
    department: Department;
    father: TicketCategory;
    path?: string;
    children?: TicketCategory[];
}
