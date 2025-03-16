import { JwtPayload, jwtDecode } from "jwt-decode";
import { User } from "../types/User";
import { Permission } from "../types/Permission";

interface UserData extends JwtPayload {
    id: number;
    name: string;
    email: string;
    permissions: Permission[];
}

const GetUserData = (): UserData | null => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwtDecode<UserData>(token);
            return new User(
                decodedToken.id.toString(),
                decodedToken.name,
                decodedToken.email,
                decodedToken.permissions
            );
        }
    }
    return null;
};

export default GetUserData;
