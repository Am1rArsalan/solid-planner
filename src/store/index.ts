import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import createAgent from "./createAgent";
import createBacklogs from "./createBacklogs";
import createRouteHandler from "./createRouteHandler";

const StoreContext = createContext();
const RouterContext = createContext();

export function Provider({ children }) {
  let backlogs;
  const router = createRouteHandler("");
  const [state, setState] = createStore({
    get backlogs() {
      return backlogs();
    },
    token: localStorage.getItem("jwt"),
    //appName: "conduit",
  });
  const actions = {};
  const store = [state, actions];
  const agent = createAgent(store);

  //articles = createArticles(agent, actions, state, setState);
  backlogs = createBacklogs(agent, actions, state, setState);

  return (
    <RouterContext.Provider value={router}>
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    </RouterContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}

export function useRouter() {
  return useContext(RouterContext);
}
