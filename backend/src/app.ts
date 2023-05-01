//////////////////////////////
// Backend (Express):
//////////////////////////////

require('dotenv').config()
import express, { Request, Response } from "express";
const connectDB = require("./utils/db");
const session = require("express-session");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const fetch = require("node-fetch");
const { Octokit } = require("@octokit/rest");

// =======================================
//             CONNECT TO DB
// =======================================

const mongoURI = process.env.MONGO_URI;
connectDB(mongoURI);

// =======================================
//                MIDDLEWARE
// =======================================

const app = express();

// =======================================
// Static middleware
// =======================================

app.use(express.static('public'))

// =======================================
// Body parser middleware
// =======================================

app.use(
  cors({
    credentials: true,
    origin: [
      "https://github-search-sg.netlify.app", // deployed frontend
      "http://localhost:3000", // localhost frontend
      "http://localhost:3001", // localhost frontend
      "http://localhost:3002", // localhost frontend
      "http://localhost:6565", // localhost docker frontend
    ],
  })
); // overcomes cors issue
app.use(express.json()); // allows res.body to work (express.json lets you read the req.body in json)
app.use(express.urlencoded({ extended: false })); // allows you to read what the forms send over (by default, it's all encoded), just declare it
// app.use(express.static("public")); // allow loading of static files in "public" directory
app.use(cookieparser());

// =======================================
// Session middleware
// =======================================

app.use(
  session({
    secret: "github-search",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } // 60 mins
  })
);

// =======================================
//                CONTROLLERS
// =======================================

const sessionController = require("./controllers/sessions");
app.use("/api/Sessions", sessionController);

const userController = require("./controllers/users");
app.use("/api/Users", userController);

const favouritesController = require("./controllers/favourites");
app.use("/api/Favourites", favouritesController);

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

app.get("/api/Status", async (req: Request, res: Response) => {
    res.send('github-search api is running')
});

app.get("/api/App", async (req: Request, res: Response) => {
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

app.get("/api/Limit", async (req: Request, res: Response) => {
  const octokit = new Octokit({
    auth: process.env.REACT_APP_OCTOKIT,
  });

  const limit = await octokit.request("GET /rate_limit", {});
  res.send(limit.data.resources.search);
});

//======================
// POST - Get GitHub Search API results
//======================

app.post("/api/Github", async (req: Request, res: Response) => {
  const type = req.body.type;
  const query = req.body.query;

  try {
    fetch(`https://api.github.com/search/${type}?q=${query}`, {
      headers: {
        Authorization: "Basic " + process.env.REACT_APP_SECRET,
        "Content-Type": "application/json",
      },
    })
      .then((res: Response) => res.json())
      .then((data: any) => res.send(data));
  } catch (err) {
    res.send(err); // still sends as 200 (need to get GitHub error code and pass to frontend)
  }
});

// =======================================
//              LISTENER
// =======================================

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

module.exports = app;

// =======================================
//              STATIC FILES
// =======================================

const path = require('path')

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../../frontend/build')))

// AFTER defining routes: Anything that doesn't match what's above, send back index.html; (the beginning slash ('/') in the string is important!)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../../frontend/build/index.html'))
})
