import { JwtPayload, jwtDecode } from "jwt-decode";

interface UserData extends JwtPayload {
    id: number;
    name: string;
    sub: string;
    permissions: string[];
}

const getUserData = (): UserData | null => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwtDecode < UserData > (token); 
            return decodedToken;
        }
    }
    return null;
};

export default getUserData;
