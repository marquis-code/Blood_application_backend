const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Post title is required"],
    },
    subTitle: {
      type: String,
      trim: true,
      required: [true, "Post subtitle is required"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Post description is required"],
    },
    readingTime: {
      type: Number,
      required: [true, "Reading Time is required"],
    },
    tags: {
      type: [{ type: String }],
    }
  },
  {
    timestamps: true,
  }
);

const BlogPost = mongoose.model("Post", PostSchema);

module.exports = BlogPost;
