import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    comicId: {
      type: String,
      required: true,
      ref: "comics",
    },
    endpoint: {
      type: String,
      required: true,
    },
    p256dh: {
      type: String,
      required: true,
    },
    auth: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("subscriptions", SubscriptionSchema);

export interface SubscriptionType {
  comicId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}
