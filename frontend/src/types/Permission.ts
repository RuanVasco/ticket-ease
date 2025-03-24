export interface Permission {
    id: string;
    name: string;
    description?: string;
    scope: "GLOBAL" | "DEPARTMENT";
}
