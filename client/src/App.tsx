import { FC } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import { ToastContainer } from "react-toastify";

const App: FC = () => {
  return (
    <>
      <div>
        <Header />
        <Main />
      </div>
      <ToastContainer />
    </>
  );
};

export default App;
