import { Comic, InfoType, Subscription } from "../shared/types";

import { FC } from "react";
import axios from "../shared/axios";

const Info: FC<{
  subscription: Subscription | null;
  info: InfoType;
  updateInfo: Function;
}> = ({ subscription, info, updateInfo }) => {
  const handleUnsubscribing = (comicId: string) => {
    axios
      .post("unsubscribe", {
        ...subscription,
        comicId,
      })
      .finally(() => {
        updateInfo(subscription);
      });
  };

  if (subscription === null || info.length === 0) return <></>;

  return (
    <div className="flex justify-center my-10 md:my-16">
      <div className="w-full max-w-[1000px] mx-3">
        <h1 className="text-2xl mb-6">Những truyện đang theo dõi</h1>
        <div className="w-full flex flex-col items-stretch gap-3">
          {info.map((item: Comic) => (
            <div key={item._id} className="flex gap-3">
              <img
                className="w-[80px] h-[120px] object-cover"
                src={item.cover}
                alt=""
              />
              <div>
                <a
                  href={`${import.meta.env.VITE_NETTRUYEN_URL}truyen-tranh/${
                    item._id
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl"
                >
                  {item.title}
                </a>
                <p>{item.latestChapter}</p>
                <button
                  onClick={() => handleUnsubscribing(item._id)}
                  className="text-orange-500"
                >
                  Huỷ theo dõi
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Info;
