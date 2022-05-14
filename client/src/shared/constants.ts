import { Slide, ToastOptions } from "react-toastify";

export const toastifyDefaultConfig = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: "dark",
  transition: Slide,
} as ToastOptions<{}>;
