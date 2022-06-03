// FIXME : refactor never and any
import { Component, createContext, useContext } from "solid-js";
import { ParentProps, Resource } from "solid-js";
import { createStore } from "solid-js/store";
import { PomodoroType } from "../types/pomodoro";
import { StoreType } from "../types/store";
import createBacklogs from "./createBacklogs";
//import createRouteHandler from "./createRouteHandler";

const StoreContext = createContext<[StoreType, any]>();
const RouterContext = createContext();
type Props = ParentProps<{}>;

export const Provider: Component<Props> = (props) => {
  let backlogs: Resource<PomodoroType[]>;
  const [state, setState] = createStore({
    token: localStorage.getItem("jwt"),
    get backlogs() {
      return backlogs;
    },
  });

  const actions: any = {};
  const store: [StoreType, any] = [state, actions];

  backlogs = createBacklogs(actions, state, setState);

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  // FIX typescript error
  const store = useContext<[StoreType, any]>(StoreContext);
  return store;
}

export function useRouter() {
  return useContext(RouterContext);
}
