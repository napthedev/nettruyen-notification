import { FC, useEffect, useState } from "react";
import { InfoType, Subscription } from "./shared/types";

import Header from "./components/Header";
import Incognito from "./components/Incognito";
import Info from "./components/Info";
import Main from "./components/Main";
import { ToastContainer } from "react-toastify";
import axios from "./shared/axios";
import { handleRegistration } from "./utils/register";

const App: FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const [info, setInfo] = useState<InfoType>([]);

  const [isNotSupported, setIsNotSupported] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      console.log("No Service Worker support!");
      setIsNotSupported(true);
    }
    if (!("PushManager" in window)) {
      console.log("No Push API Support!");
      setIsNotSupported(true);
    }

    handleRegistration().then((subscription) => {
      setSubscription(subscription);
    });
  }, []);

  const updateInfo = (subscription: Subscription | null) => {
    if (subscription !== null) {
      axios
        .post("info", { ...subscription })
        .then((res) => setInfo(res.data))
        .catch((err) => console.log(err.response.data));
    }
  };

  useEffect(() => {
    updateInfo(subscription);
  }, [subscription]);

  if (isNotSupported || typeof Notification === "undefined")
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex justify-center mx-3">
          <div className="bg-[#F9D7DA] text-[#842029] px-4 py-3 rounded-lg text-center">
            {/^((?!chrome|android).)*safari/i.test(navigator.userAgent)
              ? "Thiết bị với trình duyệt safari không hỗ trợ gửi thông báo"
              : "Thiết bị của bạn không hỗ trợ gửi thông báo"}
          </div>
        </div>
      </div>
    );

  return (
    <>
      <div>
        <Header />
        <Main
          subscription={subscription}
          setSubscription={setSubscription}
          updateInfo={updateInfo}
        />
        <Incognito />
        <Info subscription={subscription} info={info} updateInfo={updateInfo} />
      </div>
      <ToastContainer />
    </>
  );
};

export default App;
