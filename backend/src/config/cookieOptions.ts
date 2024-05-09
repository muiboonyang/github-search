import {CookieOptions} from "express";
import dotenv from "dotenv";

dotenv.config();

export const accessTokenExpiry = 1000 * 60 * 15 // '15m'
export const refreshTokenExpiry = 1000 * 60 * 60 * 24 // '1d'

export const accessTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: accessTokenExpiry,
    // secure: true // unable to access cookie on postman if secure is set to 'true'
}

// Only set 'secure' option for accessToken to true in production environment
if (process.env.NODE_ENV === 'production')
    accessTokenCookieOptions.secure = true;

export const refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: refreshTokenExpiry,
    // secure: true // unable to access cookie on postman if secure is set to 'true'
}

// Only set 'secure' option for refreshToken to true in production environment
if (process.env.NODE_ENV === 'production')
    accessTokenCookieOptions.secure = true;