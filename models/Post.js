import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: false },
    price: { type: String, required: false },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
