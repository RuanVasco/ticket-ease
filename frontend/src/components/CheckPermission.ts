import GetUserData from "./GetUserData";

export const checkPermission = (action: string, entity: string): boolean => {
    const userData = GetUserData();

    if (!userData || !userData.permissions) return false;

    const requiredPermission = `${action}_${entity}`.toUpperCase();

    return userData.permissions.includes(requiredPermission);
};
