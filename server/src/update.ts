import Comic, { ComicType } from "./models/Comic";
import Subscriptions, { SubscriptionType } from "./models/Subscriptions";

import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import parse from "node-html-parser";
import { splitArray } from "./shared/utils";
import webPush from "web-push";

dotenv.config();

const client = axios.create({
  baseURL: process.env.NETTRUYEN_URL,
});

const headers = webPush.getVapidHeaders(
  "http://localhost:3000",
  "http://localhost:3000",
  process.env.PUBLIC_VAPID_KEY as string,
  process.env.SECRET_VAPID_KEY as string,
  "aesgcm"
);

webPush.setVapidDetails(
  "http://localhost:3000",
  process.env.PUBLIC_VAPID_KEY as string,
  process.env.SECRET_VAPID_KEY as string
);

mongoose.connect(process.env.MONGODB_URI as string, () =>
  console.log(`Connected to mongodb database`)
);

(async () => {
  console.time("The update took");

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
            await Comic.findOneAndUpdate(
              { _id: existingComic._id },
              { latestChapter }
            );

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
                          url: `${client.defaults.baseURL}truyen-tranh/${existingComic._id}`,
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

  console.timeEnd("The update took");

  await mongoose.disconnect();

  process.exit(0);
})();
