import getUserData from "./getUserData";

export const checkPermission = (action: string, entity: string): boolean => {
    const userData = getUserData();

    if (!userData || !userData.permissions) return false;

    const requiredPermission = `${action}_${entity}`.toUpperCase();

    return userData.permissions.includes(requiredPermission);
};
