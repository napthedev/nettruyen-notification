interface Subscription {
  endpoint: string;
  expirationTime: null;
  keys: {
    p256dh: string;
    auth: string;
  };
}
