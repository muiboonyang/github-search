require('dotenv').config()
import express, {Request, Response} from "express";
import {
    accessTokenCookieOptions,
    accessTokenExpiry,
    refreshTokenCookieOptions,
    refreshTokenExpiry
} from "../config/cookieOptions";

const router = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/users.model");
const jwt = require("jsonwebtoken");

//======================
// ROUTES
//======================

//======================
// CREATE - Post - Create session (new log in)
// JWT - Access Token
//=======================

router.post("/login", async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;

    const checkUserExist = await UserModel.find({email: email}); // no matter the number of documents matched, a cursor {} is returned, never null

    if (checkUserExist.length === 0) {
        res.status(403).json({
            message: `Email does not exist`,
        });
        return;
    } else {
        const loginDetails = await UserModel.findOne({email: email}); //  if query matches, first document is returned, otherwise null.
        const hash = loginDetails.password;
        const valid = await bcrypt.compare(password, hash);

        if (valid) {
            // Option 1: Store user info in session
            req.session.email = loginDetails.email
            req.session.name = loginDetails.name
            req.session.isLoggedIn = true;

            // Option 2: Store user info in req.app.locals (as cookies are not accessible on prod env)
            req.app.locals.email = loginDetails.email
            req.app.locals.name = loginDetails.name
            req.app.locals.isLoggedIn = true

            // Option 3: Store user info (email and name) in access/refresh token
            const accessToken = jwt.sign(
                {
                    email: loginDetails.email,
                    name: loginDetails.name,
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: `${accessTokenExpiry}ms`,
                }
            );

            // Creating refresh token
            const refreshToken = jwt.sign(
                {
                    email: loginDetails.email,
                    name: loginDetails.name,
                },
                process.env.REFRESH_TOKEN_SECRET,
                {
                    expiresIn: `${refreshTokenExpiry}ms`,
                }
            );

            // Send tokens and login status to frontend via http-only cookie
            res.cookie("accessToken", accessToken, accessTokenCookieOptions);
            res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
            res.cookie('isLoggedIn', true, {
                ...accessTokenCookieOptions,
                httpOnly: false,
            });

            res
            .status(200)
            .json({
                message: "Login successful!",
                // Send email and name to frontend on successful login
                email: loginDetails.email,
                name: loginDetails.name
            });

        } else {
            req.session.isLoggedIn = false;
            res
            .status(403)
            .json({status: "forbidden", message: "Login unsuccessful!"});
        }
    }
});

//======================
// JWT - Refresh Token
//=======================

router.get("/refresh", (req: Request, res: Response) => {
    // Receive refreshToken in http-only cookie from frontend
    const refreshToken = req.cookies.refreshToken;

    // Verifying refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err: any, decoded: any) => {
        if (err) {
            // Invalid refresh token
            return res.status(403).json({message: `Could not refresh access token`});
        } else {
            // Valid refresh token -> create a new access token with existing user info
            const accessToken = jwt.sign(
                {
                    email: decoded.email,
                    name: decoded.name,
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: `${accessTokenExpiry}ms`,
                }
            );

            // Send refreshed access token to frontend via http-only cookie
            // Send login status to frontend via cookie
            res.cookie('accessToken', accessToken, accessTokenCookieOptions);
            res.cookie('isLoggedIn', true, {
                ...accessTokenCookieOptions,
                httpOnly: false,
            });

            res.status(200).json({
                message: 'Session extended / Token refreshed successfully!',
            });
        }
    });
});

//======================
// DESTROY - Destroy session (log out)
//=======================

router.get("/logout", (req: Request, res: Response) => {
    req.session.destroy(err => console.log(err));
    res.cookie('accessToken', '', {maxAge: 1});
    res.cookie('refreshToken', '', {maxAge: 1});
    res.cookie('isLoggedIn', '', {maxAge: 1});
    res.status(200).json({
        message: "Logged out successfully!",
    });
});

//======================
// EXPORT
//======================

module.exports = router;
