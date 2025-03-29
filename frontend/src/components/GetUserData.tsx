import { JwtPayload, jwtDecode } from "jwt-decode";

import { Cargo } from "../types/Cargo";
import { Profile } from "../types/Profile";
import { User } from "../types/User";

interface UserData extends JwtPayload {
    id: number;
    name: string;
    sub: string;
    roles: Profile[];
}

const GetUserData = (): User | null => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwtDecode<UserData>(token);

            if (!decodedToken.id || !decodedToken.name || !decodedToken.sub) {
                console.warn("⚠️ Token inválido ou incompleto:", decodedToken);
                return null;
            }

            return new User(
                decodedToken.id.toString(),
                decodedToken.name,
                decodedToken.sub,
                "",
                {} as Cargo,
                []
            );
        }
    }
    return null;
};

export default GetUserData;
