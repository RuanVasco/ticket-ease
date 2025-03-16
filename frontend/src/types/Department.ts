export interface IDepartment {
    id: string;
    name: string;
    unit: { id: string; name: string; address: string };
    receivesRequests: boolean;
}

export class Department implements IDepartment {
    id: string;
    name: string;
    unit: { id: string; name: string; address: string };
    receivesRequests: boolean;

    constructor(
        id = "",
        name = "",
        unit = { id: "", name: "", address: "" },
        receivesRequests = false
    ) {
        this.id = id;
        this.name = name;
        this.unit = unit;
        this.receivesRequests = receivesRequests;
    }
}
