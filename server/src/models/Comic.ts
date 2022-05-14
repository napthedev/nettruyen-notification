import mongoose from "mongoose";

const ComicSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    latestChapter: { type: String, required: true },
    cover: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("comics", ComicSchema);

export interface ComicType {
  _id: string;
  latestChapter: string;
  title: string;
  cover: string;
}
