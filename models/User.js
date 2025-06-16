import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "shop"],
    default: "user",
  },
  userName: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
    match: /^\+?[1-9]\d{1,14}$/,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
