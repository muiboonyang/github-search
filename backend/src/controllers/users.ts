import express, {Request, Response} from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/users.model";
import verifyToken from "../middleware/verifyToken";

const users = express.Router();

//======================
// ROUTES
//======================

//======================
// CREATE - Post (new account using form input)
//=======================

users.post("/new", async (req: Request, res: Response) => {
    const formInput = req.body;
    const email = req.body.email;
    const password = req.body.password;

    const existingEmail = await UserModel.find({email: email});

    if (existingEmail.length !== 0) {
        res.status(403).json({
            message: `Email already exists!`,
            // `Email "${req.body.email}" already exists! Choose another email.`
        });
        return;
    } else {
        const hashPassword = await bcrypt.hash(password, 12);
        await UserModel.create({...formInput, password: hashPassword});
        res.status(200).json({
            message: `New user successfully created!`,
            // `New user created! Email: ${email} | password: ${password} | hash: ${hashPassword}`
        });
    }
});

//======================
// READ - Get (user profile of current user from JWT)
//=======================

users.get("/profile", verifyToken, async (req: Request, res: Response) => {
    // using session as cookie not working on prov env
    const email = req.email;
    const foundUser = await UserModel.findOne(
        {email: email},
        {_id: 0, email: 1, name: 1}
    );
    res.status(200).json(foundUser);
});

//======================
// UPDATE - Using info from JWT
//======================

users.post("/update", verifyToken, async (req: Request, res: Response) => {
    const formInput = req.body;
    const email = req.email;
    const password = req.body.password;
    const hashPassword = await bcrypt.hash(password, 12);

    await UserModel.findOneAndUpdate(
        {email: email},
        {...formInput, password: hashPassword}
    );
    res.status(200).json({
        message: `Profile updated successfully!`,
    });
});

export default users;