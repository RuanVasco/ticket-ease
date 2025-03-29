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
        children?: TicketCategory[]
    ) {
        this.id = id;
        this.name = name;
        this.receiveTickets = receiveTickets;
        this.department = department;
        this.father = father;
        this.path = this.buildPath();
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

    buildPath(): string {
        let path = "";
        let current: TicketCategory | null = this.father;
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
            path = this.department.name;
        }

        path += ` > ${this.name}`;

        return path;
    }

    static fromJSON(data: any): TicketCategory {
        const father = data.father ? TicketCategory.fromJSON(data.father) : null;
        const category = new TicketCategory(
            data.id,
            data.name,
            data.receiveTickets,
            data.department,
            father
        );

        if (data.children) {
            category.children = data.children.map((child: any) => TicketCategory.fromJSON(child));
        }

        return category;
    }
}
