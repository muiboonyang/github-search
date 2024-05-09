import {Express} from "express";
import session from "express-session";

declare module 'express-session' {
    interface SessionData {
        email: string;
        name: string;
        isLoggedIn: boolean;
        views: number;
    }
}

declare global {
    namespace Express {
        interface Request {
            email: string;
            name: string;
        }
    }
}