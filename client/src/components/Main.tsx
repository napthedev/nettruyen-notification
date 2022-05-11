import { FC, useState } from "react";
import { Slide, toast } from "react-toastify";

const Main: FC = () => {
  const [permission, setPermission] = useState(Notification.permission);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();

    setPermission(result);

    if (result === "granted")
      toast.success("Quyền thông báo đã được cấp", {
        position: "top-right",
        type: "success",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
    else if (result === "denied")
      toast.success("Bạn đã từ chối cấp quyền thông báo", {
        position: "top-right",
        type: "error",
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

  return (
    <div className="mx-3">
      <div className="flex justify-center">
        <h1 className="text-gradient text-[36px] leading-[42px] md:text-[42px] md:leading-[52px] text-center max-w-[700px] my-8">
          Nhận thông báo mỗi khi bộ truyện yêu thích của bạn ra chap mới
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center">
        <input
          className="bg-dark outline-none px-2 py-3 border-gray-500 focus:border-[#3C82F6] transition duration-200 border-2 rounded-lg w-full max-w-[600px]"
          type="text"
          placeholder="Nhập ID truyện"
        />
        <h1 className="text-gray-400 break-all break-words">
          http://www.nettruyenco.com/truyen-tranh/
          <span className="font-bold italic">id-truyen</span>
        </h1>
      </div>

      <div className="flex justify-center items-center gap-3 mt-5">
        <button
          onClick={() => requestPermission()}
          className="bg-green-600 outline-none rounded text-white py-2 px-4 hover:brightness-110 transition duration-300"
        >
          Bật thông báo
        </button>
        <button
          disabled={permission !== "granted"}
          className="bg-blue-500 outline-none rounded text-white py-2 px-4 hover:brightness-110 transition duration-300 disabled:!brightness-50"
        >
          Theo dõi truyện
        </button>
      </div>
    </div>
  );
};

export default Main;
