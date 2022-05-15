import { FC, FormEvent, useState } from "react";

import { Subscription } from "../shared/types";
import axios from "../shared/axios";
import { handleRegistration } from "../utils/register";
import { toast } from "react-toastify";
import { toastifyDefaultConfig } from "../shared/constants";

const Main: FC<{
  subscription: Subscription | null;
  setSubscription: Function;
  updateInfo: Function;
}> = ({ subscription, setSubscription, updateInfo }) => {
  const [permission, setPermission] = useState(Notification.permission);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");

  const requestPermission = async () => {
    const result = await Notification.requestPermission();

    setPermission(result);

    if (result === "granted") {
      toast.success("Quyền thông báo đã được cấp", toastifyDefaultConfig);
      handleRegistration().then((subscription) =>
        setSubscription(subscription)
      );
    } else if (result === "denied")
      toast.error("Bạn đã từ chối cấp quyền thông báo", toastifyDefaultConfig);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (permission !== "granted" || !inputValue.trim()) return;

    if (!subscription)
      handleRegistration().then((subscription) =>
        setSubscription(subscription)
      );

    setInputValue("");
    setIsLoading(true);

    axios
      .post("subscribe", {
        ...subscription,
        comicId: inputValue.trim(),
      })
      .then(() => {
        toast.success("Theo dõi truyện thành công", toastifyDefaultConfig);
        updateInfo(subscription);
      })
      .catch((err) =>
        toast.error(
          err?.response?.data?.message || "Có lỗi đã xảy ra",
          toastifyDefaultConfig
        )
      )
      .finally(() => setIsLoading(false));
  };

  const handleTextAreaSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!textAreaValue.trim()) return;

    const list = textAreaValue.trim().split("\n").filter(Boolean);

    setTextAreaValue("");
    setIsModalOpened(false);

    setIsLoading(true);

    for (const item of list) {
      axios
        .post("subscribe", {
          ...subscription,
          comicId: item,
        })
        .then(() => {
          toast.success(
            `Theo dõi truyện thành công: ${item}`,
            toastifyDefaultConfig
          );
          updateInfo(subscription);
        })
        .catch((err) =>
          toast.error(
            `${err?.response?.data?.message}: ${item}` ||
              `Có lỗi đã xảy ra: ${item}`,
            toastifyDefaultConfig
          )
        )
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <>
      <form className="mx-3" onSubmit={handleFormSubmit}>
        <div className="flex justify-center">
          <h1 className="text-gradient text-[36px] leading-[42px] md:text-[42px] md:leading-[52px] text-center max-w-[700px] my-8">
            Nhận thông báo mỗi khi bộ truyện yêu thích của bạn ra chap mới
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-dark outline-none px-2 py-3 border-gray-500 focus:border-[#3C82F6] transition duration-200 border-2 rounded-lg w-full max-w-[600px]"
            type="text"
            placeholder="Nhập ID truyện"
            autoComplete="off"
            autoFocus
          />
          <h1 className="text-gray-400 break-all break-words">
            {import.meta.env.VITE_NETTRUYEN_URL}truyen-tranh/
            <span className="font-bold italic">id-truyen</span>
          </h1>
        </div>

        <div className="flex justify-center items-center flex-wrap gap-3 mt-5">
          <button
            type="button"
            onClick={() => requestPermission()}
            className="bg-green-600 outline-none rounded text-white py-2 px-4 hover:brightness-110 transition duration-300"
          >
            Bật thông báo
          </button>
          <button
            type="submit"
            disabled={permission !== "granted" || !subscription || isLoading}
            className="bg-blue-500 outline-none rounded text-white py-2 px-4 hover:brightness-110 transition duration-300 disabled:!brightness-[60%] flex items-center gap-2"
          >
            {isLoading && (
              <div className="h-5 w-5 rounded-full border-blue-200 border-2 border-t-transparent animate-spin"></div>
            )}
            <span> Theo dõi truyện</span>
          </button>
          <button
            type="button"
            disabled={permission !== "granted" || !subscription || isLoading}
            className="bg-amber-600 outline-none rounded text-white py-2 px-4 hover:brightness-110 transition duration-300 disabled:!brightness-[60%] flex items-center gap-2"
            onClick={() => setIsModalOpened(true)}
          >
            {isLoading && (
              <div className="h-5 w-5 rounded-full border-blue-200 border-2 border-t-transparent animate-spin"></div>
            )}
            <span> Nhập danh sách</span>
          </button>
        </div>
      </form>
      <div
        onClick={() => setIsModalOpened(false)}
        className={`fixed top-0 left-0 w-screen h-screen bg-[#00000080] flex justify-center items-center transition-all duration-300 z-10 ${
          isModalOpened ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <form
          onSubmit={handleTextAreaSubmit}
          className="p-5 bg-dark w-full max-w-[400px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-xl">Nhập danh sách</h1>
            <button
              type="submit"
              onClick={() => {}}
              className="flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#fff"
              >
                <path d="m12 18 4-5h-3V2h-2v11H8z"></path>
                <path d="M19 9h-4v2h4v9H5v-9h4V9H5c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2z"></path>
              </svg>
              <span> Nhập</span>
            </button>
          </div>
          <textarea
            value={textAreaValue}
            onChange={(e) => setTextAreaValue(e.target.value)}
            placeholder="Danh sách truyện..."
            onClick={(e: any) => e?.target?.select()}
            className="w-full h-44 bg-dark outline-none px-2 py-3 border-gray-500 focus:border-[#3C82F6] transition duration-200 border-2 rounded-lg"
          ></textarea>
        </form>
      </div>
    </>
  );
};

export default Main;
