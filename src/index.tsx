/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { Provider } from "./store/";

render(
  () => (
    <Provider>
      <App />
    </Provider>
  ),
  document.getElementById("root") as HTMLElement
);
