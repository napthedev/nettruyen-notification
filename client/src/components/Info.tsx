import { Comic, InfoType, Subscription } from "../shared/types";
import { FC, useState } from "react";

import axios from "../shared/axios";
import { copyToClipboard } from "../shared/utils";
import { toast } from "react-toastify";
import { toastifyDefaultConfig } from "../shared/constants";

const Info: FC<{
  subscription: Subscription | null;
  info: InfoType;
  updateInfo: Function;
}> = ({ subscription, info, updateInfo }) => {
  const [isModalOpened, setIsModalOpened] = useState(false);

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
    <>
      <div className="flex justify-center my-10 md:my-16">
        <div className="w-full max-w-[1000px] mx-3">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl">Những truyện đang theo dõi</h1>
            <button
              onClick={() => setIsModalOpened(true)}
              className="bg-slate-700 outline-none rounded text-white py-1 px-3 hover:brightness-110 transition duration-300"
            >
              Xuất danh sách
            </button>
          </div>
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
      <div
        onClick={() => setIsModalOpened(false)}
        className={`fixed top-0 left-0 w-screen h-screen bg-[#00000080] flex justify-center items-center transition-all duration-300 z-10 ${
          isModalOpened ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="p-5 bg-dark w-full max-w-[400px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-xl">Danh sách</h1>
            <button
              onClick={() =>
                copyToClipboard(info.map((item) => item._id).join("\n"))?.then(
                  () => {
                    setIsModalOpened(false);
                    toast.success(
                      "Sao chép danh sách thành công. Hãy lưu lại danh sách đến một nơi an toàn",
                      {
                        ...toastifyDefaultConfig,
                        autoClose: 4000,
                      }
                    );
                  }
                )
              }
              className="flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#ffffff"
              >
                <path d="M20 2H10c-1.103 0-2 .897-2 2v4H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2v-4h4c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM4 20V10h10l.002 10H4zm16-6h-4v-4c0-1.103-.897-2-2-2h-4V4h10v10z"></path>
              </svg>
              <span> Sao chép</span>
            </button>
          </div>
          <textarea
            onClick={(e: any) => e?.target?.select()}
            className="w-full h-44 bg-dark outline-none px-2 py-3 border-gray-500 focus:border-[#3C82F6] transition duration-200 border-2 rounded-lg"
            readOnly
            value={info.map((item) => item._id).join("\n")}
          ></textarea>
        </div>
      </div>
    </>
  );
};

export default Info;
