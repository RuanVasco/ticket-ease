import { JwtPayload, jwtDecode } from "jwt-decode";

import { Department } from "../types/Department";
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
            return new User(
                decodedToken.id.toString(),
                decodedToken.name,
                decodedToken.sub,
                "",
                {} as Department,
                {} as Department,
                decodedToken.roles
            );
        }
    }
    return null;
};

export default GetUserData;
