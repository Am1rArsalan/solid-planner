import { Accessor, Component, createContext, useContext } from "solid-js";
import { ParentProps, Resource } from "solid-js";
import { createStore } from "solid-js/store";
import {
  BacklogType,
  PomodoroFocusType,
  PomodoroType,
} from "../types/pomodoro";
import { StoreType } from "../types/store";
import createBacklogs from "./createBacklogs";
import createPomodoro from "./createPomodoro";
import createPomodoros from "./createPomodoros";

const StoreContext = createContext<[StoreType, any]>();
const RouterContext = createContext();

type Props = ParentProps<{}>;

export interface Actions {
  //
}

export const Provider: Component<Props> = (props) => {
  let backlogs: Resource<BacklogType[]>;
  let pomodoros: Resource<PomodoroType[]>;
  let pomodoroState: Accessor<PomodoroFocusType>;
  let activePomodoro: Accessor<PomodoroType | null>;

  const [state, setState] = createStore<StoreType>({
    token: localStorage.getItem("jwt"),
    get backlogs() {
      return backlogs;
    },

    get pomodoros() {
      return pomodoros;
    },

    get pomodoroState() {
      return pomodoroState;
    },

    get activePomodoro() {
      return activePomodoro;
    },
  });

  const actions: any = {};
  const store: [StoreType, any] = [state, actions];

  backlogs = createBacklogs(actions, state);
  pomodoros = createPomodoros(actions, state);
  const singlePomodoro = createPomodoro(actions, state);
  pomodoroState = singlePomodoro.pomodoroState;
  activePomodoro = singlePomodoro.activePomodoro;

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
