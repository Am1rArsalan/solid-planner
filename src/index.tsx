/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { Provider } from "./store/";

function Application() {
  return (
    <Provider>
      <App />
    </Provider>
  );
}

render(() => <App />, document.getElementById("root") as HTMLElement);
