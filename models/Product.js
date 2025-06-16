import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    productId: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      enum: [
        "Electronics",
        "Clothing",
        "Books",
        "Furniture",
        "Toys",
        "Sports",
        "Beauty",
      ],
      required: true,
    },
    subCategory: [
      {
        type: String,
        enum: [
          "Mobiles", "Laptops", "Cameras", "Smart Watches", "Headphones", "TV", "Smart Home Devices",
          "Male", "Female", "Kids",
          "Fiction", "Non-fiction", "Educational",
          "Living Room", "Bedroom", "Office",
          "Action Figures", "Puzzles", "Educational Toys",
          "Gym", "Outdoor", "Footwear", "Fitness Equipment", "Cycling",
          "Skincare", "Haircare", "Makeup", "Perfumes",
        ],
      },
    ],
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
