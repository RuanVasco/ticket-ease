export class Notification {
    id: string;
    message: string;
    read: boolean;
    type: string;
    typeId: string;
    createdAt: Date;

    constructor(
        id = "",
        message = "",
        read = false,
        type = "",
        typeId = "",
        createdAt = new Date()
    ) {
        this.id = id;
        this.message = message;
        this.read = read;
        this.type = type;
        this.typeId = typeId;
        this.createdAt = createdAt;
    }
}
