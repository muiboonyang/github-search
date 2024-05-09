import {Request, Response, NextFunction} from "express";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET ?? ''

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    const appLocals = req.app.locals

    // Decode token process
    if (token) {
        jwt.verify(token, accessTokenSecret, (err: any, decoded: any) => {
            if (err) {
                return res.status(403).send({
                    message: "Session has expired. Please log in again.",
                });
            }
            // If token is verified, save user's 'Email' and 'Name' to request for use in other routes
            req.email = decoded.email;
            req.name = decoded.name;
            next(); // to proceed to next function after verifying token
        });
    } else if (appLocals.isLoggedIn) {
        // Not able to set/use cookies in prod env due to cross-domain, fallback on req.app.locals.isLoggedIn
        req.email =  appLocals.email;
        req.name =  appLocals.name;
        next();
    } else {
        return res.status(401).send({
            message: "No token provided.",
        });
    }
};

export default verifyToken;
