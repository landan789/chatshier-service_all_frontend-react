namespace Chatshier {
    interface JWT {
        adu: string;
        exp: number;
        iat: number;
        iss: string;
        sub: string;
        uid: string;
    }
}