export interface IProfile {
    id: string;
    name: string;
}

export class Profile implements IProfile {
    id: string;
    name: string;

    constructor(id: "", name: "") {
        this.id = id;
        this.name = name;
    }
}
