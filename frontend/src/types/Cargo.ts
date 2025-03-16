export interface ICargo {
    id: string;
    name: string;
}

export class Cargo implements ICargo {
    id: string;
    name: string;

    constructor(id = "", name = "") {
        this.id = id;
        this.name = name;
    }
}
