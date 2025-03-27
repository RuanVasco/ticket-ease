import { Department } from "./Department";

export class TicketCategory {
    id: string;
    name: string;
    receiveTickets: boolean;
    department: Department;
    father: TicketCategory | null;
    path?: string;
    children?: TicketCategory[];

    constructor(
        id: string,
        name: string,
        receiveTickets: boolean,
        department: Department,
        father: TicketCategory | null = null,
        path?: string,
        children?: TicketCategory[]
    ) {
        this.id = id;
        this.name = name;
        this.receiveTickets = receiveTickets;
        this.department = department;
        this.father = father;
        this.path = path;
        this.children = children;
    }

    getDepartment(): Department | null {
        if (this.department) return this.department;

        let current: TicketCategory | null = this;
        while (current && !current.department) {
            current = current.father;
        }

        return current ? current.department : null;
    }

    static buildPath(father: TicketCategory | null, department: Department, name: string): string {
        let path = "";
        let current = father;
        let temp: Department | null = null;

        if (current) {
            temp = current.getDepartment();

            while (current) {
                path = `${current.name}${path ? " > " + path : ""}`;
                temp = current.getDepartment();
                current = current.father ?? null;
            }

            if (temp) {
                path = `${temp.name} > ${path}`;
            }
        } else {
            path = department.name;
        }

        path += ` > ${name}`;

        return path;
    }
}
