import { Permission } from "./Permission";

export class Profile {
    id: string;
    name: string;
    permissions: Permission[];

    constructor(id: "", name: "", permissions: Permission[]) {
        this.id = id;
        this.name = name;
        this.permissions = permissions;
    }
}
