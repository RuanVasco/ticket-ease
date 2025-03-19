import { Cargo } from "./Cargo";
import { Department } from "./Department";
import { Profile } from "./Profile";

export class User {
    id: string;
    name: string;
    email: string;
    phone: string;
    departments: Department[];
    cargo: Cargo;
    profiles: Profile[];
    password: string;

    constructor(
        id: string,
        name: string,
        email: string,
        phone: string = "",
        department: Department[] = [],
        cargo: Cargo = {} as Cargo,
        profiles: Profile[] = [],
        password: string = ""
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.departments = department;
        this.cargo = cargo;
        this.profiles = profiles;
        this.password = password;
    }
}
