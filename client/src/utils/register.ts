const publicVapidKey = import.meta.env.VITE_PUBLIC_VAPID_KEY;

export const send = async () => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("No Service Worker support!");
  }
  if (!("PushManager" in window)) {
    throw new Error("No Push API Support!");
  }

  const register = await navigator.serviceWorker.register("/worker.js");

  let subscription = await register.pushManager.getSubscription();

  if (!subscription) {
    subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicVapidKey,
    });
  }

  console.log(subscription);

  // await fetch("http://localhost:5000/subscribe", {
  //   method: "POST",
  //   body: JSON.stringify(subscription),
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
};
