/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { Provider, useStore } from "./store/";
import { Router, Route, Routes, useNavigate } from "solid-app-router";
import Auth from "./screens/Auth";

const AppWithAuth = () => {
  const nav = useNavigate();
  const [{ token }] = useStore();

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
