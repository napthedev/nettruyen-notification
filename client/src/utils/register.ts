import { Subscription } from "../shared/types";
import { toast } from "react-toastify";
import { toastifyDefaultConfig } from "../shared/constants";

const publicVapidKey = import.meta.env.VITE_VAPID_KEY;

export const register = async () => {
  const register = await navigator.serviceWorker.register("/worker.js");

  let subscription = await register.pushManager.getSubscription();

  if (!subscription) {
    subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicVapidKey,
    });
  }

  return subscription;
};

export const handleRegistration = async (): Promise<Subscription> => {
  try {
    const subscription = await register();
    const parsed = JSON.parse(JSON.stringify(subscription));
    // eslint-disable-next-line
    const { expirationTime, ...rest } = parsed;
    return rest;
  } catch (error) {
    toast.error(
      "Có lỗi đã xảy ra khi yêu cầu quyền thông báo",
      toastifyDefaultConfig
    );
    throw new Error("Something went wrong");
  }
};
