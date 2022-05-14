import { FC, FormEvent, useState } from "react";
import { Slide, toast } from "react-toastify";

import { Subscription } from "../shared/types";
import axios from "../shared/axios";
import { handleRegistration } from "../utils/register";

const Main: FC<{
  subscription: Subscription | null;
  setSubscription: Function;
  updateInfo: Function;
}> = ({ subscription, setSubscription, updateInfo }) => {
  const [permission, setPermission] = useState(Notification.permission);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();

    setPermission(result);

    if (result === "granted") {
      toast.success("Quyền thông báo đã được cấp", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
      handleRegistration().then((subscription) =>
        setSubscription(subscription)
      );
    } else if (result === "denied")
      toast.error("Bạn đã từ chối cấp quyền thông báo", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
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
        toast.success("Theo dõi truyện thành công", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide,
        });
        updateInfo(subscription);
      })
      .catch((err) =>
        toast.error(err?.response?.data?.message || "Có lỗi đã xảy ra", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide,
        })
      )
      .finally(() => setIsLoading(false));
  };

  return (
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
          http://www.nettruyenco.com/truyen-tranh/
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
      </div>
    </form>
  );
};

export default Main;
