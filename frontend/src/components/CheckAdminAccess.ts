import { checkPermission } from "./CheckPermission";

export const CheckAdminAccess = (): boolean => {
    const entities = ["USER", "PROFILE", "DEPARTMENT", "UNIT", "CARGO", "TICKET_CATEGORY"];
    const actions = ["CREATE", "EDIT", "DELETE"];

    for (const entity of entities) {
        for (const action of actions) {
            if (checkPermission(action, entity)) {
                return true;
            }
        }
    }

    return false;
};
