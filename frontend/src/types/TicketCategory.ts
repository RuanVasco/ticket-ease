import { Department } from "./Department";

export class TicketCategory {
    id: string;
    name: string;
    department: Department;
    father: TicketCategory | null;
    path?: string;
    children?: TicketCategory[];

    constructor(
        id: string,
        name: string,
        department: Department,
        father: TicketCategory | null = null,
        children?: TicketCategory[]
    ) {
        this.id = id;
        this.name = name;
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
        const parts: string[] = [];
        let current: TicketCategory | null = this;

        while (current) {
            parts.unshift(current.name);
            current = current.father ?? null;
        }

        return parts.join(" > ");
    }

    static fromJSON(data: any): TicketCategory {
        const father = data.father ? TicketCategory.fromJSON(data.father) : null;
        const category = new TicketCategory(data.id, data.name, data.department, father);

        if (data.children) {
            category.children = data.children.map((child: any) => TicketCategory.fromJSON(child));
        }

        return category;
    }
}
