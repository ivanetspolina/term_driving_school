import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);

// const userSchema = new mongoose.Schema(
//   {
//     email: { type: String, required: true, unique: true },
//     passwordHash: { type: String, required: true },
//     // додаткові поля (roles, createdAt тощо) за потреби
//   },
//   { timestamps: true },
// );
