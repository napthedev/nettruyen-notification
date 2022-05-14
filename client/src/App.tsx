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

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      alert("No Service Worker support!");
    }
    if (!("PushManager" in window)) {
      alert("No Push API Support!");
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
