import "./index.css";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
