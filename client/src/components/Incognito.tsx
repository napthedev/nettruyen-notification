import { FC, useEffect, useState } from "react";

import { detectIncognito } from "../utils/detectIncognito";

const Incognito: FC = () => {
  const [isIncognito, setIsIncognito] = useState(false);
  const [isBrave, setIsBrave] = useState(false);

  useEffect(() => {
    detectIncognito().then((result) => {
      setIsIncognito(result.isPrivate);
      setIsBrave(result.browserName === "Brave");
    });
  }, []);

  return (
    <div className="flex flex-col gap-3 my-5">
      {isIncognito && (
        <div className="flex justify-center mx-3">
          <div className="bg-[#F9D7DA] text-[#842029] px-4 py-3 rounded-lg text-center">
            Thông báo sẽ không hoạt động ở cửa sổ ẩn danh
          </div>
        </div>
      )}
      {isBrave && (
        <div className="flex justify-center mx-3">
          <div className="bg-[#FFF3CD] text-[#664d03] px-4 py-3 rounded-lg text-center max-w-[550px]">
            {`Bạn đang dùng Brave Browser. Hãy đi đến Settings -> Privacy and security -> Use Google services for push messaging -> Bật lên`}
          </div>
        </div>
      )}
    </div>
  );
};

export default Incognito;
