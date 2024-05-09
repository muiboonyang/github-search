import mongoose from 'mongoose';

//=======================
// Schema - template for documents
//=======================

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true, collection: "users" }
);

const UserModel = mongoose.model("UserModel", UserSchema);

export default UserModel;
