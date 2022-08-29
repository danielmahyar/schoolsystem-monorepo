import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App";
import { HashRouter as Router } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { AuthContext } from "api";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Router>
    <RecoilRoot>
      <App />
      <Toaster
        toastOptions={{
          position: "bottom-right",
        }}
      />
    </RecoilRoot>
  </Router>
);
