/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { Provider } from "./store/";
import { Router, Route, Routes } from "solid-app-router";

render(
  () => (
    <Provider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  ),
  document.getElementById("root") as HTMLElement
);
