import mongoose from 'mongoose';

const FavouritesSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    favouriteType: { type: String, required: true },
    userId: { type: Number, required: true },
    avatar: { type: String, required: true },
    username: { type: String, required: true },
    profileLink: { type: String, required: true },
    repoId: {
      type: Number,
      required: false,
      default: 0,
    },
    repoName: {
      type: String,
      required: false,
      default: null,
    },
    repoLink: {
      type: String,
      required: false,
      default: null,
    },
  },
  { timestamps: true, collection: "favourites" }
);

const FavouritesModel = mongoose.model("FavouritesModel", FavouritesSchema);

export default FavouritesModel;
