import express, { Request, Response } from "express";
const router = express.Router();
import FavouritesModel from "../models/favourites.model";
import verifyToken from "../middleware/verifyToken";

//======================
// ROUTES
//======================

//======================
// READ - Get favourites of specific user
//=======================

router.get("/", verifyToken, async (req: Request, res: Response) => {
  const getFavourites = await FavouritesModel.find({ email: req.email });
  res.json(getFavourites);
});

//======================
// CREATE - Post (Create new favourite)
//=======================

router.post("/new", verifyToken, async (req: Request, res: Response) => {
  // const existingUserFav = await FavouritesModel.find({
  //   email: req.email,
  //   favouriteType: req.body.favouriteType,
  //   userId: req.body.userId,
  // });

  // const existingRepoFav = await FavouritesModel.find({
  //   email: req.email,
  //   favouriteType: req.body.favouriteType,
  //   repoId: req.body.repoId,
  // });
  //
  // if (existingUserFav.length && existingRepoFav.length !== 0) {
  //   // User/Repo ID favourite exists
  //   res.status(403).json({
  //     message: `Favourite already exists!`,
  //   });
  //   return;
  // } else {
    await FavouritesModel.create({
      favouriteType: req.body.favouriteType,
      email: req.email,
      userId: req.body.userId,
      avatar: req.body.avatar,
      username: req.body.username,
      profileLink: req.body.profileLink,
      repoId: req.body.repoId,
      repoName: req.body.repoName,
      repoLink: req.body.repoLink,
    });
    res.status(200).json({
      message: `New favourite added!`,
    });
  // }
});

//======================
// DELETE - Delete single favourite based on favouriteID
//======================

router.delete("/delete/:id", verifyToken, async (req: Request, res: Response) => {
  await FavouritesModel.deleteOne({ _id: req.params.id });
  res.json({
    message: `Favourite deleted successfully!`,
  });
});

//======================
// EXPORT
//======================

export default router;
