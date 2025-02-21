import { getPermissions } from "./getPermissions";
import getUserData from "./getUserData";
import Cookies from "js-cookie";

export const checkPermission = async (action: string, entity: string): Promise<boolean> => {
    const userData = getUserData();
    if (!userData || typeof userData.id !== "number") return false;

    const requiredPermission = `${action}_${entity.toUpperCase()}`;
    let permissions = JSON.parse(Cookies.get('userPermissions') || '[]');
    
    if (permissions.length === 0) {
        permissions = await getPermissions(userData.id);

        Cookies.set('userPermissions', JSON.stringify(permissions), { secure: true, httpOnly: false, sameSite: 'Strict' });
    }

    return permissions.includes(requiredPermission);
};
