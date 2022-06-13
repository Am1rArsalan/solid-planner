/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { Provider } from "./store/";
import { Router, Route, Routes, useNavigate } from "solid-app-router";
import Auth from "./screens/Auth";

const AppWithAuth = () => {
  const nav = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  if (queryParams.get("token")) {
    localStorage.setItem("token", queryParams.get("token") as string);
    const newUrl = `${window.location.pathname}`;
    history.pushState({ path: newUrl }, "", newUrl);
  }

  const token = localStorage.getItem("token");
  if (!token?.length) {
    nav("/auth");
  }

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
};

render(
  () => (
    <Provider>
      <Router>
        <AppWithAuth />
      </Router>
    </Provider>
  ),
  document.getElementById("root") as HTMLElement
);
