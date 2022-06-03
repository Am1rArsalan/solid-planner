/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { Provider } from "./store/";
import { Component, ParentProps } from "solid-js";

const ApplicationProvider: Component<ParentProps<{}>> = (props) => {
  return <Provider>{props.children}</Provider>;
};

render(
  () => (
    <ApplicationProvider>
      <App />
    </ApplicationProvider>
  ),
  document.getElementById("root") as HTMLElement
);
