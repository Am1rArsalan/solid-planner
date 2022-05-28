// FIX : refactor never and any
import { Component, createContext, useContext } from "solid-js";
import { ParentProps, Resource } from "solid-js";
import { createStore } from "solid-js/store";
import createAgent from "./createAgent";
import createBacklogs from "./createBacklogs";
//import createRouteHandler from "./createRouteHandler";

export type StoreType = {
  readonly token: string | null;
  readonly backlogs: readonly never[];
};

const StoreContext = createContext<[StoreType, any]>();
const RouterContext = createContext();
type Props = ParentProps<{}>;

export const Provider: Component<Props> = (props) => {
  let backlogs: Resource<never[]>;
  const [state, setState] = createStore<StoreType>({
    get backlogs() {
      return backlogs();
    },
    token: localStorage.getItem("jwt"),
  });

  const actions: any = {};
  const store: [StoreType, any] = [state, actions];
  const agent = createAgent(store);

  backlogs = createBacklogs(agent, actions, state, setState);

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const store = useContext<[StoreType, any] | undefined>(StoreContext);
  return store;
}

export function useRouter() {
  return useContext(RouterContext);
}
