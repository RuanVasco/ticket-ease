import { Cargo } from "./Cargo";
import { Department } from "./Department";
import { Permission } from "./Permission";
import { Profile } from "./Profile";

export interface IUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: Department;
    cargo: Cargo;
    profiles: Profile[];
    permissions: Permission[];
    password: string;
}

export class User implements IUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: Department;
    cargo: Cargo;
    profiles: Profile[];
    permissions: Permission[];
    password: string;

    constructor(
        id: string,
        name: string,
        email: string,
        phone: string = "",
        department: Department = {} as Department,
        cargo: Cargo = {} as Cargo,
        profiles: Profile[] = [],
        permissions: Permission[] = [],
        password: string = ""
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.cargo = cargo;
        this.profiles = profiles;
        this.permissions = permissions;
        this.password = password;
    }
}
