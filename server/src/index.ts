import Comic, { ComicType } from "./models/Comic";
import Subscriptions, { SubscriptionType } from "./models/Subscriptions";

import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { parse } from "node-html-parser";
import { splitArray } from "./shared/utils";
import webPush from "web-push";

dotenv.config();

const headers = webPush.getVapidHeaders(
  "http://localhost:3000",
  "http://localhost:3000",
  process.env.PUBLIC_VAPID_KEY as string,
  process.env.SECRET_VAPID_KEY as string,
  "aesgcm"
);

const client = axios.create({
  baseURL: process.env.NETTRUYEN_URL,
});

mongoose.connect(process.env.MONGODB_URI as string, () =>
  console.log(`Connected to mongodb database`)
);

const app = express();

app.use(express.json());
app.use(cors());
app.enable("trust proxy");

webPush.setVapidDetails(
  "http://localhost:3000",
  process.env.PUBLIC_VAPID_KEY as string,
  process.env.SECRET_VAPID_KEY as string
);

app.get("/", (req, res) => {
  res.send("NetTruyen Notification Server");
});

app.post("/info", async (req, res) => {
  try {
    const { body } = req;

    if (!body?.endpoint || !body?.keys?.p256dh || !body?.keys?.auth)
      return res.status(400).send({
        message: "Yêu cầu không hợp lệ",
      });

    const existingSubscriptions = await Subscriptions.find({
      endpoint: body.endpoint,
      p256dh: body.keys.p256dh,
      auth: body.keys.auth,
    })
      .populate("comicId")
      .sort({ createdAt: -1 });

    res.send(existingSubscriptions.map((item) => item.comicId).filter(Boolean));
  } catch (error) {
    if (!res.headersSent) res.sendStatus(500);
  }
});

app.post("/subscribe", async (req, res) => {
  try {
    const { body } = req;

    let { comicId } = body;

    let title: string | undefined = "";

    if (!body?.endpoint || !body?.keys?.p256dh || !body?.keys?.auth || !comicId)
      return res.status(400).send({
        message: "Yêu cầu không hợp lệ",
      });

    try {
      const source = (await client.get(`truyen-tranh/${comicId}`)).data;
      const dom = parse(source);

      const url = dom
        .querySelector("meta[property=og:url]")
        ?.getAttribute("content");

      title = dom.querySelector("#item-detail .title-detail")?.innerText;

      const cover = dom
        .querySelector("#item-detail .detail-info img")
        ?.getAttribute("src")
        ?.replace("//", "https://");

      if (!url || !url.includes("/truyen-tranh/") || !title || !cover)
        throw new Error("");

      const latestChapter = dom.querySelector(
        ".list-chapter ul li a"
      )?.innerText;

      if (!latestChapter) throw new Error("");

      comicId = url.split("/").slice(-1)[0];

      const existingComic = await Comic.findOne({ _id: comicId });

      if (!existingComic) {
        await Comic.create({
          _id: comicId,
          latestChapter,
          title,
          cover,
        });
      }
    } catch (error) {
      return res
        .status(400)
        .send({ message: "Không tìm thấy truyện được yêu cầu" });
    }

    const existingSubscription = await Subscriptions.findOne({
      comicId,
      endpoint: body.endpoint,
      p256dh: body.keys.p256dh,
      auth: body.keys.auth,
    });

    if (!existingSubscription)
      await Subscriptions.create({
        comicId,
        endpoint: body.endpoint,
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
      });

    res.send({
      message: "Theo dõi truyện thành công",
    });

    await webPush.sendNotification(
      {
        endpoint: body.endpoint,
        keys: {
          auth: body.keys.auth,
          p256dh: body.keys.p256dh,
        },
      },
      JSON.stringify({
        title: "Đã bật thông báo",
        body: title,
        badge: "https://i.imgur.com/X7XQ9g5.png",
        icon: "https://i.imgur.com/X7XQ9g5.png",
        data: {
          url: `${process.env.NETTRUYEN_URL}truyen-tranh/${comicId}`,
        },
      }),
      {
        headers,
      }
    );
  } catch (error) {
    console.log(error);
    if (!res.headersSent)
      res.status(500).send({
        message: "Có lỗi xảy ra ở server",
      });
  }
});

app.post("/unsubscribe", async (req, res) => {
  try {
    const { body } = req;

    if (
      !body?.endpoint ||
      !body?.keys?.p256dh ||
      !body?.keys?.auth ||
      !body?.comicId
    )
      return res.status(400).send({
        message: "Yêu cầu không hợp lệ",
      });

    await Subscriptions.findOneAndDelete({
      endpoint: body.endpoint,
      p256dh: body.keys.p256dh,
      auth: body.keys.auth,
      comicId: body.comicId,
    });
    res.sendStatus(200);
  } catch (error) {
    if (!res.headersSent) res.sendStatus(500);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));

setInterval(async () => {
  const startTime = new Date().toLocaleString();
  const message = `Operation at ${startTime} took: `;

  console.time(message);

  const existingSubscriptions =
    (await Subscriptions.find()) as SubscriptionType[];

  const grouped = existingSubscriptions.reduce(
    (acc, current) => {
      if (!acc.find((item) => item.comicId === current.comicId))
        acc.push({ comicId: current.comicId, subscriptions: [] });

      acc
        ?.find((item) => item.comicId === current.comicId)
        ?.subscriptions.push(current);
      return acc;
    },
    [] as {
      comicId: string;
      subscriptions: SubscriptionType[];
    }[]
  );

  const splitted = splitArray(grouped, 10);

  for (const group of splitted) {
    await Promise.allSettled(
      group.map(async (item) => {
        try {
          const existingComic = (await Comic.findOne({
            _id: item.comicId,
          })) as ComicType;

          if (!existingComic) throw new Error("");

          const source = (await client.get(`truyen-tranh/${item.comicId}`))
            .data;

          const dom = parse(source);

          const url = dom
            .querySelector("meta[property=og:url]")
            ?.getAttribute("content");

          if (!url || !url.includes("/truyen-tranh/")) throw new Error("");

          const latestChapter = dom.querySelector(
            ".list-chapter ul li a"
          )?.innerText;

          if (latestChapter !== existingComic.latestChapter) {
            await Comic.findOneAndUpdate(existingComic, { latestChapter });

            const splittedSubscriptions = splitArray(item.subscriptions, 10);
            for (const subscriptionGroup of splittedSubscriptions) {
              await Promise.allSettled(
                subscriptionGroup.map(async (subscription) => {
                  try {
                    await webPush.sendNotification(
                      {
                        endpoint: subscription.endpoint,
                        keys: {
                          auth: subscription.auth,
                          p256dh: subscription.p256dh,
                        },
                      },
                      JSON.stringify({
                        title: `${existingComic.title} đã có chap mới`,
                        body: latestChapter,
                        badge: "https://i.imgur.com/X7XQ9g5.png",
                        icon: "https://i.imgur.com/X7XQ9g5.png",
                        image: existingComic.cover,
                        data: {
                          url: `${client.defaults.baseURL}/truyen-tranh/${existingComic._id}`,
                        },
                      }),
                      {
                        headers,
                      }
                    );
                  } catch (error: any) {
                    if (
                      error?.body?.includes("expire") ||
                      error?.body?.includes("unsubscribe")
                    ) {
                      await Subscriptions.deleteOne(subscription);
                    }
                  }
                })
              );
            }
          }
        } catch (error) {
          await Subscriptions.deleteMany({ comicId: item.comicId });
        }
      })
    );
  }

  console.timeEnd(message);
}, 1000 * 60 * 5);
