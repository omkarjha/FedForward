import 'next-auth';

declare module 'next-auth' {

    interface User {
        id?: string;
        username?: string;
        email: string;
        isVerified?: boolean;
        password: string;
        isAcceptingMessages?: boolean;
    }
    interface Session {
        user: {
            id?: string;
            username?: string;
            email?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
        } & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        username?: string;
        email?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
    }
}