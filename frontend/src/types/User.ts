import { Cargo } from "./Cargo";
import { ProfileDepartments } from "./ProfileDepartments";

export class User {
    id: string;
    name: string;
    email: string;
    phone: string;
    cargo: Cargo;
    profileDepartments: ProfileDepartments[];
    password: string;

    constructor(
        id: string,
        name: string,
        email: string,
        phone: string = "",
        cargo: Cargo = {} as Cargo,
        profileDepartments: ProfileDepartments[],
        password: string = ""
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.cargo = cargo;
        this.profileDepartments = profileDepartments;
        this.password = password;
    }
}
