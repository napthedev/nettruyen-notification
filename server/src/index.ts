import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import webPush from "web-push";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const subscriptions: Subscription[] = [];

webPush.setVapidDetails(
  "http://localhost:3000",
  process.env.PUBLIC_VAPID_KEY as string,
  process.env.SECRET_VAPID_KEY as string
);

app.post("/subscribe", (req, res) => {
  const subscription = req.body as Subscription;

  res.status(201).json({});

  subscriptions.push(subscription);

  console.log(subscriptions);

  // webPush
  //   .sendNotification(subscription, JSON.stringify({ title: "Push test" }))
  //   .catch((err) => console.error(err));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
