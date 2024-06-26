import express, {Request, Response} from "express";
import connectDB from "./utils/db";
import favourites from "./controllers/favourites";
import sessions from './controllers/sessions';
import users from "./controllers/users";
import {Octokit} from "@octokit/rest";
import cookieparser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import fetch from 'node-fetch';
import path from 'path';
import dotenv from "dotenv";

dotenv.config();

// =======================================
//             CONNECT TO DB
// =======================================

const mongoURI = process.env.MONGO_URI ?? '';
connectDB(mongoURI);

// =======================================
//                MIDDLEWARE
// =======================================

const app = express();

// =======================================
// CORS middleware
// =======================================

app.use(
    cors({
        credentials: true,
        origin: [
            "http://localhost:3000", // localhost frontend
            "http://localhost:3001", // localhost frontend
            "http://localhost:3002", // localhost frontend
            "http://localhost:6565", // localhost docker frontend
        ],
    })
); // overcomes cors issue
app.use(express.json()); // allows res.body to work (express.json lets you read the req.body in json)
app.use(express.urlencoded({extended: false})); // allows you to read what the forms send over (by default, it's all encoded), just declare it
app.use(cookieparser());

// =======================================
// Session middleware
// =======================================

app.use(
    session({
        secret: "github-search",
        resave: false,
        saveUninitialized: false,
        cookie: {maxAge: 1000 * 60 * 60} // 60 mins
    })
);

// =======================================
//                CONTROLLERS
// =======================================

app.use("/api/sessions", sessions);
app.use("/api/users", users);
app.use("/api/favourites", favourites);

// =======================================
//           GLOBAL VARIABLES
// =======================================

app.locals.email = ''
app.locals.name = ''
app.locals.isLoggedIn = false

// =======================================
//              ROUTES
// =======================================

//======================
// GET - Display app status
//======================

app.get("/api/status", async (_, res: Response) => {
    res.send('github-search api is running')
});

app.get("/api/app", async (req: Request, res: Response) => {
    if (req.session.views) {
        req.session.views++
        res.setHeader('Content-Type', 'text/html')
        res.write('<p>Current user: ' + req.session.name + '</p>')
        res.write('<p>Current email: ' + req.session.email + '</p>')
        res.write('<p>Login status: ' + req.session.isLoggedIn + '</p>')
        res.write('<p>Views: ' + req.session.views + '</p>')
        res.write('<p>Session cookie expires in: ' + (req.session.cookie.maxAge! / (1000 * 60)) + 'm</p>')
        res.end()
    } else {
        req.session.views = 1
        res.end('App is running. Refresh to see views!')
    }
});

//======================
// GET - Get current GitHub API Search limit
//======================

app.get("/api/limit", async (_, res: Response) => {
    const octokit = new Octokit({
        auth: process.env.REACT_APP_OCTOKIT,
    });

    const limit = await octokit.request("GET /rate_limit", {});
    res.send(limit.data.resources.search);
});

//======================
// POST - Get GitHub Search API results
//======================

app.post("/api/github", async (req: Request, res: Response) => {
    const type = req.body.type;
    const query = req.body.query;

    try {
        const response = await fetch(`https://api.github.com/search/${type}?q=${query}`, {
            headers: {
                Authorization: "Basic " + process.env.REACT_APP_SECRET,
                "Content-Type": "application/json",
            },
        })

        const data = await response.json();
        res.send(data)
    } catch (err) {
        res.send(err); // still sends as 200 (need to get GitHub error code and pass to frontend)
    }
});

// =======================================
//              LISTENER
// =======================================

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// =======================================
//              STATIC FILES
// =======================================

// This section needs to be placed at the bottom of the file

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../../frontend/dist')))

// AFTER defining routes: Anything that doesn't match what's above, send back index.html; the beginning slash '/' in the string is important
app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname + '/../../frontend/dist/index.html'))
})
