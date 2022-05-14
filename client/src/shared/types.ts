export interface Subscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export type InfoType = Comic[];

export interface Comic {
  _id: string;
  cover: string;
  createdAt: string;
  latestChapter: string;
  title: string;
  updatedAt: string;
}
