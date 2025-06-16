import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
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
  shopId: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "shop"],
    default: "shop",
  },
  shopName: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
    match: /^\+?[1-9]\d{1,14}$/,
  },
});

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
