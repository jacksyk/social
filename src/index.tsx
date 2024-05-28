import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { message } from "antd";
import { interceptors, create } from "@utils";
import { BrowserRouter } from "react-router-dom";

interceptors.request.use((config: any) => {
  const header = config.headers || {};
  header["token"] = localStorage.getItem("token");
  return Object.assign(config, {
    headers: header,
  });
});

interceptors.response.use((response: any) => {
  if (response.status === 403) {
    window.location.href = "/login";
  }
  return response.json();
});

create({
  baseUrl: "http://localhost:3000/",
});

window.message = message;
ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
